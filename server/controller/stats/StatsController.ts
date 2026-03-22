import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../../lib/prisma_client";
import redis from "../../lib/redis";
import { InternalServerError } from "../../lib/apiResponse/ErrorRes";

type UsageQuery = {
  websiteId?: string;
};

const safeJsonParse = (s: string | null) => {
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

export const fetchUserUsageOverview = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const supabase_user = request.user;

    if (!supabase_user) {
      reply.status(401).send({
        message: "Unauthorized",
        status: "Failed",
        errorCode: "err_verifying_user",
      });
      return;
    }
    const user = await prisma.user.findFirst({
      where: {
        supabaseId: supabase_user.id,
      },
    });

    if (!user) {
      reply.status(401).send({
        message: "Unauthorized",
        status: "Failed",
        errorCode: "err_verifying_user",
      });
      return;
    }

    if (!user?.id) {
      reply.status(400).send({
        message: "User ID is required",
        status: "Failed",
        errorCode: "user_err_no_id",
      });
      return;
    }
    const query = request.query as UsageQuery;
    const trackingId = query.websiteId;
    if (!trackingId) {
      reply.status(400).send({
        message: "Website Id is required",
        status: "Failed",
        errorCode: "website_id_not_provided",
      });
      return;
    }

    const userId = user.id;
    const cacheKey = `usage:${userId}:${trackingId}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const payload = safeJsonParse(cached);
        if (payload) {
          reply.send({
            status: "Success",
            cached: true,
            ...payload,
          });
          return;
        }
      }
    } catch (err) {
      console.warn("Redis read failed:", err);
    }

    const website = await prisma.website.findFirst({
      where: { uniqueId: trackingId },
      select: { id: true, userId: true },
    });

    if (!website) {
      reply.status(404).send({
        message: "Website not found",
        status: "Failed",
        errorCode: "website_not_found",
      });
      return;
    }

    if (website.userId !== userId) {
      reply.status(403).send({
        message: "Forbidden",
        status: "Failed",
        errorCode: "website_not_owned",
      });
      return;
    }

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOf7DaysAgo = new Date(startOfToday);
    startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 6);

    const userWebsites = await prisma.website.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        isActive: true,
        url: true,
        verified: true,
        forms: {
          select: { id: true, formName: true },
        },
      },
    });

    // @ts-ignore
    const websiteIds = userWebsites.map((w) => w.id);

    const [
      todaysLeads,
      last7DaysLeadsRaw,
      formsCountByWebsite,
      leadsCompletedByForm,
      leadsPartialByForm,
      formCount,
      totalLeads,
      completedLeads,
      partialLeads,
      avgTimeAgg,
      topCountriesRaw,
      uniqueOpps,
    ] = await Promise.all([
      prisma.lead.findMany({
        where: {
          websiteId: website.id,
          createdAt: { gte: startOfToday },
        },
        select: {
          formData: true,
          form: { select: { formName: true } },
          conversion: true,
          country: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),

      prisma.lead.findMany({
        where: {
          websiteId: website.id,
          createdAt: { gte: startOf7DaysAgo },
        },
        select: { createdAt: true, conversion: true },
        orderBy: { createdAt: "asc" },
      }),

      prisma.form.groupBy({
        by: ["websiteId"],
        where: { websiteId: { in: websiteIds } },
        _count: { _all: true },
      }),

      prisma.lead.groupBy({
        by: ["formId"],
        where: {
          websiteId: { in: websiteIds },
          conversion: true,
        },
        _count: { _all: true },
      }),

      prisma.lead.groupBy({
        by: ["formId"],
        where: {
          websiteId: { in: websiteIds },
          conversion: false,
        },
        _count: { _all: true },
      }),

      prisma.form.count({
        where: { websiteId: { in: websiteIds } },
      }),

      prisma.lead.count({
        where: { websiteId: { in: websiteIds } },
      }),

      prisma.lead.count({
        where: {
          websiteId: { in: websiteIds },
          conversion: true,
        },
      }),

      prisma.lead.count({
        where: {
          websiteId: { in: websiteIds },
          conversion: false,
        },
      }),

      prisma.fieldTimeSpent.aggregate({
        where: { lead: { websiteId: { in: websiteIds } } },
        _avg: { timeSpent: true },
      }),

      prisma.lead.groupBy({
        by: ["country"],
        where: { websiteId: { in: websiteIds } },
        _count: { country: true },
        orderBy: { _count: { country: "desc" } },
        take: 5,
      }),

      prisma.lead.findMany({
        where: {
          websiteId: { in: websiteIds },
          opportunityId: { not: "" },
        },
        select: { opportunityId: true },
        distinct: ["opportunityId"],
      }),
    ]);

    const formsCountMap = new Map(
      // @ts-ignore
      formsCountByWebsite.map((f) => [f.websiteId, f._count._all]),
    );
    const completedMap = new Map(
      // @ts-ignore
      leadsCompletedByForm.map((l) => [l.formId, l._count._all]),
    );
    const partialMap = new Map(
      // @ts-ignore
      leadsPartialByForm.map((l) => [l.formId, l._count._all]),
    );

    const last7DaysStats: Record<
      string,
      { completed: number; partial: number }
    > = {};

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOf7DaysAgo);
      d.setDate(d.getDate() + i);
      last7DaysStats[d.toISOString().slice(0, 10)] = {
        completed: 0,
        partial: 0,
      };
    }

    for (const lead of last7DaysLeadsRaw) {
      const key = lead.createdAt.toISOString().slice(0, 10);
      if (!last7DaysStats[key]) continue;
      lead.conversion
        ? last7DaysStats[key].completed++
        : last7DaysStats[key].partial++;
    }

    const last7DaysLeadsStats = Object.entries(last7DaysStats).map(
      ([date, v]) => ({
        date,
        partiallyFilled: v.partial,
        completed: v.completed,
      }),
    );

    // @ts-ignore
    const data = userWebsites.map((w) => ({
      websiteId: w.id,
      websiteName: w.name,
      isActive: w.isActive,
      url: w.url,
      formsCount: formsCountMap.get(w.id) || 0,
      user: uniqueOpps.length,
      leadsData: {
        formCount,
        totalLeads,
        completedLeads,
        partialLeads,
        abandonmentRate:
          totalLeads > 0
            ? ((partialLeads / totalLeads) * 100).toFixed(2)
            : "0.00",
        avgTimeSpent: avgTimeAgg._avg.timeSpent || 0,
        topCountries: topCountriesRaw.map((c: any) => ({
          country: c.country || "Unknown",
          count: c._count.country,
        })),
      },
      forms: w.forms.map((f: any) => ({
        formId: f.id,
        formName: f.formName,
        leadsCompleted: completedMap.get(f.id) || 0,
        leadsPartial: partialMap.get(f.id) || 0,
      })),
    }));

    const resultPayload = {
      websiteCount: userWebsites.length,
      data,
      todaysLeads,
      last7DaysLeadsStats,
    };

    try {
      await redis.set(cacheKey, JSON.stringify(resultPayload), "EX", 60);
    } catch (err) {
      console.warn("Redis write failed:", err);
    }

    reply.send({
      status: "Success",
      cached: false,
      ...resultPayload,
    });
  } catch (error) {
    console.error("fetchUserUsageOverview error:", error);
    InternalServerError(reply, error);
  }
};

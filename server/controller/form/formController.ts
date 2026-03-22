import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../../lib/prisma_client";
import { InternalServerError } from "../../lib/apiResponse/ErrorRes";
import { startOfDay } from "date-fns";

type LeadsByFormParams = {
  formId: string;
  website_id: string;
};

type LeadsByFormQuery = {
  page?: string;
  limit?: string;
};

export const fetchLeadsByForm = async (
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

    if (!user || !user?.id) {
      reply.status(401).send({
        message: "Unauthorized",
        status: "Failed",
        errorCode: "auth_err_token_invalid",
      });
      return;
    }

    const { formId, website_id } = request.params as LeadsByFormParams;
    const query = request.query as LeadsByFormQuery;
    const page = query.page ? Number(query.page) : 0;
    const limit = query.limit ? Number(query.limit) : 10;

    const skip = page * limit;
    const take = limit;

    const leads = await prisma.lead.findMany({
      where: {
        formId: formId,
        form: {
          website: {
            id: website_id,
            userId: user.id,
          },
        },
      },
      select: {
        uniqueId: true,
        formId: true,
        formData: true,
        opportunityId: true,
        opportunityGeo: true,
        referral: true,
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });

    reply.status(200).send({
      message: "Leads Fetched",
      status: "Success",
      data: leads,
    });
  } catch (error) {
    InternalServerError(reply, error);
  }
};

type AllFormsParams = {
  website_id?: string;
};

export const fetchAllForms = async (
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

    if (!user || !user?.id) {
      reply.status(401).send({
        message: "Unauthorized",
        status: "Failed",
        errorCode: "err_verifying_user",
      });
      return;
    }

    const { website_id } = request.params as AllFormsParams;

    const whereClause: any = {
      website: {
        userId: user.id,
      },
    };

    if (website_id) {
      whereClause.website.trackingId = website_id;
    }

    const forms = await prisma.form.findMany({
      where: whereClause,
      select: {
        formId: true,
        formName: true,
        pageUrl: true,
        pageId: true,
        isActive: true,
        _count: {
          select: {
            leads: true,
          },
        },
        analytics: {
          select: {
            action: true,
          },
        },
      },
    });

    // @ts-ignore
    const enrichedForms = forms.map((form) => {
      const completedLeads = form.analytics.filter(
        // @ts-ignore
        (a) => a.action === "FORM_FILLED",
      ).length;

      const partialLeads = form.analytics.filter(
        // @ts-ignore
        (a) => a.action === "FORM_PARTIAL_FILL",
      ).length;

      return {
        formId: form.formId,
        formName: form.formName,
        pageUrl: form.pageUrl,
        pageId: form.pageId,
        isActive: form.isActive,
        totalLeads: form._count.leads,
        completedLeads,
        partialLeads,
      };
    });

    reply.status(200).send({
      message: "Forms fetched",
      success: true,
      status: "Success",
      data: enrichedForms,
    });
  } catch (error) {
    console.error("fetchAllForms error:", error);
    InternalServerError(reply, error);
  }
};

type FormAnalyticsBody = {
  form_id: string;
};

export const fetchFormAnalyticsOverview = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const { form_id } = request.body as FormAnalyticsBody;

    if (!form_id) {
      reply.status(400).send({
        error: true,
        errorCode: "FORM_ID_REQUIRED",
        message: "form_id is required",
      });
      return;
    }

    const form = await prisma.form.findFirst({
      where: { formId: form_id },
      select: { id: true },
    });

    if (!form) {
      reply.status(404).send({
        error: true,
        errorCode: "FORM_NOT_FOUND",
        message: "Form not found",
      });
      return;
    }

    const formId = form.id;

    const [
      totalLeads,
      allLeads,
      partialLeads,
      returningRaw,
      fieldTimeRaw,
      fieldCompletionRaw,
      countryAll,
      countryPartial,
      countryComplete,
      deviceStatsRaw,
      formFillsTodayRaw,
      leadTimeSums,
    ] = await Promise.all([
      prisma.lead.count({ where: { formId } }),

      prisma.lead.findMany({
        where: { formId },
        select: {
          opportunityId: true,
          conversion: true,
          createdAt: true,
        },
      }),

      prisma.lead.findMany({
        where: { formId, conversion: false },
        select: {
          leadinfo: { select: { lastFieldFilled: true } },
        },
      }),

      prisma.lead.groupBy({
        by: ["opportunityId"],
        where: { formId },
        _count: { id: true },
      }),

      prisma.fieldTimeSpent.groupBy({
        by: ["fieldName"],
        where: { lead: { formId } },
        _avg: { timeSpent: true },
      }),

      prisma.fieldTimeSpent.groupBy({
        by: ["fieldName"],
        where: { lead: { formId } },
        _count: true,
      }),

      prisma.analytics.groupBy({
        by: ["country"],
        where: { formId },
        _count: true,
      }),

      prisma.analytics.groupBy({
        by: ["country"],
        where: { formId, lead: { conversion: false } },
        _count: true,
      }),

      prisma.analytics.groupBy({
        by: ["country"],
        where: { formId, lead: { conversion: true } },
        _count: true,
      }),

      prisma.deviceInfo.groupBy({
        by: ["os", "browser"],
        where: { lead: { formId } },
        _count: true,
      }),

      prisma.lead.findMany({
        where: {
          formId,
          createdAt: {
            gte: startOfDay(new Date()),
            lte: new Date(),
          },
        },
        select: { createdAt: true, conversion: true },
      }),

      prisma.fieldTimeSpent.groupBy({
        by: ["leadId"],
        where: { lead: { formId } },
        _sum: { timeSpent: true },
      }),
    ]);

    const totalTimeSpent = leadTimeSums.reduce(
      // @ts-ignore
      (acc, cur) => acc + (cur._sum.timeSpent || 0),
      0,
    );

    const averageTimeOnForm =
      leadTimeSums.length > 0
        ? Number((totalTimeSpent / leadTimeSums.length).toFixed(2))
        : 0;
    // @ts-ignore
    const completeCount = allLeads.filter((l) => l.conversion).length;
    const partialCount = allLeads.length - completeCount;
    // @ts-ignore
    const uniqueUsers = new Set(allLeads.map((l) => l.opportunityId));
    const returningUserCount = returningRaw.filter(
      // @ts-ignore
      (r) => r._count.id > 1,
    ).length;

    const returningUserPercentage =
      uniqueUsers.size > 0
        ? Number(((returningUserCount / uniqueUsers.size) * 100).toFixed(2))
        : 0;

    // @ts-ignore
    const avgTimeStats = fieldTimeRaw.map((f) => ({
      fieldName: f.fieldName,
      avgTimeSpent: Number((f._avg.timeSpent || 0).toFixed(2)),
    }));

    // @ts-ignore
    const fieldFillStats = fieldCompletionRaw.map((f) => ({
      fieldName: f.fieldName,
      percentFilled: Number(((f._count / totalLeads) * 100).toFixed(2)),
    }));

    const dropOffMap: Record<string, number> = {};
    for (const lead of partialLeads) {
      const field = lead.leadinfo?.lastFieldFilled;
      if (field) dropOffMap[field] = (dropOffMap[field] || 0) + 1;
    }

    const dropOffStats = Object.entries(dropOffMap).map(([field, count]) => ({
      field,
      percent: Number(((count / partialLeads.length) * 100).toFixed(2)),
    }));

    const countryStats = (arr: any[]) =>
      arr.map((c) => ({
        country: c.country || "Unknown",
        count: c._count,
      }));

    const osMap = new Map<string, number>();
    const browserMap = new Map<string, number>();

    for (const d of deviceStatsRaw) {
      const os = d.os || "Unknown";
      const browser = d.browser || "Unknown";
      osMap.set(os, (osMap.get(os) || 0) + d._count);
      browserMap.set(browser, (browserMap.get(browser) || 0) + d._count);
    }

    const deviceStats = {
      os: Array.from(osMap, ([name, count]) => ({ name, count })),
      browser: Array.from(browserMap, ([name, count]) => ({
        name,
        count,
      })),
    };

    const todayStats = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      completed: 0,
      partiallyFilled: 0,
    }));

    for (const item of formFillsTodayRaw) {
      const hour = new Date(item.createdAt).getHours();
      item.conversion
        ? todayStats[hour].completed++
        : todayStats[hour].partiallyFilled++;
    }

    reply.send({
      error: false,
      msg: "Form analytics fetched successfully",
      data: {
        totalLeads,
        totalUsers: uniqueUsers.size,
        partialCount,
        completeCount,
        averageTimeOnForm,
        returningUsers: {
          returningUserCount,
          returningUserPercentage,
        },
        fieldTimeStats: avgTimeStats,
        fieldFillPercent: fieldFillStats,
        lastFilledFieldStats: dropOffStats,
        countryStats: {
          all: countryStats(countryAll),
          partial: countryStats(countryPartial),
          complete: countryStats(countryComplete),
        },
        deviceStats,
        formBehavior: {
          today: todayStats,
        },
      },
    });
  } catch (error) {
    console.error("fetchFormAnalyticsOverview error:", error);
    InternalServerError(reply, error);
  }
};

type FormLeadTrendsBody = {
  form_id: string;
};

export const fetchFormLeadTrends = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const { form_id } = request.body as FormLeadTrendsBody;

    if (!form_id) {
      reply.status(400).send({
        error: true,
        errorCode: "FORM_ID_REQUIRED",
        msg: "form_id is required",
        data: null,
      });
      return;
    }

    const form = await prisma.form.findFirst({
      where: { formId: form_id },
      select: { id: true },
    });

    if (!form) {
      reply.status(404).send({
        error: true,
        errorCode: "FORM_NOT_FOUND",
        msg: "Form not found",
        data: null,
      });
      return;
    }

    const formId = form.id;

    // Helper: fetch leads after date
    const getLeadsFromDate = (gteDate: Date) =>
      prisma.lead.findMany({
        where: {
          formId,
          createdAt: { gte: gteDate },
        },
        select: {
          createdAt: true,
          conversion: true,
        },
      });

    // Date boundaries
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    const last7DaysDate = new Date(todayMidnight);
    last7DaysDate.setDate(todayMidnight.getDate() - 7);

    const last1MonthDate = new Date(todayMidnight);
    last1MonthDate.setMonth(todayMidnight.getMonth() - 1);

    const last3MonthsDate = new Date(todayMidnight);
    last3MonthsDate.setMonth(todayMidnight.getMonth() - 3);

    const [leads7d, leads1m, leads3m] = await Promise.all([
      getLeadsFromDate(last7DaysDate),
      getLeadsFromDate(last1MonthDate),
      getLeadsFromDate(last3MonthsDate),
    ]);

    // Group leads into time buckets
    const groupByInterval = (
      leads: { createdAt: Date; conversion: boolean }[],
      startDate: Date,
      intervalDays: number,
    ) => {
      const buckets: Record<
        string,
        { partiallyFilled: number; completed: number }
      > = {};

      for (const lead of leads) {
        const diff = lead.createdAt.getTime() - startDate.getTime();
        const bucketIndex = Math.floor(
          diff / (intervalDays * 24 * 60 * 60 * 1000),
        );
        const bucketDate = new Date(startDate);
        bucketDate.setDate(startDate.getDate() + bucketIndex * intervalDays);

        const key = bucketDate.toISOString().split("T")[0];

        if (!buckets[key]) {
          buckets[key] = { partiallyFilled: 0, completed: 0 };
        }

        lead.conversion
          ? buckets[key].completed++
          : buckets[key].partiallyFilled++;
      }

      return buckets;
    };

    const generateTimeline = (
      startDate: Date,
      endDate: Date,
      intervalDays: number,
    ) => {
      const result: string[] = [];
      const current = new Date(startDate);

      while (current <= endDate) {
        result.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + intervalDays);
      }

      return result;
    };

    const normalizeTimeline = (
      grouped: Record<string, { partiallyFilled: number; completed: number }>,
      startDate: Date,
      endDate: Date,
      intervalDays: number,
    ) =>
      generateTimeline(startDate, endDate, intervalDays).map(
        (date) =>
          grouped[date] ?? {
            date,
            partiallyFilled: 0,
            completed: 0,
          },
      );

    const last7Days = normalizeTimeline(
      groupByInterval(leads7d, last7DaysDate, 1),
      last7DaysDate,
      todayMidnight,
      1,
    );

    const last1Month = normalizeTimeline(
      groupByInterval(leads1m, last1MonthDate, 1),
      last1MonthDate,
      todayMidnight,
      1,
    );

    const last3Months = normalizeTimeline(
      groupByInterval(leads3m, last3MonthsDate, 5),
      last3MonthsDate,
      todayMidnight,
      5,
    );

    reply.send({
      error: false,
      errorCode: null,
      msg: "Date-wise form lead stats fetched successfully",
      data: {
        last7Days,
        last1Month,
        last3Months,
      },
    });
  } catch (error) {
    console.error("fetchFormLeadTrends error:", error);
    reply.status(500).send({
      error: true,
      errorCode: "SERVER_ERROR",
      msg: "Internal server error",
      data: null,
    });
  }
};

type UpdateFormBody = {
  formId: string;
  updations: Record<string, any>;
};

export const updateFormDetails = async (
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

    if (!user || !user?.id) {
      reply.status(401).send({
        message: "Unauthorized",
        status: "Failed",
        errorCode: "err_verifying_user",
      });
      return;
    }

    const { formId, updations } = request.body as UpdateFormBody;

    if (!user?.id || !formId) {
      reply.status(400).send({
        errorCode: "form_id_or_user_missing",
        message: "Form ID and authenticated user are required",
        error: true,
        success: false,
      });
      return;
    }

    const formRecord = await prisma.form.findFirst({
      where: { formId },
      select: { id: true },
    });

    if (!formRecord) {
      reply.status(404).send({
        errorCode: "form_not_exists",
        message: "Form does not exist",
        error: true,
        success: false,
      });
      return;
    }

    const ownedForm = await prisma.form.findFirst({
      where: {
        id: formRecord.id,
        website: {
          userId: user.id,
        },
      },
      select: { id: true },
    });

    if (!ownedForm) {
      reply.status(403).send({
        errorCode: "form_unauthorized",
        message: "Unauthorized access to this form",
        error: true,
        success: false,
      });
      return;
    }

    const updatedForm = await prisma.form.update({
      where: { id: formRecord.id },
      data: updations,
    });

    reply.status(200).send({
      success: true,
      message: "Form updated successfully",
      data: updatedForm,
    });
  } catch (error) {
    console.error("updateFormDetails error:", error);
    reply.status(500).send({
      errorCode: "internal_server_error",
      message: "Something went wrong while updating the form",
      error: true,
      success: false,
    });
  }
};

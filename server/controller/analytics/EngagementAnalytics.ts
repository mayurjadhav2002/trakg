import { FastifyRequest, FastifyReply } from "fastify";
import { subMonths, subDays, format, startOfDay, endOfDay } from "date-fns";
import prisma from "../../lib/prisma_client";

type LeadTrendBody = {
  websiteId: string;
  formId?: string;
  range?: "7d" | "30d" | "90d" | "custom";
  startDate?: string;
  endDate?: string;
};

type LeadTrendEntry = {
  date: string;
  completed: number;
  partiallyFilled: number;
};

export const fetchLeadCompletionTrend = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const { websiteId, formId, range, startDate, endDate } =
      request.body as LeadTrendBody;

    if (!websiteId) {
      reply.status(400).send({
        success: false,
        message: "Website ID is required",
      });
      return;
    }

    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (range) {
      case "30d":
        start = subMonths(now, 1);
        break;
      case "90d":
        start = subMonths(now, 3);
        break;
      case "custom":
        if (!startDate || !endDate) {
          reply.status(400).send({
            success: false,
            message: "Custom range requires startDate and endDate",
          });
          return;
        }
        start = new Date(startDate);
        end = new Date(endDate);
        break;
      case "7d":
      default:
        start = subDays(now, 7);
    }

    const forms = await prisma.form.findMany({
      where: {
        website: {
          trackingId: websiteId,
        },
      },
      select: { id: true },
    });
    // @ts-ignore
    const formIds: string[] = forms.map((f) => f.id);

    if (!formIds.length) {
      reply.send({
        success: true,
        data: [],
      });
      return;
    }

    const baseWhere = {
      formId: formId
        ? formId
        : {
            in: formIds,
          },
      createdAt: {
        gte: start,
        lte: end,
      },
    };

    const [completed, partial] = await Promise.all([
      prisma.lead.groupBy({
        by: ["createdAt"],
        where: {
          ...baseWhere,
          conversion: true,
        },
        _count: { id: true },
      }),
      prisma.lead.groupBy({
        by: ["createdAt"],
        where: {
          ...baseWhere,
          conversion: false,
        },
        _count: { id: true },
      }),
    ]);

    const trendMap: Record<string, LeadTrendEntry> = {};

    for (const entry of completed) {
      const date = format(entry.createdAt, "yyyy-MM-dd");
      trendMap[date] ??= {
        date,
        completed: 0,
        partiallyFilled: 0,
      };
      trendMap[date].completed += entry._count?.id ?? 0;
    }

    for (const entry of partial) {
      const date = format(entry.createdAt, "yyyy-MM-dd");
      trendMap[date] ??= {
        date,
        completed: 0,
        partiallyFilled: 0,
      };
      trendMap[date].partiallyFilled += entry._count?.id ?? 0;
    }

    const result: LeadTrendEntry[] = [];
    const cursor = new Date(start);

    while (cursor <= end) {
      const date = format(cursor, "yyyy-MM-dd");
      result.push(
        trendMap[date] ?? {
          date,
          completed: 0,
          partiallyFilled: 0,
        },
      );
      cursor.setDate(cursor.getDate() + 1);
    }

    reply.send({
      success: true,
      message: "Lead completion trend fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Lead trend error:", error);
    reply.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

type WebsiteAnalyticsBody = {
  websiteId: string;
  formId?: string;
  startDate?: string;
  endDate?: string;
};

export const fetchWebsiteAnalyticsOverview = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const { websiteId, formId, startDate, endDate } =
      request.body as WebsiteAnalyticsBody;

    if (!websiteId) {
      reply.status(400).send({
        success: false,
        message: "Website ID is required",
      });
      return;
    }

    const now = new Date();
    const start = startDate ? new Date(startDate) : startOfDay(subDays(now, 7));

    const end = endDate ? new Date(endDate) : endOfDay(now);

    const website = await prisma.website.findFirst({
      where: { trackingId: websiteId },
      select: { id: true },
    });

    if (!website) {
      reply.status(404).send({
        success: false,
        message: "Website not found",
      });
      return;
    }

    const analyticsWhere = {
      websiteId: website.id,
      createdAt: { gte: start, lte: end },
      ...(formId ? { formId: formId } : {}),
    };

    const visitorCountryCounts = await prisma.analytics.groupBy({
      where: analyticsWhere,
      by: ["country"],
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
    });

    const deviceData = await prisma.analytics.groupBy({
      where: analyticsWhere,
      by: ["browser"],
      _count: { browser: true },
      orderBy: { _count: { browser: "desc" } },
    });

    const deviceBreakdown = deviceData.map((entry: any) => ({
      name: entry.browser,
      count: entry._count.browser,
    }));

    const pageVisitedCounts = await prisma.analytics.groupBy({
      where: analyticsWhere,
      by: ["pageUrl"],
      _count: { pageUrl: true },
      orderBy: { _count: { pageUrl: "desc" } },
    });

    const referralCounts = await prisma.lead.groupBy({
      where: {
        websiteId: website.id,
        createdAt: { gte: start, lte: end },
        ...(formId ? { formId: formId } : {}),
        NOT: { referral: null },
      },
      by: ["referral"],
      _count: { referral: true },
    });

    reply.send({
      success: true,
      message: "Website analytics fetched successfully",
      data: {
        visitorCountryCounts,
        deviceBreakdown,
        pageVisitedCounts,
        referralCounts,
      },
    });
  } catch (error) {
    console.error("Website analytics error:", error);
    reply.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

type FormAnalyticsQuery = {
  websiteId: string;
  formId: string;
  startDate?: string;
  endDate?: string;
};

export const fetchFormAnalyticsOverview = async (
  request: FastifyRequest<{ Querystring: FormAnalyticsQuery }>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const { websiteId, formId, startDate, endDate } = request.query;

    if (!websiteId || !formId) {
      reply.status(400).send({
        success: false,
        message: "Website ID and Form ID are required",
      });
      return;
    }

    const where: any = {
      websiteId: Number(websiteId),
      formId: Number(formId),
    };

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const analytics = await prisma.analytics.findMany({
      where,
      select: {
        action: true,
        device: true,
        country: true,
        city: true,
        leadId: true,
      },
    });

    const totalEvents = analytics.length;

    const completedForms = analytics.filter(
      // @ts-ignore
      (a) => a.action === "FORM_FILLED",
    ).length;

    const partiallyFilled = analytics.filter(
      // @ts-ignore
      (a) => a.action === "FORM_PARTIAL_FILL",
    ).length;

    const uniqueLeads = new Set(
      // @ts-ignore
      analytics.map((a) => a.leadId).filter(Boolean),
    ).size;

    const completionRate =
      totalEvents > 0
        ? Number(((completedForms / totalEvents) * 100).toFixed(2))
        : 0;

    const deviceStats: Record<string, number> = {};
    const countryStats: Record<string, number> = {};
    const cityStats: Record<string, number> = {};

    for (const a of analytics) {
      if (a.device) {
        const device = String(a.device ?? "unknown");

        deviceStats[device] = (deviceStats[device] || 0) + 1;
      }
      if (a.country)
        countryStats[a.country] = (countryStats[a.country] || 0) + 1;
      if (a.city) cityStats[a.city] = (cityStats[a.city] || 0) + 1;
    }

    reply.send({
      success: true,
      message: "Form analytics fetched successfully",
      data: {
        formId: Number(formId),
        websiteId: Number(websiteId),
        totalEvents,
        partiallyFilled,
        completedForms,
        completionRate,
        uniqueLeads,
        deviceStats,
        countryStats,
        cityStats,
      },
    });
  } catch (error) {
    console.error("Form analytics error:", error);
    reply.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// export const getFormAnalytics = async (req: Request, res: Response) => {
// 	try {
// 		const {websiteId, formId, startDate, endDate} = req.query;

// 		if (!websiteId) {
// 			return res.status(400).json({error: "websiteId is required"});
// 		}

// 		const start: Date = startDate
// 			? new Date(startDate as string)
// 			: subDays(new Date(), 7);
// 		const end: Date = endDate ? new Date(endDate as string) : new Date();

// 		const whereClause = {
// 			websiteId: Number(websiteId),
// 			action: {in: ["FORM_PARTIAL_FILL", "FORM_FILL"]},
// 			createdAt: {
// 				gte: start,
// 				lte: end,
// 			},
// 			...(formId ? {formId: Number(formId)} : {}),
// 		};

// 		const analyticsData = await prisma.analytics.groupBy({
// 			by: ["action", "createdAt"],
// 			where: whereClause,
// 			_count: {_all: true},
// 			orderBy: {createdAt: "asc"},
// 		});

// 		const userData = await prisma.analytics.groupBy({
// 			by: ["country", "city", "device", "browser", "action"],
// 			where: {
// 				websiteId: Number(websiteId),
// 				...(formId ? {formId: Number(formId)} : {}),
// 			},
// 			_count: {_all: true},
// 		});

// 		res.json({
// 			success: true,
// 			data: {
// 				formStatus: analyticsData,
// 				userData,
// 			},
// 		});
// 	} catch (error) {
// 		console.error("Error fetching form analytics:", error);
// 		res.status(500).json({error: "Internal Server Error"});
// 	}
// };

// export const getLeadSessionAnalytics = async (req: Request, res: Response) => {
// 	try {
// 		const {websiteId, formId, startDate, endDate} = req.query;

// 		const start: Date = startDate
// 			? new Date(startDate as string)
// 			: subDays(new Date(), 7);
// 		const end: Date = endDate ? new Date(endDate as string) : new Date();

// 		if (websiteId) {
// 			const avgSessionPerForm = await prisma.lead.groupBy({
// 				by: ["formId"],
// 				where: {
// 					form: {websiteId: Number(websiteId)},
// 					createdAt: {gte: start, lte: end},
// 				},
// 				_avg: {sessionTime: true},
// 				_count: {id: true},
// 			});

// 			return res.json({
// 				success: true,
// 				type: "form",
// 				data: avgSessionPerForm,
// 			});
// 		}

// 		if (formId) {
// 			const distinctFields = await prisma.lead.findMany({
// 				where: {
// 					formId: Number(formId),
// 					createdAt: {gte: start, lte: end},
// 				},
// 				select: {formData: true},
// 				take: 1000,
// 			});

// 			const fieldNames = new Set<string>();
// 			distinctFields.forEach((lead) => {
// 				Object.keys(lead.formData).forEach((field) =>
// 					fieldNames.add(field)
// 				);
// 			});

// 			const fieldStats = await Promise.all(
// 				Array.from(fieldNames).map(async (field) => {
// 					return await prisma.lead.groupBy({
// 						by: ["formData"],
// 						where: {
// 							formId: Number(formId),
// 							createdAt: {gte: start, lte: end},
// 							formData: {path: [field]},
// 						},
// 						_avg: {sessionTime: true},
// 						_count: {id: true},
// 					});
// 				})
// 			);

// 			return res.json({
// 				success: true,
// 				type: "field",
// 				data: fieldStats.flat(),
// 			});
// 		}

// 		res.status(400).json({error: "Either websiteId or formId is required"});
// 	} catch (error) {
// 		console.error("Error fetching analytics:", error);
// 		res.status(500).json({error: "Internal Server Error"});
// 	}
// };

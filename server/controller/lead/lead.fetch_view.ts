import { Request, Response } from "express";
import prisma from "../../lib/prisma_client";
import { InternalServerError } from "../../lib/apiResponse/ErrorRes";

import { UserInformation } from "../../lib/validations/UserValidation";
import { FastifyRequest, FastifyReply } from "fastify";

type DeleteLeadParams = {
  leadId: string;
};

export const deleteLead = async (
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
    const { leadId } = request.params as DeleteLeadParams;

    if (!leadId) {
      reply.status(400).send({
        message: "Lead ID is missing",
        status: "Failed",
        errorCode: "lead_delete_err",
      });
      return;
    }

    const lead = await prisma.lead.findFirst({
      where: {
        uniqueId: leadId,
      },
      select: {
        uniqueId: true,
        form: {
          select: {
            website: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!lead) {
      reply.status(404).send({
        message: "Lead not found",
        status: "Failed",
        errorCode: "lead_not_found_err",
      });
      return;
    }

    if (lead.form.website.userId !== user.id) {
      reply.status(403).send({
        message: "Unauthorized to delete this lead",
        status: "Failed",
        errorCode: "unauthorized_err",
      });
      return;
    }

    const deletedLead = await prisma.lead.delete({
      where: {
        uniqueId: leadId,
      },
    });

    reply.status(200).send({
      message: "Lead deleted successfully",
      status: "Success",
      data: deletedLead,
    });
  } catch {
    reply.status(500).send({
      message: "Internal Server Error",
      status: "Failed",
      errorCode: "internal_server_err",
    });
  }
};

type GetLeadsQuery = {
  website_id: string;
  page?: number | string;
  limit?: number | string;
  conversion?: "true" | "false";
  form_id?: string;
  search?: string;
  country?: string;
};

export const GetLeads = async (
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
    const id = user.id;
    const {
      website_id,
      page = 0,
      limit = 10,
      conversion,
      form_id,
      search,
      country,
    } = request.query as GetLeadsQuery;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = pageNumber * limitNumber;
    const take = limitNumber;

    const baseFilter: any = {
      form: {
        website: {
          uniqueId: website_id,
          userId: id,
        },
        ...(form_id && { formName: form_id }),
      },
      ...(conversion === "true" && { conversion: true }),
      ...(conversion === "false" && { conversion: false }),
      ...(search && {
        formData: {
          some: {
            value: {
              contains: search.toLowerCase(),
              mode: "insensitive",
            },
          },
        },
      }),
      ...(country &&
        country !== "all" && {
          country: {
            equals: country,
          },
        }),
    };

    const cacheKey = `leads-count:${website_id}:${id}:${conversion ?? "all"}`;

    let totalLeads: number;
    const cachedCount = null;

    if (cachedCount) {
      totalLeads = parseInt(cachedCount, 10);
    } else {
      totalLeads = await prisma.lead.count({ where: baseFilter });
    }

    const leads = await prisma.lead.findMany({
      where: baseFilter,
      select: {
        uniqueId: true,
        formId: true,
        form: {
          select: {
            pageUrl: true,
            formName: true,
          },
        },
        opportunityGeo: true,
        createdAt: true,
        formData: true,
        conversion: true,
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!leads || leads.length === 0) {
      reply.status(201).send({
        message: "Not Enough Leads",
        status: "Success",
        data: [],
      });
      return;
    }

    const enrichedLeads = leads.map((lead: any) => {
      const geo = lead.opportunityGeo as any;
      return {
        ...lead,
        city: geo?.cityName ?? null,
        country: geo?.countryName ?? null,
        ip: geo?.ipAddress ?? null,
        countryCode: geo?.countryCode ?? "IN",
        opportunityGeo: null,
      };
    });

    reply.status(200).send({
      message: "Leads Found",
      status: "Success",
      data: {
        leads: enrichedLeads,
        totalPages: Math.ceil(totalLeads / limitNumber),
        totalLeads,
      },
    });
  } catch (error) {
    reply.status(500).send({
      message: "Internal Server Error",
      status: "Failed",
      errorCode: "internal_server_err",
    });
  }
};

type GetLeadDetailsBody = {
  leadId: string;
  isExternal?: boolean;
};

export const getLeadDetails = async (
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
    const userId = user.id;
    const { leadId, isExternal } = request.body as GetLeadDetailsBody;

    if (!leadId) {
      reply.status(400).send({
        message: "Fields are Missing",
        status: "Failed",
        errorCode: "lead_get_err",
      });
      return;
    }

    const lead = await prisma.lead.findFirst({
      where: {
        uniqueId: leadId,
        website: {
          userId,
        },
      },
      select: {
        formId: true,
        form: {
          select: {
            pageUrl: true,
            formName: true,
          },
        },
        createdAt: true,
        formData: true,
        conversion: true,
        opportunityId: true,
        opportunityGeo: true,
        referral: true,
        timeSpendOnForm: true,
        externalFormId: isExternal || false,
        valueChanges: {
          select: {
            key: true,
            value: true,
            currentTime: true,
          },
        },
        fieldTimes: {
          select: {
            fieldName: true,
            timeSpent: true,
          },
        },
        leadinfo: {
          select: {
            timeSpent: true,
            lastFieldFilled: true,
          },
        },
        deviceInfo: {
          select: {
            otherData: true,
          },
        },
      },
    });

    if (!lead) {
      reply.status(404).send({
        message: "Lead Not Found or Unauthorized",
        status: "Failed",
        errorCode: "lead_not_found_or_unauthorized",
      });
      return;
    }

    const userInfo = await UserInformation(userId);
    const now = new Date();

    const advancedAllowed =
      !!userInfo?.success &&
      ((userInfo.trialEndsAt && userInfo.trialEndsAt > now) ||
        userInfo.subscriptionStatus === "active") &&
      !!userInfo.allowed?.advancedAnalytics;

    const geo = lead.opportunityGeo as any;

    let totalTime = 0;
    let fieldCount = 0;

    const groupedValueChanges = lead.valueChanges.reduce(
      (acc: Record<string, any>, change: any) => {
        if (!acc[change.key]) {
          acc[change.key] = { data: [], timespent: [] };
        }
        acc[change.key].data.push({ value: change.value });

        if (change.currentTime !== null && !isNaN(Number(change.currentTime))) {
          const t = Number(change.currentTime);
          acc[change.key].timespent.push(t);
          totalTime += t;
          fieldCount += 1;
        }
        return acc;
      },
      {},
    );

    const averageOnEachField = fieldCount > 0 ? totalTime / fieldCount : 0;

    const finalLead = {
      ...lead,
      valueChanges: groupedValueChanges,
      averageOnEachField,
      opportunityGeo: {
        latitude: advancedAllowed ? geo.latitude : null,
        longitude: advancedAllowed ? geo.longitude : null,
        ipVersion: advancedAllowed ? geo.ipVersion : null,
        ipAddress: geo.ipAddress,
        countryName: geo.countryName,
        countryCode: advancedAllowed ? geo.countryCode : null,
        timeZone: geo.timeZone,
        zipCode: geo.zipCode,
        cityName: geo.cityName,
        regionName: geo.regionName,
        isProxy: advancedAllowed ? geo.isProxy : null,
        continent: advancedAllowed ? geo.continent : null,
      },
      deviceInfo: {
        otherData: {
          ...((lead.deviceInfo?.otherData as Record<string, any>) || {}),
          screen: advancedAllowed
            ? getOtherDataValue(lead.deviceInfo?.otherData, "screen")
            : null,
        },
      },
    };

    reply.status(200).send({
      message: "Lead Found",
      status: "Success",
      data: finalLead,
    });
  } catch {
    reply.status(500).send({
      message: "Internal Server Error",
      status: "Failed",
      errorCode: "internal_server_err",
    });
  }
};

function getOtherDataValue<T = unknown>(obj: unknown, key: string): T | null {
  if (typeof obj === "object" && obj !== null && key in obj) {
    return (obj as Record<string, unknown>)[key] as T;
  }
  return null;
}

type FilterLeadsQuery = {
  website_id: string;
  page?: number | string;
  limit?: number | string;
  conversion?: "true" | "false";
  form_id?: string;
  search?: string;
  country?: string;
};

export const filterLeads = async (
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
    const userId = user.id;
    const {
      website_id,
      page = 0,
      limit = 10,
      conversion,
      form_id,
      search,
    } = request.query as FilterLeadsQuery;

    if (!website_id) {
      reply.status(400).send({
        status: "Error",
        message: "website_id is required",
      });
      return;
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = pageNumber * limitNumber;

    const baseFilter: any = {
      form: {
        website: {
          uniqueId: website_id,
          userId,
        },
      },
    };

    if (conversion === "false") baseFilter.conversion = false;
    if (conversion === "true") baseFilter.conversion = true;

    if (form_id) {
      baseFilter.form = {
        ...baseFilter.form,
        formName: Number(form_id),
      };
    }

    if (search) {
      baseFilter.OR = [
        {
          formData: {
            contains: search.toLowerCase(),
            mode: "insensitive",
          },
        },
      ];
    }

    const totalLeads = await prisma.lead.count({ where: baseFilter });
    const totalPages = Math.ceil(totalLeads / limitNumber);

    const leads = await prisma.lead.findMany({
      where: baseFilter,
      select: {
        uniqueId: true,
        formId: true,
        form: {
          select: {
            pageUrl: true,
            formName: true,
          },
        },
        opportunityGeo: true,
        createdAt: true,
        formData: true,
        conversion: true,
      },
      skip,
      take: limitNumber,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!leads || leads.length === 0) {
      reply.status(404).send({
        status: "Error",
        message: "No more leads",
        errorCode: "no_more_leads",
        data: {
          leads: [],
          currentPage: pageNumber,
          totalPages,
          totalLeads,
        },
      });
      return;
    }

    const enrichedLeads = leads.map((lead: any) => {
      const geo = lead.opportunityGeo as any;
      return {
        ...lead,
        city: geo?.cityName ?? null,
        country: geo?.countryName ?? null,
        ip: geo?.ipAddress ?? null,
        countryCode: geo?.countryCode ?? "IN",
        opportunityGeo: null,
      };
    });

    reply.status(200).send({
      message: "Leads Found",
      status: "Success",
      data: {
        leads: enrichedLeads,
        currentPage: pageNumber,
        totalPages,
        totalLeads,
      },
    });
  } catch {
    reply.status(500).send({
      message: "Internal Server Error",
      status: "Failed",
      errorCode: "internal_server_err",
    });
  }
};

type LeadFiltersQuery = {
  website_id: string;
};

export const getLeadFilterOptions = async (
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
    const userId = user.id;
    const { website_id } = request.query as LeadFiltersQuery;

    if (!website_id) {
      reply.status(400).send({
        status: "Error",
        message: "website_id is required",
      });
      return;
    }

    const leads = await prisma.lead.findMany({
      where: {
        form: {
          website: {
            uniqueId: website_id,
            userId,
          },
        },
      },
      select: {
        form: {
          select: {
            formName: true,
            pageUrl: true,
          },
        },
        conversion: true,
        opportunityGeo: true,
      },
    });

    const countries = new Set<string>();
    const conversions = new Set<boolean>();
    const forms = new Map<string, { formName: string; pageUrl: string }>();

    for (const lead of leads) {
      const geo = lead.opportunityGeo as any;

      if (geo?.countryName) {
        countries.add(geo.countryName);
      }

      if (typeof lead.conversion === "boolean") {
        conversions.add(lead.conversion);
      }

      const formKey = `${lead.form.formName}::${lead.form.pageUrl}`;
      if (!forms.has(formKey)) {
        forms.set(formKey, {
          formName: lead.form.formName,
          pageUrl: lead.form.pageUrl,
        });
      }
    }

    reply.status(200).send({
      status: "Success",
      message: "Filter options fetched",
      data: {
        countries: Array.from(countries),
        forms: Array.from(forms.values()),
        conversions: Array.from(conversions),
      },
    });
  } catch {
    reply.status(500).send({
      message: "Internal Server Error",
      status: "Failed",
      errorCode: "internal_server_err",
    });
  }
};

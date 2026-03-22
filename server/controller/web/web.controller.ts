import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../../lib/prisma_client";
import { subMonths, startOfDay } from "date-fns";
import { InternalServerError } from "../../lib/apiResponse/ErrorRes";
import { UserInformation } from "../../lib/validations/UserValidation";
import { generateIds } from "../../lib/random/trackingId";

type WebsiteAnalyticsBody = {
  website_id: string;
};

export const getWebsiteAnalytics = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const user = request?.user;

    if (!user) {
      reply.status(401).send({
        message: "Unauthorized",
        status: "Failed",
        errorCode: "auth_err_token_invalid",
      });
      return;
    }

    const { website_id } = request.body as WebsiteAnalyticsBody;

    if (!website_id) {
      reply.status(400).send({
        error: "Website ID is required",
        message: "Website ID is required",
        status: "Failed",
        errorCode: "invalid_request",
      });
      return;
    }

    const website = await prisma.website.findFirst({
      where: { trackingId: String(website_id) },
    });

    if (!website) {
      reply.status(404).send({ error: "Website not found" });
      return;
    }

    const websiteId = website.id;
    const twoMonthsAgo = subMonths(new Date(), 2);

    const [totalLeads, partialLeads] = await Promise.all([
      prisma.lead.count({ where: { websiteId } }),
      prisma.lead.count({
        where: { websiteId, conversion: false },
      }),
    ]);

    const leadsByCountry = await prisma.lead.groupBy({
      by: ["country"],
      where: { websiteId },
      _count: { _all: true },
    });

    const totalForms = await prisma.form.count({
      where: { websiteId },
    });

    const deviceDetails = await prisma.analytics.groupBy({
      by: ["device"],
      where: { websiteId },
      _count: { _all: true },
    });

    const avgTime = await prisma.leadInfo.aggregate({
      where: {
        lead: { websiteId },
        timeSpent: { not: null },
      },
      _avg: {
        timeSpent: true,
      },
    });

    const referrers = await prisma.lead.groupBy({
      by: ["referral"],
      where: {
        websiteId,
        referral: { not: null },
      },
      _count: { _all: true },
    });

    const leadsByDate = await prisma.lead.findMany({
      where: {
        websiteId,
        createdAt: { gte: twoMonthsAgo },
      },
      select: { createdAt: true },
    });

    const leadsGroupedByDate: Record<string, number> = {};
    for (const lead of leadsByDate) {
      const day = startOfDay(lead.createdAt).toISOString().split("T")[0];
      leadsGroupedByDate[day] = (leadsGroupedByDate[day] || 0) + 1;
    }

    reply.send({
      status: "Success",
      totalLeads,
      partialLeads,
      completedLeads: totalLeads - partialLeads,
      leadsByCountry,
      totalForms,
      deviceDetails,
      averageTimeSpent: avgTime._avg.timeSpent ?? null,
      referrers,
      leadsGroupedByDate,
    });
  } catch {
    reply.status(500).send({
      message: "Something went wrong",
      status: "Failed",
      errorCode: "internal_server_err",
    });
  }
};

export function normalizeForDb(url: string): string | null {
  try {
    const u = new URL(url.includes("://") ? url : `https://${url}`);

    if (u.hostname === "localhost") {
      return `${u.protocol}//${u.hostname}${u.port ? `:${u.port}` : ""}`;
    }

    const hostname = (
      u.hostname.startsWith("www.") ? u.hostname.slice(4) : u.hostname
    ).toLowerCase();

    return `https://${hostname}`;
  } catch {
    return null;
  }
}

type CreateWebsiteBody = {
  website_name: string;
  website_url: string;
  website_description?: string;
  notification_info: {
    name: string;
    email: string;
  };
};

export const createWebsite = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const user = request?.user;
    const supabase_userId = user?.id;
    const fetch_user = await prisma.user.findUnique({
      where: { supabaseId: supabase_userId },
    });
    if (!fetch_user) {
      reply.status(404).send({
        message: "Couldnt find the user",
        status: "Failed",
        errorCode: "user_not_found",
      });
      return;
    }
    const id = fetch_user.id;
    if (!id) {
      reply.status(401).send({
        message: "Unauthorized",
        status: "Failed",
        errorCode: "auth_err_token_invalid",
      });
      return;
    }

    const {
      website_name,
      website_url,
      website_description,
      notification_info,
    } = request.body as CreateWebsiteBody;

    if (!website_name || !website_url || !notification_info) {
      reply.status(400).send({
        success: false,
        message: "All fields are required",
        status: "Failed",
        errorCode: "web_create_err",
      });
      return;
    }

    if (!notification_info.name || !notification_info.email) {
      reply.status(400).send({
        success: false,
        message: "Notification info is required",
        status: "Failed",
        errorCode: "web_create_err",
      });
      return;
    }

    const normalizedUrl = normalizeForDb(website_url);
    if (!normalizedUrl) {
      reply.status(400).send({
        success: false,
        message: "Invalid website URL",
        status: "Failed",
        errorCode: "web_create_err",
      });
      return;
    }
    const existingWebsite = await prisma.website.findFirst({
      where: { url: normalizedUrl },
    });

    if (existingWebsite) {
      reply.status(409).send({
        success: false,
        message: "Website already exists",
        status: "Failed",
        errorCode: "web_exists_err",
      });
      return;
    }

    const trackingId = generateIds(10);

    const newWebsite = await prisma.website.create({
      data: {
        userId: id,
        name: website_name,
        url: normalizedUrl,
        description: website_description,
        trackingId,
        notificationUser: notification_info.name,
        notificationEmail: notification_info.email,
        uniqueId: trackingId,
      },
    });

    reply.status(200).send({
      success: true,
      message: "Website Created",
      status: "Success",
      data: {
        website: {
          website_id: newWebsite.id,
          website_url: newWebsite.url,
          website_name: newWebsite.name,
          website_status: newWebsite.isActive,
          notification_info: {
            name: newWebsite.notificationUser,
            email: newWebsite.notificationEmail,
          },
          trackingId: newWebsite.trackingId,
        },
      },
    });
  } catch (error) {
    InternalServerError(reply, error as Error);
  }
};

type GetSiteParams = {
  id?: string;
};

type GetSiteQuery = {
  url?: string;
};

export const fetchWebsiteDetails = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const supabase_user = request.user;

    if (!supabase_user) {
      reply.status(401).send({
        message: "Unauthorized",
        status: "Failed",
        errorCode: "auth_err_token_invalid",
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
        errorCode: "auth_err_token_invalid",
      });
      return;
    }

    const { id: trackingId } = request.params as GetSiteParams;
    const { url } = request.query as GetSiteQuery;

    if (!trackingId && !url) {
      reply.status(400).send({
        message: "Website ID or URL is required",
        status: "Failed",
        errorCode: "web_get_err",
      });
      return;
    }

    const website = await prisma.website.findFirst({
      where: {
        trackingId: String(trackingId),
      },
      include: {
        leads: {
          select: {
            conversion: true,
          },
        },
      },
    });

    if (!website) {
      reply.status(404).send({
        message: "Website not found",
        status: "Failed",
        errorCode: "web_get_err",
      });
      return;
    }

    if (url) {
      const normalizedUrl = normalizeForDb(url);
      if (!normalizedUrl || website.url !== normalizedUrl) {
        reply.status(404).send({
          message: "Website not found",
          status: "Failed",
          errorCode: "web_get_err",
        });
        return;
      }
    }

    if (website.userId !== user.id) {
      reply.status(403).send({
        message: "Unauthorized",
        status: "Failed",
        errorCode: "auth_err_token_invalid",
      });
      return;
    }

    const totalLeads = website.leads.length;
    const completedLeads = website.leads.filter(
      // @ts-ignore
      (l) => l.conversion === true,
    ).length;
    const partialLeads = totalLeads - completedLeads;

    reply.status(200).send({
      message: "Website Found",
      status: "Success",
      data: {
        website: {
          website_id: website.id,
          website_url: website.url,
          website_name: website.name,
          isActive: website.isActive,
          trackingId: website.trackingId,
          created_at: website.createdAt,
          notification_info: {
            name: website.notificationUser,
            email: website.notificationEmail,
          },
          lead_stats: {
            total: totalLeads,
            partial: partialLeads,
            completed: completedLeads,
          },
        },
      },
    });
  } catch (error) {
    InternalServerError(reply, error as Error);
  }
};

export const fetchAllWebsites = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const supabaseUser = request.user;

    if (!supabaseUser) {
      reply.status(401).send({
        status: "error",
        message: "Please login to continue.",
        errorCode: "unauthorized",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        supabaseId: supabaseUser.id,
      },
    });

    if (!user) {
      reply.status(404).send({
        status: "error",
        message: "User account not found.",
        errorCode: "user_not_found",
      });
      return;
    }

    const websites = await prisma.website.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        url: true,
        isActive: true,
        verified: true,
        trackingId: true,
        createdAt: true,
        notificationUser: true,
        notificationEmail: true,
      },
    });

    if (!websites.length) {
      reply.status(200).send({
        status: "success",
        message: "No websites added yet.",
        errorCode: null,
        data: {
          websites: [],
        },
      });
      return;
    }

    reply.status(200).send({
      status: "success",
      message: "Websites fetched successfully.",
      errorCode: null,
      data: {
        websites,
      },
    });
  } catch (error) {
    reply.status(500).send({
      status: "error",
      message: "Something went wrong while fetching websites.",
      errorCode: "internal_server_error",
    });
  }
};

const ALLOWED_UPDATE_FIELDS = [
  "name",
  "url",
  "isActive",
  "notificationEmail",
  "notificationUser",
  "recordLeads",
] as const;

type UpdateWebsiteParams = {
  website_id: string;
};

type UpdateWebsiteBody = {
  updateFields: Partial<Record<(typeof ALLOWED_UPDATE_FIELDS)[number], any>>;
};

export const updateWebsiteDetails = async (
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

    const { website_id } = request.params as UpdateWebsiteParams;

    if (!website_id) {
      reply.status(400).send({
        message: "Invalid website ID",
        errorCode: "invalid_id",
        success: false,
      });
      return;
    }

    const website = await prisma.website.findFirst({
      where: { trackingId: website_id },
    });

    if (!website) {
      reply.status(404).send({
        message: "Website not found",
        errorCode: "not_found",
        success: false,
      });
      return;
    }

    if (website.userId !== user.id) {
      reply.status(403).send({
        message: "Forbidden",
        errorCode: "access_denied",
        success: false,
      });
      return;
    }

    const { updateFields } = request.body as UpdateWebsiteBody;

    if (!updateFields || typeof updateFields !== "object") {
      reply.status(400).send({
        message: "Missing or invalid updateFields",
        errorCode: "invalid_update_fields",
        success: false,
      });
      return;
    }

    const updateData: Partial<Record<string, unknown>> = {};

    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (updateFields[field] !== undefined) {
        updateData[field] = updateFields[field];
      }
    }

    if (!Object.keys(updateData).length) {
      reply.status(400).send({
        message: "No valid fields provided for update",
        errorCode: "no_valid_fields",
        success: false,
      });
      return;
    }

    await prisma.website.update({
      where: { id: website.id },
      data: updateData,
    });

    reply.status(200).send({
      message: "Website updated successfully",
      status: "success",
      success: true,
    });
  } catch (error) {
    InternalServerError(reply, error as Error);
  }
};

const TRACKER_SCRIPT = `${process.env.TRAKG_BACKEND_URL}/${process.env.TRAKG_API_VERSION}/tracker.min.js`;

type VerifyWebsiteBody = {
  website_id: string;
};

export const verifyWebsiteTracker = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const { website_id } = request.body as VerifyWebsiteBody;

    if (!website_id) {
      reply.status(400).send({
        error: "missing_website_id",
        message: "website_id is required",
      });
      return;
    }

    const website = await prisma.website.findUnique({
      where: { id: website_id },
      select: {
        id: true,
        url: true,
        verified: true,
      },
    });

    if (!website) {
      reply.status(404).send({
        error: "website_not_found",
        message: "Website not found",
      });
      return;
    }

    if (website.verified) {
      reply.send({
        success: true,
        message: "Website already verified",
      });
      return;
    }

    const fetchWithTimeout = async (
      url: string,
      timeoutMs = 8000,
    ): Promise<Response | null> => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        return await fetch(url, { signal: controller.signal });
      } catch {
        return null;
      } finally {
        clearTimeout(timeout);
      }
    };

    const isTrackerPresent = async (siteUrl: string): Promise<boolean> => {
      const response = await fetchWithTimeout(siteUrl);
      if (!response || !response.ok) return false;

      const html = await response.text();
      return html.includes(TRACKER_SCRIPT);
    };

    const trackerFound = await isTrackerPresent(website.url);

    if (!trackerFound) {
      reply.status(400).send({
        error: "tracker_script_not_found",
        message: "Tracking script not found on the website",
      });
      return;
    }

    await prisma.website.update({
      where: { id: website.id },
      data: { verified: true },
    });

    reply.send({
      success: true,
      message: "Website tracker verified successfully",
    });
  } catch (error) {
    reply.status(500).send({
      error: "internal_error",
      message: "Internal server error",
    });
  }
};

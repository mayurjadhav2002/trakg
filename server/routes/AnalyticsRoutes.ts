import {
  fetchLeadCompletionTrend,
  fetchWebsiteAnalyticsOverview,
} from "../controller/analytics/EngagementAnalytics";
import { getWebsiteAnalytics } from "../controller/web/web.controller";
import { FastifyInstance } from "fastify";
import { AuthMiddleware } from "../middleware/auth.middlware";

export default async function AnalyticsRoutes(app: FastifyInstance) {
  app.post(
    "/analytics/engagement-analytics",
    { preHandler: AuthMiddleware },
    getWebsiteAnalytics,
  );

  app.post(
    "/analytics/lead-completion",
    { preHandler: AuthMiddleware },
    fetchLeadCompletionTrend,
  );

  app.post(
    "/analytics/form-analytics",
    { preHandler: AuthMiddleware },
    fetchWebsiteAnalyticsOverview,
  );
}

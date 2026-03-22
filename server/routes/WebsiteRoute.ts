import { FastifyInstance } from "fastify";

import { AuthMiddleware } from "../middleware/auth.middlware";
import {
  createWebsite,
  fetchAllWebsites,
  fetchWebsiteDetails,
  updateWebsiteDetails,
  verifyWebsiteTracker,
} from "../controller/web/web.controller";
import { fetchWebsiteAnalyticsOverview } from "../controller/analytics/EngagementAnalytics";

export default async function WebRoutes(app: FastifyInstance) {
  app.post("/website/new", { preHandler: AuthMiddleware }, createWebsite);

  app.get("/website/all", { preHandler: AuthMiddleware }, fetchAllWebsites);

  app.put(
    "/website/:website_id",
    { preHandler: AuthMiddleware },
    updateWebsiteDetails,
  );

  app.get("/website/:id", { preHandler: AuthMiddleware }, fetchWebsiteDetails);

  app.post(
    "/website/verify",
    { preHandler: AuthMiddleware },
    verifyWebsiteTracker,
  );

  app.post(
    "/website/analytics",
    { preHandler: AuthMiddleware },
    fetchWebsiteAnalyticsOverview,
  );
}

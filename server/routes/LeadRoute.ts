import { FastifyInstance } from "fastify";

import {
  deleteLead,
  filterLeads,
  getLeadDetails,
  getLeadFilterOptions,
  GetLeads,
} from "../controller/lead/lead.fetch_view";

import { AuthMiddleware } from "../middleware/auth.middlware";
import { createLead } from "../controller/lead/lead.create";

export default async function LeadRoutes(app: FastifyInstance) {
  app.get("/create", createLead);
  app.get("/lead", { preHandler: AuthMiddleware }, GetLeads);

  app.delete(
    "/lead/delete/:leadId",
    { preHandler: AuthMiddleware },
    deleteLead,
  );

  app.post("/lead/getOne", { preHandler: AuthMiddleware }, getLeadDetails);

  app.get(
    "/lead/getFilteredLeads",
    { preHandler: AuthMiddleware },
    filterLeads,
  );

  app.get(
    "/lead/allFilters",
    { preHandler: AuthMiddleware },
    getLeadFilterOptions,
  );
}

import { FastifyInstance } from "fastify";

import { fetchUserSessions } from "../controller/sessions/SessionController";
import { AuthMiddleware } from "../middleware/auth.middlware";

export default async function SessionRoutes(app: FastifyInstance) {
  app.get(
    "/session/all-sessions",
    { preHandler: AuthMiddleware },
    fetchUserSessions,
  );
}

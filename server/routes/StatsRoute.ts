import { FastifyInstance } from "fastify";

import { fetchUserUsageOverview } from "../controller/stats/StatsController";
import { AuthMiddleware } from "../middleware/auth.middlware";

export default async function StatsRoutes(app: FastifyInstance) {
	app.get(
		"/stats/usage-details",
		{ preHandler: AuthMiddleware },
		fetchUserUsageOverview
	);
}
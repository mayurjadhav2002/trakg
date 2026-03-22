import { FastifyInstance } from "fastify";

import {
	fetchAllForms,
	fetchLeadsByForm,
	updateFormDetails,
	fetchFormAnalyticsOverview,
	fetchFormLeadTrends,
} from "../controller/form/formController";

import { AuthMiddleware } from "../middleware/auth.middlware";

export default async function FormRoutes(app: FastifyInstance) {
	app.post(
		"/form/:website_id/:formId",
		{ preHandler: AuthMiddleware },
		fetchLeadsByForm
	);

	app.get(
		"/form/all/:website_id",
		{ preHandler: AuthMiddleware },
		fetchAllForms
	);

	app.get(
		"/form/all",
		{ preHandler: AuthMiddleware },
		fetchAllForms
	);

	app.get("/form", async (_request, reply) => {
		reply.status(200).send({
			message: "Form Route",
			status: "Success",
		});
	});

	app.put(
		"/form",
		{ preHandler: AuthMiddleware },
		updateFormDetails
	);

	app.post(
		"/form/analytics",
		{ preHandler: AuthMiddleware },
		fetchFormAnalyticsOverview
	);

	app.post(
		"/form/trends_analytics",
		{ preHandler: AuthMiddleware },
		fetchFormLeadTrends
	);
}
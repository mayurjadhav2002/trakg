import Fastify from "fastify";
import path from "path";
import dotenv from "dotenv";
import passport from "passport";

import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import compress from "@fastify/compress";
import cookie from "@fastify/cookie";
import session from "@fastify/session";
import staticPlugin from "@fastify/static";

import AuthRoutes from "../routes/AuthRoutes";
import FormRoutes from "../routes/FormRoute";
import LeadRoutes from "../routes/LeadRoute";
import WebRoutes from "../routes/WebsiteRoute";
import AccountRoutes from "../routes/AccountRoute";
import AnalyticsRoutes from "../routes/AnalyticsRoutes";
import StatsRoutes from "../routes/StatsRoute";
import SessionRoutes from "../routes/SessionRoute";

import "../lib/passport/app";
import "module-alias/register";

import cron from "node-cron";
import { processExpiredLeads } from "../background_workers/lead_sync";
import multipart from "@fastify/multipart";

dotenv.config();

const app = Fastify({
  logger: true,
});

const API_VERSION_PATH = `/api/${process.env.API_VERSION}`;

(async () => {
  await app.register(cors, {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });

  await app.register(helmet, {
    crossOriginResourcePolicy: false,
  });

  await app.register(compress);

  await app.register(multipart);
  await app.register(cookie);

  await app.register(session, {
    secret: process.env.SESSION_SECRET!,
    cookieName: "session",
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
    saveUninitialized: false,
  });

  app.decorate("passport", passport);

  // @ts-ignore
  app.addHook("preHandler", passport.initialize());
  // @ts-ignore
  app.addHook("preHandler", passport.session());

  // await app.register(staticPlugin, {
  //   root: path.join(__dirname, "..", "public"),
  //   prefix: "/public/",
  // });

  await app.register(staticPlugin, {
    root: path.join(__dirname, "..", "script"),
    prefix: `${API_VERSION_PATH}/script/`,
    maxAge: "7d",
    immutable: true,
  });

  // await app.register(AuthRoutes, { prefix: "/auth" });

  await app.register(AuthRoutes, { prefix: API_VERSION_PATH });
  await app.register(FormRoutes, { prefix: API_VERSION_PATH });
  await app.register(LeadRoutes, { prefix: API_VERSION_PATH });
  await app.register(WebRoutes, { prefix: API_VERSION_PATH });
  await app.register(AccountRoutes, { prefix: API_VERSION_PATH });
  await app.register(AnalyticsRoutes, { prefix: API_VERSION_PATH });
  await app.register(StatsRoutes, { prefix: API_VERSION_PATH });
  await app.register(SessionRoutes, { prefix: API_VERSION_PATH });

  cron.schedule("*/5 * * * *", async () => {
    console.log("⏳ Cron started: syncing expired leads...");
    await processExpiredLeads();
  });
  app.get("/", async () => {
    return { message: "Welcome to the API" };
  });

  const PORT = Number(process.env.PORT) || 3000;

  app.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`🚀 Server running on ${process.env.BACKEND_URL}`);
  });
})();

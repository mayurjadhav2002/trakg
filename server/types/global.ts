import { Request } from "express";
import { SendMailOptions } from "nodemailer";
export interface AuthenticatedRequest extends Request {
  user: any;
}

export type LeadStatsEntry = {
  date: string;
  partiallyFilled: number;
  completed: number;
};

export type EmailOptions = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  cc?: string;
  bcc?: string;
  replyTo?: string;
  attachments?: SendMailOptions["attachments"];
};

import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user?: any;
  }
}

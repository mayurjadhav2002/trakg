import { FastifyInstance } from "fastify";
import { addDays } from "date-fns";

import prisma from "../lib/prisma_client";
import { generateIds } from "../lib/random/trackingId";
import { TRIAL_PERIOD } from "../lib/constants";
import { sendEmail } from "../mail/nodemailer.config";
import { newUserTemplate } from "../mail/templates/NewUser";

import { SupabaseAuth } from "../middleware/supabaseAuth";

export default async function AuthRoutes(app: FastifyInstance) {
  app.post(
    "/auth/sync",
    { preHandler: SupabaseAuth },
    async (req: any, reply) => {
      const supaUser = req.user;

      const email = supaUser.email;
      const name = supaUser.user_metadata?.name || "";
      const avatar = supaUser.user_metadata?.avatar_url || "";

      if (!email) {
        return reply.code(400).send({ error: "Email missing" });
      }

      const uniqueId = generateIds(20);

      let newAccount = false;

      const result = await prisma.$transaction(async (tx) => {
        let user = await tx.user.findUnique({
          where: { supabaseId: supaUser.id },
        });

        if (!user) {
          user = await tx.user.create({
            data: {
              name,
              supabaseId: supaUser.id,
              email,
              avatar,
              userData: {
                create: {
                  uniqueId,
                },
              },
              preferences: {
                create: [
                  { type: "marketing", isActive: true },
                  { type: "promotions", isActive: true },
                  { type: "sales", isActive: true },
                  { type: "updates", isActive: true },
                ],
              },
            },
          });

          await sendEmail({
            to: email,
            subject: "Welcome to Trakg!",
            html: newUserTemplate(name, TRIAL_PERIOD.toString()),
          });

          newAccount = true;
        }

        const session = await tx.session.create({
          data: {
            userId: user.id,
            lastActive: new Date(),
            authorized: true,
          },
        });

        return { user, session };
      });

      return reply.send({
        success: true,
        newAccount,
        sessionId: result.session.id,
        user: result.user,
      });
    },
  );
}

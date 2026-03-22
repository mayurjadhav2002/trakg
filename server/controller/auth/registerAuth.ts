import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { addDays } from "date-fns";

import { hashPassword } from "../../lib/crypt/passwordVerify";
import { createJwtToken } from "../../lib/crypt/jwtTokens";
import { InternalServerError } from "../../lib/apiResponse/ErrorRes";
import prisma from "../../lib/prisma_client";
import { generateIds } from "../../lib/random/trackingId";
import { TRIAL_PERIOD } from "../../lib/constants";
import { sendEmail } from "../../mail/nodemailer.config";
import { newUserTemplate } from "../../mail/templates/NewUser";

const createUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  company: z.string().min(2, "Company is required"),
  country: z.string().optional(),
  userIp: z.string().optional(),
  sessionInfo: z
    .object({
      userAgent: z.string().optional(),
      platform: z.string().optional(),
      language: z.string().optional(),
      ip: z.string().optional(),
      network: z.string().optional(),
      version: z.string().optional(),
      region_code: z.string().optional(),
      city: z.string().optional(),
      region: z.string().optional(),
      country_name: z.string().optional(),
      country_code: z.string().optional(),
      country_code_iso3: z.string().optional(),
      continent_code: z.string().optional(),
      postal: z.string().optional(),
      timezone: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      utc_offset: z.string().optional(),
      asn: z.string().optional(),
      org: z.string().optional(),
      browser: z.string().optional(),
      browserVersion: z.string().optional(),
      os: z.string().optional(),
      osVersion: z.string().optional(),
      deviceType: z.string().optional(),
      deviceVendor: z.string().optional(),
      deviceModel: z.string().optional(),
      cpu: z.string().optional(),
      screen: z.string().optional(),
      pixelRatio: z.number().optional(),
      isTouch: z.boolean().optional(),
    })
    .optional(),
});

type CreateUserBody = z.infer<typeof createUserSchema>;

export const createUser = async (
  request: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const parsed = createUserSchema.safeParse(request.body);

    if (!parsed.success) {
      reply.status(400).send({
        message: "Invalid input data",
        status: "Failed",
        errorCode: "validation_error",
        errors: parsed.error.errors,
      });
      return;
    }

    const { name, email, password, company, sessionInfo } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      reply.status(400).send({
        message: "Email Already Exists",
        status: "Failed",
        errorCode: "account_create_u_exists_err",
      });
      return;
    }

    let uniqueId: string;
    do {
      uniqueId = generateIds(20);
    } while (await prisma.userData.findFirst({ where: { uniqueId } }));

    const encryptedPassword = await hashPassword(password);

    const user = await prisma.$transaction(async (tx: any) => {
      const trialStart = new Date();
      const trialEnd = addDays(trialStart, TRIAL_PERIOD);

      const createdUser = await tx.user.create({
        data: {
          name,
          email,
          password: encryptedPassword,
          company,
          authTypes: {
            create: [{ provider: "Simple", providerId: email }],
          },
          userData: {
            create: {
              uniqueId,
              trialStarted: true,
              trialStartDate: trialStart,
              trialEndDate: trialEnd,
              trialPeriodDays: TRIAL_PERIOD,
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
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          phone: true,
          createdAt: true,
          authTypes: true,
          subscriptions: true,
        },
      });

      if (sessionInfo) {
        await tx.session.create({
          data: {
            userId: createdUser.id,
            loginType: "Simple",
            userAgent: sessionInfo.userAgent ?? null,
            platform: sessionInfo.platform ?? null,
            language: sessionInfo.language ?? null,
            ip: sessionInfo.ip ?? null,
            network: sessionInfo.network ?? null,
            ip_version: sessionInfo.version ?? null,
            region_code: sessionInfo.region_code ?? null,
            city: sessionInfo.city ?? null,
            region: sessionInfo.region ?? null,
            country: sessionInfo.country_name ?? null,
            country_code: sessionInfo.country_code ?? null,
            country_code_iso3: sessionInfo.country_code_iso3 ?? null,
            continent_code: sessionInfo.continent_code ?? null,
            postal: sessionInfo.postal ?? null,
            timezone: sessionInfo.timezone ?? null,
            location:
              sessionInfo.latitude !== undefined &&
              sessionInfo.longitude !== undefined
                ? `${sessionInfo.latitude},${sessionInfo.longitude}`
                : null,
            utc_offset: sessionInfo.utc_offset ?? null,
            asn: sessionInfo.asn ?? null,
            network_provider: sessionInfo.org ?? null,
            browser: sessionInfo.browser ?? null,
            browserVersion: sessionInfo.browserVersion ?? null,
            os: sessionInfo.os ?? null,
            osVersion: sessionInfo.osVersion ?? null,
            deviceType: sessionInfo.deviceType ?? null,
            deviceVendor: sessionInfo.deviceVendor ?? null,
            deviceModel: sessionInfo.deviceModel ?? null,
            cpuArch: sessionInfo.cpu ?? null,
            screenSize: sessionInfo.screen ?? null,
            pixelRatio: sessionInfo.pixelRatio ?? null,
            isTouchDevice:
              sessionInfo.isTouch !== undefined ? sessionInfo.isTouch : null,
          },
        });
      }

      return createdUser;
    });

    const accessToken = createJwtToken(
      { id: user.id, email: user.email },
      "access",
      "1d",
    );

    const refreshToken = createJwtToken(
      { id: user.id, email: user.email },
      "refresh",
      "30d",
    );

    if (!accessToken || !refreshToken) {
      reply.status(500).send({
        message: "Failed to create tokens",
        status: "Failed",
        errorCode: "token_creation_failed",
      });
      return;
    }

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    sendEmail({
      to: email,
      subject: "Welcome to Trakg!",
      html: newUserTemplate(name, TRIAL_PERIOD?.toString() || "14"),
    });

    reply.status(200).send({
      message: "Account Created",
      status: "Success",
      data: user,
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    InternalServerError(reply, error);
  }
};

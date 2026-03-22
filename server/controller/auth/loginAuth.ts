import { AccountType } from "../../prisma/generated";
import {
  DataRecordingError,
  InternalServerError,
} from "../../lib/apiResponse/ErrorRes";
import { createJwtToken } from "../../lib/crypt/jwtTokens";
import { verifyPassword } from "../../lib/crypt/passwordVerify";
import prisma from "../../lib/prisma_client";
import { FastifyRequest, FastifyReply } from "fastify";

type LoginBody = {
  email: string;
  password: string;
  sessionInfo?: Record<string, any>;
};

export const loginWithEmailPassword = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const { email, password, sessionInfo } = request.body as LoginBody;

    if (!email || !password) {
      reply.status(400).send({
        message: "Fields are Missing",
        status: "Failed",
        errorCode: "login_err",
      });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        password: true,
        name: true,
        email: true,
        avatar: true,
        company: true,
        authTypes: true,
        userData: true,
      },
    });

    if (!user) {
      reply.status(400).send({
        message: "User Not Found",
        status: "Failed",
        errorCode: "login_user_not_found_err",
      });
      return;
    }

    if (!user.password) {
      reply.status(400).send({
        message: "User having Oauth2.0 login",
        status: "Failed",
        errorCode: "user_oauth_login_err",
      });
      return;
    }

    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      reply.status(400).send({
        message: "Password Incorrect",
        status: "Failed",
        errorCode: "login_password_incorrect_err",
      });
      return;
    }

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        loginType: AccountType.Simple,
        lastActive: new Date(),

        ...(sessionInfo?.userAgent && { userAgent: sessionInfo.userAgent }),
        ...(sessionInfo?.platform && { platform: sessionInfo.platform }),
        ...(sessionInfo?.language && { language: sessionInfo.language }),
        ...(sessionInfo?.ip && { ip: sessionInfo.ip }),
        ...(sessionInfo?.network && { network: sessionInfo.network }),
        ...(sessionInfo?.version && { ip_version: sessionInfo.version }),

        ...(sessionInfo?.region_code && {
          region_code: sessionInfo.region_code,
        }),
        ...(sessionInfo?.city && { city: sessionInfo.city }),
        ...(sessionInfo?.region && { region: sessionInfo.region }),
        ...(sessionInfo?.country_name && {
          country: sessionInfo.country_name,
        }),
        ...(sessionInfo?.country_code && {
          country_code: sessionInfo.country_code,
        }),
        ...(sessionInfo?.country_code_iso3 && {
          country_code_iso3: sessionInfo.country_code_iso3,
        }),
        ...(sessionInfo?.continent_code && {
          continent_code: sessionInfo.continent_code,
        }),
        ...(sessionInfo?.postal && { postal: sessionInfo.postal }),
        ...(sessionInfo?.timezone && { timezone: sessionInfo.timezone }),
        ...(sessionInfo?.utc_offset && {
          utc_offset: sessionInfo.utc_offset,
        }),
        ...(sessionInfo?.latitude &&
          sessionInfo?.longitude && {
            location: `${sessionInfo.latitude},${sessionInfo.longitude}`,
          }),

        ...(sessionInfo?.asn && { asn: sessionInfo.asn }),
        ...(sessionInfo?.org && {
          network_provider: sessionInfo.org,
        }),

        ...(sessionInfo?.browser && { browser: sessionInfo.browser }),
        ...(sessionInfo?.browserVersion && {
          browserVersion: sessionInfo.browserVersion,
        }),
        ...(sessionInfo?.os && { os: sessionInfo.os }),
        ...(sessionInfo?.osVersion && {
          osVersion: sessionInfo.osVersion,
        }),
        ...(sessionInfo?.deviceType && {
          deviceType: sessionInfo.deviceType,
        }),
        ...(sessionInfo?.deviceVendor && {
          deviceVendor: sessionInfo.deviceVendor,
        }),
        ...(sessionInfo?.deviceModel && {
          deviceModel: sessionInfo.deviceModel,
        }),
        ...(sessionInfo?.cpu && { cpuArch: sessionInfo.cpu }),
        ...(sessionInfo?.screen && { screenSize: sessionInfo.screen }),
        ...(sessionInfo?.pixelRatio && {
          pixelRatio: sessionInfo.pixelRatio,
        }),
        ...(sessionInfo?.isTouch !== undefined && {
          isTouchDevice: sessionInfo.isTouch,
        }),
      },
    });

    if (!session) {
      DataRecordingError(reply, "Failed to create session");
      return;
    }

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
      InternalServerError(reply, "Failed to create tokens");
      return;
    }

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    reply.status(200).send({
      message: "Logged In",
      status: "Success",
      data: {
        ...user,
        password: null,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    InternalServerError(reply, error as Error);
  }
};

export const loginSuccess = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  if (!request.user) {
    reply.status(401).send({ message: "Not authenticated" });
    return;
  }

  reply.send(request.user);
};

export const logoutUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    if (request.session) {
      await new Promise<void>((resolve, reject) => {
        request.session.destroy((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    reply.send({ message: "Logged out successfully" });
  } catch {
    reply.status(500).send({ message: "Error logging out" });
  }
};

type CreateSessionBody = {
  user: {
    id: string;
  };
  sessionInfo: {
    auth_type?: AccountType;
    userAgent?: string | null;
    platform?: string | null;
    language?: string | null;
    ip?: string | null;
    network?: string | null;
    version?: string | null;
    region_code?: string | null;
    city?: string | null;
    region?: string | null;
    country_name?: string | null;
    country_code?: string | null;
    country_code_iso3?: string | null;
    continent_code?: string | null;
    postal?: string | null;
    timezone?: string | null;
    latitude?: number;
    longitude?: number;
    utc_offset?: string | null;
    asn?: string | null;
    org?: string | null;
    browser?: string | null;
    browserVersion?: string | null;
    os?: string | null;
    osVersion?: string | null;
    deviceType?: string | null;
    deviceVendor?: string | null;
    deviceModel?: string | null;
    cpu?: string | null;
    screen?: string | null;
    pixelRatio?: number | null;
    isTouch?: boolean;
  };
  sessionKey?: string;
};

export const createSession = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const { user, sessionInfo, sessionKey } = request.body as CreateSessionBody;

    if (!user || !sessionInfo) {
      reply.status(400).send({
        message: "Fields are Missing",
        status: "Failed",
        errorCode: "login_err",
      });
      return;
    }

    const {
      auth_type = AccountType.Simple,
      userAgent = null,
      platform = null,
      language = null,
      ip = null,
      network = null,
      version = null,
      region_code = null,
      city = null,
      region = null,
      country_name = null,
      country_code = null,
      country_code_iso3 = null,
      continent_code = null,
      postal = null,
      timezone = null,
      latitude,
      longitude,
      utc_offset = null,
      asn = null,
      org = null,
      browser = null,
      browserVersion = null,
      os = null,
      osVersion = null,
      deviceType = null,
      deviceVendor = null,
      deviceModel = null,
      cpu = null,
      screen = null,
      pixelRatio = null,
      isTouch,
    } = sessionInfo;

    const sessionData = {
      user: { connect: { id: user.id } },
      loginType: auth_type,
      lastActive: new Date(),
      userAgent,
      platform,
      language,
      ip,
      network,
      ip_version: version,
      region_code,
      city,
      region,
      country: country_name,
      country_code,
      country_code_iso3,
      continent_code,
      postal,
      timezone,
      location:
        latitude !== undefined && longitude !== undefined
          ? `${latitude},${longitude}`
          : null,
      utc_offset,
      asn,
      network_provider: org,
      browser,
      browserVersion,
      os,
      osVersion,
      deviceType,
      deviceVendor,
      deviceModel,
      cpuArch: cpu,
      screenSize: screen,
      pixelRatio,
      isTouchDevice: isTouch ?? null,
    };

    const session = sessionKey
      ? await prisma.session.update({
          where: { id: sessionKey },
          data: sessionData,
        })
      : await prisma.session.create({
          data: sessionData,
        });
    if (!session) {
      DataRecordingError(reply, "Failed to save session");
      return;
    }

    reply.status(200).send({
      message: sessionKey ? "Session Updated" : "Session Created",
      status: "Success",
      data: session,
    });
  } catch (error) {
    InternalServerError(reply, error as Error);
  }
};

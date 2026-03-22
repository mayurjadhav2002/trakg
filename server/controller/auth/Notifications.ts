import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../../lib/prisma_client";

type NotificationType = "marketing" | "promotions" | "sales" | "updates";

interface UpdateNotificationBody {
  type: NotificationType;
  subscribe: boolean;
}

export const updateNotificationSettings = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const user = (request as any).user;
    const { type, subscribe } = request.body as UpdateNotificationBody;

    if (!user?.id || !type || typeof subscribe !== "boolean") {
      return reply.status(400).send({
        errorCode: "INVALID_INPUT",
        message: "Missing or invalid fields: userId, type, or subscribe.",
      });
    }

    const validTypes: NotificationType[] = [
      "marketing",
      "promotions",
      "sales",
      "updates",
    ];

    if (!validTypes.includes(type)) {
      return reply.status(400).send({
        errorCode: "INVALID_TYPE",
        message: `Invalid notification type. Must be one of: ${validTypes.join(
          ", ",
        )}`,
      });
    }

    const updatedPref = await prisma.userNotificationPreference.upsert({
      where: {
        userId_type: {
          userId: user.id,
          type,
        },
      },
      update: {
        isActive: subscribe,
      },
      create: {
        userId: user.id,
        type,
        isActive: subscribe,
      },
    });

    return reply.status(200).send({
      message: `You have successfully ${
        subscribe ? "subscribed to" : "unsubscribed from"
      } ${type} notifications.`,
      preference: updatedPref,
    });
  } catch (error: any) {
    request.log.error(error);

    return reply.status(500).send({
      errorCode: "SERVER_ERROR",
      message: "An unexpected error occurred while updating preferences.",
      details:
        process.env.NODE_ENV === "development" ? error?.message : undefined,
    });
  }
};

export const getNotificationSettings = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const user = (request as any).user;

    if (!user?.id) {
      return reply.status(400).send({
        errorCode: "INVALID_INPUT",
        message: "Missing userId in request.",
      });
    }

    const preferences = await prisma.userNotificationPreference.findMany({
      where: { userId: user.id },
      select: {
        type: true,
        isActive: true,
      },
    });

    const formatted = preferences.reduce<Record<string, boolean>>(
      // @ts-ignore
      (acc, pref) => {
        acc[pref.type] = pref.isActive;
        return acc;
      },
      {},
    );

    return reply.status(200).send({
      message: "Fetched notification preferences successfully.",
      data: formatted,
    });
  } catch (error: any) {
    request.log.error(error);

    return reply.status(500).send({
      errorCode: "SERVER_ERROR",
      message: "An unexpected error occurred while fetching preferences.",
      details:
        process.env.NODE_ENV === "development" ? error?.message : undefined,
    });
  }
};

import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../../lib/prisma_client";

type SessionsQuery = {
  limit?: string;
};

export const fetchUserSessions = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const supabase_user = request.user;

    if (!supabase_user) {
      return reply.status(401).send({
        message: "Unauthorized",
        errorCode: "err_verifying_user",
      });
    }

    const user = await prisma.user.findUnique({
      where: { supabaseId: supabase_user.id },
      select: { id: true },
    });

    if (!user) {
      return reply.status(404).send({
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    const { limit = "5" } = request.query as SessionsQuery;

    const sessions = await prisma.session.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: parseInt(limit),
    });

    return reply.send({
      success: true,
      data: sessions,
    });
  } catch (error) {
    request.log.error(error);

    return reply.status(500).send({
      message: "Internal server error",
      errorCode: "INTERNAL_SERVER_ERROR",
    });
  }
};

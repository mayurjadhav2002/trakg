import { FastifyRequest, FastifyReply } from "fastify";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const AuthMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      reply.status(401).send({
        message: "Authorization header missing or malformed",
        status: "Failed",
        errorCode: "auth_err_no_auth_header",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      reply.status(401).send({
        message: "Token not found",
        status: "Failed",
        errorCode: "auth_err_token_not_found",
      });
      return;
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      reply.status(401).send({
        message: "Invalid or expired token",
        status: "Failed",
        errorCode: "auth_err_token_invalid",
      });
      return;
    }

    (request as any).user = data.user;
  } catch {
    reply.status(500).send({
      message: "Internal Server Error",
      status: "Failed",
      errorCode: "internal_server_err",
    });
  }
};

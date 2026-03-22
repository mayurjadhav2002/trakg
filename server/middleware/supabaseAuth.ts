import { FastifyRequest, FastifyReply } from "fastify";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function SupabaseAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return reply.code(401).send({ error: "Missing token" });
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    return reply.code(401).send({ error: "Invalid token" });
  }

  request.user = data.user as any;
}

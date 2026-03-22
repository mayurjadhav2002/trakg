import "dotenv/config";
import { defineConfig, env } from "prisma/config";
//@ts-ignore
import path from "path";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: env("DATABASE_URL"),
  },
});

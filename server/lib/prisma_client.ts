import "dotenv/config";
import { PrismaClient } from "../prisma/generated/client";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const dbType = process.env.DB_TYPE || "postgres";

let prisma: PrismaClient;

if (dbType === "mysql") {
  const adapter = new PrismaMariaDb({
    database: process.env.DATABASE_URL!,
  });

  prisma = new PrismaClient({ adapter });
} else {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });

  prisma = new PrismaClient({ adapter });
}

export default prisma;

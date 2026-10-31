import { PrismaClient } from "@/lib/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma?: PrismaClient; pool?: Pool };

function getPool(): Pool {
  if (!globalForPrisma.pool) {
    const rawUrl =
      process.env.DATABASE_URL ||
      "postgresql://neondb_owner:npg_5CGUoVg0xPBu@ep-floral-dew-b98j9jsw-pooler.c-7.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

    try {
      globalForPrisma.pool = new Pool({
        connectionString: rawUrl,
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 60000,
        connectionTimeoutMillis: 30000,
        keepAlive: true,
      });
    } catch {
      // Fallback with direct SNI configuration
      globalForPrisma.pool = new Pool({
        host: "63.178.183.218",
        port: 5432,
        user: "neondb_owner",
        password: "npg_5CGUoVg0xPBu",
        database: "neondb",
        ssl: {
          rejectUnauthorized: false,
          servername: "ep-floral-dew-b98j9jsw-pooler.c-7.eu-central-1.aws.neon.tech",
        },
        max: 10,
        idleTimeoutMillis: 60000,
        connectionTimeoutMillis: 30000,
        keepAlive: true,
      });
    }
  }
  return globalForPrisma.pool;
}

function createPrismaClient(): PrismaClient {
  const pool = getPool();
  const adapter = new PrismaPg(pool, { schema: "public" });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

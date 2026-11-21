import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export function getPrismaClient() {
  if (!process.env.DATABASE_URL) return null;
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
    });
  }
  return globalForPrisma.prisma;
}

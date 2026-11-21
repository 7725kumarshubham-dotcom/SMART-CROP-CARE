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

// Return actionable database errors without exposing connection strings or query data.
export function databaseErrorResponse(error, fallback) {
  const code = error?.code || error?.errorCode;
  if (["P1000", "P1010"].includes(code)) {
    return { status: 503, body: { error: "The server cannot access the database. The site administrator needs to check the production database credentials.", code: "DATABASE_ACCESS_DENIED" } };
  }
  if (["P1001", "P1002", "P1008", "P1017", "P2024"].includes(code)) {
    return { status: 503, body: { error: "The server cannot connect to the database. Please try again shortly. If this continues, the site administrator needs to check the production database connection.", code: "DATABASE_UNAVAILABLE" } };
  }
  if (["P2021", "P2022"].includes(code)) {
    return { status: 503, body: { error: "The production database needs to be updated before sign-in can work. Please contact the site administrator.", code: "DATABASE_SCHEMA_MISSING" } };
  }
  if (["P1012", "P1013"].includes(code)) {
    return { status: 503, body: { error: "The production database configuration is invalid. Please contact the site administrator.", code: "DATABASE_CONFIGURATION_INVALID" } };
  }
  if (error?.name === "PrismaClientInitializationError") {
    const message = String(error.message || "");
    if (/Environment variable not found/i.test(message)) {
      const variable = ["DATABASE_URL", "DIRECT_URL"].find((name) => message.includes(name));
      return { status: 503, body: { error: `The production server is missing ${variable || "a required database setting"}. The site administrator needs to add it in Vercel and redeploy.`, code: "DATABASE_ENV_MISSING" } };
    }
    if (/could not locate the Query Engine|Query Engine.*not found|Unable to require|Unable to.*engine|libssl|openssl/i.test(message)) {
      return { status: 503, body: { error: "The deployment is missing a compatible Prisma database runtime. The site administrator needs to rebuild the server package.", code: "DATABASE_RUNTIME_MISSING" } };
    }
    return { status: 503, body: { error: "The server could not initialize its database connection. Please contact the site administrator.", code: "DATABASE_INITIALIZATION_FAILED" } };
  }
  return { status: 500, body: { error: fallback, code: "AUTH_SERVICE_ERROR" } };
}

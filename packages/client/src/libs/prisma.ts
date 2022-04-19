import { PrismaClient } from "@sky-time/prisma";

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

const log =
  process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error"];

export const prisma: PrismaClient =
  prismaGlobal.prisma ||
  new PrismaClient({
    log,
  });

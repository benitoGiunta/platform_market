import { PrismaClient } from "@prisma/client";

// Instance Prisma singleton — importée partout. Jamais de `new PrismaClient()` ailleurs.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

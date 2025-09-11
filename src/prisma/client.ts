import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Check if DATABASE_URL is available
const createPrismaClient = () => {
    if (!process.env.DATABASE_URL) {
        console.warn('DATABASE_URL is not set. Prisma client will not be initialized.');
        return null;
    }
    return new PrismaClient();
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) {
    globalForPrisma.prisma = prisma;
}

// This module is for re-using a single PrismaClient instance instead of creating new one every time

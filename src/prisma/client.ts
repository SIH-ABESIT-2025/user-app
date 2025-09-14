import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Check if DATABASE_URL is available
const createPrismaClient = () => {
    console.log('Creating Prisma client...');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length || 0);
    
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL is not set. Prisma client will not be initialized.');
        console.error('Available environment variables:', Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('DB')));
        return null;
    }
    
    try {
        const client = new PrismaClient({
            log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        });
        console.log('✅ Prisma client created successfully');
        return client;
    } catch (error) {
        console.error('❌ Failed to create Prisma client:', error);
        return null;
    }
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) {
    globalForPrisma.prisma = prisma;
}

// This module is for re-using a single PrismaClient instance instead of creating new one every time

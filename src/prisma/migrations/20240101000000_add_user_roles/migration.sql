-- Create UserRole enum first
CREATE TYPE "UserRole" AS ENUM ('CITIZEN', 'MINISTRY_STAFF', 'ADMIN', 'SUPER_ADMIN');

-- Add role and isActive fields to User table
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'CITIZEN';
ALTER TABLE "User" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

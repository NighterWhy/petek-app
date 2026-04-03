-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'DONOR', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'DONOR',
    "isEduVerified" BOOLEAN NOT NULL DEFAULT false,
    "trustScore" INTEGER NOT NULL DEFAULT 100,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "city" TEXT,
    "district" TEXT,
    "campusName" TEXT,
    "universityName" TEXT,
    "department" TEXT,
    "enrollmentYear" INTEGER,
    "livingArrangement" TEXT,
    "preferredCategories" TEXT[],
    "behaviorClusterId" INTEGER,
    "churnRiskScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

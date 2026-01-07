-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "weeklySchedule" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerSubmission" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PARTNER',
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerSubmission_pkey" PRIMARY KEY ("id")
);

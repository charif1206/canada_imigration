-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "equivalenceRejectedAt" TIMESTAMP(3),
ADD COLUMN     "equivalenceRejectionReason" TEXT,
ADD COLUMN     "equivalenceStatus" TEXT,
ADD COLUMN     "isSendingFormulaireEquivalence" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSendingFormulaireResidence" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSendingPartners" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "partnerRejectedAt" TIMESTAMP(3),
ADD COLUMN     "partnerRejectionReason" TEXT,
ADD COLUMN     "partnerStatus" TEXT,
ADD COLUMN     "residenceRejectedAt" TIMESTAMP(3),
ADD COLUMN     "residenceRejectionReason" TEXT,
ADD COLUMN     "residenceStatus" TEXT;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "profileEvaluationRejectedAt" TIMESTAMP(3),
ADD COLUMN     "profileEvaluationRejectionReason" TEXT,
ADD COLUMN     "profileEvaluationStatus" TEXT,
ADD COLUMN     "tcfPreparationRejectedAt" TIMESTAMP(3),
ADD COLUMN     "tcfPreparationRejectionReason" TEXT,
ADD COLUMN     "tcfPreparationStatus" TEXT;

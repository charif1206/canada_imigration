-- AlterTable: Remove unnecessary columns from Client
ALTER TABLE "Client" DROP COLUMN "phone";
ALTER TABLE "Client" DROP COLUMN "dateOfBirth";
ALTER TABLE "Client" DROP COLUMN "address";
ALTER TABLE "Client" DROP COLUMN "immigrationType";
ALTER TABLE "Client" DROP COLUMN "notes";

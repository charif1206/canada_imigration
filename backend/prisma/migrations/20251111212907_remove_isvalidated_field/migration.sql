/*
  Warnings:

  - You are about to drop the column `isValidated` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `validatedAt` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `validatedBy` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "isValidated",
DROP COLUMN "validatedAt",
DROP COLUMN "validatedBy";

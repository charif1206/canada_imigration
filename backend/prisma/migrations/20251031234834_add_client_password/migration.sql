-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "password" TEXT NOT NULL DEFAULT '$2b$10$defaultpasswordhash';

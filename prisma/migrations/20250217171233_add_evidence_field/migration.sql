/*
  Warnings:

  - Made the column `cwe` on table `Vulnerability` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Vulnerability" ADD COLUMN     "evidence" TEXT,
ALTER COLUMN "cwe" SET NOT NULL;

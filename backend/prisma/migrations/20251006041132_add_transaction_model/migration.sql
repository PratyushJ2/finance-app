/*
  Warnings:

  - Added the required column `transactionId` to the `LedgerEntry` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `entryType` on the `LedgerEntry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."EntryType" AS ENUM ('Debit', 'Credit');

-- AlterTable
ALTER TABLE "public"."LedgerEntry" ADD COLUMN     "transactionId" TEXT NOT NULL,
DROP COLUMN "entryType",
ADD COLUMN     "entryType" "public"."EntryType" NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LedgerEntry_accountId_idx" ON "public"."LedgerEntry"("accountId");

-- CreateIndex
CREATE INDEX "LedgerEntry_transactionId_idx" ON "public"."LedgerEntry"("transactionId");

-- AddForeignKey
ALTER TABLE "public"."LedgerEntry" ADD CONSTRAINT "LedgerEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

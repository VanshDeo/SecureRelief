/*
  Warnings:

  - A unique constraint covering the columns `[donationId]` on the table `Voucher` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Voucher" ADD COLUMN     "donationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_donationId_key" ON "Voucher"("donationId");

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

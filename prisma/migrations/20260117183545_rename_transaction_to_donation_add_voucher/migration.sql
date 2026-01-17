-- CreateEnum
CREATE TYPE "ZoneStatus" AS ENUM ('ACTIVE', 'CRITICAL', 'PENDING', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "VoucherStatus" AS ENUM ('ISSUED', 'REDEEMED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "DisasterZone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "budget" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "allocated" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "distributed" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "beneficiaries" INTEGER NOT NULL DEFAULT 0,
    "status" "ZoneStatus" NOT NULL DEFAULT 'PENDING',
    "severity" "Severity" NOT NULL DEFAULT 'MEDIUM',
    "type" TEXT NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL DEFAULT 1000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisasterZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "donorAddress" TEXT,
    "zoneId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "currency" TEXT NOT NULL DEFAULT 'USDC',

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voucher" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "qrCode" TEXT NOT NULL,
    "status" "VoucherStatus" NOT NULL DEFAULT 'ISSUED',
    "beneficiaryId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "vendorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemedAt" TIMESTAMP(3),

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_qrCode_key" ON "Voucher"("qrCode");

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "DisasterZone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "DisasterZone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

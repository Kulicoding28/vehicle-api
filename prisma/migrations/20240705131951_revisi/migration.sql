/*
  Warnings:

  - You are about to drop the column `code` on the `PriceList` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PriceList" DROP COLUMN "code";

-- AlterTable
ALTER TABLE "VehicleType" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

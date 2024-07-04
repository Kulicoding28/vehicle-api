/*
  Warnings:

  - You are about to drop the `Pricelist` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `VehicleModel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pricelist" DROP CONSTRAINT "Pricelist_modelId_fkey";

-- DropForeignKey
ALTER TABLE "Pricelist" DROP CONSTRAINT "Pricelist_yearId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "isAdmin" SET DEFAULT false;

-- AlterTable
ALTER TABLE "VehicleModel" ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Pricelist";

-- CreateTable
CREATE TABLE "PriceList" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "yearId" INTEGER NOT NULL,
    "modelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "VehicleModel" ADD CONSTRAINT "VehicleModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceList" ADD CONSTRAINT "PriceList_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "VehicleYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceList" ADD CONSTRAINT "PriceList_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "VehicleModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

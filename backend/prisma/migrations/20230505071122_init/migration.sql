/*
  Warnings:

  - You are about to drop the column `liftWorkOrderId` on the `Palette` table. All the data in the column will be lost.
  - You are about to drop the column `liftWorkOrderId` on the `Parcel` table. All the data in the column will be lost.
  - You are about to drop the column `liftWorkOrderId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Palette" DROP CONSTRAINT "Palette_liftWorkOrderId_fkey";

-- DropForeignKey
ALTER TABLE "Parcel" DROP CONSTRAINT "Parcel_liftWorkOrderId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_liftWorkOrderId_fkey";

-- AlterTable
ALTER TABLE "Palette" DROP COLUMN "liftWorkOrderId";

-- AlterTable
ALTER TABLE "Parcel" DROP COLUMN "liftWorkOrderId";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "liftWorkOrderId";

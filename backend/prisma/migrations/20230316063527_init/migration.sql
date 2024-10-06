/*
  Warnings:

  - You are about to drop the `WorkOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkOrder" DROP CONSTRAINT "WorkOrder_orderId_fkey";

-- DropForeignKey
ALTER TABLE "WorkOrder" DROP CONSTRAINT "WorkOrder_rackId_fkey";

-- AlterTable
ALTER TABLE "Palette" ADD COLUMN     "liftWorkOrderId" INTEGER;

-- AlterTable
ALTER TABLE "Parcel" ADD COLUMN     "liftWorkOrderId" INTEGER;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "liftWorkOrderId" INTEGER;

-- DropTable
DROP TABLE "WorkOrder";

-- CreateTable
CREATE TABLE "LiftWorkOrder" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER,
    "status" "WorkOrderStatus" NOT NULL DEFAULT 'IN_PROGRESS',

    CONSTRAINT "LiftWorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LiftWorkOrder_orderId_key" ON "LiftWorkOrder"("orderId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_liftWorkOrderId_fkey" FOREIGN KEY ("liftWorkOrderId") REFERENCES "LiftWorkOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_liftWorkOrderId_fkey" FOREIGN KEY ("liftWorkOrderId") REFERENCES "LiftWorkOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Palette" ADD CONSTRAINT "Palette_liftWorkOrderId_fkey" FOREIGN KEY ("liftWorkOrderId") REFERENCES "LiftWorkOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiftWorkOrder" ADD CONSTRAINT "LiftWorkOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

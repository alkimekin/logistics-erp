-- DropForeignKey
ALTER TABLE "DispatchNote" DROP CONSTRAINT "DispatchNote_orderId_fkey";

-- AddForeignKey
ALTER TABLE "DispatchNote" ADD CONSTRAINT "DispatchNote_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

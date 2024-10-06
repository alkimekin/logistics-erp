-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SERVICE_ACCOUNT');

-- CreateEnum
CREATE TYPE "ProductState" AS ENUM ('DAMAGED', 'UNDAMAGED');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ON_RACK', 'ON_FLOOR', 'ON_SECONDERY', 'ON_PREPARATION', 'ON_TRANSFER', 'DELIVERED');

-- CreateEnum
CREATE TYPE "ParcelStatus" AS ENUM ('ON_RACK', 'ON_FLOOR', 'ON_PREPARATION', 'ON_TRANSFER', 'DELIVERED');

-- CreateEnum
CREATE TYPE "PaletteStatus" AS ENUM ('ON_RACK', 'ON_FLOOR', 'ON_PREPARATION', 'ON_TRANSFER', 'DELIVERED');

-- CreateEnum
CREATE TYPE "Restirictions" AS ENUM ('NONE', 'WAITS_PRODUCTION_STATEMENT', 'WAITS_WATCHFILE', 'WAITS_FORKLIFT', 'WAITS_PREPARATION', 'WAITS_TRANSFER_STATEMENT', 'WAITS_TRANSFER');

-- CreateEnum
CREATE TYPE "ArrivalStatus" AS ENUM ('ENTERED_HANGAR', 'WATCHFILE_IMPORTED', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('ON_PREPARATION', 'ON_TRANSFER', 'DELIVERED');

-- CreateEnum
CREATE TYPE "WorkOrderStatus" AS ENUM ('IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "ContainerType" AS ENUM ('UNKNOWN', 'PRODUCT', 'PARCEL', 'PALETTE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tfaActive" INTEGER NOT NULL DEFAULT 0,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "userId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "personalId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "BaseProduct" (
    "id" SERIAL NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BaseProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "serialNumber" TEXT NOT NULL,
    "baseProductId" INTEGER,
    "barcodeNumber" TEXT,
    "gtinNumber" TEXT NOT NULL,
    "lotNumber" INTEGER NOT NULL,
    "productionDate" TEXT,
    "expirationDate" TEXT,
    "parcelId" TEXT,
    "orderId" INTEGER,
    "state" "ProductState" NOT NULL DEFAULT 'UNDAMAGED',
    "status" "ProductStatus" NOT NULL,
    "restiriction" "Restirictions" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("serialNumber")
);

-- CreateTable
CREATE TABLE "Parcel" (
    "id" TEXT NOT NULL,
    "paletteId" TEXT,
    "orderId" INTEGER,
    "status" "ParcelStatus" NOT NULL,
    "restiriction" "Restirictions" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parcel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Palette" (
    "id" TEXT NOT NULL,
    "hangarId" INTEGER,
    "rackId" INTEGER,
    "baseProductId" INTEGER,
    "productCode" TEXT,
    "lotNumber" TEXT,
    "productNumber" INTEGER NOT NULL DEFAULT 0,
    "expirationDate" TEXT,
    "arrivalId" INTEGER,
    "isWatchfileImported" BOOLEAN NOT NULL DEFAULT false,
    "orderId" INTEGER,
    "status" "PaletteStatus" NOT NULL,
    "restiriction" "Restirictions" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Palette_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rack" (
    "id" INTEGER NOT NULL,
    "hangarId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hangar" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hangar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arrival" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "invoiceNumber" TEXT,
    "watchfileLoading" BOOLEAN NOT NULL DEFAULT false,
    "watchfileLoaded" BOOLEAN NOT NULL DEFAULT false,
    "status" "ArrivalStatus" NOT NULL,
    "restiriction" "Restirictions" NOT NULL,

    CONSTRAINT "Arrival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DispatchProduct" (
    "id" SERIAL NOT NULL,
    "baseProductId" INTEGER,
    "count" INTEGER NOT NULL,
    "lotNumber" TEXT NOT NULL,
    "dispatchNoteId" INTEGER,

    CONSTRAINT "DispatchProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DispatchNote" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT,
    "invoiceNumber" TEXT NOT NULL,
    "ettnCode" TEXT NOT NULL,
    "orderId" INTEGER,

    CONSTRAINT "DispatchNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT,
    "invoiceNumber" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'ON_PREPARATION',

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" SERIAL NOT NULL,
    "rackId" INTEGER,
    "containerType" "ContainerType" NOT NULL DEFAULT 'UNKNOWN',
    "containerCount" INTEGER NOT NULL,
    "orderId" INTEGER,
    "status" "WorkOrderStatus" NOT NULL DEFAULT 'IN_PROGRESS',

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchfileError" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "arrivalId" INTEGER NOT NULL,

    CONSTRAINT "WatchfileError_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcodeNumber_key" ON "Product"("barcodeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Palette_rackId_key" ON "Palette"("rackId");

-- CreateIndex
CREATE UNIQUE INDEX "Rack_id_key" ON "Rack"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Hangar_name_key" ON "Hangar"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Order_invoiceNumber_key" ON "Order"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "WorkOrder_rackId_key" ON "WorkOrder"("rackId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_baseProductId_fkey" FOREIGN KEY ("baseProductId") REFERENCES "BaseProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "Parcel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_paletteId_fkey" FOREIGN KEY ("paletteId") REFERENCES "Palette"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Palette" ADD CONSTRAINT "Palette_hangarId_fkey" FOREIGN KEY ("hangarId") REFERENCES "Hangar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Palette" ADD CONSTRAINT "Palette_rackId_fkey" FOREIGN KEY ("rackId") REFERENCES "Rack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Palette" ADD CONSTRAINT "Palette_baseProductId_fkey" FOREIGN KEY ("baseProductId") REFERENCES "BaseProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Palette" ADD CONSTRAINT "Palette_arrivalId_fkey" FOREIGN KEY ("arrivalId") REFERENCES "Arrival"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Palette" ADD CONSTRAINT "Palette_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rack" ADD CONSTRAINT "Rack_hangarId_fkey" FOREIGN KEY ("hangarId") REFERENCES "Hangar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchProduct" ADD CONSTRAINT "DispatchProduct_baseProductId_fkey" FOREIGN KEY ("baseProductId") REFERENCES "BaseProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchProduct" ADD CONSTRAINT "DispatchProduct_dispatchNoteId_fkey" FOREIGN KEY ("dispatchNoteId") REFERENCES "DispatchNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchNote" ADD CONSTRAINT "DispatchNote_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_rackId_fkey" FOREIGN KEY ("rackId") REFERENCES "Rack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchfileError" ADD CONSTRAINT "WatchfileError_arrivalId_fkey" FOREIGN KEY ("arrivalId") REFERENCES "Arrival"("id") ON DELETE CASCADE ON UPDATE CASCADE;

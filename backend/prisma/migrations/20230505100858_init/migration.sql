/*
  Warnings:

  - You are about to drop the column `predictedMaxPaletteSize` on the `Arrival` table. All the data in the column will be lost.
  - You are about to drop the column `predictedMaxParcelSize` on the `Arrival` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Arrival" DROP COLUMN "predictedMaxPaletteSize",
DROP COLUMN "predictedMaxParcelSize",
ADD COLUMN     "maxPaletteSize" INTEGER,
ADD COLUMN     "maxParcelSize" INTEGER;

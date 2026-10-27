/*
  Warnings:

  - You are about to drop the column `contestCombo` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `shortEntries` on the `Move` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nameEn]` on the table `Type` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contestCombos` to the `Move` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Move" DROP COLUMN "contestCombo",
DROP COLUMN "shortEntries",
ADD COLUMN     "contestCombos" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Type_nameEn_key" ON "Type"("nameEn");

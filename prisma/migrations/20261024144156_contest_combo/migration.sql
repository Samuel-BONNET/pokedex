/*
  Warnings:

  - Added the required column `contestCombo` to the `Move` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Move" ADD COLUMN     "contestCombo" TEXT NOT NULL;

/*
  Warnings:

  - A unique constraint covering the columns `[idGame,idUser,version]` on the table `GameSave` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "GameSave_idGame_idUser_key";

-- AlterTable
ALTER TABLE "GameSave" ADD COLUMN     "version" VARCHAR(30) NOT NULL DEFAULT 'default';

-- CreateIndex
CREATE UNIQUE INDEX "GameSave_idGame_idUser_version_key" ON "GameSave"("idGame", "idUser", "version");

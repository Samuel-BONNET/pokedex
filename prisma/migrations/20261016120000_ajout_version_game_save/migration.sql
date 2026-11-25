-- AlterTable
ALTER TABLE "GameSave" ADD COLUMN "version" VARCHAR(30) NOT NULL DEFAULT 'default';

-- DropIndex
DROP INDEX "GameSave_idGame_idUser_key";

-- CreateIndex
CREATE UNIQUE INDEX "GameSave_idGame_idUser_version_key" ON "GameSave"("idGame", "idUser", "version");

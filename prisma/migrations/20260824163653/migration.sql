/*
  Warnings:

  - You are about to drop the `GamePreferences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PokemonPreferences` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `currentJaquette` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idGameProvenance` to the `Statut` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GamePreferences" DROP CONSTRAINT "GamePreferences_idGame_fkey";

-- DropForeignKey
ALTER TABLE "GamePreferences" DROP CONSTRAINT "GamePreferences_idUser_fkey";

-- DropForeignKey
ALTER TABLE "PokemonPreferences" DROP CONSTRAINT "PokemonPreferences_idPokemon_fkey";

-- DropForeignKey
ALTER TABLE "PokemonPreferences" DROP CONSTRAINT "PokemonPreferences_idUser_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "currentJaquette" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Statut" ADD COLUMN     "currentSprite" TEXT,
ADD COLUMN     "idGameProvenance" INTEGER NOT NULL;

-- DropTable
DROP TABLE "GamePreferences";

-- DropTable
DROP TABLE "PokemonPreferences";

-- AddForeignKey
ALTER TABLE "Statut" ADD CONSTRAINT "Statut_idGameProvenance_fkey" FOREIGN KEY ("idGameProvenance") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

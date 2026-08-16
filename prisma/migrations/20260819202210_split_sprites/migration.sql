/*
  Warnings:

  - You are about to drop the column `currentJaquette` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `currentSprite` on the `Statut` table. All the data in the column will be lost.
  - You are about to drop the column `idGameProvenance` on the `Statut` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Statut" DROP CONSTRAINT "Statut_idGameProvenance_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "currentJaquette";

-- AlterTable
ALTER TABLE "Statut" DROP COLUMN "currentSprite",
DROP COLUMN "idGameProvenance";

-- CreateTable
CREATE TABLE "PokemonPreferences" (
    "idPokemon" INTEGER NOT NULL,
    "idUser" INTEGER NOT NULL,
    "currentSprite" TEXT NOT NULL,

    CONSTRAINT "PokemonPreferences_pkey" PRIMARY KEY ("idPokemon","idUser")
);

-- CreateTable
CREATE TABLE "GamePreferences" (
    "idGame" INTEGER NOT NULL,
    "idUser" INTEGER NOT NULL,
    "currentSprite" TEXT NOT NULL,

    CONSTRAINT "GamePreferences_pkey" PRIMARY KEY ("idGame","idUser")
);

-- AddForeignKey
ALTER TABLE "PokemonPreferences" ADD CONSTRAINT "PokemonPreferences_idPokemon_fkey" FOREIGN KEY ("idPokemon") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonPreferences" ADD CONSTRAINT "PokemonPreferences_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePreferences" ADD CONSTRAINT "GamePreferences_idGame_fkey" FOREIGN KEY ("idGame") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePreferences" ADD CONSTRAINT "GamePreferences_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

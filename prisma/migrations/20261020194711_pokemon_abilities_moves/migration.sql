/*
  Warnings:

  - You are about to drop the column `types` on the `Pokemon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pokemon" DROP COLUMN "types";

-- AlterTable
ALTER TABLE "Statut" ADD COLUMN     "capturedGame" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- CreateTable
CREATE TABLE "Ability" (
    "id" SERIAL NOT NULL,
    "nameFr" VARCHAR(50) NOT NULL,
    "nameEn" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Ability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonAbility" (
    "pokemonId" INTEGER NOT NULL,
    "abilityId" INTEGER NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PokemonAbility_pkey" PRIMARY KEY ("pokemonId","abilityId")
);

-- CreateTable
CREATE TABLE "Move" (
    "id" SERIAL NOT NULL,
    "nameFr" VARCHAR(50) NOT NULL,
    "nameEn" VARCHAR(50) NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "power" INTEGER,
    "accuracy" INTEGER,
    "pp" INTEGER NOT NULL,
    "effectChance" INTEGER,
    "priority" INTEGER NOT NULL,
    "minHits" INTEGER,
    "maxHits" INTEGER,
    "minTurns" INTEGER,
    "maxTurns" INTEGER,
    "drain" INTEGER NOT NULL,
    "healing" INTEGER NOT NULL,
    "critRate" INTEGER NOT NULL,
    "ailmentChance" INTEGER NOT NULL,
    "flinchChance" INTEGER NOT NULL,
    "statChance" INTEGER NOT NULL,
    "target" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "damageClass" TEXT NOT NULL,
    "effectEntries" TEXT NOT NULL,
    "shortEntries" TEXT NOT NULL,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonMove" (
    "pokemonId" INTEGER NOT NULL,
    "moveId" INTEGER NOT NULL,
    "learnMethod" TEXT,
    "level" INTEGER,

    CONSTRAINT "PokemonMove_pkey" PRIMARY KEY ("pokemonId","moveId")
);

-- CreateTable
CREATE TABLE "Type" (
    "id" SERIAL NOT NULL,
    "nameEn" VARCHAR(30) NOT NULL,
    "strength" JSONB,
    "weaknesses" JSONB,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonType" (
    "pokemonId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,

    CONSTRAINT "PokemonType_pkey" PRIMARY KEY ("pokemonId","typeId")
);

-- AddForeignKey
ALTER TABLE "PokemonAbility" ADD CONSTRAINT "PokemonAbility_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonAbility" ADD CONSTRAINT "PokemonAbility_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "Ability"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonMove" ADD CONSTRAINT "PokemonMove_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonMove" ADD CONSTRAINT "PokemonMove_moveId_fkey" FOREIGN KEY ("moveId") REFERENCES "Move"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonType" ADD CONSTRAINT "PokemonType_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonType" ADD CONSTRAINT "PokemonType_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

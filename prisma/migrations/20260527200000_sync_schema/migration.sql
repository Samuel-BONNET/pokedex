-- Drop obsolete column
ALTER TABLE "Pokemon" DROP COLUMN "currentSprite";

-- Add missing columns
ALTER TABLE "Pokemon" ADD COLUMN "availableGames" JSONB NOT NULL DEFAULT '[]';

ALTER TABLE "Game" ADD COLUMN "generation" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Statut" ADD COLUMN "currentGeneration" INTEGER NOT NULL DEFAULT 0;

-- Add unique index on pokeNumber
CREATE UNIQUE INDEX "Pokemon_pokeNumber_key" ON "Pokemon"("pokeNumber");

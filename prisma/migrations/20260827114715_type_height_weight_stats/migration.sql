-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "height" INTEGER,
ADD COLUMN     "stats" JSONB,
ADD COLUMN     "types" JSONB,
ADD COLUMN     "weight" INTEGER;

-- CreateTable
CREATE TABLE "Evolution" (
    "id" SERIAL NOT NULL,
    "fromPokemonId" INTEGER NOT NULL,
    "toPokemonId" INTEGER NOT NULL,

    CONSTRAINT "Evolution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Evolution_fromPokemonId_toPokemonId_key" ON "Evolution"("fromPokemonId", "toPokemonId");

-- AddForeignKey
ALTER TABLE "Evolution" ADD CONSTRAINT "Evolution_fromPokemonId_fkey" FOREIGN KEY ("fromPokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evolution" ADD CONSTRAINT "Evolution_toPokemonId_fkey" FOREIGN KEY ("toPokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

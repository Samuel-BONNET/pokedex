-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "pseudo" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "preferences" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "nameEn" VARCHAR(50) NOT NULL,
    "generation" INTEGER NOT NULL,
    "currentJaquette" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "nameFr" VARCHAR(50) NOT NULL,
    "nameEn" VARCHAR(50) NOT NULL,
    "pokeNumber" INTEGER NOT NULL,
    "availableGames" JSONB NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statut" (
    "idPokemon" INTEGER NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idGameProvenance" INTEGER NOT NULL,
    "isOwned" BOOLEAN NOT NULL,
    "isShiny" BOOLEAN NOT NULL,
    "currentSprite" TEXT NOT NULL,

    CONSTRAINT "Statut_pkey" PRIMARY KEY ("idPokemon","idUser")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_pokeNumber_key" ON "Pokemon"("pokeNumber");

-- AddForeignKey
ALTER TABLE "Statut" ADD CONSTRAINT "Statut_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statut" ADD CONSTRAINT "Statut_idPokemon_fkey" FOREIGN KEY ("idPokemon") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statut" ADD CONSTRAINT "Statut_idGameProvenance_fkey" FOREIGN KEY ("idGameProvenance") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

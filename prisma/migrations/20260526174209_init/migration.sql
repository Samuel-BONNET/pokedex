-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "pseudo" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "preferences" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "pokeNumber" INTEGER NOT NULL,
    "curentSprite" TEXT NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statut" (
    "idPokemon" INTEGER NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idGameProvenance" INTEGER NOT NULL,
    "isOwned" BOOLEAN NOT NULL,
    "isShiny" BOOLEAN NOT NULL,

    CONSTRAINT "Statut_pkey" PRIMARY KEY ("idPokemon","idUser","idGameProvenance")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Statut" ADD CONSTRAINT "Statut_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statut" ADD CONSTRAINT "Statut_idPokemon_fkey" FOREIGN KEY ("idPokemon") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statut" ADD CONSTRAINT "Statut_idGameProvenance_fkey" FOREIGN KEY ("idGameProvenance") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

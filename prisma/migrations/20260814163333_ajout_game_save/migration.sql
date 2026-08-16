-- CreateTable
CREATE TABLE "GameSave" (
    "id" SERIAL NOT NULL,
    "idGame" INTEGER NOT NULL,
    "idUser" INTEGER NOT NULL,
    "file" BYTEA NOT NULL,
    "fileName" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameSave_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameSave_idGame_idUser_key" ON "GameSave"("idGame", "idUser");

-- AddForeignKey
ALTER TABLE "GameSave" ADD CONSTRAINT "GameSave_idGame_fkey" FOREIGN KEY ("idGame") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSave" ADD CONSTRAINT "GameSave_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

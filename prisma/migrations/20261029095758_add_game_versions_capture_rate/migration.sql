-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "capture_rate" INTEGER,
ADD COLUMN     "gameVersions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "typeTable" JSONB;

-- AlterTable
ALTER TABLE "Type" ADD COLUMN     "immunities" JSONB;

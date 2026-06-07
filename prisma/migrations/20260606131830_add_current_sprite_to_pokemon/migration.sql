-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "currentSprite" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Pokemon" ALTER COLUMN "currentSprite" DROP DEFAULT;

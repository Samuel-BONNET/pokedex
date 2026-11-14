-- AlterTable
ALTER TABLE `Pokemon` ADD COLUMN `capture_rate` INTEGER NULL,
  ADD COLUMN `gameVersions` JSON NOT NULL DEFAULT ('[]'),
  ADD COLUMN `typeTable` JSON NULL;


-- AlterTable
ALTER TABLE `Type` ADD COLUMN `immunities` JSON NULL;
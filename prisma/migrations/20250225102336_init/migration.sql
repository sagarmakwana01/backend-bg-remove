/*
  Warnings:

  - You are about to drop the column `birthdaySpecial` on the `template` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `template` DROP COLUMN `birthdaySpecial`,
    ADD COLUMN `frameType` VARCHAR(191) NULL;

/*
  Warnings:

  - Made the column `logoText` on table `header` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `header` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `logoText` VARCHAR(191) NOT NULL;

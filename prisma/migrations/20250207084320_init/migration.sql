/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `paid` BOOLEAN NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_phone_key` ON `User`(`phone`);

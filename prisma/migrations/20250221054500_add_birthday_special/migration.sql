/*
  Warnings:

  - You are about to drop the column `birthday` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetExpires` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetToken` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `template` ADD COLUMN `birthdaySpecial` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `birthday`,
    DROP COLUMN `passwordResetExpires`,
    DROP COLUMN `passwordResetToken`;

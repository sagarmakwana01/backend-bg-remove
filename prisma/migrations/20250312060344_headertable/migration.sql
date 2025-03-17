/*
  Warnings:

  - You are about to drop the `babys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `backgrounds` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `frames` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sticker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `template` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `babys` DROP FOREIGN KEY `Babys_userId_fkey`;

-- DropTable
DROP TABLE `babys`;

-- DropTable
DROP TABLE `backgrounds`;

-- DropTable
DROP TABLE `frames`;

-- DropTable
DROP TABLE `sticker`;

-- DropTable
DROP TABLE `template`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Header` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logoText` VARCHAR(191) NULL,
    `logoImage` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MenuItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `headerId` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MenuItem` ADD CONSTRAINT `MenuItem_headerId_fkey` FOREIGN KEY (`headerId`) REFERENCES `Header`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

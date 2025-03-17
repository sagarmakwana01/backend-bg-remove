/*
  Warnings:

  - You are about to drop the `slide` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `whychooseussectionsecond` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `menuitem` DROP FOREIGN KEY `MenuItem_headerId_fkey`;

-- DropForeignKey
ALTER TABLE `slide` DROP FOREIGN KEY `Slide_sectionId_fkey`;

-- DropIndex
DROP INDEX `MenuItem_headerId_fkey` ON `menuitem`;

-- DropTable
DROP TABLE `slide`;

-- DropTable
DROP TABLE `whychooseussectionsecond`;

-- CreateTable
CREATE TABLE `WhyChooseUsSecond` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `heading1` VARCHAR(191) NOT NULL,
    `heading2` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `slides` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MenuItem` ADD CONSTRAINT `MenuItem_headerId_fkey` FOREIGN KEY (`headerId`) REFERENCES `Header`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `WhyChooseUsSectionSecond` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `heading1` VARCHAR(191) NOT NULL,
    `heading2` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Slide` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageUrl` VARCHAR(191) NOT NULL,
    `iconUrl` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `linkName` VARCHAR(191) NOT NULL,
    `sectionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Slide` ADD CONSTRAINT `Slide_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `WhyChooseUsSectionSecond`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

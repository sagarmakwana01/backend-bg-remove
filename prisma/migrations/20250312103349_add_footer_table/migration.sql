-- CreateTable
CREATE TABLE `Footer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logoText` VARCHAR(191) NOT NULL,
    `logoImage` VARCHAR(191) NULL,
    `socialMedia` JSON NOT NULL,
    `companyLinks` JSON NOT NULL,
    `toolsAPI` JSON NOT NULL,
    `howToUse` JSON NOT NULL,
    `support` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

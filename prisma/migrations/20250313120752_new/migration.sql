/*
  Warnings:

  - You are about to drop the column `description` on the `whychooseussecond` table. All the data in the column will be lost.
  - You are about to drop the column `heading1` on the `whychooseussecond` table. All the data in the column will be lost.
  - You are about to drop the column `heading2` on the `whychooseussecond` table. All the data in the column will be lost.
  - You are about to drop the column `slides` on the `whychooseussecond` table. All the data in the column will be lost.
  - Added the required column `iconUrl` to the `WhyChooseUsSecond` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `WhyChooseUsSecond` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `WhyChooseUsSecond` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkName` to the `WhyChooseUsSecond` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `whychooseussecond` DROP COLUMN `description`,
    DROP COLUMN `heading1`,
    DROP COLUMN `heading2`,
    DROP COLUMN `slides`,
    ADD COLUMN `iconUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `imageUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `link` VARCHAR(191) NOT NULL,
    ADD COLUMN `linkName` VARCHAR(191) NOT NULL;

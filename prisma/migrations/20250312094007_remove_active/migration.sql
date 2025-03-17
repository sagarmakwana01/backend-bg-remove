/*
  Warnings:

  - You are about to drop the column `active` on the `header` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `menuitem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `header` DROP COLUMN `active`;

-- AlterTable
ALTER TABLE `menuitem` DROP COLUMN `order`;

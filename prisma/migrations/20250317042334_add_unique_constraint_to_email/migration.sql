/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `subscription_email_key` ON `subscription`(`email`);

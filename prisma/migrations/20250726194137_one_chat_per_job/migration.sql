/*
  Warnings:

  - You are about to drop the column `jobId` on the `chat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chatId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `chat` DROP FOREIGN KEY `Chat_jobId_fkey`;

-- DropIndex
DROP INDEX `Chat_jobId_fkey` ON `chat`;

-- AlterTable
ALTER TABLE `chat` DROP COLUMN `jobId`;

-- AlterTable
ALTER TABLE `job` ADD COLUMN `chatId` INTEGER NULL,
    ADD COLUMN `freelancerId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Job_chatId_key` ON `Job`(`chatId`);

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `Chat`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_freelancerId_fkey` FOREIGN KEY (`freelancerId`) REFERENCES `FreelancerProfile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

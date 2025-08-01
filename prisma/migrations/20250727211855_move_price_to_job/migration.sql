/*
  Warnings:

  - You are about to drop the column `price` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `job` ADD COLUMN `price` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `price`;

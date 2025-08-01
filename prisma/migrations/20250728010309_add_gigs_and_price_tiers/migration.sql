-- CreateTable
CREATE TABLE `Gig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `freelancerId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `acceptedTokens` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PriceTier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gigId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `deliveryDays` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Gig` ADD CONSTRAINT `Gig_freelancerId_fkey` FOREIGN KEY (`freelancerId`) REFERENCES `FreelancerProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PriceTier` ADD CONSTRAINT `PriceTier_gigId_fkey` FOREIGN KEY (`gigId`) REFERENCES `Gig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

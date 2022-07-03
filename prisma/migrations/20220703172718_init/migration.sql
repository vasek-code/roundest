-- CreateTable
CREATE TABLE `Vote` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pokemonDexId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pokemon` (
    `id` VARCHAR(191) NOT NULL,
    `dexId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `spriteURL` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Pokemon_dexId_key`(`dexId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

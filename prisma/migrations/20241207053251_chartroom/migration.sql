-- CreateTable
CREATE TABLE `ChartRoom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` CHAR(20) NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ChartRoom_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserChartRoom` (
    `userId` INTEGER NOT NULL,
    `chartRoomId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `chartRoomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

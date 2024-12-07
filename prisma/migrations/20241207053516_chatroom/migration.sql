/*
  Warnings:

  - You are about to drop the `ChartRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserChartRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `ChartRoom`;

-- DropTable
DROP TABLE `UserChartRoom`;

-- CreateTable
CREATE TABLE `ChatRoom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` CHAR(20) NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ChatRoom_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserChatRoom` (
    `userId` INTEGER NOT NULL,
    `chatRoomId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `chatRoomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

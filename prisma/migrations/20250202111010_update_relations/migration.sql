/*
  Warnings:

  - You are about to drop the column `offer_id` on the `TimeSlot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[time_slot_id]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TimeSlot` DROP FOREIGN KEY `TimeSlot_offer_id_fkey`;

-- DropIndex
DROP INDEX `TimeSlot_offer_id_idx` ON `TimeSlot`;

-- DropIndex
DROP INDEX `TimeSlot_offer_id_key` ON `TimeSlot`;

-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `TimeSlot` DROP COLUMN `offer_id`;

-- CreateIndex
CREATE UNIQUE INDEX `Booking_time_slot_id_key` ON `Booking`(`time_slot_id`);

-- CreateIndex
CREATE INDEX `Booking_user_id_idx` ON `Booking`(`user_id`);

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

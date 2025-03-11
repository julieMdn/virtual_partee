/*
  Warnings:

  - The primary key for the `OpeningHours` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `afternoon_end` on the `OpeningHours` table. All the data in the column will be lost.
  - You are about to drop the column `afternoon_start` on the `OpeningHours` table. All the data in the column will be lost.
  - You are about to drop the column `day_of_week` on the `OpeningHours` table. All the data in the column will be lost.
  - You are about to drop the column `morning_end` on the `OpeningHours` table. All the data in the column will be lost.
  - You are about to drop the column `morning_start` on the `OpeningHours` table. All the data in the column will be lost.
  - You are about to drop the column `opening_hours_id` on the `OpeningHours` table. All the data in the column will be lost.
  - The primary key for the `TimeSlot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `end_time` on the `TimeSlot` table. All the data in the column will be lost.
  - You are about to drop the column `is_available` on the `TimeSlot` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `TimeSlot` table. All the data in the column will be lost.
  - You are about to drop the column `time_slot_id` on the `TimeSlot` table. All the data in the column will be lost.
  - Added the required column `afternoonEnd` to the `OpeningHours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `afternoonStart` to the `OpeningHours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dayOfWeek` to the `OpeningHours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `OpeningHours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `morningEnd` to the `OpeningHours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `morningStart` to the `OpeningHours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `TimeSlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `TimeSlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `TimeSlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `TimeSlot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Booking` DROP FOREIGN KEY `Booking_time_slot_id_fkey`;

-- AlterTable
ALTER TABLE `OpeningHours` DROP PRIMARY KEY,
    DROP COLUMN `afternoon_end`,
    DROP COLUMN `afternoon_start`,
    DROP COLUMN `day_of_week`,
    DROP COLUMN `morning_end`,
    DROP COLUMN `morning_start`,
    DROP COLUMN `opening_hours_id`,
    ADD COLUMN `afternoonEnd` DATETIME(3) NOT NULL,
    ADD COLUMN `afternoonStart` DATETIME(3) NOT NULL,
    ADD COLUMN `dayOfWeek` VARCHAR(191) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `morningEnd` DATETIME(3) NOT NULL,
    ADD COLUMN `morningStart` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `TimeSlot` DROP PRIMARY KEY,
    DROP COLUMN `end_time`,
    DROP COLUMN `is_available`,
    DROP COLUMN `start_time`,
    DROP COLUMN `time_slot_id`,
    ADD COLUMN `date` DATETIME(3) NOT NULL,
    ADD COLUMN `endTime` DATETIME(3) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `isAvailable` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `startTime` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_time_slot_id_fkey` FOREIGN KEY (`time_slot_id`) REFERENCES `TimeSlot`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

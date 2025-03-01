/*
  Warnings:

  - You are about to drop the column `booking_date` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `event_date` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` DROP COLUMN `booking_date`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `event_date` DATETIME(3) NOT NULL;

/*
  Warnings:

  - You are about to drop the column `day_of_week` on the `TimeSlot` table. All the data in the column will be lost.
  - You are about to drop the column `max_capacity` on the `TimeSlot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `TimeSlot` DROP COLUMN `day_of_week`,
    DROP COLUMN `max_capacity`;

/*
  Warnings:

  - You are about to drop the column `course_id` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Score` DROP FOREIGN KEY `Score_course_id_fkey`;

-- DropIndex
DROP INDEX `Score_course_id_idx` ON `Score`;

-- AlterTable
ALTER TABLE `Score` DROP COLUMN `course_id`;

-- DropTable
DROP TABLE `Course`;

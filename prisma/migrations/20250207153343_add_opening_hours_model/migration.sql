-- CreateTable
CREATE TABLE `OpeningHours` (
    `opening_hours_id` INTEGER NOT NULL AUTO_INCREMENT,
    `day_of_week` VARCHAR(191) NOT NULL,
    `morning_start` TIME NOT NULL,
    `morning_end` TIME NOT NULL,
    `afternoon_start` TIME NOT NULL,
    `afternoon_end` TIME NOT NULL,

    PRIMARY KEY (`opening_hours_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

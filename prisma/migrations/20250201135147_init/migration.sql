-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(191) NOT NULL,
    `user_email` VARCHAR(191) NOT NULL,
    `user_password` VARCHAR(191) NOT NULL,
    `user_firstname` VARCHAR(191) NOT NULL,
    `user_lastname` VARCHAR(191) NOT NULL,
    `user_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `user_birthday` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_user_name_key`(`user_name`),
    UNIQUE INDEX `User_user_email_key`(`user_email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `address_id` INTEGER NOT NULL AUTO_INCREMENT,
    `address_street` VARCHAR(191) NOT NULL,
    `address_city` VARCHAR(191) NOT NULL,
    `address_post_code` VARCHAR(191) NOT NULL,
    `address_country` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `address_type` VARCHAR(191) NOT NULL DEFAULT 'billing',

    PRIMARY KEY (`address_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Offer` (
    `offer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `offer_title` VARCHAR(191) NOT NULL,
    `offer_description` VARCHAR(191) NOT NULL,
    `offer_price` DOUBLE NOT NULL,
    `offer_picture` VARCHAR(191) NOT NULL,
    `offer_duration` INTEGER NOT NULL,
    `offer_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`offer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeSlot` (
    `time_slot_id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `is_available` BOOLEAN NOT NULL DEFAULT true,
    `day_of_week` VARCHAR(191) NOT NULL,
    `max_capacity` INTEGER NOT NULL,
    `offer_id` INTEGER NOT NULL,

    UNIQUE INDEX `TimeSlot_offer_id_key`(`offer_id`),
    INDEX `TimeSlot_offer_id_idx`(`offer_id`),
    PRIMARY KEY (`time_slot_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `booking_id` INTEGER NOT NULL AUTO_INCREMENT,
    `booking_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `booking_status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `offer_id` INTEGER NOT NULL,
    `time_slot_id` INTEGER NOT NULL,
    `payment_id` INTEGER NULL,

    INDEX `Booking_offer_id_idx`(`offer_id`),
    INDEX `Booking_time_slot_id_idx`(`time_slot_id`),
    INDEX `Booking_payment_id_idx`(`payment_id`),
    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `payment_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `payment_amount` DOUBLE NOT NULL,
    `tva_amount` DOUBLE NOT NULL,
    `payment_status` VARCHAR(191) NOT NULL DEFAULT 'pending',

    INDEX `Payment_payment_id_idx`(`payment_id`),
    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Score` (
    `score_id` INTEGER NOT NULL AUTO_INCREMENT,
    `score_value` INTEGER NOT NULL,
    `score_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` INTEGER NOT NULL,
    `course_id` INTEGER NOT NULL,

    INDEX `Score_user_id_idx`(`user_id`),
    INDEX `Score_course_id_idx`(`course_id`),
    PRIMARY KEY (`score_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `course_id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AddressToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AddressToUser_AB_unique`(`A`, `B`),
    INDEX `_AddressToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TimeSlot` ADD CONSTRAINT `TimeSlot_offer_id_fkey` FOREIGN KEY (`offer_id`) REFERENCES `Offer`(`offer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_offer_id_fkey` FOREIGN KEY (`offer_id`) REFERENCES `Offer`(`offer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_time_slot_id_fkey` FOREIGN KEY (`time_slot_id`) REFERENCES `TimeSlot`(`time_slot_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `Payment`(`payment_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Score` ADD CONSTRAINT `Score_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Score` ADD CONSTRAINT `Score_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AddressToUser` ADD CONSTRAINT `_AddressToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Address`(`address_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AddressToUser` ADD CONSTRAINT `_AddressToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

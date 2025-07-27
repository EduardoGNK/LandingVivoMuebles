/*
  Warnings:

  - You are about to drop the column `artist` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `dimensions` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `medium` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `project` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyType` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workType` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `project` DROP COLUMN `artist`,
    DROP COLUMN `dimensions`,
    DROP COLUMN `medium`,
    DROP COLUMN `price`,
    DROP COLUMN `year`,
    ADD COLUMN `comuna` VARCHAR(191) NOT NULL DEFAULT 'Santiago',
    ADD COLUMN `endDate` VARCHAR(191) NOT NULL,
    ADD COLUMN `propertyType` VARCHAR(191) NOT NULL,
    ADD COLUMN `startDate` VARCHAR(191) NOT NULL,
    ADD COLUMN `workType` VARCHAR(191) NOT NULL;

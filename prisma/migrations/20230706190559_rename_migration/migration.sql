/*
  Warnings:

  - You are about to alter the column `brand` on the `product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `thumbnail_public_id` on the `product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `discountPercentage` FLOAT NULL DEFAULT 0,
    MODIFY `brand` VARCHAR(100) NOT NULL,
    MODIFY `thumbnail_public_id` VARCHAR(100) NOT NULL;

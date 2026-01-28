/*
  Warnings:

  - You are about to drop the `Superpower` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Superpower" DROP CONSTRAINT "Superpower_heroId_fkey";

-- AlterTable
ALTER TABLE "Hero" ADD COLUMN     "superpowers" TEXT[];

-- DropTable
DROP TABLE "Superpower";

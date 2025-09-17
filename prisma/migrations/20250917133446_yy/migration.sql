/*
  Warnings:

  - You are about to drop the column `pseudo` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."user_pseudo_key";

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "pseudo",
ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_name_key" ON "public"."user"("name");

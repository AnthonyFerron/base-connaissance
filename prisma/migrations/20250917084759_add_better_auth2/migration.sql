/*
  Warnings:

  - You are about to drop the column `description` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `verification` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Made the column `photo` on table `Pokemon` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Pokemon" DROP COLUMN "description",
ADD COLUMN     "content" JSONB NOT NULL,
ALTER COLUMN "photo" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Request" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Type" ADD COLUMN     "color" TEXT;

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "emailVerified",
DROP COLUMN "image",
DROP COLUMN "name";

-- DropTable
DROP TABLE "public"."verification";

-- CreateTable
CREATE TABLE "public"."_RequestToType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RequestToType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RequestToType_B_index" ON "public"."_RequestToType"("B");

-- AddForeignKey
ALTER TABLE "public"."_RequestToType" ADD CONSTRAINT "_RequestToType_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RequestToType" ADD CONSTRAINT "_RequestToType_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

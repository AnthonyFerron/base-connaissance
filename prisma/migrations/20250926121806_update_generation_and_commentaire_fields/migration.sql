/*
  Warnings:

  - You are about to drop the column `texte` on the `Commentaire` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `Generation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Generation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[generationNumber]` on the table `Generation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `text` to the `Commentaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `generationNumber` to the `Generation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Generation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Generation_nom_key";

-- AlterTable
ALTER TABLE "public"."Commentaire" DROP COLUMN "texte",
ADD COLUMN     "text" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Generation" DROP COLUMN "nom",
ADD COLUMN     "generationNumber" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Generation_name_key" ON "public"."Generation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Generation_generationNumber_key" ON "public"."Generation"("generationNumber");

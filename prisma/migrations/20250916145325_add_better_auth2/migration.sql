/*
  Warnings:

  - You are about to drop the column `auteurId` on the `Commentaire` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `Type` table. All the data in the column will be lost.
  - You are about to drop the `Proposition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Utilisateur` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Pokemon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Type` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Commentaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Type` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE');

-- DropForeignKey
ALTER TABLE "public"."Commentaire" DROP CONSTRAINT "Commentaire_auteurId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Proposition" DROP CONSTRAINT "Proposition_auteurId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Proposition" DROP CONSTRAINT "Proposition_pokemonId_fkey";

-- DropIndex
DROP INDEX "public"."Commentaire_auteurId_idx";

-- DropIndex
DROP INDEX "public"."Pokemon_nom_key";

-- DropIndex
DROP INDEX "public"."Type_nom_key";

-- AlterTable
ALTER TABLE "public"."Commentaire" DROP COLUMN "auteurId",
ADD COLUMN     "authorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Pokemon" DROP COLUMN "nom",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Type" DROP COLUMN "nom",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Proposition";

-- DropTable
DROP TABLE "public"."Utilisateur";

-- DropEnum
DROP TYPE "public"."PropositionStatus";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "pseudo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Request" (
    "id" SERIAL NOT NULL,
    "content" JSONB NOT NULL,
    "actionType" "public"."ActionType" NOT NULL,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'EN_ATTENTE',
    "proposedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,
    "pokemonId" INTEGER NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_pseudo_key" ON "public"."User"("pseudo");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Request_authorId_idx" ON "public"."Request"("authorId");

-- CreateIndex
CREATE INDEX "Request_pokemonId_idx" ON "public"."Request"("pokemonId");

-- CreateIndex
CREATE INDEX "Request_status_idx" ON "public"."Request"("status");

-- CreateIndex
CREATE INDEX "Commentaire_authorId_idx" ON "public"."Commentaire"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_name_key" ON "public"."Pokemon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Type_name_key" ON "public"."Type"("name");

-- AddForeignKey
ALTER TABLE "public"."Commentaire" ADD CONSTRAINT "Commentaire_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Request" ADD CONSTRAINT "Request_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Request" ADD CONSTRAINT "Request_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "public"."Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

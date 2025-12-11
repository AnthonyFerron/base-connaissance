/*
  Warnings:

  - Added the required column `generationId` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Request" ADD COLUMN     "generationId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Request_generationId_idx" ON "public"."Request"("generationId");

-- AddForeignKey
ALTER TABLE "public"."Request" ADD CONSTRAINT "Request_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "public"."Generation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

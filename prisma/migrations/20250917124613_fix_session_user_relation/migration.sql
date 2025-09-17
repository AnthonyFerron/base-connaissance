-- DropForeignKey
ALTER TABLE "public"."session" DROP CONSTRAINT "session_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

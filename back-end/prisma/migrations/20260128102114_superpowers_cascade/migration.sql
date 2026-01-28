-- DropForeignKey
ALTER TABLE "Superpower" DROP CONSTRAINT "Superpower_heroId_fkey";

-- AddForeignKey
ALTER TABLE "Superpower" ADD CONSTRAINT "Superpower_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "Hero"("id") ON DELETE CASCADE ON UPDATE CASCADE;

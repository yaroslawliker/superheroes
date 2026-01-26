-- CreateTable
CREATE TABLE "Hero" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "realName" TEXT NOT NULL,
    "originDescription" TEXT NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Superpower" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "heroId" INTEGER NOT NULL,

    CONSTRAINT "Superpower_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Superpower" ADD CONSTRAINT "Superpower_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "Hero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

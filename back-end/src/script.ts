// A simple script to play around
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runScript() {
    // const result = await prisma.hero.findMany();

    // console.log(result);

    // const result = await prisma.hero.deleteMany();
    // console.log(result);
}



runScript();
prisma.$disconnect();
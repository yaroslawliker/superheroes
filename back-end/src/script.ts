// A simple script to play around
import { PrismaClient } from "@prisma/client";
import { populateDb } from "./populate-db";
import { populate } from "dotenv";
import { minioClient, BUCKET_NAME } from "./config/minio.client";
import { MinioService } from "./services/minio.service";

const prisma = new PrismaClient();
const minio = new MinioService(minioClient, BUCKET_NAME);

async function runScript() {   
    // Getting all images of the heroes
    const heroes = await prisma.hero.findMany({
        select: {
            images: true
        }
    })
    const filenames = heroes.map(h => h.images);    
    await minio.removeFiles(filenames.flat());
    console.log("Removed files from minio");

    const result1 = await prisma.hero.deleteMany();
    console.log("Removed heroes: ", result1);



    const result = await populateDb(prisma, minio, 33);
    console.log("Database was populated.", result);
}

runScript();
prisma.$disconnect();
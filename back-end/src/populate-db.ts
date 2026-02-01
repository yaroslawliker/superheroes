import { PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";
import { MinioService } from "./services/minio.service";
import { readSingleFile } from "./services/readFile";
import { read } from "fs";


const firstParts = ['Bat', 'Spider', 'Cat', 'Post', 'Police', 'Cool'];
const lastParts = ['man', 'woman', 'er', 'ness', 'guy', 'girl'];
function buildNickname() {
    const firstPart = firstParts[randomInt(0, firstParts.length)];
    const lastPart = lastParts[randomInt(0, lastParts.length)];

    return firstPart + lastPart;
}

const firstNames = ['John', 'Mary', 'James', 'Jennifer', 'Robert', 'Jessica' ];
const lastNames = ['Smith', 'Parker', "Johnson", "Williams", "Brown", "White"];
function buildName() {
    const firstName = firstNames[randomInt(0, firstNames.length)];
    const lastName = lastNames[randomInt(0, lastNames.length)];

    return `${firstName} ${lastName}`;
}

const families = ['bad', 'good', 'poor', 'rich'];
function buildOrigin() {
    const family = families[randomInt(0, families.length)];
    return `A superhero from a ${family} family.`
}

const superpowerVariants = ['freeze everything', 'throw fireballs', 'heal', 'reginirate', 'write reliable code', 'invisibility', 'owns ecoflow']
function buildSuperpowers() {
    const superpowers = [];
    for (let i = 0; i < randomInt(1, 4); i++) {
        superpowers.push(superpowerVariants[randomInt(0, superpowerVariants.length)]);
    }
    return superpowers;
}

async function buildFiles(minio: MinioService) {
    const file1 = await readSingleFile('superhero-main.png');
    const file2 = await readSingleFile('superhero.png');

    return await minio.saveFiles([file1, file2]);
}

export async function populateDb(prisma: PrismaClient, minio: MinioService, amount: number) {
    const heroes = [];   
    for (let i=0; i < amount; i++) {
        heroes.push({
            nickname: buildNickname(),
            realName: buildName(),
            originDescription: buildOrigin(),
            catchPhrase: "I am a superhero!",
            superpowers: buildSuperpowers(),
            images: await buildFiles(minio)
        })
    }
    
    return await prisma.hero.createMany({
        data: heroes
    })
}
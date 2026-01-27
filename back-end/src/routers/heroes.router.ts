import express from 'express'
import multer from 'multer'
import { Client as MinioClient } from 'minio';
import { BUCKET_NAME } from '../config/minio.client';

import { PrismaClient } from '@prisma/client';

import { logRequest } from '../logging/request-logger';
import { createHeroSchema, CreateHeroDto } from '../dto/create-hero.dto';



const INTERNAL_ERROR = {
    code: "no_such_id",
    message: "No hero with such id."
}

export default function createHeroesRouter(prisma: PrismaClient, minio: MinioClient) {
    
    const router = express.Router();
    const upload = multer({ storage: multer.memoryStorage() });

    router.use('', logRequest);


    // --- End-points


    
    // Returns the full info on a specific superhero
    router.get('/:heroId', (req, res) => {
        const id = Number(req.params.heroId);
        const hero = prisma.hero.findUnique({
            where: {
                id: id
            }
        })

        hero
            .then((h) => {
                if (h) {
                    res.statusCode = 200;
                    res.send(h);
                }
                else {
                    res.statusCode = 400;
                    res.send({
                        error: {
                            code: "no_such_id",
                            message: "No hero with such id."
                        }
                    })
                }
            })
            .catch((e)=>{
                res.statusCode = 500;
                res.send({
                    error: INTERNAL_ERROR
                })
            })        
    });


    // Lets upload a hero with images
    router.post(
        '/', 
        upload.array('images', 10), 
        
        async (req, res) => {
        try {

            // Parsing json
            if (!req.body.data) {
                return res.status(400).json({ error: {
                    code: "missing_field",
                    message: "Missing 'data' field"
                }});
            }

            let parsedBody;
            try {
                parsedBody = JSON.parse(req.body.data);
            } catch (e) {
                return res.status(400).json({ error: { 
                    code: "invalid_json",
                    message: "Invalid JSON format in 'data'",
                }});
            }

            // Data validation
            const validationResult = createHeroSchema.safeParse(parsedBody);

            if (!validationResult.success) {
                return res.status(400).json({ 
                    error: {
                        message: "Validation Error",
                        code: "validation_error"
                    },
                    details: validationResult.error.issues
                });
            }

            const validHeroData = validationResult.data;

            // Ensuring the files
            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                return res.status(400).json({ 
                    error: { code: "no_images", message: "At least one image required" }
                });
            }

            // Saving files to minIO
            const uploadPromises = files.map(async (file) => {
                const fileName = `${Date.now()}-${file.originalname}`;
                
                await minio.putObject(
                    BUCKET_NAME,
                    fileName,
                    file.buffer,
                    file.size,
                    { 'Content-Type': file.mimetype }
                );
                
                return fileName; 
            });

            const savedFileNames = await Promise.all(uploadPromises);

            // Parsing superpowers
            const superpowersData = validHeroData.superpowers.map((s: string) => ({ name: s }));

            // Adding the new hero to the database
            const newHero = await prisma.hero.create({
                data: {
                    nickname: validHeroData.nickname,
                    realName: validHeroData.realName,
                    originDescription: validHeroData.originDescription,
                    images: savedFileNames,

                    superpowers: {
                        createMany: {
                            data: superpowersData
                        } 
                    }
                },
                include: {
                    superpowers: true
                }
            });

            res.status(201).json(newHero);

        } catch (error) {
            console.error("Error while creating hero:", error);
            res.status(500).json({ error: INTERNAL_ERROR });
        }
    });



    router.put('/', (req, res) => {
        res.send("Hero!");
    });



    router.delete('/', (req, res) => {
        res.send("Hero!");
    });

    return router;
}





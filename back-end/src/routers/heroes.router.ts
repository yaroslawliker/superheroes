import express from 'express'
import multer from 'multer'
import { Client as MinioClient } from 'minio';
import { BUCKET_NAME } from '../config/minio.client';

import { PrismaClient } from '@prisma/client';

import { logRequest } from '../logging/request-logger';
import { createHeroSchema } from '../dto/create-hero.dto';
import { updateHeroSchema } from '../dto/update-hero.dto';
import { MinioService } from '../services/minio.service'
import { catalogSchema } from '../dto/catalog.dto';



const INTERNAL_ERROR = {
    code: "no_such_id",
    message: "No hero with such id."
}

export default function createHeroesRouter(prisma: PrismaClient, minio: MinioService) {
    
    const router = express.Router();
    const upload = multer({ storage: multer.memoryStorage() });

    router.use('', logRequest);


    // --- End-points



    /**
     * Searches for superheroes with the given pagination.
     * 'search' query param is not used for now
     */
    router.get("/catalog", async (req, res) => {
        try{
            const { page, limit } = catalogSchema.parse(req.query);
            const skip = (page-1)*limit;

            const [heroes, totalCount] = await Promise.all([
                prisma.hero.findMany({
                    skip: skip,
                    take: limit,
                    orderBy: { id: 'desc' },
                    select: {
                        id: true,
                        nickname: true,
                        images: true
                    }
                }),
                prisma.hero.count()
            ]);

            res.json({
                data: heroes,
                totalCount: totalCount
            })

        } catch (error) {
            res.status(500).json({ error: INTERNAL_ERROR })
        }
    })


    
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
            const savedFileNames = await minio.saveFiles(files);

            // Adding the new hero to the database
            const newHero = await prisma.hero.create({
                data: {
                    nickname: validHeroData.nickname,
                    realName: validHeroData.realName,
                    originDescription: validHeroData.originDescription,
                    images: savedFileNames,
                    superpowers: validHeroData.superpowers
                }
            });

            res.status(201).json(newHero);

        } catch (error) {
            console.error("Error while creating hero:", error);
            res.status(500).json({ error: INTERNAL_ERROR });
        }
    });



    router.put('/:heroId', upload.array('images', 10), async (req, res) => {
        const heroId = Number(req.params.heroId);

        try {
            
            if (!req.body.data) return res.status(400).json(
                { error: {
                    code: "missing_field",
                    message: "Missing 'data' field"
                }}
            );
            
            let payload;
            try {
                payload = JSON.parse(req.body.data);
            } catch (e) {
                return res.status(400).json({ error:{
                    code: "invalid_json",
                    message: "Invalid JSON" 
                }});
            }

            const validation = updateHeroSchema.safeParse(payload);

            if (!validation.success) {
                return res.status(400).json({ error: validation.error.issues });
            }
            const updates = validation.data;

            const currentHero = await prisma.hero.findUnique({
                where: { id: heroId },
                select: { images: true }
            });

            if (!currentHero) return res.status(404).json({ error: "Hero not found" });


            const files = req.files as Express.Multer.File[];
            let newFileNames: string[] = [];
            
            if (files && files.length > 0) {
                newFileNames = await minio.saveFiles(files);
            }

            if (updates.deletedImages && updates.deletedImages.length > 0) {
                await minio.removeFiles(updates.deletedImages);
            }

            let finalImages = currentHero.images;
            
            if (updates.deletedImages && updates.deletedImages.length > 0) {
                finalImages = finalImages.filter(img => !updates.deletedImages.includes(img));
            }

            finalImages = [...finalImages, ...newFileNames];
            
            const updatedHero = await prisma.hero.update({
                where: { id: heroId },
                data: {
                    nickname: updates.nickname,
                    realName: updates.realName,
                    originDescription: updates.originDescription,
                    superpowers: updates.superpowers,
                    images: finalImages
                }
            });

            res.json(updatedHero);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });


    router.delete('/', async (req, res) => {
        const heroId = Number(req.body.id);

        if (!heroId) {
            res.status(400).json({ error: {
                code: "missing_field",
                message: "No id was provided"
            }})
        }

        const hero = await prisma.hero.findUnique({
            where: {
                id: heroId
            },
            select: {
                images: true
            }
        });

        if (!hero) {
            return res.status(404).json({ error: {
                code: "not_found",
                message: "No such hero to delete"
            }});
        }

        try {

            const result = await prisma.hero.delete({
                where: {
                    id: heroId
                }
            })

            if (hero.images && hero.images.length > 0) {
                minio.removeFiles(hero.images)
                console.debug(`${hero.images.length} images were removed.`)
            }

            res.status(200).json({
                status: "deleted"
            })

        } catch (error) {
            res.status(500).json({ error: INTERNAL_ERROR })
        }
    });

    return router;
}





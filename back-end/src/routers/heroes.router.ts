import express from 'express'

import { PrismaClient } from '@prisma/client';
import { logRequest } from '../logging/request-logger';
import { validate } from '../dto/validate-schema';
import { createHeroSchema, CreateHeroDto } from '../dto/create-hero.dto';


const INTERNAL_ERROR = {
    code: "no_such_id",
    message: "No hero with such id."
}


export default function createHeroesRouter(prisma: PrismaClient) {

    const router = express.Router();

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
    })


    // Lets to add new superheroes
    router.post('/', validate(createHeroSchema), async (req, res) => {
        try {
            const body = req.body;

            const superpowers = body.superpowers.map(
                (s: string) => {return {name: s}}
            );

            console.log(superpowers);

            const newHero = await prisma.hero.create({
                data: {
                    nickname: body.nickname,
                    realName: body.realName,
                    originDescription: body.originDescription,
                    superpowers: {
                        createMany: {
                            data: superpowers
                        } 
                    }
                }
            })

            res.status(201).json(newHero);
        }
        catch (error) {
            res.status(500).json({
                error: INTERNAL_ERROR
            })
            console.error(error);
        }
        
    })

    router.put('/', (req, res) => {
        res.send("Hero!");
    })

    router.delete('/', (req, res) => {
        res.send("Hero!");
    })

    return router;
}





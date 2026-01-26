import express from 'express'

import { PrismaClient } from '@prisma/client';
import { logRequest } from '../logging/request-logger';


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
                    error: {
                        code: "internal",
                        message: "Internal server error"
                    }
                })
            })        
    })



    router.post('/', (req, res) => {
        res.send("Hero!");
    })

    router.put('/', (req, res) => {
        res.send("Hero!");
    })

    router.delete('/', (req, res) => {
        res.send("Hero!");
    })

    return router;
}





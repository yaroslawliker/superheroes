import express from 'express'

import { PrismaClient } from '@prisma/client'
import { minioClient, initMinio } from './config/minio.client';

import createHeroesRouter from './routers/heroes.router'


const app = express();
const port = 3000;


// Dependency injection and components set up

app.use(express.json());

initMinio();

const prisma = new PrismaClient();
const heroesRouter = createHeroesRouter(prisma, minioClient);


// --- Paths ---

// Index path
app.get('/', (req, res) => {
  res.send('Hello heroes app!')
})

// The heroes router
app.use('/heroes', heroesRouter);



// --- Running the server ---
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

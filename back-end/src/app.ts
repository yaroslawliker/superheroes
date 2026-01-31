import express from 'express'
import cors from "cors"

import { PrismaClient } from '@prisma/client'
import { minioClient, BUCKET_NAME } from './config/minio.client';
import { MinioService } from './services/minio.service';

import createHeroesRouter from './routers/heroes.router'


const app = express();
const port = 3000;


// Dependency injection and components set up

app.use(cors());
app.use(express.json());

const minioService = new MinioService(minioClient, BUCKET_NAME);

const prisma = new PrismaClient();
const heroesRouter = createHeroesRouter(prisma, minioService);


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

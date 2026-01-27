import express from 'express'

import { PrismaClient } from '@prisma/client'

import createHeroesRouter from './routers/heroes.router'


const app = express();
const port = 3000;


// Dependency injection

app.use(express.json())

const prisma = new PrismaClient();
const heroesRouter = createHeroesRouter(prisma);


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

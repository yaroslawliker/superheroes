import express from 'express'

import herosRouter from './routers/heroes-router'

const app = express()
const port = 3001

app.get('/', (req, res) => {
  res.send('Hello heroes app!')
})

app.use('/heroes', herosRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

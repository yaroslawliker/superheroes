import express from 'express'

import { logRequest } from '../logging/request-logger';

const router = express.Router();

router.use('', logRequest);

router.get('/', (req, res) => {
    res.send("Hero!");
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


export default router;



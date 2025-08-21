
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute.js'
const router = express.Router()


router.get('/status', (req,res) => {
    res.status(StatusCodes.OK).json({message: 'APIs are ready to use'})
})

router.use('/boards', boardRoute)
export const APIs_V1 = router
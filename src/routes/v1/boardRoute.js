import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '../../validations/boardValidation.js'
import { boardController } from '../../controllers/boardController.js'
const router = express.Router()


router.route('/') 
    .get((req,res) => {
        res.status(StatusCodes.OK).json({message: 'GET: API get list boards'})})
    .post(boardValidation.createNew, boardController.createNew )
router.route('/:id') 
    .get(boardController.getDetails)
    .put()
export const boardRoute = router
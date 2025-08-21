import { StatusCodes } from "http-status-codes";
import { boardService } from "../services/boardService.js";
const createNew = async (req, res, next) => {
    try {
        //turning to service
        const createBoard = await boardService.createNew(req.body)
        //return the result to Client
        res.status(StatusCodes.OK).json({ createBoard })
    } catch (error) {
        next(error)
    }
}
const getDetails = async (req, res, next) => {
    try {

        const boardId = req.params.id
        //turning to service
        const board = await boardService.getDetails(boardId)
        //return the result to Client
        res.status(StatusCodes.OK).json({ board })
    } catch (error) {
        next(error)
    }
}
export const boardController = {
    createNew,
    getDetails
}
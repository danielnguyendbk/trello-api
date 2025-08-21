import { slugify } from "../utils/formatters.js"
import { BOARD_MODEL } from "../models/boardModel.js"
import ApiError from "../utils/apiError.js"
import { StatusCodes } from "http-status-codes"
import pkg from "lodash"
const { cloneDeep } = pkg
const createNew = async (reqBody) => {
   try {
    // handle project-specific logic
    const newBoard = {
        ...reqBody,
        slug: slugify(reqBody.title)
    }
      
    //call the model to create a new board
    const createdBoard = await BOARD_MODEL.createNew(newBoard)
     
    // get the created board from the database
    const getNewBoard = await BOARD_MODEL.findOneById(createdBoard.insertedId)
       

    //there's always return in services
       return getNewBoard
      
   } catch (error) {
       
    throw error
   }
}
const getDetails = async (boardId) => {
    try {
       
        //call the model to create a new board
        const board = await BOARD_MODEL.getDetails(boardId)
        if (!board) {
            throw  new ApiError(StatusCodes.NOT_FOUND, `Board with id ${boardId} not found`)
        }
        // fix columns and cards issues
        const resBoard = cloneDeep(board)

        resBoard.columns.forEach(column => {
            column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
        })

        delete resBoard.cards
        //there's always return in services
        return resBoard

    } catch (error) {

        throw error
    }
}


export const boardService = {
    createNew,
    getDetails  
}
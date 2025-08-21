import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/apiError.js";
import { BOARD_TYPES } from "../utils/constants.js";
const createNew = async (req, res, next) => {
    // console.log('Validation middleware running...', req.body)
    const correctCondition = Joi.object({
        title: Joi.string().required().min(3).max(50).trim().strict().messages({
            'any.required': 'Title is required',
            'string.empty': 'Title cannot be empty',
            'string.min': 'Title must be at least 3 characters long',
            'string.max': 'Title must not exceed 50 characters',
            'string.trim': 'Title cannot have leading or trailing spaces'
        }),
        description: Joi.string().required().min(3).max(255).trim().strict(),
        type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required().messages({
            'any.required': 'Type is required',
            'any.only': 'Type must be either public or private'
        })
    })
   
    try {
        await correctCondition.validateAsync(req.body, {abortEarly: false})
    //after validating data then use next to convey code to board controller
       next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
    
}
export const boardValidation = {
    createNew
}
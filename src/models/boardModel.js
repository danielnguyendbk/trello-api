import Joi from 'joi'
import { GET_DB } from '../config/mongodb.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from './validators.js'
import { ObjectId } from 'bson';
import { BOARD_TYPES } from '../utils/constants.js';
import { columnModel } from './columnModule.js';
import { cardModel } from './cardModel.js';

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    slug: Joi.string()
        .min(3) // slug phải ít nhất 3 ký tự
        .trim() // bỏ khoảng trắng đầu và cuối
        .strict() // ép dữ liệu phải là string, không tự convert
        .default((parent) =>
            parent.title?.toLowerCase().replace(/\s+/g, '-')
        )
,
    description: Joi.string().required().min(3).max(255).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
    columnOrderIds: Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([]),
    createAt: Joi.date().timestamp('javascript').default(Date.now),
    updateAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})
// Validate data before creating a new board
const validateBeforeCreate = async (data) => {
    
    return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { 
        abortEarly: false
    })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
    } catch (error) {
        throw new Error(error)
    }
}
const findOneById =  async (id) => {
    try{
        return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
    } catch (error) {
        throw new Error(error)
    }
} 
const getDetails = async (id) => {
    try {
        // const objectId = new ObjectId(id)
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
            {
                $match: {
                    _id: new ObjectId(id),
                    _destroy: false 
                }
            },
            {
                $lookup: {
                    from: columnModel.COLUMN_COLLECTION_NAME,
                    localField: '_id',
                    foreignField: 'boardId',
                    as: 'columns'
                }
            },
            {
                $lookup: {
                    from: cardModel.CARD_COLLECTION_NAME,
                    localField: '_id',
                    foreignField: 'boardId',
                    as: 'cards'
                }
            }
        ]).toArray()

        console.log('result', result)
        return result[0] || {}
    } catch (error) {
        throw new Error(error)
    }
}


export const BOARD_MODEL = {
    BOARD_COLLECTION_NAME,
    BOARD_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails
}
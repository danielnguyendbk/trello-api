
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve('./src/.env') })

export const env = {
    MONGO_URL: process.env.MONGO_URL,
    DATABASE_NAME: process.env.DATABASE_NAME,
    APP_HOST: process.env.APP_HOST,
    APP_PORT: process.env.APP_PORT,

    BUILD_MODE: process.env.BUILD_MODE,
    AUTHOR: process.env.AUTHOR

}
console.log('Loaded env variables:', env)
import { MongoClient,ServerApiVersion } from "mongodb"
import { env } from "./environment.js"

// create an object when not connecting
let trelloDatabaseInstance= null
///create an oject to connect MongoDb
const client = new MongoClient(env.MONGO_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

export const CONNECT_DB = async () => {
    //call the connection from mongoDb
    await client.connect()
    //if successfully , take Database by name 
    trelloDatabaseInstance = client.db(env.DATABASE_NAME) 
}

//function GET (not async) return the database
export const GET_DB = () => {
    if (!trelloDatabaseInstance) throw new Error('Must connect to database first!')
    return trelloDatabaseInstance
}
export const CLOSE_DB = async () => {
    await client.close()
}
 
import express from 'express'
import { GET_DB, CONNECT_DB, CLOSE_DB } from './config/mongodb.js'
import exitHook from 'async-exit-hook'
import { env } from './config/environment.js'
import { APIs_V1 }  from './routes/v1/index.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'
import cors from 'cors'
import { corsOptions } from './config/cors.js'
const START_SERVER = () => {
  const app = express()
  //handle  cors
  app.use(cors(corsOptions))
  app.use(express.json())

  app.use('/v1', APIs_V1)

  //Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware) 
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello , I am running at ${env.APP_HOST}:${env.APP_PORT}/`)
  })
  exitHook(() => {
    CLOSE_DB()
  })
}

CONNECT_DB()
  .then(() => console.log('Connect To MongoDb'))
  .then(() => START_SERVER())
  .catch(error => {
    console.error(error)
    process.exit(0)
  })
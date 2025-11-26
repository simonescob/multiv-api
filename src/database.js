import mongoose from 'mongoose'
import { config } from './config'

// Validate required environment variables
if (!config.dbUser || !config.dbPassword || !config.dbHost || !config.dbName) {
  throw new Error('Missing required database environment variables. Please check DB_USER, DB_PASSWORD, DB_HOST, and DB_NAME.')
}

const USER = encodeURIComponent(config.dbUser)
const PASSWORD = encodeURIComponent(config.dbPassword)
const DB_NAME = config.dbName

// Check if using MongoDB Atlas (cloud) or local MongoDB
const isCloudMongoDB = config.dbHost.includes('mongodb+srv')

// Construct appropriate connection string
const MONGO_URI = isCloudMongoDB 
  ? `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`
  : `mongodb://${USER}:${PASSWORD}@${config.dbHost}:27017/${DB_NAME}`

;(async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const db = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })

    console.log('Database is connected to:', db.connection.name)
  } catch (err) {
    // Mejor enterarse que no se pudo conectar y disparar un error
    throw err
  }
})()

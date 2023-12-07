import dotenv from 'dotenv'
import path from 'path'

const envPath = path.resolve(process.cwd(), '.env')
dotenv.config({ path: envPath })
console.log(`Loading environment variables from: ${envPath}`)

export const config = {
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
  mongoDB: {
    host: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    dbName: process.env.MONGODB_DB_NAME,
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
  },

  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: 31557600, // 1 year
  },

  logLevel: process.env.LOG_LEVEL ?? 'info',
}

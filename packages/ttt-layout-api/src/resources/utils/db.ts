import mongoose, { ConnectOptions } from 'mongoose'

import { config, termcolors } from '../../constants'
const connect = (): Promise<typeof mongoose> => {
  // const dbUrl = `mongodb+srv://${config.mongoDB.host}:${config.mongoDB.port}`

  const dbUrl = `mongodb+srv://${config.mongoDB.user}:${
    config.mongoDB.password
  }@trestlemongodb.p0zygcb.mongodb.net/?authMechanism=SCRAM-SHA-1`;
  return mongoose
    .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, dbName: config.mongoDB.dbName } as ConnectOptions)
    .then(() => {
      console.log(termcolors.fgGreen + 'Connected to database' + termcolors.reset)
      return mongoose
    })
    .catch((err) => {
      console.error("Couldn't connect to database. " + err)
      process.exit(1)
    })
}
mongoose.set('strictQuery', false)

export default connect

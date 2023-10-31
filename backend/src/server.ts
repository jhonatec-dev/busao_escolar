import { configDotenv } from 'dotenv'
import express, { type Application } from 'express'
import mongoose from 'mongoose'
import router from './routes/index.routes'

configDotenv()

const password = process.env.MONGO_PASSWORD
const user = process.env.MONGO_USER
const collection = process.env.MONGO_COLLECTION
const uri = encodeURI(
  `mongodb+srv://${user}:${password}@cluster0.y63pkr8.mongodb.net/${collection}?retryWrites=true&w=majority`
)

const app: Application = express()

async function startServer (): Promise<void> {
  try {
    await mongoose.connect(uri, {
      dbName: collection
    })

    app.use(express.json())
    app.use(router)

    const port = process.env.PORT

    app.get('/', (_req, res) => {
      res.send('Hello World!')
    })

    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

startServer().catch((error) => {
  console.log(error)
})

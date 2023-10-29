import express, { Application } from "express";
import mongoose from "mongoose";
import router from "./routes/index.routes";

require("dotenv").config();

const password = process.env.MONGO_PASSWORD || "";
const user = process.env.MONGO_USER || "";
const collection = process.env.MONGO_COLLECTION || "";
const passwordEncoded = encodeURIComponent(password);
const uri = `mongodb+srv://${user}:${passwordEncoded}@cluster0.y63pkr8.mongodb.net/${collection}?retryWrites=true&w=majority`;

console.log(uri)

const app: Application = express();

async function startServer() {
  try {
    await mongoose.connect(uri, {
      dbName: collection,
    });

    app.use(express.json());
    app.use(router);

    const port = process.env.PORT || 3001;

    app.get("/", (_req, res) => {
      res.send("Hello World!");
    })

    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();

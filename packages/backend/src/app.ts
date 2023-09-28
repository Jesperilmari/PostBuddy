/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import express from "express"
require("express-async-errors")
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"
import notFound from "./api/middleware/notFound"
import errorHandler from "./api/middleware/errorHandler"
import { restApi } from "./api"

const app = express()

app.use(helmet())
app.use(cors())

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"))
}

app.use(express.json())

app.get("/", (_req, res) => {
  res.send("Hello World!")
})

// Rest api
app.use("/api/v1", restApi)

// TODO: add graphql api router here

app.use(notFound, errorHandler)

export default app

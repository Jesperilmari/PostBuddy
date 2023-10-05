/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import express from "express"
require("express-async-errors")
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"
import notFound from "./api/middleware/notFound"
import errorHandler from "./api/middleware/errorHandler"
import { restApi, createGqlServer } from "./api"

const app = express()

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
)
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

// eslint-disable-next-line
;(async () => {
  const graphqlMiddleware = await createGqlServer()
  app.use("/graphql", graphqlMiddleware)
  app.use(notFound, errorHandler)
})()

export default app

import { Router } from "express"
import oauthRouter from "./routers/oauthRouter"
import fileUploadRouter from "./routers/fileUploadRouter"
import createGqlServer from "./apolloServer"

const restApi = Router()

restApi.get("/", (_req, res) => {
  res.send("Hello World!")
})

restApi.use("/oauth", oauthRouter)

restApi.use("/upload", fileUploadRouter)

export { restApi, createGqlServer }

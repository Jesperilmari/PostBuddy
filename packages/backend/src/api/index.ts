import { Router } from "express"
import oauthRouter from "./routers/oauthRouter"

const restApi = Router()

restApi.get("/", (_req, res) => {
  res.send("Hello World!")
})

restApi.use("/oauth", oauthRouter)

// Later will have more exports
// eslint-disable-next-line import/prefer-default-export
export { restApi }

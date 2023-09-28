import app from "./app"
import config from "./config"
import { connectDb } from "./util/db"
import { info } from "./util/logger"
;(async () => {
  await connectDb()
  app.listen(config.port, () => {
    info(`Server listening on port http://localhost:${config.port}`)
  })
})()

import { doStartUpPostRescheduling } from "./api/controllers/postScheduler"
import app from "./app"
import config from "./config"
import connectDb from "./util/db"
import { info } from "./util/logger"

async function main() {
  await connectDb()
  await doStartUpPostRescheduling()
  app.listen(config.port, () => {
    info(`Server listening on port http://localhost:${config.port}`)
    info(`Graphql sandbox: http://localhost:${config.port}/graphql`)
  })
}

main()

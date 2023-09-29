import { ApolloServer } from "@apollo/server"
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default"
import { expressMiddleware } from "@apollo/server/express4"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { Express } from "express"
import resolvers from "./resolvers"
import typeDefs from "./schemas"
import { info } from "../util/logger"
import PBContext from "./interfaces/PBContext"

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

/**
 * Creates an ApolloServer instance and mounts it on the Express app on the given path.
 */
export default async function useGraphql(path: string, app: Express) {
  const server = new ApolloServer<PBContext>({
    schema,
    introspection: true,
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault({
            embed: true as false,
          })
        : ApolloServerPluginLandingPageLocalDefault(),
    ],
    includeStacktraceInErrorResponses: false,
  })
  await server.start()
  info("Apollo graphql server started")
  const middleware = expressMiddleware(server, {
    context: async () => {
      const ctx = {} as PBContext
      return ctx
    },
  })
  app.use(path, middleware)
}

import { ApolloServer } from "@apollo/server"
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default"
import { expressMiddleware } from "@apollo/server/express4"
import { makeExecutableSchema } from "@graphql-tools/schema"
import resolvers from "./resolvers"
import typeDefs from "./schemas"
import { info } from "../util/logger"
import { BaseContext } from "./interfaces/PBContext"
import authDirectiveTransformer from "../util/directives"

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const schema = authDirectiveTransformer(executableSchema, "auth")

/**
 * Creates an ApolloServer instance and mounts it on the Express app on the given path.
 */
export default async function createGqlServer() {
  const server = new ApolloServer<BaseContext>({
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
  return expressMiddleware(server, {
    context: async ({ req }) => ({ req }),
  })
}

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
import PBContext from "./interfaces/PBContext"

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const landingPage =
  process.env.NODE_ENV === "production"
    ? ApolloServerPluginLandingPageProductionDefault({ embed: true as false })
    : ApolloServerPluginLandingPageLocalDefault()

export default async function createServerMiddleware() {
  const server = new ApolloServer<PBContext>({
    schema,
    introspection: true,
    plugins: [landingPage],
    includeStacktraceInErrorResponses: false,
  })
  await server.start()
  info("Apollo server started")
  return expressMiddleware(server, {
    // eslint-disable-next-line no-unused-vars
    context: async ({ req }) => {
      const ctx = {} as PBContext
      return ctx
    },
  })
}

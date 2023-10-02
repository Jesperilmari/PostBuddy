import { GraphQLError } from "graphql"

export function raise<T extends Error>(err: T) {
  throw err
}

export function raiseAuthError(msg?: string): () => never | never {
  if (!msg) {
    throw new GraphQLError("Not authenticated")
  }
  return () => {
    throw new GraphQLError(msg)
  }
}

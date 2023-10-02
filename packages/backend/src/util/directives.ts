import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils"
import { GraphQLSchema, defaultFieldResolver } from "graphql"
import { BaseContext, PBContext } from "../api/interfaces/PBContext"
import authenticate from "./authenticate"
import { raiseAuthError } from "./errors"
import TokenPayload from "../api/interfaces/TokenPayload"

export default function authDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName: string,
) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(
        schema,
        fieldConfig,
        directiveName,
      )?.[0]
      if (authDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig
        fieldConfig.resolve = async (
          source,
          args,
          context: BaseContext,
          info,
        ) => {
          const tokenPayload = authenticate(context.req).unwrapOrElse(
            raiseAuthError,
          ) as TokenPayload
          const pbContext: PBContext = {
            ...context,
            userId: tokenPayload.id,
          }
          return resolve(source, args, pbContext, info)
        }
      }
      return fieldConfig
    },
  })
}

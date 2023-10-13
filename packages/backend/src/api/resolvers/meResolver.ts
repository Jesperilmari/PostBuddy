import { GraphQLError } from "graphql"
import { PBContext } from "../interfaces/PBContext"
import { User } from "../interfaces/User"
import { raise } from "../../util/errors"
import PlatformModel from "../models/PlatformModel"
import UserModel from "../models/UserModel"
import { info } from "../../util/logger"

export default {
  Query: {
    me: async (_: User, __: {}, ctx: PBContext) => {
      const user = await UserModel.findById(ctx.userId)
      return user ?? raise(new GraphQLError("User not found"))
    },
    connections: async (_: unknown, __: {}, ctx: PBContext) =>
      PlatformModel.find({ user: ctx.userId }),
  },
  Mutation: {
    deleteConnection: async (
      _: unknown,
      { name }: { name: string },
      ctx: PBContext,
    ) => {
      const deleted = await PlatformModel.findOneAndDelete({
        user: ctx.userId,
        name,
      })
      info(deleted)
      if (!deleted) {
        return {
          ok: false,
          message: "Connection not found",
        }
      }
      return {
        ok: true,
        message: "Connection removed",
      }
    },
  },
}

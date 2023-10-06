import { GraphQLError } from "graphql"
import { PBContext } from "../interfaces/PBContext"
import { User } from "../interfaces/User"
import { raise } from "../../util/errors"
import PlatformModel from "../models/PlatformModel"
import UserModel from "../models/UserModel"

export default {
  Query: {
    me: async (_: User, __: {}, ctx: PBContext) => {
      const user = await UserModel.findById(ctx.userId)
      return user ?? raise(new GraphQLError("User not found"))
    },
    connections: async (_: unknown, __: {}, ctx: PBContext) =>
      PlatformModel.find({ user: ctx.userId }),
  },
}

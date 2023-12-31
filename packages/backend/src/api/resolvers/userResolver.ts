import { Maybe } from "true-myth"
import { GraphQLError } from "graphql"
import { PBContext } from "../interfaces/PBContext"
import UserModel from "../models/UserModel"
import { UserInput, LoginArgs, User } from "../interfaces/User"
import { raise, raiseAuthError } from "../../util/errors"
import { generateToken } from "../../util/token"

export default {
  Query: {
    users: async () => UserModel.find(),
    user: async (_p: User, { id }: { id: string }) => UserModel.findById(id),
    userByUsername: async (_p: undefined, args: { username: string }) => {
      const user = await UserModel.findOne({ username: args.username })
      if (!user) {
        throw new GraphQLError("User not found")
      }
      return user
    },
  },
  Mutation: {
    updateUser: async (
      _p: User,
      { user }: { user: UserInput },
      ctx: PBContext,
    ) => {
      const u = await UserModel.findByIdAndUpdate(ctx.userId, user, {
        new: true,
      })
      return u
    },
    deleteUser: async (_: User, __: {}, ctx: PBContext) =>
      UserModel.findByIdAndDelete(ctx.userId),
    login: async (_: User, args: LoginArgs) => {
      const result: Maybe<User> = await UserModel.login(args)
      const user = result.unwrapOrElse(raiseAuthError("Login failed"))

      return {
        token: generateToken({ id: user._id }),
        user,
      }
    },
    register: async (_: User, { user }: { user: User }) => {
      const result = await UserModel.register(user)
      const created = result.unwrapOrElse(raise) as User
      const token = generateToken({ id: created._id })
      return {
        token,
        user: created,
      }
    },
    updatePassword: async (
      _: User,
      {
        newPassword,
        oldPassword,
      }: { newPassword: string; oldPassword: string },
      ctx: PBContext,
    ) => {
      const user = await UserModel.findById(ctx.userId)
      if (!user) {
        return raiseAuthError("User not found")
      }

      const res = await user.changePassword(oldPassword, newPassword)

      return res.unwrapOrElse(raise)
    },
  },
}

import { Maybe } from "true-myth"
import { PBContext } from "../interfaces/PBContext"
import UserModel from "../models/UserModel"
import { UserInput, LoginArgs, User } from "../interfaces/User"
import { raise, raiseAuthError } from "../../util/errors"
import { generateToken } from "../../util/token"

export default {
  Query: {
    users: async () => UserModel.find(),
    user: async (_p: User, { id }: { id: string }) => UserModel.findById(id),
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
  },
}

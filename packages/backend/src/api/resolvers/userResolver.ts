import { Maybe } from "true-myth"
import PBContext from "../interfaces/PBContext"
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
    updateUser: async (_p: User, args: UserInput, ctx: PBContext) => {
      const id = ctx.userId.unwrapOrElse(raiseAuthError)
      return UserModel.findByIdAndUpdate(id, args, { new: true })
    },
    deleteUser: async (_: User, __: {}, ctx: PBContext) => {
      const id = ctx.userId.unwrapOrElse(raiseAuthError)
      return UserModel.findByIdAndDelete(id)
    },
    login: async (_: User, args: LoginArgs) => {
      const result: Maybe<User> = await UserModel.login(args)
      const user = result.unwrapOrElse(raiseAuthError("Login failed"))
      return {
        token: generateToken({ id: user._id }),
        user,
      }
    },
    register: async (_: User, { user }: { user: UserInput }) => {
      const result = await UserModel.register(user)
      const created = result.unwrapOrElse(raise) as User
      return {
        token: generateToken({ id: created._id }),
        user,
      }
    },
  },
}

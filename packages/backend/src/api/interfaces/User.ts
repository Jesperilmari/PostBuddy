import { Document } from "mongoose"

export interface User extends Document {
  username: string
  name: string
  email: string
  password: string
  // createdAt: Date;
  // updatedAt: Date;
}

export type UserInput = Partial<Omit<User, "id" | "_id">>

export interface LoginArgs {
  usernameOrEmail: string
  password: string
}

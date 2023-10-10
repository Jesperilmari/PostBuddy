import { Document, Types } from "mongoose"
import { User } from "./User"

export interface Platform extends Document {
  name: string
  token: string
  refresh_token?: string
  secret?: string
  user: User | Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

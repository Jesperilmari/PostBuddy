import { Document, Types } from "mongoose"
import { User } from "./User"
import { PlatformName } from "../controllers/oauth/platforms"

export interface Platform extends Document {
  name: PlatformName
  token: string
  refresh_token: string
  user: User | Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

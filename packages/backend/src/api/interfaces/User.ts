import { Document } from "mongoose"

export interface User extends Document {
  username: string
  name: string
  email: string
  password: string
  // createdAt: Date;
  // updatedAt: Date;
}

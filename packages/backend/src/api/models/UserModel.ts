import { model, Schema } from "mongoose"
import { User } from "../interfaces/User"

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
})

userSchema.set("toJSON", {
  transform(_doc, ret, _opt) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    delete ret.password
  },
})

const UserModel = model<User>("User", userSchema)

export default UserModel

import { model, Schema } from "mongoose"
import { Platform } from "../interfaces/Platform"

const platformSchema = new Schema<Platform>(
  {
    name: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

platformSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    delete ret.refresh_token
    delete ret.token
  },
})

const PlatformModel = model<Platform>("Platform", platformSchema)

export default PlatformModel

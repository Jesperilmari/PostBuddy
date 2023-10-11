import { model, Schema } from "mongoose"
import Post from "../interfaces/Post"
import {
  implementedPlatforms,
  PlatformName,
} from "../controllers/oauth/platforms"

const PostSchema = new Schema<Post>({
  title: {
    type: String,
    required: false,
    minlength: 1,
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
  },
  platforms: {
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) =>
        v.length > 0 &&
        v.every((p) => implementedPlatforms.includes(p as PlatformName)),
      message: (props) => `${props.value} is not a valid platform`,
    },
  },
  media: {
    type: String,
  },
  mediaType: {
    type: String,
  },
  dispatchTime: {
    type: Date,
    required: true,
  },
  postOwner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

export default model<Post>("Post", PostSchema)

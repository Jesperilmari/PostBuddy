import { model, Schema } from "mongoose"
import Post from "../interfaces/Post"

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
  },
  media: {
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
// TODO validate platforms

export default model<Post>("Post", PostSchema)

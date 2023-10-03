import { model, Schema } from "mongoose"
import Post from "../interfaces/Post"

const postSchema = new Schema<Post>({
  title: {
    type: String,
    required: false,
    minlength: 3,
  },
  description: {
    type: String,
    required: false,
    minlength: 1,
  },
  // TODO validate platforms
  platforms: {
    type: [String],
    required: true,
    minlength: 1,
  },
  media: {
    type: String,
    minlength: 1,
  },
  dispatchTime: {
    type: Date,
    required: true,
    validate: {
      validator: (val: Date) => val.getTime() >= Date.now(),
      message: (props: { value: string }) =>
        `${props.value} the date selected is in the past`,
    },
  },
})

export default model<Post>("Post", postSchema)

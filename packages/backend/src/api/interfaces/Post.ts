import { Document } from "mongoose"

export default interface Post extends Document {
  id: string
  title: string
  description: string
  platforms: string[]
  media: string
  dispatchTime: Date
}

// export { Post }

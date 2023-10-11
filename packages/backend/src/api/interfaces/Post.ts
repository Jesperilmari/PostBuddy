import { Document, Types } from "mongoose"
import { PlatformName } from "../controllers/oauth/platforms"

export default interface Post extends Document {
  id: string
  title?: string
  description: string
  platforms: PlatformName[]
  media?: string
  mediaType?: "image" | "video"
  dispatchTime: Date
  postOwner: Types.ObjectId
}

// export { Post }

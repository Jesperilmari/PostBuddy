import { Document } from "mongoose"
import { PlatformName } from "../controllers/oauth/platforms"

export default interface Post extends Document {
  id: string
  title?: string
  description: string
  platforms: PlatformName[]
  media?: string
  dispatchTime: Date
  postOwner: string
}

// export { Post }

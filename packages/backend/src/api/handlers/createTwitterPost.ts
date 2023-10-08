import { info } from "../../util/logger"
import Post from "../interfaces/Post"

export default async function createTwitterPost(post: Post) {
  info("Creating twitter post", post)
  throw new Error("Twitter not implemented")
}

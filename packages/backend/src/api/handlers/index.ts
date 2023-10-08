import Post from "../interfaces/Post"
import createTwitterPost from "./createTwitterPost"

export default async function handlePostCreationFor(post: Post) {
  const { platforms: p } = post

  const promises = p.map((platform) => createPostForPlatform(platform, post))

  await Promise.all(promises)
}

async function createPostForPlatform(platform: string, post: Post) {
  switch (platform) {
    case "twitter":
      return createTwitterPost(post)
    default:
      throw new Error(`Platform not supported: ${platform}`)
  }
}

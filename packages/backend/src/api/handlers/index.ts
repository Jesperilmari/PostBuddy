import { Result } from "true-myth"
import Post from "../interfaces/Post"
import createTwitterPost from "./createTwitterPost"

export const defaultMethods = {
  createTwitterPost,
} as const

export type PlatformMethods = typeof defaultMethods

export class PostCreator {
  private readonly methods: PlatformMethods

  constructor(methods: PlatformMethods = defaultMethods) {
    this.methods = methods
  }

  async handlePostCreationFor(
    post: Post,
  ): Promise<Result<undefined, string[]>> {
    const { platforms: p } = post
    if (p.length === 0) {
      return Result.err(["No platforms selected"])
    }

    try {
      const promises = p.map((platform) => this.createPost(platform, post))
      const results = await Promise.all(promises)

      const errors: string[] = []
      results.forEach((r) => r.isErr && errors.push(r.error))

      if (errors.length > 0) {
        return Result.err(errors)
      }
    } catch (e) {
      const err = e as Error
      return Result.err([err.message])
    }

    return Result.ok(undefined)
  }

  private async createPost(
    platform: string,
    post: Post,
  ): Promise<Result<undefined, string>> {
    try {
      switch (platform) {
        case "twitter":
          return this.methods.createTwitterPost(post)
        default:
          return Result.err("Platform not supported")
      }
    } catch (error) {
      return Result.err((error as Error).message)
    }
  }
}

const postCreator = new PostCreator()

export const handlePostCreationFor = async (post: Post) =>
  postCreator.handlePostCreationFor(post)

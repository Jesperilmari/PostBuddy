import { PBContext } from "../interfaces/PBContext"
import PostModel from "../models/PostModel"
import Post from "../interfaces/Post"

export default {
  Query: {},
  Mutation: {
    createPost: async (
      _: Post,
      args: { post: Omit<Post, "id" | "_id" | "postOwner"> },
      ctx: PBContext,
    ) => {
      // eslint-disable-next-line no-console
      console.log(args)
      // eslint-disable-next-line no-console
      console.log(ctx)
      const createPost = await PostModel.create({
        ...args.post,
        postOwner: ctx.userId,
      })
      // eslint-disable-next-line no-console
      console.log(`createPost: ${createPost}`)
      return createPost
    },
  },
}

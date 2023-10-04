import { PBContext } from "../interfaces/PBContext"
import PostsModel from "../models/PostsModel"
import Post from "../interfaces/Post"

export default {
  Query: {},
  Mutation: {
    createPost: async (
      _: Post,
      args: { post: Omit<Post, "id" | "_id" | "postOwner"> },
      ctx: PBContext,
    ) => {
      const createPost = await PostsModel.create({
        ...args.post,
        postOwner: ctx.userId,
      })
      return createPost
    },
    editPost: async (
      _: Post,
      args: {
        id: Pick<Post, "id">
        post: Omit<Post, "id" | "_id" | "postOwner">
      },
      _cxt: PBContext,
    ) => {
      const editPost = await PostsModel.findByIdAndUpdate(args.id, args.post)
      return editPost
    },
  },
}

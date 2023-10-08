/* eslint-disable no-console */
import { PBContext } from "../interfaces/PBContext"
import PostsModel from "../models/PostsModel"
import Post from "../interfaces/Post"

export default {
  Query: {
    postsByFilter: async (
      _: Post,
      args: { postTitle: String; platformName: String },
      ctx: PBContext,
    ) => {
      const query: Record<string, unknown> = {
        postOwner: ctx.userId,
      }

      if (args.postTitle) {
        query.title = { $in: args.postTitle }
      }

      if (args.platformName) {
        query.platforms = { $in: [args.platformName] }
      }

      return PostsModel.find(query)
    },
  },
  Mutation: {
    createPost: async (
      _: Post,
      args: { post: Omit<Post, "id" | "_id" | "postOwner"> },
      ctx: PBContext,
    ) => {
      console.log(args)
      const createPost = await PostsModel.create({
        ...args.post,
        postOwner: ctx.userId,
      })
      console.log(createPost)
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
      const editPost = await PostsModel.findByIdAndUpdate(args.id, args.post, {
        new: true,
      })
      return editPost
    },
    deletePost: async (
      _: Post,
      args: { id: [Pick<Post, "id" | "_id">] },
      _ctx: PBContext,
    ) => {
      const deletePost = await PostsModel.find({
        _id: { $in: args.id },
      }).deleteMany({})
      console.log(args.id)
      console.log(`deletePost`, deletePost)
      return deletePost
    },
  },
}

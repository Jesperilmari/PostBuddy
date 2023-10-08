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
      ctx: PBContext,
    ) => {
      const editPost = await PostsModel.findOneAndUpdate(
        { _id: args.id, postOwner: ctx.userId },
        args.post,
        {
          new: true,
        },
      )
      return editPost
    },
    deletePost: async (
      _: Post,
      args: { id: [Pick<Post, "id" | "_id">] },
      ctx: PBContext,
    ) => {
      const { deletedCount } = await PostsModel.find({
        _id: { $in: args.id },
      }).deleteMany({ postOwner: ctx.userId })
      return {
        message: `Deleted ${deletedCount} posts`,
      }
    },
  },
}

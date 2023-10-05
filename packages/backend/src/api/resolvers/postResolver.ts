/* eslint-disable no-console */
import { PBContext } from "../interfaces/PBContext"
import PostsModel from "../models/PostsModel"
import Post from "../interfaces/Post"

export default {
  Query: {
    // TODO find a more efficient way to filter posts
    postsByFilter: async (
      _: Post,
      args: { postTitle: String; platformName: String },
      ctx: PBContext,
    ) => {
      let filteredPosts
      if (args.postTitle === undefined && args.platformName === undefined) {
        filteredPosts = await PostsModel.find({
          postOwner: { $in: ctx.userId },
        })
      }
      if (args.postTitle !== undefined && args.platformName === undefined) {
        filteredPosts = await PostsModel.find({
          postOwner: { $in: ctx.userId },
          title: { $in: args.postTitle },
        })
      }
      if (args.postTitle !== undefined && args.platformName !== undefined) {
        filteredPosts = await PostsModel.find({
          postOwner: { $in: ctx.userId },
          title: { $in: args.postTitle },
          platforms: { $in: [args.platformName] },
        })
      }
      console.log(
        "postTitle:",
        args.postTitle,
        "platformName:",
        args.platformName,
      )
      console.log(filteredPosts)
      return filteredPosts
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

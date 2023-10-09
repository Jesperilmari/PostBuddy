import connectAndClearDb from "./util/connectAndClearDb"
import UserTestUtils from "./util/userFunctions"
import PostTestUtils from "./util/postFunctions"
import gqlReq from "./util/gqlreq"
import { createPost, deletePost, editPost, postsByFilter } from "./queries"
import { User } from "../src/api/interfaces/User"
import mongoose from "mongoose"
import PostsModel from "../src/api/models/PostsModel"
import UserModel from "../src/api/models/UserModel"

function longInTheFuture() {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  return d
}

describe("postResolver", () => {
  let user: User
  let token: string
  beforeAll(async () => {
    await connectAndClearDb()
  })

  beforeEach(async () => {
    await UserModel.deleteMany({})
    await PostsModel.deleteMany({})
    user = await UserTestUtils.createUser()
    token = UserTestUtils.genToken(user._id)
    await PostTestUtils.createPost(user)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  it("should create a post", async () => {
    const res = await gqlReq(
      {
        query: createPost,
        variables: {
          post: {
            title: "title",
            description: "desc",
            platforms: ["twitter"],
            dispatchTime: longInTheFuture(),
          },
        },
      },
      token,
    )

    expect(res.body.data.createPost).toHaveProperty("title")
  })

  it("should create a post with media", async () => {
    const res = await gqlReq(
      {
        query: createPost,
        variables: {
          post: {
            title: "title",
            description: "desc",
            platforms: ["twitter"],
            dispatchTime: longInTheFuture(),
            media: "media",
          },
        },
      },
      token,
    )

    expect(res.body.data.createPost).toHaveProperty("title")
    expect(res.body.data.createPost).toHaveProperty("media")
    expect(res.body.data.createPost.media).toBe("media")
  })

  it("should delete a post", async () => {
    const created = await PostTestUtils.createPost(user, "title", "desc", [
      "twitter",
    ])
    const res = await gqlReq(
      {
        query: deletePost,
        variables: {
          deletePostId: [created._id],
        },
      },
      token,
    )

    expect(res.body.data.deletePost).toBeDefined()
    expect(res.body.data.deletePost.message).toBe("Deleted 1 posts")
    const deleted = await PostsModel.findById(created._id)
    expect(deleted).toBeNull()
  })

  it("should edit a post", async () => {
    const created = await PostTestUtils.createPost(user, "title", "desc", [
      "twitter",
    ])
    const res = await gqlReq(
      {
        query: editPost,
        variables: {
          editPostId: created._id,
          post: {
            title: "new title",
            description: "new desc",
            platforms: ["twitter"],
            dispatchTime: longInTheFuture(),
          },
        },
      },
      token,
    )
    expect(res.body.data.editPost).toBeDefined()
    expect(res.body.data.editPost.title).toBe("new title")
    const edited = await PostsModel.findById(created._id)
    expect(edited).toBeDefined()
    expect(edited?.title).toBe("new title")
  })

  it("should get all posts for user", async () => {
    const res = await gqlReq(
      {
        query: postsByFilter,
      },
      token,
    )
    const { postsByFilter: posts } = res.body.data

    expect(posts).toBeDefined()
    expect(posts.length).toBeGreaterThanOrEqual(1)
  })

  it("should get posts by title", async () => {
    await PostTestUtils.createPost(user, "othertitle", "desc", ["twitter"])
    await PostTestUtils.createPost(user, "title", "desc", ["twitter"])
    const res = await gqlReq(
      {
        query: postsByFilter,
        variables: {
          postTitle: "othertitle",
        },
      },
      token,
    )
    expect(res.body.data.postsByFilter).toBeDefined()
    expect(res.body.data.postsByFilter.length).toBe(1)
  })

  it("should get posts by platformName", async () => {
    await PostTestUtils.createPost(user, "title", "desc", ["twitter"])
    const res = await gqlReq(
      {
        query: postsByFilter,
        variables: {
          platformName: "random",
        },
      },
      token,
    )

    expect(res.body.data.postsByFilter.length).toBe(0)
  })
  it("it should not delete a someone elses post", async () => {
    const otherUser = await UserTestUtils.createUser(
      "other",
      "other",
      "other@mail.com",
    )
    const otherPost = await PostTestUtils.createPost(
      otherUser,
      "othertitle",
      "desc",
      ["twitter"],
    )
    const res = await gqlReq(
      {
        query: deletePost,
        variables: {
          deletePostId: [otherPost._id],
        },
      },
      token,
    )
    expect(res.body.data.deletePost.message).toBe("Deleted 0 posts")
  })

  it("should not modify someone elses post", async () => {
    const otherUser = await UserTestUtils.createUser(
      "other",
      "other",
      "other@mail.com",
    )
    const otherPost = await PostTestUtils.createPost(
      otherUser,
      "othertitle",
      "desc",
      ["twitter"],
    )
    const res = await gqlReq(
      {
        query: editPost,
        variables: {
          editPostId: otherPost._id,
          post: {
            title: "asdf",
          },
        },
      },
      token,
    )

    expect(res.body.data.editPost).toBeNull()
  })
})

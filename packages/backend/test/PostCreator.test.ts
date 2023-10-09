import { PlatformMethods, PostCreator } from "../src/api/handlers"
import UserTestUtils from "./util/userFunctions"
import PostTestUtils from "./util/postFunctions"
import connectAndClearDb from "./util/connectAndClearDb"
import { User } from "../src/api/interfaces/User"
import Post from "../src/api/interfaces/Post"

describe("PostCreator", () => {
  let post: Post
  let mockTwitterPost = jest.fn()

  let mockPlatformMethods: PlatformMethods = {
    createTwitterPost: mockTwitterPost,
  }
  const postCreator = new PostCreator(mockPlatformMethods)
  let user: User
  beforeAll(async () => {
    await connectAndClearDb()
    user = await UserTestUtils.createUser()
    post = await PostTestUtils.createPost(user)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should throw error for empty platforms", async () => {
    post.platforms = []
    const res = await postCreator.handlePostCreationFor(post)
    const errors = (res.isErr && res.error) as string[]
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0]).toBe("No platforms selected")
  })
  it("should create twitter post", async () => {
    const res = await postCreator.handlePostCreationFor(post)
    expect(res.isOk).toBe(true)
  })
  it("should not create post if no user is present", async () => {
    // @ts-ignore
    post.postOwner = null
    const res = await postCreator.handlePostCreationFor(post)
    const errors = (res.isErr && res.error) as string[]
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0]).toBe("No twitter token found")
  })
  it("should throw error for not recognized platform", async () => {
    // @ts-ignore
    post.platforms = ["not a platform"]
    const res = await postCreator.handlePostCreationFor(post)
    const errors = (res.isErr && res.error) as string[]
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0]).toBe("Platform not supported")
  })
})

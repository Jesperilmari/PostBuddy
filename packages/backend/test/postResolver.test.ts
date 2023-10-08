import connectAndClearDb from "./util/connectAndClearDb"
import UserTestUtils from "./util/userFunctions"
import Post from "../src/api/interfaces/Post"
import PostTestUtils from "./util/postFunctions"
import gqlReq from "./util/gqlreq"
import { createPost } from "./queries"
import { User } from "../src/api/interfaces/User"

describe("postResolver", () => {
  let user: User
  let token: string
  let post: Post
  beforeAll(async () => {
    await connectAndClearDb()
    user = await UserTestUtils.createUser()
    token = UserTestUtils.genToken(user._id)
    post = await PostTestUtils.createPost(user)
    console.log(user, token, post)
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
            dispatchTime: new Date(),
          },
        },
      },
      token,
    )
    console.log(res)

    expect(res.body.data.createPost).toHaveProperty("title")
  })
})

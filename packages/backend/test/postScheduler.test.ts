import { schedulePost } from "../src/api/controllers/postScheduler"
import { User } from "../src/api/interfaces/User"
import connectAndClearDb from "./util/connectAndClearDb"
import PostTestUtils from "./util/postFunctions"
import UserTestUtils from "./util/userFunctions"

describe("PostScheduler", () => {
  let user: User
  beforeAll(async () => {
    await connectAndClearDb()
    user = await UserTestUtils.createUser()
  })
  it("should schedule a post that is more than 5 min in the future", async () => {
    const post = await PostTestUtils.createPost(
      user,
      "title",
      "desc",
      ["twitter"],
      new Date(Date.now() + 1000 * 60 * 6),
    )
    const result = schedulePost(post)
    expect(result.isOk).toBe(true)
  })
})

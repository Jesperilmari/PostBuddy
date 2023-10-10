import { CronJob } from "cron"
import {
  schedulePost,
  doStartUpPostRescheduling,
  getScheduledPosts,
  removeScheduledPost,
  updateScheduledPost,
} from "../src/api/controllers/postScheduler"
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

  beforeEach(() => {
    const jobs = getScheduledPosts()
    jobs.clear()
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

  it("should reshedule posts on startup", async () => {
    const created = await PostTestUtils.createPost(user)
    await doStartUpPostRescheduling()
    const jobs = getScheduledPosts()
    expect(jobs.size).toBeGreaterThanOrEqual(1)
    const job = jobs.get(created.id) as CronJob
    expect(job).toBeDefined()
  })

  it("should remove a scheduled post", async () => {
    const created = await PostTestUtils.createPost(user)
    const result = schedulePost(created)
    expect(result.isOk).toBe(true)
    const ok = removeScheduledPost(created)
    expect(ok).toBe(true)
  })

  it("should update a scheduled post", async () => {
    const created = await PostTestUtils.createPost(user)
    const result = schedulePost(created)
    expect(result.isOk).toBe(true)
    const cp = created.$clone()
    cp.description = "new description"
    const ok = updateScheduledPost(cp)
    expect(ok).toBe(true)
  })
})

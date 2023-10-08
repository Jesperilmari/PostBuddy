import { CronJob } from "cron"
import { Result } from "true-myth"
import Post from "../interfaces/Post"
import PostsModel from "../models/PostsModel"
import { error, info } from "../../util/logger"
import handlePostCreationFor from "../handlers"

const jobs = new Map<string, CronJob>()

export function schedulePost(post: Post): Result<undefined, Error> {
  const pObj = post.toObject()
  const { id, dispatchTime } = pObj
  try {
    const job = new CronJob(
      dispatchTime,
      async () => handlePostCreationFor(pObj),
      null,
      true,
    )
    jobs.set(id, job)
    info(`New post scheduled at ${dispatchTime}`)
    return Result.ok(undefined)
  } catch (e) {
    error(`Error while scheduling post ${id}: ${e}`)
    return Result.err(e as Error)
  }
}

export async function doStartUpPostRescheduling() {
  info("Rescheduling posts after startup")
  const posts = await PostsModel.find({ date: { $gt: new Date() } })

  const promises = posts.map(schedulePost)

  const results = await Promise.all(promises)
  const errors = results.filter((r) => r.isErr)
  const len = errors.length > 0 ? posts.length - errors.length : posts.length

  if (!errors) {
    info(`Rescheduling done for ${len} posts`)
  } else {
    error(`Rescheduling done for ${len} posts, some errors occurred`)
  }
}

export function getScheduledPosts() {
  return jobs.values()
}

export function removeScheduledPost(postId: string): boolean {
  const job = jobs.get(postId)
  if (job) {
    job.stop()
    jobs.delete(postId)
    return true
  }
  return false
}

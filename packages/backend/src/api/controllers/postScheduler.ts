import { CronJob } from "cron"
import { Result } from "true-myth"
import Post from "../interfaces/Post"
import PostsModel from "../models/PostsModel"
import { error, info } from "../../util/logger"
import { PostCreator } from "../handlers"

const jobs = new Map<string, CronJob>()

const postCreator = new PostCreator()

export function schedulePost(post: Post): Result<CronJob, Error> {
  const pObj = post.toObject()
  const { id, dispatchTime } = pObj
  try {
    const job = new CronJob(
      dispatchTime,
      async () => postCreator.handlePostCreationFor(pObj),
      null,
      true,
    )
    jobs.set(id, job)
    info(`New post scheduled at ${dispatchTime}`)
    return Result.ok(job)
  } catch (e) {
    error(`Error while scheduling post ${id}: ${e}`)
    return Result.err(e as Error)
  }
}

export async function doStartUpPostRescheduling() {
  info("Rescheduling posts after startup")
  const posts = await PostsModel.find({ date: { $gt: new Date() } })

  const results = posts.map(schedulePost)

  const errors = results.filter((r) => r.isErr)
  const len = errors.length > 0 ? posts.length - errors.length : posts.length

  if (!errors) {
    info(`Rescheduling done for ${len} posts`)
  } else {
    error(`Rescheduling done for ${len} posts, some errors occurred`)
  }
  return false
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

export function updateScheduledPost(newPost: Post): boolean {
  if (!removeScheduledPost(newPost._id)) {
    return false
  }
  return schedulePost(newPost).isOk
}

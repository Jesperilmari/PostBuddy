import { CronJob } from "cron"
import { Result } from "true-myth"
import Post from "../interfaces/Post"
import PostsModel from "../models/PostsModel"
import { error, info } from "../../util/logger"
import { PostCreator } from "../handlers"

const jobs = new Map<string, CronJob>()

const postCreator = new PostCreator()

// TODO somehow notify user that the post creation failed

export function schedulePost(post: Post): Result<CronJob, Error> {
  const { id, dispatchTime } = post
  const onComplete = null // Do nothing
  const start = true // This does not run the job immediately, but schedules it
  try {
    const job = new CronJob(
      dispatchTime,
      async () => {
        await postCreator.handlePostCreationFor(post)
        removeScheduledPost(post)
      },
      onComplete,
      start,
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
  const posts = await PostsModel.find({ dispatchTime: { $gt: new Date() } })

  const results = posts.map(schedulePost)

  const errors = results.filter((r) => r.isErr)
  const len = errors.length > 0 ? posts.length - errors.length : posts.length

  if (!errors) {
    info(`Rescheduling done for ${len} posts`)
    return true
  }
  error(`Rescheduling done for ${len} posts, some errors occurred`)
  return false
}

export function getScheduledPosts() {
  return jobs
}

export function removeScheduledPost(post: Post): boolean {
  const job = jobs.get(post.id)
  if (job) {
    job.stop()
    jobs.delete(post.id)
    return true
  }
  return false
}

export function updateScheduledPost(newPost: Post): boolean {
  if (!removeScheduledPost(newPost)) {
    return false
  }
  return schedulePost(newPost).isOk
}

import { Maybe, Result } from "true-myth"
import Twitter from "twitter"
import { info, error } from "../../util/logger"
import Post from "../interfaces/Post"
import PlatformModel from "../models/PlatformModel"
import { Platform } from "../interfaces/Platform"
import storageClient from "../controllers/storageClient"
import config from "../../config"

type TwitterBody = {
  status: string
  media_ids?: string
}
export default async function createTwitterPost(
  post: Post,
): Promise<Result<undefined, string>> {
  info("Creating twitter post", post)

  const initialConnection: Platform | null = await PlatformModel.findOne({
    name: "twitter",
    user: post.postOwner,
  })

  if (!initialConnection) {
    return Result.err("No twitter token found")
  }

  const client = new Twitter({
    consumer_key: config.twitter_api_key,
    consumer_secret: config.twitter_api_key_secret,
    access_token_secret: config.twitter_access_token_secret as string,
    access_token_key: config.twitter_access_token,
  })
  try {
    const status = formatText(post)
    const body: TwitterBody = {
      status,
    }
    if (post.media) {
      const mediaId = await uploadMedia(post, client)
      body.media_ids = mediaId
      await createTweet(body, client)
    }
    return Result.ok(undefined)
  } catch (err) {
    return Result.err((err as Error).message)
  }
}

async function createTweet(body: any, client: Twitter) {
  return new Promise((resolve, reject) => {
    client.post("statuses/update", body, (err, tweet, _res) => {
      if (err) {
        error("Error creating tweet", err)
        return reject(err)
      }
      info("Created tweet", tweet)
      return resolve(tweet)
    })
  })
}

function formatText(post: Post) {
  if (!post.title) {
    return post.description
  }
  return `${post.title} ${post.description}`
}

async function uploadMedia(post: Post, client: Twitter): Promise<string> {
  const buf = await getBlob(post.media as string)
  if (buf.isNothing) {
    return Promise.reject(new Error("No blob found"))
  }

  const endPoint = "media/upload" as const
  return new Promise((resolve, reject) => {
    client.post(endPoint, { media: buf.value }, (err, media, _res) => {
      if (err) {
        error("Error uploading media", err)
        return reject(err)
      }
      info("Uploaded media", media.media_id_string)
      return resolve(media.media_id_string as string)
    })
  })
}

async function getBlob(media: string): Promise<Maybe<Buffer>> {
  const blobClient = storageClient.getBlockBlobClient(media)
  const exists = await blobClient.exists()
  if (!exists) {
    return Maybe.nothing()
  }
  const buf = await blobClient.downloadToBuffer()
  return Maybe.of(buf)
}

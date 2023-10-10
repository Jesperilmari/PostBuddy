import { Maybe, Result } from "true-myth"
import qs from "qs"
import Twitter from "twitter"
import { Client } from "twitter-api-sdk"
import axios from "axios"
import { info, error } from "../../util/logger"
import Post from "../interfaces/Post"
import PlatformModel from "../models/PlatformModel"
import { Platform } from "../interfaces/Platform"
import storageClient from "../controllers/storageClient"
import config from "../../config"
import { PlatformName } from "../controllers/oauth/platforms"
import { twitterBasicToken } from "../controllers/oauth/platforms/twitter"

export default async function createTwitterPost(
  post: Post,
): Promise<Result<undefined, string>> {
  const maybeCon = await findAndRefreshToken(
    "twitter",
    post.postOwner.toString(),
  )

  if (maybeCon.isNothing) {
    return Result.err("No connection found")
  }
  const connection = maybeCon.value
  // Used for uploading the media to twitter
  const uploadClient = new Twitter({
    consumer_key: config.twitter_api_key,
    consumer_secret: config.twitter_api_key_secret,
    access_token_secret: config.twitter_access_token_secret as string,
    access_token_key: config.twitter_access_token,
  })
  // Used for posting the tweet
  const postClient = new Client(connection.token)
  return createTwitterPostImpl(post, uploadClient, postClient)
}

export async function createTwitterPostImpl(
  post: Post,
  uploadClient: Twitter,
  postClient: Client,
): Promise<Result<undefined, string>> {
  info("Creating twitter post")
  const result = await postClient.users.findMyUser()
  const twitterUserId = result.data?.id
  if (!twitterUserId) {
    return Result.err("No twitter id found")
  }

  try {
    const text = formatText(post)
    const body: Tweet = {
      text,
    }
    if (post.media) {
      const mediaId = await uploadMedia(post, twitterUserId, uploadClient)
      body.media = { media_ids: [mediaId] }
    }
    const ok = await createTweet(body, postClient)
    return ok ? Result.ok(undefined) : Result.err("Error creating tweet")
  } catch (err) {
    error("Error creating tweet", err)
    return Result.err((err as Error).message)
  } finally {
    await cleanUp(post)
  }
}

type Tweet = {
  text: string
  media?: {
    media_ids: string[]
  }
}

async function createTweet(content: Tweet, client: Client) {
  info("Creating tweet")
  const { errors } = await client.tweets.createTweet(content)
  if (errors) {
    error("Error creating tweet", errors)
    return false
  }
  info("Created tweet")
  return true
}

function formatText(post: Post) {
  if (!post.title) {
    return post.description
  }
  return `${post.title} ${post.description}`
}

async function uploadMedia(
  post: Post,
  twitterUID: string,
  client: Twitter,
): Promise<string> {
  const buf = await getBlob(post.media as string)
  console.log(buf)
  if (buf.isNothing) {
    return Promise.reject(new Error("No blob found"))
  }

  const endPoint = "media/upload" as const
  return new Promise((resolve, reject) => {
    client.post(
      endPoint,
      { media: buf.value, additional_owners: twitterUID },
      (err, media, _res) => {
        if (err) {
          error("Error uploading media", err)
          return reject(err)
        }
        info("Uploaded media", media.media_id_string)
        return resolve(media.media_id_string as string)
      },
    )
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

async function findAndRefreshToken(
  platform: PlatformName,
  userId: string,
): Promise<Maybe<Platform>> {
  const connection = await PlatformModel.findOne({
    name: platform,
    user: userId,
  })
  if (!connection) {
    return Maybe.nothing()
  }
  if (shouldRefresh(connection)) {
    const refreshed = await refresh(connection)
    return Maybe.of(refreshed)
  }
  return Maybe.just(connection)
}

function shouldRefresh(platform: Platform) {
  const TWO_HOURS = 1000 * 60 * 60 * 2
  return Date.now() - platform.updatedAt.getTime() > TWO_HOURS
}

async function refresh(platform: Platform) {
  const url = "https://api.twitter.com/2/oauth2/token"
  const data = qs.stringify({
    grant_type: "refresh_token",
    client_id: config.twitter_client_id,
    refresh_token: platform.refresh_token,
  })
  try {
    const res = await axios.post<{
      refresh_token: string
      access_token: string
    }>(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${twitterBasicToken}`,
      },
    })
    info("Refreshed token", res.data)
    const { access_token, refresh_token } = res.data
    platform.token = access_token
    platform.refresh_token = refresh_token
    return await platform.save()
  } catch (e) {
    error("Error refreshing token", e)
    return null
  }
}

async function cleanUp(post: Post) {
  if (post.media) {
    try {
      const blobClient = storageClient.getBlockBlobClient(post.media as string)
      await blobClient.deleteIfExists()
      info("Deleted post media from storage")
    } catch (e) {
      error("Error deleting blob", e)
    }
  }
}

async function uploadVideo(post: Post, twitterUID: string, client: Twitter) {
  const endPoint = "media/upload" as const
  const mediaId = () => {
    try {
      const result = client.post(endPoint, {
        command: "INIT",
        media_type: "video/mp4",
        media_category: "tweet_video",
        total_bytes: 434,
      })
    } catch (err) {
      console.log(err)
    }
  }
}

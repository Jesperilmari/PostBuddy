import { Result } from "true-myth"
import qs from "qs"
import Twitter from "twitter"
import { Client } from "twitter-api-sdk"
import axios from "axios"
import { Readable } from "stream"
import { me } from "../../../test/queries"
import { info, error } from "../../util/logger"
import Post from "../interfaces/Post"
import { Platform } from "../interfaces/Platform"
import config from "../../config"
import { twitterBasicToken } from "../controllers/oauth/platforms/twitter"
import { findAndRefreshToken } from "../../util/platformUtils"
import { getBlob, cleanUp } from "../../util/postCreationUtils"

export default async function createTwitterPost(
  post: Post,
): Promise<Result<undefined, string>> {
  const maybeCon = await findAndRefreshToken(
    "twitter",
    post.postOwner.toString(),
    refresh,
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
  info(connection)
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
  info("Found twitter user id", twitterUserId)

  try {
    const text = formatText(post)
    const body: Tweet = {
      text,
    }
    if (post.media) {
      info("Uploading media")
      const mediaId = await uploadFile(post, twitterUserId, uploadClient)
      body.media = { media_ids: [mediaId] }
    }
    const ok = await createTweet(body, postClient)
    await cleanUp(post)
    return ok ? Result.ok(undefined) : Result.err("Error creating tweet")
  } catch (err) {
    error("Error creating tweet", err)
    await cleanUp(post)
    return Result.err((err as Error).message)
  }
}

type Tweet = {
  text: string
  media?: {
    media_ids: string[]
  }
}

async function createTweet(request_body: Tweet, client: Client) {
  info("Creating tweet", request_body)
  const { errors } = await client.tweets.createTweet(request_body)
  if (errors) {
    error("Error creating tweet", errors)
    errors.forEach((e) => error(e))
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

async function uploadFile(post: Post, twitterUID: string, client: Twitter) {
  const res = await getBlob(post.media as string)
  if (res.isNothing) {
    return Promise.reject(new Error("No blob found"))
  }
  if (!post.mediaType) {
    return Promise.reject(new Error("No media type found"))
  }
  const { stream, total_bytes } = res.value
  try {
    const mediaId = await doSomeStreaming(
      stream,
      client,
      twitterUID,
      total_bytes,
      post.mediaType,
    )
    return Promise.resolve(mediaId)
  } catch (err) {
    error("Error uploading video", err)
    return Promise.reject(err)
  }
}

async function doSomeStreaming(
  stream: Readable,
  client: Twitter,
  twitterUID: string,
  total_bytes: number,
  mediaType: string,
): Promise<string> {
  let segment_index = 0
  info("Initializing upload, bytes:", total_bytes)
  const media_id = await initUpload({
    client,
    additional_owners: twitterUID,
    total_bytes,
    mediaType,
  })
  if (!media_id) {
    throw new Error("No media id found")
  }

  const uploads: Promise<void>[] = []

  return new Promise<string>((resolve, reject) => {
    stream.on("data", async (chunk) => {
      try {
        const current = Number(segment_index)
        const promise = uploadChunk(chunk, {
          media_id,
          client,
          segment_index: current,
        })
        uploads.push(promise)
        segment_index += 1
      } catch (err) {
        error(`Error uploading chunk ${segment_index}`, err)
        reject(err)
      }
    })

    stream.on("end", async () => {
      try {
        await Promise.all(uploads) // wait for all uploads to finish
        await finalizeUpload(media_id, client)
        resolve(media_id)
      } catch (err) {
        reject(err)
      }
    })

    stream.on("error", (err) => reject(err))
  })
}

const uploadEndpoint = "media/upload" as const

type InitOptions = {
  client: Twitter
  additional_owners: string
  total_bytes: number
  mediaType: string
}

type ChunkOptions = {
  media_id: string
  client: Twitter
  segment_index: number
}

async function initUpload(opts: InitOptions): Promise<string> {
  const { client, total_bytes, additional_owners, mediaType } = opts
  info("Initializing upload, mediatype: ", mediaType)
  return new Promise((resolve, reject) => {
    client.post(
      uploadEndpoint,
      {
        command: "INIT",
        media_type: mediaType, // TODO implement media type for postmodel
        additional_owners,
        total_bytes,
      },
      (err, data, _res) => {
        if (err) {
          reject(err)
        }
        resolve(data?.media_id_string as string)
      },
    )
  })
}

async function finalizeUpload(media_id: string, client: Twitter) {
  info("Finalizing upload", media_id)
  return new Promise((resolve, reject) => {
    client.post(
      uploadEndpoint,
      {
        command: "FINALIZE",
        media_id,
      },
      async (err, data, _res) => {
        if (err) {
          info(_res)
          info(data)
          error("Error finalizing upload", err)
          reject(err)
        }
        resolve(data)
      },
    )
  })
}

async function uploadChunk(chunk: Buffer, opts: ChunkOptions) {
  const { media_id, client, segment_index } = opts
  info(`Uploading chunk bytes: ${chunk.length}`, segment_index)
  await client.post(uploadEndpoint, {
    command: "APPEND",
    media_id,
    media: chunk,
    segment_index,
  })
}

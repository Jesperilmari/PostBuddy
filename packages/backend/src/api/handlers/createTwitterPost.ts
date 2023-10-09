import { Maybe, Result } from "true-myth"
import { Client } from "twitter-api-sdk"
import FormData from "form-data"
import { Readable } from "stream"
import axios from "axios"
import qs from "qs"
import { info, error } from "../../util/logger"
import Post from "../interfaces/Post"
import PlatformModel from "../models/PlatformModel"
import { Platform } from "../interfaces/Platform"
import storageClient from "../controllers/storageClient"
import { twitterBasicToken } from "../controllers/oauth/platforms/twitter"

type TwitterBody = {
  text: string
  media?: { media_ids: string[] }
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
  const connection = await refreshOldToken(initialConnection)

  const client = new Client(connection.token, {
    max_retries: 1,
  })
  const text = formatText(post)
  const body: TwitterBody = {
    text,
  }

  if (post.media) {
    const mediaId = await uploadImageToTwitter(connection.token, post.media)

    if (!mediaId) {
      return Result.err("Error uploading image to twitter")
    }
    info("Uploaded image to twitter", mediaId)
    body.media = { media_ids: [mediaId] }
  }

  const { errors } = await client.tweets.createTweet(body)

  if (errors) {
    return Result.err(JSON.stringify(errors))
  }

  info("Created twitter post")
  return Result.ok(undefined)
}

function formatText(post: Post) {
  if (!post.title) {
    return post.description
  }
  return `${post.title} ${post.description}`
}

// function isOldToken(platform: Platform) {
//   const ONE_WEEK = 1000 * 60 * 60 * 24 * 7
//   const now = Date.now()
//   const diff = now - platform.updatedAt.getTime()
//   return diff > ONE_WEEK
// }

async function refreshOldToken(platform: Platform) {
  const url = "https://api.twitter.com/2/oauth2/token"
  const data = {
    refresh_token: platform.refresh_token,
    grant_type: "refresh_token",
  }
  const res = await axios.post(url, qs.stringify(data), {
    headers: {
      Authorization: `Basic ${twitterBasicToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
  info("Refreshed token", res.data)
  return platform
}

async function uploadImageToTwitter(
  token: string,
  media: string,
): Promise<string | null> {
  try {
    const url = "https://upload.twitter.com/1.1/media/upload.json"
    const stream = await getBlobStreamFromAzure(media)
    if (stream.isNothing) {
      return null
    }
    const form = new FormData()
    form.append("media", stream.value)
    const res = await axios.post<{ media_id_string: string }>(url, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders(),
      },
    })
    return res.data.media_id_string
  } catch (err) {
    error("Error uploading image to twitter", err)
    return null
  }
}

async function getBlobStreamFromAzure(media: string): Promise<Maybe<Readable>> {
  const blobClient = storageClient.getBlockBlobClient(media)
  const exists = await blobClient.exists()
  if (!exists) {
    return Maybe.nothing()
  }
  const stream = await blobClient.download()
  return Maybe.of(stream.readableStreamBody as Readable)
}

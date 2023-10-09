import path from "path"
import { Maybe, Result } from "true-myth"
import axios from "axios"
import qs from "qs"
import { Client } from "twitter-api-sdk"
import { TwitterApi } from "twitter-api-v2"
import { info, error } from "../../util/logger"
import Post from "../interfaces/Post"
import PlatformModel from "../models/PlatformModel"
import { Platform } from "../interfaces/Platform"
import storageClient from "../controllers/storageClient"
import { twitterBasicToken } from "../controllers/oauth/platforms/twitter"
import config from "../../config"

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

  const text = formatText(post)
  const body: TwitterBody = {
    text,
  }

  const client = new Client(connection.token)
  const { data } = await client.users.findMyUser({ "user.fields": ["id"] })
  if (!data) {
    return Result.err("Error getting user id")
  }

  if (post.media && post.media !== "") {
    const mediaId = await uploadImageToTwitter(data.id, post.media)

    console.log(mediaId)

    if (!mediaId) {
      return Result.err("Error uploading image to twitter")
    }
    info("Uploaded image to twitter", mediaId)
    body.media = { media_ids: [mediaId] }
  }

  console.log(body)
  const success = await createTweet(body, connection.token)
  if (!success) {
    return Result.err("Error while sending post to twitter")
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
//
type RefreshTokenRes = {
  access_token: string
  refresh_token: string
}

async function refreshOldToken(platform: Platform) {
  info("Refreshing old token")
  const url = "https://api.twitter.com/2/oauth2/token"
  const data = {
    refresh_token: platform.refresh_token,
    grant_type: "refresh_token",
  }
  const res = await axios.post<RefreshTokenRes>(url, qs.stringify(data), {
    headers: {
      Authorization: `Basic ${twitterBasicToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
  platform.token = res.data.access_token
  platform.refresh_token = res.data.refresh_token
  info("Saving new token")
  return platform.save()
}

async function uploadImageToTwitter(_userId: string, media: string) {
  const uploadClient = new TwitterApi(config.twitter_bearer_token)
  const buf = await getBlob(media)
  if (buf.isNothing) {
    return null
  }
  const file = path.join(__dirname, "../../../test/files/postBuddy.png")
  return uploadClient.v1.uploadMedia(file)
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

async function createTweet(body: TwitterBody, token: string) {
  const url = "https://api.twitter.com/2/tweets"
  try {
    const res = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    info("Created tweet", res.data)
    return true
  } catch (e) {
    error(e)
    return false
  }
}

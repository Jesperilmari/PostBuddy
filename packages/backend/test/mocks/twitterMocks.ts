// @ts-nocheck
import { Client } from "twitter-api-sdk"
import Twitter from "twitter"
import { mock, instance, when, anything, anyFunction } from "ts-mockito"
import { BlockBlobClient, ContainerClient } from "@azure/storage-blob"
import { blockBlobClientInstance } from "./mockContainerClient"

const mockUploadClient = mock(Twitter)

const mockPostClient = mock(Client)

when(mockPostClient.users).thenReturn({
  findMyUser: async () => ({
    data: {
      id: "123",
    },
  }),
})

when(mockPostClient.tweets).thenReturn({
  createTweet: async (content: any) => {
    if (content.text === "fail fail") {
      return { errors: ["error"] }
    }
    return {}
  },
})

when(mockUploadClient.post("media/upload", anything(), anyFunction())).thenCall(
  async (_, __, cb) => {
    if (process.env.FAIL_UPLOAD === "true") {
      cb(new Error("Failed to upload media"))
      return
    }
    cb(null, { media_id_string: "123" }, null)
  },
)

export const uploadClient = instance(mockUploadClient)
export const postClient = instance(mockPostClient)

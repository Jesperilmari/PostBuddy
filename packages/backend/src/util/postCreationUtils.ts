import { Maybe } from "true-myth"
import { Readable } from "stream"
import storageClient from "../api/controllers/storageClient"
import BigChungus from "./BigChungus"
import Post from "../api/interfaces/Post"
import { error, info } from "./logger"

export type BlobStuff = {
  stream: Readable
  total_bytes: number
}

export async function getBlob(
  media: string,
  chunkSize?: number,
): Promise<Maybe<BlobStuff>> {
  const blobClient = storageClient.getBlockBlobClient(media)
  const exists = await blobClient.exists()
  if (!exists) {
    return Maybe.nothing()
  }
  const props = await blobClient.getProperties()
  const total_bytes = props.contentLength

  if (!total_bytes) {
    return Maybe.nothing()
  }
  const res = await blobClient.download()
  const stream = res.readableStreamBody
  const out = new BigChungus(chunkSize)

  if (!stream) {
    return Maybe.nothing()
  }
  return Maybe.just({
    stream: stream.pipe(out),
    total_bytes,
  } as BlobStuff)
}

export async function cleanUp(post: Post) {
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

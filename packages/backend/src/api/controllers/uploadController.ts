import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { ContainerClient } from "@azure/storage-blob"
import sharp from "sharp"
import crypto from "node:crypto"
import APIError from "../classes/APIError"

const validContentTypes = [
  "image/jpeg", // Only images supported for now
  "image/png",
  // "image/gif",
  // "video/mp4",
  // "video/webm",
]

// TODO: Implement video uploads
export default function uploadHandler(containerClient: ContainerClient) {
  return (req: Request, res: Response) => {
    // TODO might need to resize images
    const compressor = sharp().png({ quality: 40 })
    const contentType = req.headers["content-type"]
    if (!contentType) {
      throw new APIError("Missing content-type header", StatusCodes.BAD_REQUEST)
    }

    if (!isValidContentType(contentType)) {
      res.status(400).json({
        message: "Invalid content-type",
        was: contentType,
        supported: validContentTypes,
      })
      return
    }

    const fileId = crypto.randomUUID()
    const blobClient = containerClient.getBlockBlobClient(fileId)
    const out = req.pipe(compressor)
    blobClient.uploadStream(out)
    out.on("end", async () => {
      await waitFor(300)
      res.json({
        message: "Upload successful",
        fileId,
      })
    })
  }
}

async function waitFor(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

function isValidContentType(mime: string) {
  return validContentTypes.includes(mime)
}

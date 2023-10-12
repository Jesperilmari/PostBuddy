import { PassThrough, Readable } from "stream"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { ContainerClient } from "@azure/storage-blob"
import sharp from "sharp"
import crypto from "node:crypto"
import APIError from "../classes/APIError"
import compressVideo from "./video"

const validImageTypes = ["image/jpeg", "image/png"]
const validVideoTypes = ["video/mp4"]
const validContentTypes = [...validImageTypes, ...validVideoTypes]

export default function uploadHandler(containerClient: ContainerClient) {
  return async (req: Request, res: Response) => {
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
    const out = await handleCompression(req, contentType)

    if (!out) {
      throw new APIError(
        "Error compressing file",
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }

    blobClient.uploadStream(out)
    out.on("end", async () => {
      res.json({
        message: "Upload successful",
        fileId,
        fileType: contentType,
      })
    })
  }
}

async function handleCompression(stream: Readable, contentType: string) {
  if (isImage(contentType)) {
    return stream.pipe(sharp().png({ quality: 40 }))
  }

  if (isVideo(contentType)) {
    return compressVideo(stream)
  }

  return new PassThrough()
}

function isImage(contentType: string) {
  return validImageTypes.includes(contentType)
}

function isVideo(contentType: string) {
  return validVideoTypes.includes(contentType)
}

function isValidContentType(mime: string) {
  return validContentTypes.includes(mime)
}

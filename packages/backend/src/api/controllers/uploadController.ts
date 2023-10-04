import { Router } from "express"
import crypto from "crypto"
import { ContainerClient } from "@azure/storage-blob"
import sharp from "sharp"
import { StatusCodes } from "http-status-codes"
import config from "../../config"
import APIError from "../classes/APIError"
import checkAuth from "../middleware/checkAuth"

const storageClient = new ContainerClient(
  config.azure_storage_connection_string,
)
const validContentTypes = [
  "image/jpeg", // Only images supported for now
  "image/png",
  // "image/gif",
  // "video/mp4",
  // "video/webm",
]

// This makes testing easier
export function createRouter(containerClient: ContainerClient) {
  const uploadRouter = Router()
  const compressor = sharp().png({ quality: 40 })

  uploadRouter.use(checkAuth)

  // TODO: Implement video uploads
  uploadRouter.post("/", async (req, res) => {
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
    req.on("end", () => {
      res.json({
        message: "Upload successful",
        fileId,
      })
    })
  })
  return uploadRouter
}

function isValidContentType(mime: string) {
  return validContentTypes.includes(mime)
}

const uploadRouter = createRouter(storageClient)
export default uploadRouter

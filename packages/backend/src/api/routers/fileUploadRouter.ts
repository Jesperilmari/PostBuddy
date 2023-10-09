import { Router } from "express"
import { ContainerClient } from "@azure/storage-blob"
import checkAuth from "../middleware/checkAuth"
import uploadHandler from "../controllers/uploadController"
import storageClient from "../controllers/storageClient"

// This makes testing easier
export function createRouter(containerClient: ContainerClient) {
  return Router().use(checkAuth).post("/", uploadHandler(containerClient))
}

const fileUploadRouter = createRouter(storageClient)
export default fileUploadRouter

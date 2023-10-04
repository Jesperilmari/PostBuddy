import { Router } from "express"
import { ContainerClient } from "@azure/storage-blob"
import config from "../../config"
import checkAuth from "../middleware/checkAuth"
import uploadHandler from "../controllers/uploadController"

const storageClient = new ContainerClient(
  config.azure_storage_connection_string,
)

// This makes testing easier
export function createRouter(containerClient: ContainerClient) {
  return Router().use(checkAuth).post("/", uploadHandler(containerClient))
}

const fileUploadRouter = createRouter(storageClient)
export default fileUploadRouter

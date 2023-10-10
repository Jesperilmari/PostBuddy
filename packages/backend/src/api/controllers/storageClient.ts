import { ContainerClient } from "@azure/storage-blob"
import config from "../../config"

const storageClient = new ContainerClient(
  config.azure_storage_connection_string,
)

export default storageClient

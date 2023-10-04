import dotenv from "dotenv"
import { log } from "./util/logger"

dotenv.config()

const variables = [
  "port",
  "db_uri",
  "test_db_uri",
  "jwt_secret",
  "api_base_url",
  "twitter_client_id",
  "twitter_client_secret",
  "azure_storage_connection_string",
] as const

export type Config = {
  [_key in (typeof variables)[number]]: string
}

function createConfig() {
  log("INFO", true, "Using dev/prod config")
  const config = {} as Config
  variables.forEach((variable) => {
    const value = process.env[variable.toUpperCase()]
    if (!value) {
      throw new Error(`Missing environment variable: ${variable.toUpperCase()}`)
    }
    config[variable] = value
  })
  return config
}

function createTestConfig() {
  const config = {
    port: process.env.PORT || "3000",
    api_base_url: process.env.API_BASE_URL || "http://localhost:3000",
    db_uri: "",
    test_db_uri: process.env.TEST_DB_URI || "",
    jwt_secret: process.env.JWT_SECRET || "secret",
    twitter_client_id: process.env.TWITTER_CLIENT_ID || "",
    twitter_client_secret: process.env.TWITTER_CLIENT_SECRET || "",
    azure_storage_connection_string:
      process.env.AZURE_STORAGE_CONNECTION_STRING || "",
  } as Config
  return config
}

const config =
  process.env.NODE_ENV === "test" ? createTestConfig() : createConfig()

export default config

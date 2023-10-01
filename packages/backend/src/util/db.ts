import mongoose from "mongoose"
import config from "../config"
import { info } from "./logger"

export default async function connectDb(uri: string = config.db_uri) {
  await mongoose.connect(uri)
  info("Connected to MongoDB")
}

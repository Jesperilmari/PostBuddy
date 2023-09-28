import mongoose from "mongoose"
import config from "../config"
import { info } from "./logger"

export async function connectDb() {
  await mongoose.connect(config.db_uri)
  info("Connected to MongoDB")
}

import mongoose from "mongoose"
import readline from "readline"
import UserModel from "../api/models/UserModel"
import PlatformModel from "../api/models/PlatformModel"
import config from "../config"
import { info } from "./logger"
import PostsModel from "../api/models/PostsModel"

async function clearDb() {
  await confirmDelete()
  info("Clearing database")
  await mongoose.connect(config.db_uri)
  await UserModel.deleteMany({})
  await PlatformModel.deleteMany({})
  await PostsModel.deleteMany({})
  await mongoose.connection.close()
  info("Database cleared")
}

async function confirmDelete() {
  const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  try {
    await askYNQuestion(input, "Are you sure you want to clear the database?")
  } catch (error) {
    process.exit(0)
  }
}

async function askYNQuestion(input: readline.Interface, question: string) {
  return new Promise<void>((resolve, reject) => {
    input.question(`${question} (y/n)`, (answer: string) => {
      input.close()
      return answer === "y" ? resolve() : reject()
    })
  })
}

clearDb()

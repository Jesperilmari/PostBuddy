import mongoose from "mongoose"
import config from "../../src/config"
import PlatformModel from "../../src/api/models/PlatformModel"
import UserModel from "../../src/api/models/UserModel"
import PostsModel from "../../src/api/models/PostsModel"

export default async function connectAndClearDb() {
  await mongoose.connect(config.test_db_uri)
  await UserModel.deleteMany({})
  await PlatformModel.deleteMany({})
  await PostsModel.deleteMany({})
}

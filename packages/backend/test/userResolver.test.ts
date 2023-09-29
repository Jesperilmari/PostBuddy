import mongoose from "mongoose"
import { StatusCodes } from "http-status-codes"
import UserModel from "../src/api/models/UserModel"
import config from "../src/config"
import UserTestUtils from "./util/userFunctions"
import request from "supertest"
import app from "../src/app"

describe("UserResolver", () => {
  let token: string
  let user
  beforeAll(async () => {
    await mongoose.connect(config.test_db_uri)
    await UserModel.deleteMany({})
    user = await UserTestUtils.createUser()
    token = UserTestUtils.genToken(user._id)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })
})

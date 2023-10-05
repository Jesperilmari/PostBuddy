import express from "express"
require("express-async-errors")
import { createRouter } from "../src/api/routers/fileUploadRouter"
import containerClientInstance from "./mocks/mockContainerClient"
import request from "supertest"
import { StatusCodes } from "http-status-codes"
import fs from "fs"
import errorHandler from "../src/api/middleware/errorHandler"
import mongoose from "mongoose"
import config from "../src/config"
import UserModel from "../src/api/models/UserModel"
import UserTestUtils from "./util/userFunctions"

// Testing just the router here
const app = express()
const uploadRouter = createRouter(containerClientInstance)
app.use("/api/v1/upload", uploadRouter).use(errorHandler)

describe("UploadRouter", () => {
  let token = ""
  beforeAll(async () => {
    await mongoose.connect(config.test_db_uri)
    await UserModel.deleteMany({})
    const user = await UserTestUtils.createUser()
    token = UserTestUtils.genToken(user._id)
  })

  it("should require authentication", async () => {
    const response = await request(app)
      .post("/api/v1/upload")
      .set("Content-Type", "image/png")
      .set("Authorization", `Bearer asdfsdfds`)
      .send("Hello World")

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it("should respond with bad request if mimetype is not supported", async () => {
    const response = await request(app)
      .post("/api/v1/upload")
      .set("Content-Type", "text/plain")
      .set("Authorization", `Bearer ${token}`)
      .send("Hello World")
    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
  })

  it("should response with bad request if no mimetype is provided", async () => {
    const response = await request(app)
      .post("/api/v1/upload")
      .set("Authorization", `Bearer ${token}`)
      .send("Hello World")

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
  })

  it("should upload image", async () => {
    const file = fs.readFileSync("./test/files/postBuddy.png")
    const response = await request(app)
      .post("/api/v1/upload")
      .set("Content-Type", "image/png")
      .set("Authorization", `Bearer ${token}`)
      .send(file)

    expect(response.status).toBe(StatusCodes.OK)
    expect(response.body).toEqual({
      message: "Upload successful",
      fileId: expect.any(String),
    })
  })
})

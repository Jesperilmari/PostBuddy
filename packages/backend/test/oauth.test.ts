import mongoose from "mongoose"
import { StatusCodes } from "http-status-codes"
import UserModel from "../src/api/models/UserModel"
import PlatformModel from "../src/api/models/PlatformModel"
import config from "../src/config"
import { platforms } from "../src/api/controllers/oauth"
import { mockPlatform } from "./mocks/mockPlatform"
import request from "supertest"
import app from "../src/app"
import UserTestUtils from "./util/userFunctions"

describe("OAuthRouter", () => {
  let token: string
  let user
  beforeAll(async () => {
    platforms["mock"] = mockPlatform
    await mongoose.connect(config.test_db_uri)
    await UserModel.deleteMany({})
    await PlatformModel.deleteMany({})
    user = await UserTestUtils.createUser()
    token = UserTestUtils.genToken(user._id)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  it("should expect a bearer token", async () => {
    const response = await request(app).get("/api/v1/oauth/mock")
    expect(response.status).toBe(400)
  })

  it("should expect a valid bearer token", async () => {
    const response = await request(app)
      .get("/api/v1/oauth/mock")
      .set("Authorization", "Bearer invalid")
    expect(response.status).toBe(401)
  })

  it("should expect a valid platform", async () => {
    const response = await request(app)
      .get("/api/v1/oauth/invalid")
      .set("Authorization", `Bearer ${token}`)
    expect(response.status).toBe(404)
  })

  it("should return url to oauth provider", async () => {
    const response = await request(app)
      .get("/api/v1/oauth/mock")
      .set("Authorization", `Bearer ${token}`)
    expect(response.status).toBe(StatusCodes.OK)
    expect(response.body.url).toBeDefined()
  })

  it("should expect a valid platform", async () => {
    const response = await request(app)
      .get("/api/v1/oauth/callback/invalid")
      .query({ code: "code", state: "state" })

    expect(response.status).toBe(404)
  })

  it("should connect the platform", async () => {
    const init = await request(app)
      .get("/api/v1/oauth/mock")
      .set("Authorization", `Bearer ${token}`)

    expect(init.status).toBe(StatusCodes.OK)
    const url = init.body.url as string
    const state = url
      .split("?")[1]
      .split("&")
      .find((s) => s.startsWith("state="))
      ?.split("=")[1]
    expect(state).toBeDefined()
    const response = await request(app)
      .get("/api/v1/oauth/callback/mock")
      .query({ code: "code", state })

    expect(response.status).toBe(302)
    const platform = await PlatformModel.findOne({})
    expect(platform).toBeDefined()
    expect(platform?.token).toBe("accessToken")
  })
})

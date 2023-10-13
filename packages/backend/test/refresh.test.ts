import { Platform } from "./../src/api/interfaces/Platform"
import mongoose from "mongoose"
import UserModel from "../src/api/models/UserModel"
import PlatformModel from "../src/api/models/PlatformModel"
import config from "../src/config"
import { platforms } from "../src/api/controllers/oauth/platforms"
import { mockPlatform } from "./mocks/mockPlatform"
import UserTestUtils from "./util/userFunctions"
import { findAndRefreshToken } from "../src/util/platformUtils"
import { User } from "../src/api/interfaces/User"
import { shouldRefresh } from "../src/util/platformUtils"

describe("refreshConnection", () => {
  let user: User
  let plat: Platform
  beforeAll(async () => {
    // @ts-ignore is needed for testing
    platforms["mock"] = mockPlatform
    await mongoose.connect(config.test_db_uri)
    await UserModel.deleteMany({})
    await PlatformModel.deleteMany({})
    user = await UserTestUtils.createUser()
    plat = new PlatformModel({
      name: "string",
      token: "string",
      refresh_token: "string",
      secret: "string",
      user: user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  })
  afterAll(async () => {
    await mongoose.connection.close()
  })
  it("should not refresh token", async () => {
    const maybe = await findAndRefreshToken(
      "twitter",
      user._id,
      async (): Promise<Platform> => {
        return plat
      },
    )
    expect(maybe.isNothing).toBe(true)
  })
  it("should refresh", async () => {
    plat.updatedAt = new Date(Date.now() - 2000 * 60 * 60 * 2)
    const should = shouldRefresh(plat)
    expect(should).toBe(true)
  })
  it("should not refresh", async () => {
    plat.updatedAt = new Date(Date.now())
    const should = shouldRefresh(plat)
    expect(should).toBe(false)
  })
})

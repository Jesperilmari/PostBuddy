import { mockPlatform } from "./mocks/mockPlatform"
import { platforms } from "../src/api/controllers/oauth/platforms"
import { User } from "../src/api/interfaces/User"
import UserTestUtils from "./util/userFunctions"
import { createPlatformConnection } from "../src/api/controllers/oauth/platforms/twitter"
import UserModel from "../src/api/models/UserModel"
import mongoose from "mongoose"
import PlatformModel from "../src/api/models/PlatformModel"
import config from "../src/config"

describe("twitter test", () => {
  let user: User
  let code: string = "code"
  let state: string = "state"

  beforeAll(async () => {
    // @ts-ignore is needed for testing
    platforms["mock"] = mockPlatform
    await mongoose.connect(config.test_db_uri)
    await UserModel.deleteMany({})
    await PlatformModel.deleteMany({})
    user = await UserTestUtils.createUser()
  })
  afterAll(async () => {
    await mongoose.connection.close()
  })

  it("should generate a url", async () => {
    const url: { url: string; token: string } =
      await mockPlatform.getRedirectUrl()
    expect(url).toBeDefined()
    expect(url.url).toBeDefined()
    expect(url.token).toBeDefined()
  })
  it("should not create connection", async () => {
    const nothing = await createPlatformConnection(user, code, state)
    expect(nothing.isNothing).toBe(true)
  })
})

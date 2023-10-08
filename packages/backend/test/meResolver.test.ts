import connectAndClearDb from "./util/connectAndClearDb"
import UserTestUtils from "./util/userFunctions"
import app from "../src/app"
import request from "supertest"
import { connections, me } from "./queries"
import { StatusCodes } from "http-status-codes"
import { Platform } from "../src/api/interfaces/Platform"
import { User } from "../src/api/interfaces/User"
import mongoose from "mongoose"

describe("meResolver", () => {
  let user: User
  let token: string
  let platform: Platform
  beforeAll(async () => {
    await connectAndClearDb()
    user = await UserTestUtils.createUser()
    token = UserTestUtils.genToken(user._id)
    platform = await UserTestUtils.createPlatformFor(user)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  it("should return user", async () => {
    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: me,
      })
      .expect(StatusCodes.OK)

    expect(res.body.data.me).toBeDefined()
    const data = res.body.data.me as User
    expect(data.username).toBe(user.username)
  })

  it("should return connections", async () => {
    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: connections,
      })
      .expect(StatusCodes.OK)
    expect(res.body.data.connections).toBeDefined()
    expect(res.body.data.connections.length).toBe(1)
    expect(res.body.data.connections[0].name).toBe(platform.name)
  })
})

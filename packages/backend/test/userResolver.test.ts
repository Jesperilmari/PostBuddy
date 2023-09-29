import mongoose from "mongoose"
import { StatusCodes } from "http-status-codes"
import UserModel from "../src/api/models/UserModel"
import config from "../src/config"
import UserTestUtils from "./util/userFunctions"
import request from "supertest"
import app from "../src/app"
import { allUsers, oneUser, register } from "./queries"
import { User } from "../src/api/interfaces/User"

describe("UserResolver", () => {
  // let token: string
  let user: User
  beforeAll(async () => {
    await mongoose.connect(config.test_db_uri)
    await UserModel.deleteMany({})
    user = await UserTestUtils.createUser()
    // token = UserTestUtils.genToken(user._id)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  it("should return all users", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: allUsers,
      })
      .expect(StatusCodes.OK)
    expect(response.body.data.users).toHaveLength(1)
  })

  it("should return a user", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: oneUser,
        variables: {
          userId: user._id,
        },
      })
      .expect(StatusCodes.OK)
    expect(response.body.data.user).toHaveProperty("username")
    expect(response.body.data.user).toHaveProperty("name")
  })

  it("should register a user", async () => {
    const user = {
      username: "testuser",
      name: "test",
      email: "test2@email.com",
      password: "testpassword",
    }
    const response = await request(app)
      .post("/graphql")
      .send({
        query: register,
        variables: {
          user,
        },
      })
      .expect(StatusCodes.OK)

    expect(response.body.data.register).toHaveProperty("token")
    expect(response.body.data.register).toHaveProperty("user")
    expect(response.body.data.register.user).toHaveProperty("username")
  })
})

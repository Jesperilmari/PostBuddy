import app from "../src/app"
import { StatusCodes } from "http-status-codes"
import request from "supertest"
import { updateUser } from "./queries"
import connectDb from "../src/util/db"
import config from "../src/config"
import UserTestUtils from "./util/userFunctions"
import mongoose from "mongoose"

describe("AuthDirective", () => {
  beforeAll(async () => {
    await connectDb(config.test_db_uri)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  it("should require authentication", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: updateUser,
        variables: {
          user: {
            username: "asdf",
          },
        },
      })
      .expect(StatusCodes.OK)

    const errors = response.body.errors
    expect(errors).toBeDefined()
    expect(errors[0].message).toBe("Not authenticated")
  })

  it("should authorize request", async () => {
    const token = UserTestUtils.genToken("something")
    const response = await request(app)
      .post("/graphql")
      .send({
        query: updateUser,
        variables: {
          user: {
            username: "asdf",
          },
        },
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.OK)

    const errors = response.body.errors
    expect(errors).toBeDefined()
    expect(errors[0].message).not.toBe("Not authenticated")
  })
})

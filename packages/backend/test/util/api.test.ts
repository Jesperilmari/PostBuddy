import app from "../../src/app"
import request from "supertest"
import connectAndClearDb from "./connectAndClearDb"

describe("Api", () => {
  beforeAll(async () => {
    await connectAndClearDb()
  })

  it("should return 404", async () => {
    return request(app).get("/somethingrandom").expect(404)
  })
})

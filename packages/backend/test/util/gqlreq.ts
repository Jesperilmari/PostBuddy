import app from "../../src/app"
import request from "supertest"

export default function gqlReq(
  body: {
    query: string
    variables?: any
  },
  token?: string,
) {
  return request(app)
    .post("/graphql")
    .send(body)
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${token}`)
}

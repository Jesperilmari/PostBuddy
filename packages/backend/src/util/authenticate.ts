import jwt from "jsonwebtoken"
import { Request } from "express"
import { Maybe } from "true-myth"
import TokenPayload from "../api/interfaces/TokenPayload"
import config from "../config"

export default function authenticate(req: Request): Maybe<TokenPayload> {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    return Maybe.nothing()
  }
  try {
    const payload = jwt.verify(token, config.jwt_secret) as TokenPayload
    return Maybe.just(payload)
  } catch (err) {
    return Maybe.nothing()
  }
}

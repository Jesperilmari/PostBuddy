import jwt from "jsonwebtoken"
import { Maybe } from "true-myth"
import config from "../config"
import TokenPayload from "../api/interfaces/TokenPayload"

export function generateToken(tokenPayload: TokenPayload) {
  return jwt.sign(tokenPayload, config.jwt_secret)
}

export function verifyToken(token: string): Maybe<TokenPayload> {
  try {
    const result = jwt.verify(token, config.jwt_secret) as TokenPayload
    return Maybe.just(result)
  } catch (error) {
    return Maybe.nothing()
  }
}

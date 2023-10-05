import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { Maybe } from "true-myth"
import { StatusCodes } from "http-status-codes"
import APIError from "../classes/APIError"
import UserModel from "../models/UserModel"
import config from "../../config"
import TokenPayload from "../interfaces/TokenPayload"

export default async function checkAuth(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  const token = getToken(req)
  if (token.isNothing) {
    throw new APIError("Token not provided", StatusCodes.BAD_REQUEST)
  }

  const payload = verifySafe(token.value).unwrapOrElse(() => {
    throw new APIError("Invalid token", StatusCodes.UNAUTHORIZED)
  })

  const user = await UserModel.findById(payload.id)
  if (!user) {
    throw new APIError("User not found", StatusCodes.NOT_FOUND)
  }

  req.user = user
  next()
}

function getToken(req: Request) {
  const authHeader = req.headers.authorization
  return Maybe.of(authHeader).map((header) => header.slice(7))
}

function verifySafe(token: string): Maybe<TokenPayload> {
  try {
    return Maybe.of(jwt.verify(token, config.jwt_secret) as TokenPayload)
  } catch (error) {
    return Maybe.nothing()
  }
}

import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { Maybe } from "true-myth"
import { User } from "../../interfaces/User"
import twitter from "./platforms/twitter"
import { OauthPlatform, BaseParams } from "../../interfaces/OauthPlatform"
import APIError from "../../classes/APIError"
import PlatformModel from "../../models/PlatformModel"
import { Platform } from "../../interfaces/Platform"
import { error } from "../../../util/logger"

const cache = new Map<string, User>()
// Platforms that are supported
export const platforms: Record<string, OauthPlatform<BaseParams>> = {
  twitter,
}

/**
 * Handles initialization of the oauth flow
 */
export async function connectPlatform(
  req: Request<{ platformName: string }>,
  res: Response,
) {
  const user = req.user as User
  const { platformName } = req.params

  const key = genCookieValue(platformName, user._id)

  // Cache user for later use in callback
  cache.set(key, user)

  const platform = platforms[platformName]
  if (!platform) {
    res
      .status(StatusCodes.NOT_FOUND)
      .send(`Platform not found: ${platformName}`)
    return
  }
  const realParams = {
    ...platform.params,
    state: key,
    code_challenge: key,
  }

  res.json({
    url: platform.oauthClient.getAuthorizeUrl(realParams),
  })
}

/**
 * Generates a cookie value for the user
 * which is a base64 encoded string of the platform name and user id
 */
function genCookieValue(platform: string, userId: string) {
  const str = `${platform}-${userId}`
  return Buffer.from(str).toString("base64").substring(0, 32)
}

type CallbackRequest = Request<
  { platformName: string },
  {},
  {},
  { code: string; state: string }
>
/**
 * Handles the callback from the oauth provider
 */
export async function handleCallback(req: CallbackRequest, res: Response) {
  const { code, state } = req.query
  const { platformName } = req.params
  const user = cache.get(state)
  const platform = platforms[platformName]

  if (!platform) {
    throw new APIError(
      `Platform not found: ${platformName}`,
      StatusCodes.NOT_FOUND,
    )
  }

  if (!user) {
    error("Invalid state", state)
    throw new APIError("Invalid state", StatusCodes.BAD_REQUEST)
  }

  const connection = await createPlatformConnection(user, platform, code, state)

  cache.delete(state)

  // Send response
  connection.match({
    // Connection created
    Just: () => {
      res.redirect("http://localhost:5173") // TODO conditional redirect based on NODE_ENV
    },
    // Connection creation failed
    Nothing: () => {
      throw new APIError(
        "Error creating platform connection",
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    },
  })
}

async function createPlatformConnection<T extends BaseParams>(
  user: User,
  platform: OauthPlatform<T>,
  code: string,
  state: string,
) {
  return new Promise<Maybe<Platform>>((resolve) => {
    platform.oauthClient.getOAuthAccessToken(
      code,
      {
        ...platform.oauthAccessTokenParams,
        code_verifier: state,
      },
      async (err, accessToken, refreshToken, _result) => {
        if (err) {
          error("Error getting access token: ", err)
          return resolve(Maybe.nothing())
        }
        const connection = await PlatformModel.create({
          name: platform.params.kind,
          token: accessToken,
          refresh_token: refreshToken,
          user: user._id,
        })

        return resolve(Maybe.of(connection))
      },
    )
  })
}

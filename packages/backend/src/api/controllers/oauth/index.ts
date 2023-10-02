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

// TODO: Implement better caching.
// This is a temporary solution. Either use proper inMemoryCache or use redis?
const cache: Record<string, User> = {}

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

  const val = genCookieValue(platformName, user._id)

  // Cache user for later use in callback
  cache[val] = user

  res.cookie("connect", val, { httpOnly: true })
  const platform = platforms[platformName]
  if (!platform) {
    res
      .status(StatusCodes.NOT_FOUND)
      .send(`Platform not found: ${platformName}`)
    return
  }

  // Redirect user to oauth provider
  res.redirect(platform.authorizeUrl)
}

/**
 * Generates a cookie value for the user
 * which is a base64 encoded string of the platform name and user id
 */
function genCookieValue(platform: string, userId: string) {
  const str = `${platform}-${userId}`
  return Buffer.from(str).toString("base64")
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
  const { code } = req.query
  const { platformName } = req.params
  const user = cache[req.cookies.connect]
  const platform = platforms[platformName]

  if (!platform) {
    throw new APIError(
      `Platform not found: ${platformName}`,
      StatusCodes.NOT_FOUND,
    )
  }

  if (!user) {
    error("Invalid cookie: ", req.cookies?.connect)
    throw new APIError("Invalid cookie", StatusCodes.BAD_REQUEST)
  }

  const connection = await createPlatformConnection(user, platform, code)

  // Clear cache and cookies after use
  delete cache[req.cookies.connect]
  res.clearCookie("connect")

  // Send response
  connection.match({
    // Connection created
    Just: (plt) => {
      res.status(StatusCodes.CREATED).json({
        message: `${plt.name} connection created successfully`,
      })
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
) {
  return new Promise<Maybe<Platform>>((resolve) => {
    platform.oauthClient.getOAuthAccessToken(
      code,
      platform.oauthAccessTokenParams,
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

import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { User } from "../../interfaces/User"
import APIError from "../../classes/APIError"
import { error } from "../../../util/logger"
import { PlatformName, platforms } from "./platforms"
import config from "../../../config"

// Cache for connecting callback to specific user
const cache = new Map<string, User>()

/**
 * Handles initialization of the oauth flow
 */
export async function connectPlatform(
  req: Request<{ platformName: PlatformName }>,
  res: Response,
) {
  const user = req.user as User
  const { platformName } = req.params

  const platform = platforms[platformName]
  if (!platform) {
    res
      .status(StatusCodes.NOT_FOUND)
      .send(`Platform not found: ${platformName}`)
    return
  }
  const { url, token: key } = await platform.getRedirectUrl()
  cache.set(key, user)

  res.json({
    url,
  })
}

type CallbackRequest = Request<
  { platformName: PlatformName },
  {},
  {},
  {
    code?: string
    state?: string
    oauth_token?: string
    oauth_verifier?: string
    error?: string
  }
>
/**
 * Handles the callback from the oauth provider
 */
export async function handleCallback(req: CallbackRequest, res: Response) {
  const { state, oauth_token, error: failed } = req.query
  const { platformName } = req.params
  if (failed) {
    res.redirect(config.website_url)
    return
  }

  const key = state || (oauth_token as string)
  const user = cache.get(key)
  const platform = platforms[platformName]

  if (!platform) {
    throw new APIError(
      `Platform not found: ${platformName}`,
      StatusCodes.NOT_FOUND,
    )
  }

  if (!user) {
    error("Invalid key", key)
    throw new APIError("Invalid state", StatusCodes.BAD_REQUEST)
  }

  cache.delete(key)

  platform.handleCallback(req, res, user)
}

// async function createPlatformConnection<T extends BaseParams>(
//   user: User,
//   platform: OauthPlatform<T>,
//   code: string,
//   state: string,
// ) {
//   return new Promise<Maybe<Platform>>((resolve) => {
//     platform.oauthClient.getOAuthAccessToken(
//       code,
//       {
//         ...platform.oauthAccessTokenParams,
//         code_verifier: state,
//       },
//       async (err, accessToken, refreshToken, _result) => {
//         if (err) {
//           error("Error getting access token: ", err)
//           return resolve(Maybe.nothing())
//         }
//         const connection = await PlatformModel.create({
//           name: platform.params.kind,
//           token: accessToken,
//           refresh_token: refreshToken,
//           user: user._id,
//         })

//         return resolve(Maybe.of(connection))
//       },
//     )
//   })
// }

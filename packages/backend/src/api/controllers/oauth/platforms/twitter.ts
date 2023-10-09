import { OAuth2 } from "oauth"
import { Request, Response } from "express"
import { Maybe } from "true-myth"
import { User } from "../../../interfaces/User"
import PlatformModel from "../../../models/PlatformModel"
import APIError from "../../../classes/APIError"
import config from "../../../../config"
import { error } from "../../../../util/logger"
import { Platform } from "../../../interfaces/Platform"

export interface OauthStuff {
  getRedirectUrl: () => Promise<{ url: string; token: string }>
  handleCallback: (
    // eslint-disable-next-line
    req: Request<any, any, any, any>,
    // eslint-disable-next-line
    res: Response,
    // eslint-disable-next-line
    user: User,
  ) => Promise<void>
}

const basicToken = Buffer.from(
  `${config.twitter_client_id}:${config.twitter_client_secret}`,
).toString("base64")

const customHeaders = {
  Authorization: `Basic ${basicToken}`,
}

const twitterParams = {
  client_id: config.twitter_client_id,
  response_type: "code",
  redirect_uri: `${config.api_base_url}/api/v1/oauth/callback/twitter`,
  scope: "tweet.write tweet.read users.read offline.access",
  code_challenge_method: "plain",
}

const oauthAccessTokenParams = {
  grant_type: "authorization_code",
  redirect_uri: twitterParams.redirect_uri,
  client_id: twitterParams.client_id,
}

const oauthClient = new OAuth2(
  config.twitter_client_id,
  config.twitter_client_secret,
  "",
  "https://twitter.com/i/oauth2/authorize",
  "https://api.twitter.com/2/oauth2/token",
  customHeaders,
)

const twitter: OauthStuff = {
  getRedirectUrl: async () => {
    const state = genState()
    return {
      url: oauthClient.getAuthorizeUrl({
        ...twitterParams,
        state,
        code_challenge: state,
      }),
      token: state,
    }
  },
  handleCallback: async (
    req: Request<{}, {}, {}, { code: string; state: string }>,
    res: Response,
    user: User,
  ) => {
    const { code, state } = req.query
    const connection = await createPlatformConnection(user, code, state)
    if (!connection) {
      throw new APIError("Could not create connection", 500)
    }
    res.redirect(config.website_url)
  },
}

function genState() {
  return crypto.randomUUID() as string
}

async function createPlatformConnection(
  user: User,
  code: string,
  state: string,
) {
  return new Promise<Maybe<Platform>>((resolve) => {
    oauthClient.getOAuthAccessToken(
      code,
      {
        ...oauthAccessTokenParams,
        code_verifier: state,
      },
      async (err, accessToken, refreshToken, _result) => {
        if (err) {
          error("Error getting access token: ", err)
          return resolve(Maybe.nothing())
        }
        const connection = await PlatformModel.create({
          name: "twitter",
          token: accessToken,
          refresh_token: refreshToken,
          user: user._id,
        })

        return resolve(Maybe.of(connection))
      },
    )
  })
}

export default twitter

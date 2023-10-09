import { OAuth2 } from "oauth"
import config from "../../../../config"
import {
  OauthPlatform,
  BaseParams,
  OauthAccessTokenParams,
} from "../../../interfaces/OauthPlatform"

interface TwitterParams extends BaseParams {}

export const twitterBasicToken = Buffer.from(
  `${config.twitter_client_id}:${config.twitter_client_secret}`,
).toString("base64")

const customHeaders = {
  Authorization: `Basic ${twitterBasicToken}`,
}

const twitterParams: TwitterParams = {
  kind: "twitter",
  client_id: config.twitter_client_id,
  response_type: "code",
  redirect_uri: `${config.api_base_url}/api/v1/oauth/callback/twitter`,
  scope: "tweet.write offline.access tweet.read users.read",
  state: "asdf",
  code_challenge: "asdf",
  code_challenge_method: "plain",
}

const oauthAccessTokenParams: OauthAccessTokenParams = {
  grant_type: "authorization_code",
  redirect_uri: twitterParams.redirect_uri,
  client_id: twitterParams.client_id,
  code_verifier: "",
}

const oauthClient = new OAuth2(
  config.twitter_client_id,
  config.twitter_client_secret,
  "",
  "https://twitter.com/i/oauth2/authorize",
  "https://api.twitter.com/2/oauth2/token",
  customHeaders,
)

const twitter: OauthPlatform<TwitterParams> = {
  oauthClient,
  redirectUrl: twitterParams.redirect_uri,
  authorizeUrl: oauthClient.getAuthorizeUrl(twitterParams),
  params: twitterParams,
  oauthAccessTokenParams,
}

export default twitter

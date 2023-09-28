import { OAuth2 } from "oauth"

export interface BaseParams {
  kind: string
  response_type: string
  client_id: string
  redirect_uri: string
  scope: string
  state: string
  code_challenge: string
  code_challenge_method: string
}

export interface OauthPlatform<T extends BaseParams> {
  oauthClient: OAuth2
  authorizeUrl: string
  redirectUrl: string
  params: T
}

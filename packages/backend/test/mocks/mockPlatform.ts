import { mock, when, anything, instance } from "ts-mockito"
import { OAuth2 } from "oauth"
import {
  BaseParams,
  OauthPlatform,
} from "../../src/api/interfaces/OauthPlatform"

const oauth2Mock = mock(OAuth2)

when(oauth2Mock.getAuthorizeUrl(anything())).thenReturn(
  "http://localhost:3002/authorize",
)
when(
  oauth2Mock.getOAuthAccessToken(anything(), anything(), anything()),
).thenCall((_, __, cb: Function) => {
  cb(null, "accessToken", "refreshToken", {})
})

export const mockPlatform: OauthPlatform<BaseParams> = {
  authorizeUrl: "http://localhost:3002/authorize",
  redirectUrl: "http://localhost:3002/callback",
  oauthClient: instance(oauth2Mock),
  params: {
    client_id: "client_id",
    code_challenge: "code_challenge",
    code_challenge_method: "code_challenge_method",
    kind: "kind",
    redirect_uri: "redirect_uri",
    response_type: "response_type",
    scope: "scope",
    state: "state",
  },
  oauthAccessTokenParams: {
    client_id: "client_id",
    code_verifier: "code_verifier",
    grant_type: "grant_type",
    redirect_uri: "redirect_uri",
  },
}

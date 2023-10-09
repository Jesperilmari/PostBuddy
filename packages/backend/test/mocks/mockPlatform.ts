import { OauthStuff } from "../../src/api/controllers/oauth/platforms/twitter"

export const mockPlatform: OauthStuff = {
  getRedirectUrl: async () => ({ url: "https://example.com", token: "token" }),
  handleCallback: async (_req, res) => {
    res.redirect("https://example.com")
  },
}

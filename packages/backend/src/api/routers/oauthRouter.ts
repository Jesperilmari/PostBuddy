import { Router } from "express"
import { connectPlatform, handleCallback } from "../controllers/oauth"
import checkAuth from "../middleware/checkAuth"

const oauthRouter = Router()

// For initializing connections
oauthRouter.get("/:platformName", checkAuth, connectPlatform)

// For handling callbacks
oauthRouter.get("/callback/:platformName", handleCallback)

export default oauthRouter

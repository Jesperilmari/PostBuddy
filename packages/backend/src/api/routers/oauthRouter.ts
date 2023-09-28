import { Router } from "express"
import { connectPlatform, handleCallback } from "../controllers/oauth"
import checkAuth from "../middleware/checkAuth"
import cookieParser from "cookie-parser"

const oauthRouter = Router()

// For initializing connections
oauthRouter.get("/:platformName", checkAuth, connectPlatform)

oauthRouter.use(cookieParser())
// For handling callbacks
oauthRouter.get("/callback/:platformName", handleCallback)

export default oauthRouter

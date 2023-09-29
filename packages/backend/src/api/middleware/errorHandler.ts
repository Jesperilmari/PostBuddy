import { NextFunction, Request, Response } from "express"
import APIError from "../classes/APIError"

export default function errorHandler(
  err: APIError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  res.status(err.status || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  })
}

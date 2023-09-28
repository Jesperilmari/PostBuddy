import { Request, Response, NextFunction } from "express"

export default function notFound(
	req: Request,
	res: Response,
	next: NextFunction
) {
	res.status(404).send(`🔍 - Not Found - ${req.originalUrl}`)
	next()
}

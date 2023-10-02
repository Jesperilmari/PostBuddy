import { Request } from "express"

export interface BaseContext {
  req: Request
}

export interface PBContext extends BaseContext {
  userId: string
}

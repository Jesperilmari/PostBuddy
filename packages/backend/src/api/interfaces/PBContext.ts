import { Request } from "express"
import { Maybe } from "true-myth"

export default interface PBContext {
  req: Request
  userId: Maybe<string>
}

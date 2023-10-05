declare interface User {}

declare namespace Express {
  interface Request {
    user?: User
  }
}

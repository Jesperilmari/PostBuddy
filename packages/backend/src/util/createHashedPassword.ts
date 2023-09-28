import bcrypt from "bcrypt"

const salt = bcrypt.genSaltSync(10)

export default function createHashedPassword(password: string) {
  return bcrypt.hashSync(password, salt)
}

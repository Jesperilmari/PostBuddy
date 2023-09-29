import bcrypt from "bcrypt"

const salt = bcrypt.genSaltSync(10)

export function createHashedPassword(password: string) {
  return bcrypt.hashSync(password, salt)
}

export function correctPassword(password: string, hashedPassword: string) {
  return bcrypt.compareSync(password, hashedPassword)
}

import UserModel from "../../src/api/models/UserModel"
import jwt from "jsonwebtoken"
import config from "../../src/config"
import { createHashedPassword } from "../../src/util/password"
import { User } from "../../src/api/interfaces/User"
import PlatformModel from "../../src/api/models/PlatformModel"

namespace UserTestUtils {
  /**
   *
   * @param username Default test
   * @param password Default password
   * @param email Default test@email.com
   */
  export async function createUser(
    username: string = "test",
    password: string = "password",
    email: string = "test@email.com",
  ) {
    return UserModel.create({
      username,
      name: username,
      password: createHashedPassword(password),
      email,
    })
  }

  /**
   * Generate valid token for testing
   */
  export function genToken(userId: string) {
    return jwt.sign({ id: userId }, config.jwt_secret)
  }

  export async function createPlatformFor(user: User) {
    return PlatformModel.create({
      name: "testplatform",
      refresh_token: "refresh",
      token: "token",
      user: user._id,
    })
  }
}

export default UserTestUtils

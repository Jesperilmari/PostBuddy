import { model, Schema, Model, Error } from "mongoose"
import { Maybe, Result } from "true-myth"
import { GraphQLError } from "graphql"
import validator from "validator"
import { User, LoginArgs, UserInput } from "../interfaces/User"
import { correctPassword, createHashedPassword } from "../../util/password"

interface UserMethods {
  changePassword(
    // eslint-disable-next-line
    oldPassword: string,
    // eslint-disable-next-line
    newPassword: string,
  ): Promise<Result<User, GraphQLError>>
}

interface IUserModel extends Model<User, {}, UserMethods> {
  // eslint-disable-next-line
  login(creds: LoginArgs): Promise<Maybe<User>>
  // eslint-disable-next-line
  register(user: UserInput): Promise<Result<User, GraphQLError>>
}

const userSchema = new Schema<User, IUserModel, UserMethods>({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (val: string) => validator.isEmail(val),
      message: (props: { value: string }) =>
        `${props.value} is not a valid email`,
    },
  },
  password: {
    type: String,
    required: true,
  },
})

userSchema.set("toJSON", {
  transform(_doc, ret, _opt) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    delete ret.password
  },
})

// Static login method
userSchema.static(
  "login",
  async function login({
    usernameOrEmail,
    password,
  }: LoginArgs): Promise<Maybe<User>> {
    const user = await this.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    })

    if (!user) {
      return Maybe.nothing()
    }

    return correctPassword(password, user.password)
      ? Maybe.just(user)
      : Maybe.nothing()
  },
)

// Register method for creating users
userSchema.static("register", async function register(user: User): Promise<
  Result<User, GraphQLError>
> {
  const hashedPassword = createHashedPassword(user.password)
  const created = new this({
    ...user,
    password: hashedPassword,
  })
  const errors = created.validateSync()
  return !errors
    ? Result.ok(await created.save())
    : Result.err(new GraphQLError(`Validation failed: ${mapErrors(errors)}`))
})

userSchema.method(
  "changePassword",
  async function changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<Result<User, GraphQLError>> {
    if (!correctPassword(oldPassword, this.password)) {
      return Result.err(new GraphQLError("Incorrect password"))
    }
    const hashedPassword = createHashedPassword(newPassword)
    this.password = hashedPassword
    const errors = this.validateSync()
    return !errors
      ? Result.ok(await this.save())
      : Result.err(new GraphQLError(`Validation failed: ${mapErrors(errors)}`))
  },
)

/**
 * Creates a string from ValidationError object
 * Example: username: required lenght 3
 */
function mapErrors({ errors }: Error.ValidationError) {
  return Object.keys(errors)
    .map((key) => `${key}: ${errors[key].message}`)
    .join(" ")
}

const UserModel = model<User, IUserModel>("User", userSchema)

export default UserModel

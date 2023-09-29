import { model, Schema, Model, Error } from "mongoose"
import { Maybe, Result } from "true-myth"
import { GraphQLError } from "graphql"
import validator from "validator"
import { User, LoginArgs, UserInput } from "../interfaces/User"
import { correctPassword } from "../../util/password"

interface IUserModel extends Model<User> {
  // eslint-disable-next-line
  login(creds: LoginArgs): Promise<Maybe<User>>
  // eslint-disable-next-line
  register(user: UserInput): Promise<Result<User, GraphQLError>>
}

const userSchema = new Schema<User, IUserModel>({
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
userSchema.static("register", async function register(user: UserInput): Promise<
  Result<User, GraphQLError>
> {
  const created = new this(user)
  const errors = created.validateSync()
  return !errors
    ? Result.ok(await created.save())
    : Result.err(new GraphQLError(`Validation failed: ${mapErrors(errors)}`))
})

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

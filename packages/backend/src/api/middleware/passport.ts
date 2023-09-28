import passport from "passport"
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt"
import config from "../../config"
import bcrypt from "bcrypt"
import { Strategy } from "passport-local"
import UserModel from "../models/UserModel"

passport.use(
	new Strategy(async (username, password, done) => {
		try {
			const user = await UserModel.findOne({ username })
			if (user === null || !user) {
				return done(null, false)
			}

			if (!bcrypt.compareSync(password, user.password!)) {
				return done(null, false)
			}
			// convert user to plain object to get rid of binary row type
			const loginUser = user.toObject()
			return done(null, loginUser, { message: "Logged In Successfully" }) // use spread syntax to create shallow copy to get rid of binary row type
		} catch (err) {
			return done(err)
		}
	})
)

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.jwt_secret,
		},
		(jwtPayload, done) => {
			done(null, jwtPayload)
		}
	)
)

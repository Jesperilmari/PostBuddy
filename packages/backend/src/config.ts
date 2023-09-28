import dotenv from "dotenv"
dotenv.config()

const variables = [
	"port",
	"db_uri",
	"test_db_uri",
	"jwt_secret",
	"api_base_url",
	"twitter_client_id",
	"twitter_client_secret",
] as const

export type Config = {
	[key in (typeof variables)[number]]: string
}

function createConfig() {
	const config = {} as Config
	variables.forEach((variable) => {
		const value = process.env[variable.toUpperCase()]
		if (!value)
			throw new Error("Missing environment variable: " + variable.toUpperCase())
		config[variable] = value
	})
	return config
}

const config = createConfig()

export default config

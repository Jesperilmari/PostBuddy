import { model, Schema } from "mongoose"
import { Platform } from "../interfaces/Platform"

const platformSchema = new Schema<Platform>(
	{
		name: {
			type: String,
			required: true,
		},
		refresh_token: {
			type: String,
			required: true,
		},
		token: {
			type: String,
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

const PlatformModel = model<Platform>("Platform", platformSchema)

export default PlatformModel

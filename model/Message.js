import mongoose, { Schema, ObjectId } from "mongoose";

const Message = mongoose.model("Message", new Schema(
	{
		id: ObjectId,
		message: {
			type: String,
			require: true
		},
		sender: {
			type: String,
			require: true
		},
		receiver: {
			type: String,
			require: true
		}
	},
	{
		timestamps: true
	}
));

export default Message
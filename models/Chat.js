import mongoose, { Schema, ObjectId } from "mongoose";

const Chat = mongoose.model("Chat", new Schema(
	{
		id: ObjectId,
		user: {
			type: String,
			require: true,
		},
		timeStart: {
            type: Date,
            require: true
        }
	},
	{
		timestamps: true
	}
));

export default Chat
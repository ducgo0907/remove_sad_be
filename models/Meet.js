import mongoose, { Schema, ObjectId } from "mongoose";

const Meet = mongoose.model("Meet", new Schema(
	{
		id: ObjectId,
		timeStart: {
			type: Date,
			require: true
		},
		timeEnd: {
			type: Date,
			require: true
		},
		customer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		address: {
			type: String,
			require: true
		},
		status: {
			type: String,
			default: "PENDING"
		},
		phone: {
			type: String,
			require: true
		}
	},
	{
		timestamps: true
	}
));

export default Meet
import mongoose, { Schema, ObjectId } from "mongoose";

const Order = mongoose.model("Order", new Schema(
	{
		id: ObjectId,
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		money: {
			type: Number,
			require: true
		},
		code: {
			type: String,
			require: true
		},
		status: {
			type: String,
			require: true
		},
		type: {
			type: String,
			require: false,
			default: "CUSTOM"
		}
	},
	{
		timestamps: true
	}
));

export default Order
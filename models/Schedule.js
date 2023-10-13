import mongoose, { Schema, ObjectId } from "mongoose";

const Schedule = mongoose.model("Schedule", new Schema(
	{
		id: ObjectId,
		pylir: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
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
		}
	},
	{
		timestamps: true
	}
));

export default Schedule
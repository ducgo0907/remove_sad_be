import mongoose, { Schema, ObjectId } from "mongoose";

const Item = mongoose.model("Item", new Schema(
	{
		id: ObjectId,
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
        item: {
            type: String,
        },
        amount: {
            type: Number,
        }
	},
	{
		timestamps: true
	}
));

export default Item
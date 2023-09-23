import mongoose, { ObjectId, Schema } from "mongoose";
import isEmail from "validator/lib/isemail.js";

const User = mongoose.model("User", new Schema({
	id: ObjectId,
	name: {
		type: String,
		require: true,
		validate: {
			validator: value => value.length > 3,
			message: 'Length of name must be greater than 3.'
		}
	},
	password: {
		type: String,
		require: true,
		validate: {
			validator: value => value.length >= 8,
			message: 'Pasword length must be greater than or equal 8'
		}
	},
	email: {
		type: String,
		require: true,
		validate: {
			validator: value => isEmail(value),
			message: 'Email incorrect format.'
		}
	},
	phoneNumber: {
		type: String,
		require: true
	},
	address: {
		type: String,
		require: false
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	isActive: {
		type: Boolean,
		default: false
	},
	activationCode: {
		type: String,
		require: false
	}
}))

export default User;


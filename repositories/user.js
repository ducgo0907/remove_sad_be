import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import sendMail from "../util/sendMail.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Item from "../models/Item.js";

const register = async ({ name, email, password }) => {
	// Kiem tra su ton tai cua User
	const existingUser = await User.findOne({ email }).exec();
	if (existingUser != null) {
		throw new Error("User is existed");
	}

	const hashPassword = await bcrypt.hash(password, parseInt(process.env.SECRET_KEY));

	// Create random activation code for user active account
	const activationCode = uuidv4();
	// Goi user model de thao tac du lieu 
	const newUser = await User.create({
		name,
		email,
		password: hashPassword,
		isActive: true
	});

	// const linkActivateCode = `${process.env.base_URL}users/activate?email=${email}&activationCode=${activationCode}`;
	// sendMail(linkActivateCode, email)
	// 	.then(() => {
	// 		console.log("Send mail successfully");
	// 	})
	// 	.catch(error => {
	// 		throw new Error(error);
	// 	})
	return {
		...newUser,
		password: 'Not Show'
	}
}

const getAllUsers = async () => {
	// lay tat ca user
	const listAllUser = await User.find().select("-password");
	if (listAllUser == null) {
		throw new Error("Don't have any user");
	}
	return listAllUser;
}

const login = async ({ email, password }) => {
	try {
		const loginUser = await User.findOne({ email }).exec();

		if (!loginUser) {
			throw new Error('User not found');
		}
		const passwordIsValid = bcrypt.compareSync(password, loginUser.password);

		if (!passwordIsValid) {
			throw new Error("Invalid password");
		}
		const jwtSecret = process.env.SECRET_KEY_JWT;
		const token = jwt.sign({ id: loginUser._id, name: loginUser.name, email: loginUser.email, isActive: loginUser.isActive }, jwtSecret, {
			algorithm: 'HS256',
			expiresIn: 86400
		});
		return {
			id: loginUser._id,
			name: loginUser.name,
			email: loginUser.email,
			isAdmin: loginUser.isAdmin,
			accessToken: token
		}
	} catch (error) {
		throw new Error(error);
	}
}

const activateAccount = async (email, activationCode) => {
	try {
		const activeUser = await User.findOne({ email }).select("-password").exec();
		if (!activeUser) {
			throw new Error('User not existed');
		}
		if (activeUser.isActive) {
			throw new Error('User already active!');
		}
		if (activeUser.activationCode == activationCode) {
			activeUser.isActive = true;
			activeUser.activationCode = '';
		}
		await activeUser.save();
		return activeUser;
	} catch (error) {
		throw new Error(error);
	}
}

const getMoney = async (userId) => {
	const money = await User.findById(userId).select("money");
	const items = await Item.findOne({item: "meeting_ticket", user: userId});
	return {
		money: money.money,
		item: items
	};
}

const checkExistedChat = async (email) => {
	const currentTime = new Date();
	const timeThreshold = new Date(currentTime - 20 * 60 * 1000); // 20 minutes ago
	const existedChat = await Chat.findOne({timeStart: { $gt: timeThreshold }, user: email}).exec();
	if(existedChat){
		return existedChat;
	}else {
		return {status: 0};
	}
}

const goToChat = async (isFree, email) => {
	const user = await User.findOne({email: email}).exec();
	if (!user && isFree) {
		const newChat = await Chat.create({ user: email, timeStart: new Date() });
		return newChat;
	}
	if ((user && user.money && user.money >= 20000)) {
		const newChat = await Chat.create({ user: email, timeStart: new Date() });
		user.money -= 20000;
		await user.save();
		return newChat;
	} else {
		return { status: 0 };
	}
}

const genGuest = async () => {
	let userId = "Khách-" + makeid(10);
	const message = await Message.find({$or: [{sender: userId}, {receiver: userId}]});
	if(message.length > 0){
		userId = "Khách-" + makeid(10);
		return userId;
	}
	return userId;
}

function makeid(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

// Actions wirk DB: ...

export default {
	register,
	getAllUsers,
	login,
	activateAccount,
	getMoney,
	goToChat,
	checkExistedChat,
	genGuest
};
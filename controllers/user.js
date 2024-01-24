import { validationResult } from "express-validator";
import { userRepository } from "../repositories/index.js";

const register = async (req, res) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(400).json({ error: error.array() });
	}

	// Destructuring Request Object
	const { name, email, password } = req.body;
	try {
		// Call action cua Repository (DAO)
		const activeUser = await userRepository.register({ name, email, password })
		console.log(activeUser);
		return res.status(201).json({ message: 'Register successfully.' })
	} catch (error) {
		return res.status(500).json({ message: error.toString() });
	}
}

const getAllUser = async (req, res) => {
	try {
		const listUser = await userRepository.getAllUsers();
		return res.status(200).json(listUser);
	} catch (error) {
		return res.status(500).json({ message: error.toString() });
	}
}

const login = async (req, res) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(400).json({ error: error.array() });
	}

	const { email, password } = req.body;
	try {
		const userInfo = await userRepository.login({ email, password });
		return res.status(200).json(userInfo);
	} catch (error) {
		return res.status(500).json({ message: error.toString() });
	}
}

const activateAccount = async (req, res) => {
	const email = req.query.email;
	const activationCode = req.query.activationCode;
	if (!email || !activationCode) {
		return {
			message: 'Link is not correct!!'
		}
	}

	try {
		const isActive = await userRepository.activateAccount(email, activationCode);
		return res.status(200).json({ message: 'Active user sucessfully' });
	} catch (error) {
		return res.status(500).json({ message: error.toString() })
	}
}

const getMoney = async (req, res) => {
	const userId = req.userID;
	try {
		const money = await userRepository.getMoney(userId);
		return res.status(200).json({ money });
	} catch (error) {
		return res.status(500).json({ message: error.toString() })
	}
}


const checkExistedChat = async (req, res) => {
	const {email} = req.body;
	try{
		const result = await userRepository.checkExistedChat(email);
		return res.status(200).json(result);
	}catch(error) {
		return res.status(500).json(error.toString());
	}
}

const goToChat = async (req, res) => {
	const {isFree, email} = req.body;
	try{
		const result = await userRepository.goToChat(isFree, email);
		return res.status(200).json(result);
	}catch(error) {
		return res.status(500).json(error.toString());
	}
}

export default {
	register,
	getAllUser,
	login,
	activateAccount,
	getMoney,
	goToChat,
	checkExistedChat
}
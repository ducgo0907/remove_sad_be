import Message from "../models/Message.js";
import { messageRepository } from "../repositories/index.js";

const saveMessage = async ({ sender, receiver, message, fakeName, isAdmin }) => {
	const newMessage = await Message.create({
		sender,
		receiver,
		message,
		fakeName,
		isAdmin
	});

	return {
		message: 'success',
		data: newMessage
	}
}

const getAllMessage = async (req, res) => {
	try {
		const { receiver, sender } = req.query;
		const listMessages = await messageRepository.getAllMessage(receiver, sender);
		return res.status(200).json({
			status: 'success',
			data: listMessages
		})
	} catch (error) {
		return res.status(500).json({ error: error.toString() })
	}
}

const getListUser = async (req, res) => {
	try {
		const { adminID } = req.query;
		const listUser = await messageRepository.getListUser({ adminID });
		return res.status(200).json({ data: listUser })
	} catch (error) {
		return res.status(500).json({ error: error.toString() });
	}
}

const getPylir = async (req, res) => {
	try {
		const pylir = await messageRepository.getPylir();
		return res.status(200).json({ message: 'Get pylir successfully', data: pylir });
	} catch (error) {
		return res.status(500).json({ error: error.toString() });
	}
}

const deleteMessage = async (req, res) => {
	const {user} = req.query;
	try {
		await messageRepository.deleteMessage(user);
		return res.status(200).json("Delete successfully");
	}catch(error) {
		return res.status(500).json({ error: error.toString() });
	}
}


export default {
	saveMessage,
	getAllMessage,
	getListUser,
	getPylir,
	deleteMessage
}
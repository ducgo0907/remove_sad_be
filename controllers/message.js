import Message from "../models/Message.js";
import { messageRepository } from "../repositories/index.js";

const saveMessage = async ({ sender, receiver, message, fakeName }) => {
	const newMessage = await Message.create({
		sender,
		receiver,
		message,
		fakeName
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

export default {
	saveMessage,
	getAllMessage
}
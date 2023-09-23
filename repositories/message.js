import Message from "../models/Message.js"

const getAllMessage = async (receiver, sender) => {
	const listAllMessage = await Message.find({
		$or: [{ sender: sender, receiver: receiver }, { sender: receiver, receiver: sender }]
	}).sort({ createdAt: 1});

	return listAllMessage;
}

export default {
	getAllMessage
}
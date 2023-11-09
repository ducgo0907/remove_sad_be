import Message from "../models/Message.js"
import User from "../models/User.js";

const getAllMessage = async (receiver, sender) => {
	const listAllMessage = await Message.find({
		$or: [{ sender: sender, receiver: receiver }, { sender: receiver, receiver: sender }]
	}).sort({ createdAt: 1 });

	return listAllMessage;
}

const getListUser = async ({ adminID }) => {
	try {
		const listUser = await Message.aggregate([
			{
				$match: { receiver: adminID }
			},
			{
				$group: {
					_id: "$sender",
					latestMessageDate: { $max: "$createdAt" }
				}
			},
			{
				$sort: {
					latestMessageDate: -1 // Sort by createdAt in descending order
				}
			},
			{
				$project: {
					_id: 0, // Exclude _id from the result
					sender: "$_id"
				}
			}
		]);

		return listUser;
	} catch (error) {
		throw new Error(error);
	}
}

const getPylir = async () => {
	try {
		const listPylir = await User.find({ isAdmin: true }).select('-password');
		if (!listPylir) {
			throw new Error("Don't existed pylir");
		}
		const pylir = listPylir[Math.floor(Math.random() * listPylir.length)];
		return pylir;
	} catch (error) {
		throw new Error(error);
	}
}

const deleteMessage = async (user) => {
	try {
	  await Message.deleteMany({ $or: [{ sender: user }, { receiver: user }] });
	} catch (error) {
	  throw new Error(error.toString());
	}
  }

export default {
	getAllMessage,
	getListUser,
	getPylir,
	deleteMessage
}
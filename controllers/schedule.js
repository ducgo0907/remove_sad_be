import { scheduleRepository } from "../repositories/index.js"

async function createSchedule(req, res) {
	try {
		const { timeStart, timeEnd, customerId } = req.body;
		const newSchedule = await scheduleRepository.createSchedule({ timeStart, timeEnd, customerId });
		res.status(200).json({ message: 'Create schedule successfully', data: newSchedule })
	} catch (error) {
		res.status(500).json({ message: error });
	}
}

export default {
	createSchedule
}
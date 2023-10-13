import Schedule from "../models/Schedule.js";
import User from "../models/User.js";


async function hasOverlappingSchedules(pylirId, timeStart, timeEnd) {
	const existingSchedules = await Schedule.find({
		pylir: pylirId,
		$or: [
			{
				timeStart: { $lt: timeEnd },
				timeEnd: { $gt: timeStart }
			},
			{
				timeStart: { $gte: timeStart, $lt: timeEnd }
			},
			{
				timeEnd: { $gt: timeStart, $lte: timeEnd }
			}
		]
	});

	return existingSchedules.length > 0;
}


// Find a pylir with free time from a list of userIds
async function findPylirWithFreeTime(userIds, timeStart, timeEnd) {
	for (const userId of userIds) {
		const userHasOverlap = await hasOverlappingSchedules(userId, timeStart, timeEnd);
		if (!userHasOverlap) {
			return userId; // Return the first pylir with free time
		}
	}
	return null; // Return null if no pylir has free time
}

// Create a schedule for a pylir with free time
async function createSchedule({timeStart, timeEnd, customerId}) {
	const pylirs = await User.find({ isAdmin: true }); // Assuming you have a User model
	console.log("1");
	const pylirIdWithFreeTime = await findPylirWithFreeTime(pylirs.map(user => user._id), timeStart, timeEnd);
	console.log("2");
	if (pylirIdWithFreeTime) {
		const newSchedule = new Schedule({
			pylir: pylirIdWithFreeTime,
			timeStart,
			timeEnd,
			customer: customerId
		});

		return newSchedule.save();
	}

	return null; // Return null if no pylir has free time
}
export default {
	createSchedule
}
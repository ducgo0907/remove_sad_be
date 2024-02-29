import Item from "../models/Item.js";
import Meet from "../models/Meet.js"

// Create a schedule for a pylir with free time
async function create({ timeStart, timeEnd, userId, address }) {
    const item = await Item.findOne({ user: userId });
    if (item.amount <= 0) {
        return {
            statusCode: 0,
            content: "Bạn cần mua cà phê gặp mặt trước khi đặt cuộc hẹn"
        }
    } else {
        item.amount -= 1;
        await item.save();
    }
    const meet = await Meet.create({
        timeStart,
        timeEnd,
        customer: userId,
        address
    })
    return {
        statusCode: 1,
        content: meet
    };
}

async function approve({ meetId, status }) {
    const meet = await Meet.findOne({ status: "PENDING", _id: meetId });
    if (!meet) {
        return { statusCode: 0 }
    }
    const item = await Item.findOne({ user: meet.customer });
    if (status === "REFUSE") {
        item.amount += 1;
    }
    meet.status = status;
    await meet.save();
    return {
        statusCode: 1,
        data: meet
    }
}

async function getAll(){
    const listMeet = await Meet.find();
    return listMeet;
}

async function getByUserId(userId){
    const listMeet = await Meet.find({customer: userId});
    return listMeet
}
export default {
    create,
    approve,
    getAll,
    getByUserId
}
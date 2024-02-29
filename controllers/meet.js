import { meetRepository } from "../repositories/index.js";

async function create(req, res) {
    try {
        const { timeStart, timeEnd, address } = req.body;
        const userId = req.userID;
        const newMeeting = await meetRepository.create({ timeStart, timeEnd, address, userId })
        res.status(200).json({ message: 'Create meeting successfully', data: newMeeting })
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

async function approve(req, res) {
    try {
        const { meetId, status } = req.body;
        const result = await meetRepository.approve({ meetId, status })
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

const getAll = async (req, res) => {
    try {
        const result = await meetRepository.getAll();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

const getByCustomerId = async (req, res) => {
    try {
        const userId = req.userID;
        console.log(userId);
        const result = await meetRepository.getByUserId(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export default {
    create,
    approve,
    getAll,
    getByCustomerId
}
import { orderRepository } from "../repositories/index.js";


const createOrder = async (req, res) => {
    try {
        const userId = req.userID;
        const { money } = req.body;
        const result = await orderRepository.createOrder(userId, money);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi hệ thống, vui lòng thử lại"
        })
    }
}

const charge = async (req, res) => {
    const {content} = req.body;
    try{
        const result = await orderRepository.charge(content);
        return res.status(200).json(result);
    }catch(error){
        console.log("error: ", error);
        return res.status(500).json(error.toString());
    }
}

export default {
    createOrder,
    charge
}
import Item from "../models/Item.js";
import Order from "../models/Order.js";
import User from "../models/User.js";


const createOrder = async (userId, money, type) => {
    const orderCode = "PILYR" + generateRandomString(5) + "A";
    try {
        const order = await Order.create({
            user: userId,
            code: orderCode,
            money: money,
            status: "PENDING",
            type: type
        });
        return {
            mesage: "Khởi tạo đơn hàng thành công",
            content: order,
            statusCode: 1
        };
    } catch (error) {
        return error.toString();
    }
}

const charge = async (content) => {
    console.log(content)
    try {
        console.log(1)
        if (content == null || content == undefined || content == '') {
            throw new Error("Nội dung đang bị rỗng");
        }
        const amount = extractSubstring(content, "Số tiền: +", "VND.")
        const rawCode = extractSubstring(content, "PILYR", "A")
        const amountNumber = convertMoney(amount);
        const code = "PILYR" + rawCode + "A";
        if (!amount || !code) {
            throw new Error("Nội dung đang bị rỗng");
        }
        const order = await Order.findOne({ code: code, status: "PENDING" });
        if (!order) { 
            throw new Error("Phiếu mua không tồn tại");
        }
        console.log(9, amountNumber)
        console.log(order.user, 10);
        console.log(order, 11);
        const user = await User.findById(order.user);
        if (order.type == "MEETING") {
            const item = await Item.findOne({
                item: "meeting_ticket",
                user: order.user
            });
            if (!item) {
                await Item.create({
                    user: order.user,
                    item: "meeting_ticket",
                    amount: 1
                })
            }else {
                item.amount += 1;
                await item.save();
            }
        }else if (order.type == "COMBO3") {
            user.money += 60000;
            await user.save();
        }else if (order.type == "COMBO7"){
            user.money += 140000;
            await user.save();
        }else if(order.type == "CUSTOM"){
            user.money += order.money;
            await user.save();
        }else if(order.type == "MEMBER"){
            user.isVipMember = true;
            await user.save();
        }
        order.status = "FINISHED";
        await order.save();
        return {
            message: "Nạp tiền thành công",
            statusCode: 1
        }
    } catch (error) {
        return error.toString();
    }
}

const getDataByTypeAndDate = async (type, dateFrom, dateTo) => {
    try {
        const fromDate = new Date(dateFrom);
        const endDate = new Date(dateTo);
        endDate.setHours(23);
        fromDate.setHours(0);
        const listData = await Order.find({
            createdAt: {
                $gte: fromDate,
                $lte: endDate
            },
            type,
            status: "FINISHED"
        });
        return {
            message: "Get data success",
            statusCode: 1,
            data: listData
        }
    } catch (error) {
        // console.log("error", error);
    }

}

function convertMoney(inputString) {
    if (!inputString) return null;

    // Use regular expression to extract the numeric part
    const match = inputString.match(/[0-9,]+/);

    // Extracted number as a string
    const extractedNumberString = match ? match[0] : null;

    // Remove commas from the extracted number string
    const cleanedNumberString = extractedNumberString ? extractedNumberString.replace(/,/g, '') : null;

    // Convert the cleaned string to an actual number
    const extractedNumber = cleanedNumberString ? parseInt(cleanedNumberString, 10) : null;

    return extractedNumber;
}

function extractSubstring(inputString, startMarker, endMarker) {
    const regexPattern = new RegExp(`${startMarker}(.*?)${endMarker}`);
    const match = inputString.match(regexPattern);
    return match ? match[1].trim() : null;
}

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzBCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

export default {
    createOrder,
    charge,
    getDataByTypeAndDate
}
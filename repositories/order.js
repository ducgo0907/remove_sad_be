import Order from "../models/Order.js";
import User from "../models/User.js";


const createOrder = async (userId, money) => {
    const orderCode = generateRandomString(5);
    try {
        const order = await Order.create({
            user: userId,
            code: orderCode,
            money: money,
            status: "PENDING"
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
        const rawCode = extractSubstring(content, "Nội dung giao dịch: ", ".CT")
        const amountNumber = convertMoney(amount);
        const code = rawCode.slice(-5);
        if (!amount || !code) {
            throw new Error("Nội dung đang bị rỗng");
        }
        console.log(8, code)
        const order = await Order.findOne({ code: code, status: "PENDING" });
        if (!order) {
            throw new Error("Phiếu mua không tồn tại");
        }
        console.log(9, amountNumber)
        console.log(order.user, 10);
        const user = await User.findById(order.user);
        user.money += amountNumber;
        await user.save();
        console.log("user: ", user);
        return {
            message: "Nạp tiền thành công",
            statusCode: 1
        }
    } catch (error) {
        return error.toString();
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
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

export default {
    createOrder,
    charge
}
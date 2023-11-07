import express from 'express';
import config from '../config/config.js';
import moment from 'moment/moment.js';
import QueryString from 'qs';
import crypto from 'crypto';
import authJwt from '../middleware/authJwt.js';
import User from '../models/User.js';
const orderRouter = express.Router();

orderRouter.post('/create_payment_url', authJwt.verifyToken, function (req, res) {
	process.env.TZ = 'Asia/Ho_Chi_Minh';

	let date = new Date();
	let createDate = moment(date).format('YYYYMMDDHHmmss');

	let ipAddr = req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;

	let userId = req.userID;
	let tmnCode = config['vnp_TmnCode'];
	let secretKey = config['vnp_HashSecret'];
	let vnpUrl = config['vnp_Url'];
	let returnUrl = config['vnp_ReturnUrl'] + "?userId=" + userId;
	let orderId = moment(date).format('DDHHmmss');
	let amount = req.body.amount;
	let bankCode = req.body.bankCode;

	let locale = req.body.language;
	if (locale === null || locale === '') {
		locale = 'vn';
	}
	let currCode = 'VND';
	let vnp_Params = {};
	vnp_Params['vnp_Version'] = '2.1.0';
	vnp_Params['vnp_Command'] = 'pay';
	// vnp_Params['user_id']=userId;
	vnp_Params['vnp_TmnCode'] = tmnCode;
	vnp_Params['vnp_Locale'] = locale;
	vnp_Params['vnp_CurrCode'] = currCode;
	vnp_Params['vnp_TxnRef'] = orderId;
	vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
	vnp_Params['vnp_OrderType'] = 'other';
	vnp_Params['vnp_Amount'] = amount * 100;
	vnp_Params['vnp_ReturnUrl'] = returnUrl;
	vnp_Params['vnp_IpAddr'] = ipAddr;
	vnp_Params['vnp_CreateDate'] = createDate;
	if (bankCode !== null && bankCode !== '') {
		vnp_Params['vnp_BankCode'] = bankCode;
	}

	vnp_Params = sortObject(vnp_Params);

	let signData = QueryString.stringify(vnp_Params, { encode: false });
	let hmac = crypto.createHmac("sha512", secretKey);
	let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
	vnp_Params['vnp_SecureHash'] = signed;
	vnpUrl += '?' + QueryString.stringify(vnp_Params, { encode: false });

	res.status(200).json(vnpUrl);
});

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			str.push(encodeURIComponent(key));
		}
	}
	str.sort();
	for (key = 0; key < str.length; key++) {
		if(str[key] !== "userId"){
			sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
		}
	}
	return sorted;
}

orderRouter.get('/vnpay_return', async function (req, res, next) {
	let vnp_Params = req.query;
	console.log(vnp_Params);

	let secureHash = vnp_Params['vnp_SecureHash'];

	delete vnp_Params['vnp_SecureHash'];
	delete vnp_Params['vnp_SecureHashType'];

	vnp_Params = sortObject(vnp_Params);

	let tmnCode = config['vnp_TmnCode'];
	let secretKey = config['vnp_HashSecret'];
	let {userId} = req.query;
	let signData = QueryString.stringify(vnp_Params, { encode: false });
	let hmac = crypto.createHmac("sha512", secretKey);
	let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

	if (secureHash === signed) {
		//Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
		console.log("Amount: ", vnp_Params['vnp_Amount']);
		const user = await User.findById(userId);
		const currentMoney = user.money ? user.money : 0;
		user.money = currentMoney + parseInt(vnp_Params['vnp_Amount']) / 100;
		await user.save();
		res.redirect("https://pylir.netlify.app/success");
	} else {
		console.log("Vao day");
		res.redirect("https://pylir.netlify.app/failed");
	}
});


export default orderRouter;
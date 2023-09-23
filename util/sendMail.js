import nodemailer from 'nodemailer'
import fs from "fs";

const htmlTemplate = fs.readFileSync('./util/email.html', 'utf-8');

const sendMail = async (activationLink, email) => {
	const html = htmlTemplate.replace('{{activationLink}}', activationLink);
	var transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: 'ngoquangtrung2047@gmail.com',
			pass: 'bhtx kkkz lbvh qbow'
		}
	})

	const info = await transporter.sendMail({
		from: "Ngo Quang Trung <ngoquangtrung2047@gmail.com>",
		to: email,
		subject: 'Testing send email',
		html: html,
	});

	console.log("Message sent: " + info.messageId);
}

export default sendMail;

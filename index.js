import express from 'express';
import http from 'http';
import * as dotvn from 'dotenv'
import { Server } from 'socket.io';
import { messageController } from './controllers/index.js';
import ConnectDB from './database/database.js';
import router from './routes/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/config.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

dotvn.config();

const server = http.createServer(app);
const socketIo = new Server(server, {
	cors: {
		origin: ["https://ducgo0907.github.io", "http://localhost:3000", "https://pilyr.netlify.app"], // Replace with the actual origin of your frontend
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true, // Enable credentials (important for cookies and authentication)
	},
});
app.use(cors({
	origin: ["https://ducgo0907.github.io", "http://localhost:3000", "https://pilyr.netlify.app"], // Replace with the origin of your frontend
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true, // Enable credentials (if needed)
}));

app.get('/', (req, res) => {
	return res.status(200).json('Hello 12');
});

app.use(router);

// Keep track of connected users
const connectedUsers = {};
let listUser = [];
socketIo.on('connection', (socket) => {
	console.log('New client connected', socket.id);

	// Store the user's socket ID when they connect
	socket.on('storeUserId', ({ userId, isAdmin, username }) => {
		connectedUsers[`${userId}`] = socket.id;
		if (!isAdmin) {
			const userExisted = listUser.find(u => u.email === userId);
			if (!userExisted)
				listUser.push({ email: userId, name: username });
			socketIo.emit("getListUserPending", listUser);
		}
	});

	socket.on('getListUserPendingInit', (data) => {
		socketIo.emit("getListUserPending", listUser);
	})


	// socket.on('storeAdminId', (adminId) => {
	// 	connectedAdmin[adminId] = socket.id;
	// });

	// socket.on('getConnectedAdmin', () => {
	// 	console.log(connectedAdmin);
	// 	socket.emit('getConnectedAdmin', Object.keys(connectedAdmin));
	// })


	socket.on("connectedWithUser", async ({admin, user}) => {
		let receiverSocketId = connectedUsers[user];
		socketIo.to(receiverSocketId).emit("getAdminId", admin);
		socketIo.to(receiverSocketId).emit('privateMessage', {
			sender: admin,
			message: "Hi, welcome to pylir!",
			isAdmin: true
		});
		await messageController.saveMessage({
			sender: admin,
			receiver: user,
			message: "Hi, welcome to pylir!",
			isAdmin: true
		});
		listUser = listUser.filter(us => us.email !== user);
		socketIo.emit("getListUserPending", listUser);
	})

	// Send the list of connected users to the client
	socket.on('getConnectedUsers', () => {
		socket.emit('connectedUsers', Object.keys(connectedUsers));
	});

	socket.on('privateMessage', async ({ sender, receiver, message, fakeName, isAdmin }) => {
		let receiverSocketId = connectedUsers[receiver];
		// if (sender == 'trungnqhe161514@fpt.edu.vn') {
		// 	receiverSocketId = connectedUsers[receiver];
		// }
		if (receiverSocketId) {
			try {
				const savedMessage = await messageController.saveMessage({
					sender,
					receiver,
					message,
					fakeName,
					isAdmin
				});
				// Send the message to the receiver only
				socketIo.to(receiverSocketId).emit('privateMessage', {
					sender,
					message,
					fakeName,
					isAdmin
				});
			} catch (error) {
				console.error('Error saving message to the database:', error);
				// Handle the error gracefully
			}
		} else {
			// Handle the case where the receiver is not online
			socket.emit('receiverOffline', receiver);
		}
	});


	socket.on('disconnect', () => {
		// Remove the user's socket ID when they disconnect
		const userId = Object.keys(connectedUsers).find(
			(key) => connectedUsers[key] === socket.id
		);
		if (userId) {
			delete connectedUsers[userId];
			listUser = listUser.filter(user => user.email !== userId);
			console.log('User disconnected:', userId);
		}
	});
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, async () => {
	await ConnectDB();
	console.log(`Server is running on port: ${PORT}`);
});

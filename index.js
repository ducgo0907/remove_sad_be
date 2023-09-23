import express from 'express';
import http from 'http';
import * as dotvn from 'dotenv'
import { Server } from 'socket.io';
import { messageController } from './controllers/index.js';
import ConnectDB from './database/database.js';
import router from './routes/index.js';
import cors from 'cors';
import { authJWT } from './middleware/index.js';

const app = express();
app.use(express.json());

dotvn.config();

const server = http.createServer(app);
const socketIo = new Server(server, {
	cors: {
		origin: 'http://localhost:3000', // Replace with the actual origin of your frontend
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true, // Enable credentials (important for cookies and authentication)
	},
});
app.use(cors({
	origin: 'http://localhost:3000', // Replace with the origin of your frontend
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true, // Enable credentials (if needed)
}));

app.get('/', (req, res) => {
	return res.status(200).json('Hello 12');
});

app.use(router);

// Keep track of connected users
const connectedUsers = {};

socketIo.on('connection', (socket) => {
	console.log('New client connected', socket.id);

	// Store the user's socket ID when they connect
	socket.on('storeUserId', (userId) => {
		connectedUsers[userId] = socket.id;
	});

	// Send the list of connected users to the client
	socket.on('getConnectedUsers', () => {
		socket.emit('connectedUsers', Object.keys(connectedUsers));
	});

	socket.on('privateMessage', async ({ sender, receiver, message, fakeName }) => {
		let receiverSocketId = connectedUsers['trungnqhe161514@fpt.edu.vn'];
		if (sender === 'trungnqhe161514@fpt.edu.vn') {
			receiverSocketId = connectedUsers[receiver];
		}
		if (receiverSocketId) {
			try {
				receiver = sender !== 'trungnqhe161514@fpt.edu.vn' ? 'trungnqhe161514@fpt.edu.vn' : receiver;
				const savedMessage = await messageController.saveMessage({
					sender,
					receiver,
					message,
					fakeName
				});
				// Send the message to the receiver only
				socketIo.to(receiverSocketId).emit('privateMessage', {
					sender,
					message,
					fakeName,
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
			console.log('User disconnected:', userId);
		}
	});
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, async () => {
	await ConnectDB();
	console.log(`Server is running on port: ${PORT}`);
});

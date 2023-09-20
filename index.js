const express = require('express');
const http = require("http");

var app = express();
const sever = http.createServer(app);

const socketIo = require("socket.io")(sever, {
	cors: {
		origin: "*",
	}
})

socketIo.on("connection", (socket) => {
	console.log("New client connected", socket.id);

	socket.emit("getId", socket.id);

	socket.on("sendDataClient", function (data) {
		socketIo.emit("sendDataSever", { data });
	})

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});

sever.listen(3000, () => {
	console.log(`Sever is running on port: 3000`);
})
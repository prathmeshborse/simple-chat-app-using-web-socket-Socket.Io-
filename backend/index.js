import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173", // Allow requests from the React app running on port 5173
		methods: ["GET", "POST"], // Allow GET and POST methods
		credentials: true, // Allow credentials (cookies, authorization headers, etc.)
	},
});


app.get("/", (req, res) => {
	res.send("Server is running");
});

server.listen(3000, () => {
	console.log("Server is running on port 3000");
});
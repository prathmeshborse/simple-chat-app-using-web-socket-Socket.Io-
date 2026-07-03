import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

// Io is the Socket.IO server instance that allows real-time communication between the server and clients.
// It is configured to allow cross-origin requests from the React app running on port 5173, enabling GET and POST methods,
// and allowing credentials such as cookies and authorization headers.
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

const users = new Map();

io.on("connection", (socket) => {
	console.log("A user connected: ", socket.id);

	socket.on("joinRoom", async (user) => {
		await socket.join("Group Chat");
		console.log(`${user} joined the room`);

        users.set(socket.id, user);
		io.to("Group Chat").emit("userJoined", `${user} joined the room`);
	});

	socket.on("sendMessage", (message) => {
		io.to("Group Chat").emit("receiveMessage", message);
	});


    socket.on("typing", ({userName, isTyping}) => {
        socket.to("Group Chat").emit("typing", {userName, isTyping});
    });

	socket.on("disconnect", () => {
        const userName = users.get(socket.id);
        if(userName) {
            socket.to("Group Chat").emit("typing", { userName, isTyping: false });
            users.delete(socket.id);
        }
		console.log("A user disconnected: ", socket.id);
	});
});

app.get("/", (req, res) => {
	res.send("Server is running");
});

server.listen(3000, () => {
	console.log("Server is running on port 3000");
});
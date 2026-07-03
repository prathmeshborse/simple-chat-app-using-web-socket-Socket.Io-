# Realtime Group Chat Application

A simple realtime group chat application built with **React**, **Socket.IO**, **Express**, and **Node.js**. Users can join a shared chat room, send messages instantly, and see typing indicators from other participants.

## Features

* Realtime messaging using Socket.IO
* Join chat with a custom username
* Shared group chat room
* Live typing indicators
* Automatic user join notifications
* Responsive and clean UI
* Message timestamps
* Disconnect handling

---

## Tech Stack

### Frontend

* React
* Vite
* Socket.IO Client
* Tailwind CSS

### Backend

* Node.js
* Express
* Socket.IO

---

## Project Structure

```text
project-root/
│
├── client/
│   ├── src/
│   │   ├── connection/
│   │   │   └── ws.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/realtime-group-chat.git
cd realtime-group-chat
```

---

### 2. Install Dependencies

#### Client

```bash
cd client
npm install
```

#### Server

```bash
cd ../server
npm install
```

---

## Running the Application

### Start the Backend Server

Navigate to the server directory and run:

```bash
npm run dev
```

or

```bash
node server.js
```

Server will start on:

```text
http://localhost:3000
```

---

### Start the Frontend

Navigate to the client directory and run:

```bash
npm run dev
```

Frontend will start on:

```text
http://localhost:5173
```

---

## Socket Events

### Client → Server

| Event         | Description                  |
| ------------- | ---------------------------- |
| `joinRoom`    | User joins the chat room     |
| `sendMessage` | Sends a new message          |
| `typing`      | Indicates user typing status |

---

### Server → Client

| Event            | Description                       |
| ---------------- | --------------------------------- |
| `userJoined`     | Broadcasts user join notification |
| `receiveMessage` | Delivers chat messages            |
| `typing`         | Updates typing status of users    |

---

## Typing Indicator Flow

1. User starts typing.
2. Client emits:

```javascript
socket.emit("typing", {
  userName,
  isTyping: true,
});
```

3. Server broadcasts typing status to all other users.

4. After a timeout or when input becomes empty:

```javascript
socket.emit("typing", {
  userName,
  isTyping: false,
});
```

5. Other clients update the typing indicator UI.

---

## Message Format

```javascript
{
  id: Date.now(),
  sender: "John",
  text: "Hello everyone!",
  ts: Date.now()
}
```

---

## Room Architecture

All users join a common Socket.IO room:

```javascript
socket.join("Group Chat");
```

Messages and typing events are broadcast only within this room.

---

## Future Improvements

* Private messaging
* Multiple chat rooms
* User online/offline status
* Message persistence with MongoDB
* Authentication and authorization
* Emoji support
* Read receipts
* File and image sharing
* Dark mode
* User avatars

---

## Environment Requirements

* Node.js v18+
* npm v9+

---

## Dependencies

### Frontend

```json
{
  "react": "^19.x",
  "socket.io-client": "^4.x",
  "tailwindcss": "^4.x"
}
```

### Backend

```json
{
  "express": "^5.x",
  "socket.io": "^4.x"
}
```

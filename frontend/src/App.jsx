import { useEffect, useState, useRef } from "react";
import Ws from "./connection/ws";

export default function App() {

    const socketRef = useRef(null);
    const timeoutRef = useRef(null);
    const userNameRef = useRef("");

    const [showNamePopup, setShowNamePopup] = useState(true);
    const [inputName, setInputName] = useState("");

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [typingUsers, setTypingUsers] = useState([]);

    function formatTime(ts) {
        const d = new Date(ts);
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
    }

    useEffect(() => {
        socketRef.current = Ws();

        socketRef.current?.on("connect", () => {
            console.log("Connected to server with id: ", socketRef.current.id);
        });

        socketRef.current?.on("userJoined", (message) => {
            setMessages((prev) => [...prev, { id: Date.now(), sender: "System", text: message, ts: Date.now() }]);
        });

        socketRef.current?.on("receiveMessage", (message) => {
            setMessages((prev) => [...prev, { id: message["id"], sender: message["sender"], text: message["text"], ts: message["ts"] }]);
        });

        socketRef.current?.on("typing", ({ userName: typerName, isTyping }) => {
            console.log("listener userName =", userNameRef.current);
            console.log("typerName =", typerName);
            if (typerName === userNameRef.current) return; // Ignore typing events from self

            if (!isTyping) {
                setTypingUsers((prev) => prev.filter((user) => user !== typerName));
            }
            else {
                setTypingUsers((prev) => {
                    if (!prev.includes(typerName)) {
                        return [...prev, typerName];
                    }
                    return prev;
                });
            }
        });

        return () => {
            socketRef.current.off("connect");
            socketRef.current.off("userJoined");
            socketRef.current.off("receiveMessage");
            socketRef.current.off("typing");
            socketRef.current?.disconnect();
        };
    }, []);


    useEffect(() => {
        if (!userNameRef.current) return;
        if (!socketRef.current?.connected) return;

        // If the text is empty or only whitespace, emit a typing event with isTyping set to false and return early.
        if (!text.trim()) {
            socketRef.current?.emit("typing", { userName: userNameRef.current, isTyping: false, });
            return;
        }

        socketRef.current?.emit("typing", { userName: userNameRef.current, isTyping: true, });

        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            socketRef.current?.emit("typing", { userName: userNameRef.current, isTyping: false, });
        }, 4000);

        return () => clearTimeout(timeoutRef.current);
    }, [text]);


    function handleNameSubmit(e) {
        e.preventDefault();

        const trimmed = inputName.trim();

        if (trimmed) {
            userNameRef.current = trimmed;
            setShowNamePopup(false);
            socketRef.current?.emit("joinRoom", trimmed);
        }
    }

    function sendMessage() {
        const trimmed = text.trim();

        if (!trimmed) return;

        const newMessage = {
            id: Date.now(),
            sender: userNameRef.current,
            text: trimmed,
            ts: Date.now(),
        };

        socketRef.current?.emit("sendMessage", newMessage);
        setText("");
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4 font-inter">
            {/* NAME POPUP */}
            {showNamePopup && (
                <div className="fixed inset-0 flex items-center justify-center z-40">
                    <div className="bg-white rounded-xl shadow-lg max-w-md p-6">
                        <h1 className="text-xl font-semibold text-black">
                            Enter your name
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Enter your name to start chatting.
                        </p>

                        <form onSubmit={handleNameSubmit} className="mt-4">
                            <input autoFocus value={inputName} onChange={(e) => setInputName(e.target.value)}
                                className="w-full border border-gray-200 rounded-md px-3 py-2 outline-green-500 placeholder-gray-400"
                                placeholder="Your name (e.g. John Doe)"
                            />

                            <button type="submit"
                                className="block ml-auto mt-3 px-4 py-1.5 rounded-full bg-green-500 text-white font-black text-sm hover:bg-green-600 transition cursor-pointer"
                            >
                                Continue
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* CHAT WINDOW */}
            {!showNamePopup && (
                <div className="w-full max-w-2xl h-[90vh] bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
                    {/* HEADER */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
                        <div className="h-10 w-10 rounded-full bg-[#075E54] flex items-center justify-center text-white font-semibold text-lg">
                            {userNameRef.current?.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1">
                            <div className="text-sm font-medium text-[#303030]">
                                Realtime Group Chat
                            </div>

                            {
                                typingUsers.length > 0 &&
                                <div className="text-xs text-gray-500">
                                    {typingUsers.join(",")} {typingUsers.length === 1 ? "is" : "are"} typing...
                                </div>
                            }

                        </div>

                        <div className="text-sm text-gray-500">
                            Signed in as{" "}
                            <span className="font-medium text-[#303030] capitalize">
                                {userNameRef.current}
                            </span>
                        </div>
                    </div>

                    {/* MESSAGES */}
                    <div className="flex-1 overflow-y-auto p-4 bg-zinc-100 flex flex-col">
                        {messages.map((m) => {
                            const mine = m.sender === userNameRef.current;

                            return (
                                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`} >
                                    <div
                                        className={`max-w-[78%] p-3 my-2 rounded-[18px] text-sm shadow-sm ${mine
                                            ? "bg-[#DCF8C6] text-[#303030]"
                                            : "bg-white text-[#303030]"
                                            }`}
                                    >
                                        <div>{m.text}</div>

                                        <div className="flex justify-between items-center mt-1 gap-4">
                                            <div className="text-[11px] font-bold">
                                                {m.sender}
                                            </div>

                                            <div className="text-[11px] text-gray-500">
                                                {formatTime(m.ts)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* INPUT */}
                    <div className="px-4 py-3 border-t border-gray-200 bg-white">
                        <div className="flex items-center gap-4 border border-gray-200 rounded-full">
                            <textarea
                                rows={1}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                className="w-full resize-none px-4 py-4 text-sm outline-none"
                            />

                            <button
                                onClick={sendMessage}
                                className="bg-green-500 text-white px-4 py-2 mr-2 rounded-full text-sm font-medium hover:bg-green-600 transition cursor-pointer"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
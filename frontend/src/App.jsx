import { useState } from "react";

export default function App() {
  const [userName, setUserName] = useState("");
  const [showNamePopup, setShowNamePopup] = useState(true);
  const [inputName, setInputName] = useState("");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  function formatTime(ts) {
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  function handleNameSubmit(e) {
    e.preventDefault();

    const trimmed = inputName.trim();

    if (trimmed) {
      setUserName(trimmed);
      setShowNamePopup(false);
    }
  }

  function sendMessage() {
    const trimmed = text.trim();

    if (!trimmed) return;

    const newMessage = {
      id: Date.now(),
      sender: userName,
      text: trimmed,
      ts: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
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
              <input autoFocus value={inputName}  onChange={(e) => setInputName(e.target.value)}
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
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="text-sm font-medium text-[#303030]">
                Realtime Group Chat
              </div>
              <div className="text-xs text-gray-500">
                someone is typing...
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Signed in as{" "}
              <span className="font-medium text-[#303030] capitalize">
                {userName}
              </span>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 bg-zinc-100 flex flex-col">
            {messages.map((m) => {
              const mine = m.sender === userName;

              return (
                <div key={m.id} className={`flex ${ mine ? "justify-end" : "justify-start"  }`} >
                  <div
                    className={`max-w-[78%] p-3 my-2 rounded-[18px] text-sm shadow-sm ${
                      mine
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
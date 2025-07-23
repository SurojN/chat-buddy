"use client";

import { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from "react";

type Message = {
  from: "user" | "ai";
  text: string;
  image?: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { from: "ai", text: "👋 Welcome! Ask me anything or send an image." },
  ]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  type ApiResponse = {
    text: string;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data: ApiResponse = await res.json();
      setMessages((prev) => [...prev, { from: "ai", text: data.text }]);
    } catch (err) {
      console.error("AI error", err);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Error. Try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="w-full flex flex-col max-w-3xl mx-auto h-screen p-6 bg-gray-400 text-gray-300 font-sans selection:bg-blue-600 selection:text-white">
      <h1 className="text-4xl font-semibold mb-6 text-blue-300 tracking-wide drop-shadow-md">
        Kura kani -<span className="text-blue-500">- Chat Buddy</span>
      </h1>

      <div className="flex-grow overflow-y-auto mb-6 p-6 bg-gray-500 rounded-3xl shadow-lg shadow-black/70">
        {messages.map((msg, i) => {
          const isUser = msg.from === "user";
          return (
            <div
              key={i}
              className={`my-3 p-4 rounded-2xl max-w-[70%] break-words
                ${
                  isUser
                    ? "ml-auto bg-gradient-to-br from-blue-300 to-blue-500 text-white shadow-md shadow-blue-900/60"
                    : "mr-auto bg-gradient-to-br from-gray-700 to-gray-500 text-gray-300 shadow-md shadow-black/60"
                }
                animate-fadeIn`}
              style={{ animationDuration: "0.3s" }}
            >
              {msg.text}
            </div>
          );
        })}

        {isTyping && (
          <div className="max-w-[60%] p-4 rounded-2xl bg-gray-700 text-gray-400 shadow-md shadow-black/40 animate-fadeIn italic">
            AI is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-4 items-center">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-grow bg-gray-700 placeholder-blue-300 rounded-full px-6 py-3
            text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
            transition duration-300"
          autoComplete="off"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-400 hover:bg-blue-400 active:bg-blue-500
            text-white font-semibold rounded-full px-7 py-3 shadow-md
            transition duration-200 transform hover:scale-105 active:scale-95"
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

// File: src/App.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./App.css";

const socket = io("http://localhost:5555"); // Adjust if backend is deployed

function App() {
  const [userId, setUserId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setChat((prev) => [...prev, data]);
    });
  }, []);

  const fetchChat = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5555/chat/${propertyId}/${userId}/${recipientId}`
      );
      setChat(res.data);
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const sendMessage = async () => {
    if (!message) return;

    const newMsg = {
      senderId: userId,
      recipientId,
      propertyId,
      message,
    };

    try {
      await axios.post("http://localhost:5555/chat", newMsg);
      socket.emit("sendMessage", newMsg);
      setChat((prev) => [...prev, newMsg]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="app">
      <h1>Property Chat</h1>
      <div className="form">
        <input
          placeholder="Your User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          placeholder="Recipient ID"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
        />
        <input
          placeholder="Property ID"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
        />
        <button onClick={fetchChat}>Load Chat</button>
      </div>

      <div className="chat-box">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={msg.senderId === userId ? "msg sender" : "msg recipient"}
          >
            <p>{msg.message}</p>
          </div>
        ))}
      </div>

      <div className="send-box">
        <input
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;

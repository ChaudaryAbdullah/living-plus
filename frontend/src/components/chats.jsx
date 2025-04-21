import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./css/chats.css";

const socket = io("http://localhost:5556"); // Adjust for deployment

function App({ userId, ownerId, propertyId }) {
  const [chatId, setChatId] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  // Initialize chat
  useEffect(() => {
    const initiateChat = async () => {
      try {
        const res = await axios.get("http://localhost:5556/chat/findOrCreate", {
          params: {
            applicantId: userId,
            ownerId,
            propertyId,
          },
        });
        setChatId(res.data._id);

        // Fetch messages
        const msgRes = await axios.get(
          `http://localhost:5556/chat/messages/${res.data._id}`
        );
        setChat(msgRes.data);
      } catch (error) {
        console.error("Error initiating chat:", error);
      }
    };

    initiateChat();
  }, [userId, ownerId, propertyId]);

  // Listen for real-time messages
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      if (data.chatId === chatId) {
        setChat((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (!message || !chatId) return;

    const newMsg = {
      chatId,
      senderId: userId,
      message,
    };

    try {
      await axios.post("http://localhost:5556/chat/message", newMsg);
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

// src/App.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Sidebar from "./Sidebar";
// import "./App.css";

const socket = io("http://localhost:5555");

function ChatPanel({ property, messages, onSendMessage }) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-panel">
      {property ? (
        <>
          <div className="chat-header">Chatting about: {property.title}</div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.senderId === "USER_ID" ? "sent" : "received"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </>
      ) : (
        <div className="chat-placeholder">
          Select a property to start chatting
        </div>
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5555/profile", {
          withCredentials: true,
        });

        setUser(response.data);
        setLoading(false);

        if (response.data?.user?._id) {
          setFormData((prevData) => ({
            ...prevData,
            userId: response.data.user._id,
          })); // Set userId in formData
        }

        if (response.data?.user?.ownerId) {
          fetchRentalsForUser(response.data.user.ownerId);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      socket.emit("join_property", selectedProperty._id);
    }
  }, [selectedProperty]);

  useEffect(() => {
    socket.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = (msg) => {
    if (!selectedProperty) return;
    console.log(user.user.id);
    const messageData = {
      //   propertyId: selectedProperty._id,
      senderId: user.user.id, // Replace with actual user ID from auth
      text: msg,
    };
    socket.emit("send_message", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
  };

  if (user) {
    console.log("user", user.user.id);
  }
  return (
    <div className="app-container">
      <Sidebar setSelectedProperty={setSelectedProperty} />
      <ChatPanel
        property={selectedProperty}
        messages={messages}
        onSendMessage={sendMessage}
      />
    </div>
  );
}

export default App;

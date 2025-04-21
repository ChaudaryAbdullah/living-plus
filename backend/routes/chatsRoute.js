import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useParams, useHistory } from "react-router-dom";
import "./css/chats.css";

const socket = io("http://localhost:5556"); // Make sure to adjust this to your backend's URL

function ChatRoom() {
  const { chatId } = useParams(); // Get chatId from URL
  const [userId, setUserId] = useState(""); // This should be dynamically set, e.g., via context or props
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [chatsList, setChatsList] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Fetch all chats for the user (either owner or applicant)
    const fetchChats = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5556/chat/allChats/${userId}`
        );
        setChatsList(res.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();

    // Fetch existing chat messages when component mounts
    const fetchChatMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5556/chat/messages/${chatId}`
        );
        setChat(res.data);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchChatMessages();

    // Listen for incoming messages from the socket
    socket.on("receiveMessage", (newMessage) => {
      setChat((prevChat) => [...prevChat, newMessage]);
    });

    return () => {
      socket.off("receiveMessage"); // Cleanup on unmount
    };
  }, [chatId, userId]);

  const sendMessage = async () => {
    if (!message) return; // Don't send empty messages

    const newMsg = {
      chatId,
      senderId: userId,
      message,
    };

    try {
      // Post message to backend
      const res = await axios.post(
        "http://localhost:5556/chat/message",
        newMsg
      );

      // Emit the new message through socket to all connected clients
      socket.emit("sendMessage", res.data);

      // Add message to chat view
      setChat((prevChat) => [...prevChat, res.data]);
      setMessage(""); // Clear message input
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleChatSelect = (selectedChatId) => {
    // Navigate to the selected chat's page
    history.push(`/chat/${selectedChatId}`);
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <h2>Chats</h2>
        <ul>
          {chatsList.map((chatItem) => (
            <li
              key={chatItem._id}
              onClick={() => handleChatSelect(chatItem._id)}
            >
              <div>
                <strong>{chatItem.propertyId.name}</strong>
                <p>Applicant: {chatItem.applicantId.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-room">
        <h1>Chat with Property Owner</h1>

        {/* Chat Box */}
        <div className="chat-box">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={
                msg.senderId === userId ? "msg sender" : "msg recipient"
              }
            >
              <p>{msg.message}</p>
            </div>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="send-box">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;

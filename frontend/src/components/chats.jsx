import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import "./css/chats.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const socket = io("http://localhost:5556");

function ChatRoomLayout() {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("chatId");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(chatId || null);
  const [activeItem, setActiveItem] = useState("chats");
  const [activePage, setActivePage] = useState("Chats");
  // Update selectedChatId if chatId changes in URL
  useEffect(() => {
    if (chatId) {
      setSelectedChatId(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5556/profile", {
          withCredentials: true,
        });
        const currentUser = res.data.user;
        setUser(currentUser);
        fetchChats(currentUser);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchChats = async (currentUser) => {
      try {
        const res = await axios.get(
          `http://localhost:5556/chat/${currentUser.id}/chats`
        );

        console.log(res.data);
        const res1 = await axios.get(
          `http://localhost:5556/chat/${currentUser.ownerId}/chats`
        );
        console.log(res1.data);

        setChats([...res.data, ...res1.data]);
        if (!selectedChatId && res.data.length > 0) {
          setSelectedChatId(res.data[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!selectedChatId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5556/chat/messages/${selectedChatId}`
        );
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [selectedChatId]);

  useEffect(() => {
    // Listen for incoming messages via socket
    socket.on("receiveMessage", (msg) => {
      // If the received message belongs to the selected chat, update messages
      if (msg.chatId === selectedChatId) {
        setMessages((prev) => [...prev, msg]);
        updateChatWithLatestMessage(msg); // Update the chat preview as well
      }
    });

    return () => socket.off("receiveMessage"); // Clean up the listener on unmount
  }, [selectedChatId]);

  // Update the chat preview in the sidebar with the latest message
  const updateChatWithLatestMessage = (msg) => {
    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat._id === msg.chatId) {
          return {
            ...chat,
            lastMessage: msg.message,
            updatedAt: new Date(),
          };
        }
        return chat;
      });
    });
  };

  const sendMessage = async () => {
    if (!message || !selectedChatId || !user?.id) return;
    try {
      const sender = isOwner ? user.ownerId : user.id;
      const typeSender = isOwner ? "Owner" : "Applicant";
      const res = await axios.post("http://localhost:5556/chat/message", {
        chatId: selectedChatId,
        senderId: sender,
        senderType: typeSender,
        message,
      });
      socket.emit("sendMessage", res.data);
      setMessages((prev) => [...prev, res.data]); // Update messages immediately on send
      setMessage("");
      updateChatWithLatestMessage(res.data); // Also update the chat preview in the sidebar
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const selectedChat = chats.find((chat) => chat._id === selectedChatId);
  let isOwner = false;
  if (selectedChat && user?.ownerId) {
    isOwner = selectedChat.ownerId?._id === user.ownerId;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <Header title={activePage} />

      <div className="main-content">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <div className="chat-layout">
          <div className="chat-sidebar">
            <h2>Chats</h2>
            {chats.map((chat) => (
              <div
                key={chat._id}
                className={`chat-preview ${
                  selectedChatId === chat._id ? "active" : ""
                }`}
                onClick={() => setSelectedChatId(chat._id)}
              >
                <p>
                  Property: <b>{chat.propertyId?.rentalName || "N/A"}</b>
                </p>
                <p>
                  Address: <b>{chat.propertyId?.address || "N/A"}</b>
                </p>
                {/* Show the latest message in the preview */}
                {chat.lastMessage && (
                  <p>
                    <b>Last message: </b>
                    {chat.lastMessage}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="chat-box">
            <div className="messages">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={
                    msg.senderId === user?.id ? "msg sender" : "msg recipient"
                  }
                >
                  <div>{msg.message}</div>
                </div>
              ))}
            </div>
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
      </div>
      <Footer />
    </div>
  );
}

export default ChatRoomLayout;

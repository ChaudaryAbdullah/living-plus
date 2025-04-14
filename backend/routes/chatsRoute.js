// project/backend/routes/chatSocket.js
import ChatMessage from "../models/chatMessageModel.js";

export const chatSocketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join_property_chat", async (propertyId) => {
      socket.join(propertyId);
      const history = await ChatMessage.find({ propertyId }).sort({
        timestamp: 1,
      });
      socket.emit("chat_history", history);
    });

    socket.on("send_message", async (data) => {
      const { propertyId, senderId, senderType, message } = data;

      const newMsg = new ChatMessage({
        propertyId,
        senderId,
        senderType,
        message,
      });
      await newMsg.save();

      io.to(propertyId).emit("receive_message", newMsg);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import express from "express";
import session from "express-session";
import { PORT, DB_URL } from "./config.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import rentalRoutes from "./routes/rentalRoutes.js";
import parkingAllocationRoutes from "./routes/parkingAllocationRoutes.js";
import parkingRequestRoutes from "./routes/parkingRequestRoutes.js";
import parkingSlotRoutes from "./routes/parkingSlotRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import applicantRoutes from "./routes/applicantRoutes.js";
import ownsRoutes from "./routes/ownsRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import ApplyRental from "./routes/applyRentalRoutes.js";
import rentRoutes from "./routes/rentRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import chatsRoute from "./routes/chatsRoute.js";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "12345",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/session-db",
    }),
    cookie: { secure: false, httpOnly: true, maxAge: 3600000, sameSite: "lax" },
  })
);

// Routes
app.use("/rentals", rentalRoutes);
app.use("/parkingAllocation", parkingAllocationRoutes);
app.use("/parkingRequest", parkingRequestRoutes);
app.use("/parkingSlot", parkingSlotRoutes);
app.use("/owner", ownerRoutes);
app.use("/applicant", applicantRoutes);
app.use("/tenant", tenantRoutes);
app.use("/owns", ownsRoutes);
app.use("/rents", rentRoutes);
app.use("/rooms", roomRoutes);
app.use("/applyRental", ApplyRental);
app.use("/profile", profileRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/notifications", notificationRoutes);
app.use("/payment", paymentRoutes);
app.use("/chat", chatsRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the Rental Management System API!");
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join", (chatToken) => {
    socket.join(chatToken);
    console.log(`User joined chat: ${chatToken}`);
  });

  socket.on("sendMessage", ({ chatToken, message }) => {
    socket.to(chatToken).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start server with port fallback

server
  .listen(PORT)
  .on("listening", () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    mongoose
      .connect(DB_URL)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.error(`Error connecting to MongoDB: ${error.message}`);
      });
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      const fallbackPort = PORT + 1;
      console.warn(`Port ${PORT} is already in use. Trying ${fallbackPort}...`);

      server.listen(fallbackPort).on("listening", () => {
        console.log(
          `Fallback: Server is running on http://localhost:${fallbackPort}`
        );

        mongoose
          .connect(DB_URL)
          .then(() => {
            console.log("Connected to MongoDB");
          })
          .catch((error) => {
            console.error(`Error connecting to MongoDB: ${error.message}`);
          });
      });
    } else {
      throw err;
    }
  });

import mongoose from "mongoose";
import express from "express";
import { PORT, DB_URL } from "./config.js";
import cors from "cors";

const app = express();

app.use(
  cors()
  // cors({
  //   origin: "http://localhost:3000",
  //   methods: ["GET", "POST", "PUT", "DELETE"],
  //   allowedHeaders: ["Content-Type"],
  // })
);
mongoose
  .connect(DB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  });

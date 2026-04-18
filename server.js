import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./router.js";
import dotenv from "dotenv"
dotenv.config()
const app = express();
const PORT=process.env.PORT ||8000
// 1. CORS MUST be at the very top
app.use(cors({
  origin:"https://ecommercefronted-xi.vercel.app/homepage"
}));

// 2. Body Parser
app.use(express.json());

// 3. Routes
app.use("/auth", routes);

// 4. DB Connection
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log("Server is running "));
  })
  .catch((err) => console.error("Connection error:", err));

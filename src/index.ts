import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./database/mongodb";
import { PORT } from "./configs";
import userRoutes from "./routes/user_route";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Enable CORS so frontend can access backend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // frontend URL
    credentials: true,
  })
);

// Routes
app.use("/api/users", userRoutes);

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Server is running!");
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

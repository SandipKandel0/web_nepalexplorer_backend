import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./database/mongodb";
import { PORT } from "./configs";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

startServer();

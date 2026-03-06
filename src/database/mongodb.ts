import mongoose from "mongoose";
import {MONGODB_URI} from "../configs/index"

const isTestEnv = process.env.NODE_ENV === "test" || !!process.env.JEST_WORKER_ID;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    if (!isTestEnv) {
      console.log("✅ MongoDB connected successfully");
    }
  } catch (error) {
    if (!isTestEnv) {
      console.error("❌ MongoDB connection error:", error);
    }
    process.exit(1);
  }
};

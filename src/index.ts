import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database/mongodb";
import { HttpError } from "./errors/http-error";
import guideRoutes from "./routes/guide_route";
import userRoutes from "./routes/user_route";
import adminRoutes from "./routes/admin_route";
import guideRequestRoutes from "./routes/guide_request_route";
import UserModel from "./models/user";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Connect to Database
connectDB();

const ensureDefaultAdmin = async () => {
  const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@webnepal.com";
  const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin12345";
  const defaultAdminUsername = process.env.DEFAULT_ADMIN_USERNAME || "admin";

  const existingAdmin = await UserModel.findOne({
    $or: [{ role: "admin" }, { email: defaultAdminEmail }],
  });
  if (existingAdmin) {
    return;
  }

  await UserModel.create({
    fullName: "Default Admin",
    username: defaultAdminUsername,
    email: defaultAdminEmail,
    phone: "9800000000",
    password: defaultAdminPassword,
    role: "admin",
  });

  console.log(`Default admin created: ${defaultAdminEmail}`);
};

ensureDefaultAdmin().catch((error) => {
  console.error("Failed to ensure default admin:", error);
});

// Routes
app.use("/api/guide", guideRoutes);
app.use("/api/guide", guideRequestRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "Server is running" });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    success: false, 
    error: "Route not found" 
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("=== Error Handler Middleware ===");
  console.error("Error:", err);
  console.error("Error stack:", err.stack);

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
    message: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

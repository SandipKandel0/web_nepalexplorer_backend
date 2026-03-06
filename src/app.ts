import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { HttpError } from "./errors/http-error";
import guideRoutes from "./routes/guide_route";
import userRoutes from "./routes/user_route";
import adminRoutes from "./routes/admin_route";
import guideRequestRoutes from "./routes/guide_request_route";
import destinationRoutes from "./routes/destination_route";

const app = express();
const isTestEnv = process.env.NODE_ENV === "test" || !!process.env.JEST_WORKER_ID;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/guide", guideRoutes);
app.use("/api/guide", guideRequestRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/destinations", destinationRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (process.env.NODE_ENV !== "production" && !isTestEnv) {
    console.error("=== Error Handler Middleware ===");
    console.error("Error:", err);
    console.error("Error stack:", err?.stack);
  }

  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message =
    err instanceof HttpError
      ? err.message
      : "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
  });
});

export default app;

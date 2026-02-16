import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs";
import { HttpError } from "../errors/http-error";

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
      user?: any;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new HttpError(401, "No token provided");
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        throw new HttpError(401, "Invalid or expired token");
      }
      req.userId = user.id;
      next();
    });
  } catch (error: any) {
    res.status(error.statusCode || 401).json({
      success: false,
      message: error.message || "Authentication failed",
    });
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // First verify the token
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new HttpError(401, "No token provided");
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        throw new HttpError(401, "Invalid or expired token");
      }
      req.userId = user.id;
      req.userRole = user.role;

      // Check if user is admin
      if (user.role !== "admin") {
        throw new HttpError(403, "Only admin users can access this resource");
      }

      next();
    });
  } catch (error: any) {
    res.status(error.statusCode || 403).json({
      success: false,
      message: error.message || "Authorization failed",
    });
  }
};

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log("=== authenticateUser middleware ===");
    console.log("Auth header:", authHeader?.substring(0, 50) + "...");
    console.log("Token extracted:", token ? "Yes" : "No");

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        console.log("JWT verification failed:", err.message);
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
        });
      }
      console.log("JWT verified successfully, user:", user);
      req.userId = user.id;
      req.userRole = user.role;
      req.user = user;
      next();
    });
  } catch (error: any) {
    console.error("Error in authenticateUser middleware:", error);
    res.status(error.statusCode || 401).json({
      success: false,
      message: error.message || "Authentication failed",
    });
  }
};

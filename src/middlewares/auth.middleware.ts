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

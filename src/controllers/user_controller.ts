import { Request, Response } from "express";
import { z } from "zod";
import { UserService } from "../services/user_service";

const userService = new UserService();

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).optional(),
});

// Login validation
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerUser = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body); // Validate request body

    const user = await userService.register(parsed);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Registration failed",
    });
  }
};

// Login existing user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.parse(req.body); // Validate request body

    const result = await userService.login(parsed.email, parsed.password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Login failed",
    });
  }
};

import { z } from "zod";

// Register DTO
export const RegisterDTO = z.object({
  fullName: z.string().min(3, "Full name is required"),
  username: z.string().min(3, "Username is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(10, "Invalid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).optional(),
});
// Login DTO
export const LoginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

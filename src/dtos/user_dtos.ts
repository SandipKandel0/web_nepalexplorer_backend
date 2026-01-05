import { z } from "zod";

// Register DTO
export const RegisterDTO = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  phoneNumber: z.string().min(10),
  role: z.enum(["user", "admin"]).optional(),
});

// Login DTO
export const LoginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

import { z } from "zod";

// Register DTO
export const RegisterDTO = z.object({
  fullName: z.string().min(3, "Full name is required"),
  username: z.string().min(3, "Username is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(10, "Invalid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isGuide: z.boolean().optional().default(false),
});
// Login DTO
export const LoginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const UpdateUserDto = RegisterDTO.partial();

// Guide Request DTO
export const GuideRequestDTO = z.object({
  guideId: z.string().min(1, "Guide ID is required"),
  tripDate: z.string().datetime("Invalid date format"),
  duration: z.number().min(1, "Duration must be at least 1 day"),
  location: z.string().min(3, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budget: z.number().min(1, "Budget must be greater than 0"),
  numberOfPeople: z.number().min(1, "At least 1 person required"),
});

// Guide Request Status Update DTO
export const GuideRequestStatusDTO = z.object({
  status: z.enum(["approved", "declined"], "Invalid status"),
});

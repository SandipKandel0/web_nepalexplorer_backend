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
  guestName: z.string().min(3, "Name is required"),
  guestEmail: z.string().email("Valid email is required"),
  guestPhone: z.string().min(10, "Valid phone number is required"),
  tripDate: z.string().min(1, "Booking date is required"),
  duration: z.number().min(1, "Duration must be at least 1 day"),
  location: z.string().min(3, "Location is required"),
  numberOfPeople: z.number().min(1, "At least 1 person required"),
  language: z.string().min(2, "Language preference is required"),
  customMessage: z.string().min(10, "Message must be at least 10 characters"),
});

// Guide Request Status Update DTO
export const GuideRequestStatusDTO = z.object({
  status: z.enum(["approved", "declined"], "Invalid status"),
});

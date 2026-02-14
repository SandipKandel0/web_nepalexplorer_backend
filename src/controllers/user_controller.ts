import { Request, Response } from "express";
import { UserService } from "../services/user_service";
import { RegisterDTO, LoginDTO } from "../dtos/user_dtos";

const userService = new UserService();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const parsed = RegisterDTO.parse(req.body); // only fullName, username, email, phoneNumber, password, role
    const user = await userService.register(parsed);
    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.errors?.map((e: any) => e.message).join(", ") || error.message,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    // Validate request body using DTO
    const parsed = LoginDTO.parse(req.body);

    // Call service to login user
    const data = await userService.login(parsed.email, parsed.password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error: any) {
    // Handle Zod validation errors or service errors
    const message =
      error?.errors?.map((e: any) => e.message).join(", ") || error.message;

    res.status(400).json({
      success: false,
      message,
    });
  }
};

import { Request, Response } from "express";
import { UserService } from "../services/user_service";
import { UpdateUserDto } from "../dtos/user_dtos";

const userService = new UserService();

// Create user with image
export const createUser = async (req: Request, res: Response) => {
  try {
    const { fullName, username, email, phoneNumber, password, role } = req.body;
    
    const userData = {
      fullName,
      username,
      email,
      phoneNumber,
      password,
      role: role || "user",
    };

    // If file is uploaded, add imageUrl
    if (req.file) {
      (userData as any).imageUrl = `/uploads/${req.file.filename}`;
    }

    const user = await userService.register(userData);
    
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create user",
    });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve users",
    });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve user",
    });
  }
};

// Update user with optional image
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = UpdateUserDto.parse(req.body);

    // If file is uploaded, add imageUrl
    if (req.file) {
      (updateData as any).imageUrl = `/uploads/${req.file.filename}`;
    }

    const user = await userService.updateUser(id, updateData);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update user",
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
};

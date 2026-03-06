import UserModel from "../models/user";
import { GuideModel } from "../models/guide";
import { HttpError } from "../errors/http-error";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { sendResetPasswordEmail } from "../utils";

interface RegisterUserInput {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  profileImage?: string;
}

interface LoginUserInput {
  email: string;
  password: string;
}

interface ResetTokenPayload {
  id: string;
  email: string;
  role: string;
  purpose: "password-reset";
}

export class UserService {
  async registerUser(input: RegisterUserInput) {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: input.email });
    if (existingUser) {
      throw new HttpError(409, "User with this email already exists");
    }

    // Create new user
    const user = new UserModel({
      fullName: input.fullName,
      email: input.email,
      password: input.password,
      phone: input.phone,
      profileImage: input.profileImage || null,
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      token,
    };
  }

  async loginUser(input: LoginUserInput) {
    const user = await UserModel.findOne({ email: input.email }).select("+password");
    if (!user) {
      throw new HttpError(401, "Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(input.password);
    if (!isPasswordValid) {
      throw new HttpError(401, "Invalid email or password");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      token,
    };
  }

  async forgotPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
      // Fallback: if this email belongs to a guide, send guide reset link.
      const guide = await GuideModel.findOne({ email: normalizedEmail });
      if (!guide) {
        return;
      }

      const guideToken = jwt.sign(
        {
          id: String(guide._id),
          email: guide.email,
          role: "guide",
          purpose: "password-reset",
        } as ResetTokenPayload,
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "15m" }
      );

      const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const guideResetLink = `${frontendBaseUrl}/reset-password?token=${encodeURIComponent(guideToken)}&role=guide`;

      await sendResetPasswordEmail({
        to: guide.email,
        name: guide.fullName,
        resetLink: guideResetLink,
        role: "guide",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: String(user._id),
        email: user.email,
        role: user.role,
        purpose: "password-reset",
      } as ResetTokenPayload,
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "15m" }
    );

    const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${frontendBaseUrl}/reset-password?token=${encodeURIComponent(token)}&role=user`;

    await sendResetPasswordEmail({
      to: user.email,
      name: user.fullName,
      resetLink,
      role: "user",
    });
  }

  async resetPassword(token: string, newPassword: string) {
    let decoded: ResetTokenPayload;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as ResetTokenPayload;
    } catch (error) {
      throw new HttpError(400, "Invalid or expired reset token");
    }

    if (decoded.purpose !== "password-reset") {
      throw new HttpError(400, "Invalid reset token");
    }

    const user = await UserModel.findById(decoded.id).select("+password");
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    user.password = newPassword;
    await user.save();
  }

  async getUserById(id: string) {
    const user = await UserModel.findById(id).populate("favourites");
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  }

  async updateUser(id: string, data: Partial<RegisterUserInput>) {
    const user = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    return user;
  }

  async addFavourite(userId: string, guideId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    if (!user.favourites.includes(guideId as any)) {
      user.favourites.push(guideId as any);
      await user.save();
    }

    return user.populate("favourites");
  }

  async removeFavourite(userId: string, guideId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    user.favourites = user.favourites.filter((id: mongoose.Types.ObjectId) => id.toString() !== guideId);
    await user.save();

    return user.populate("favourites");
  }

  async getFavourites(userId: string) {
    const user = await UserModel.findById(userId).populate("favourites");
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user.favourites;
  }

  // Admin methods
  async register(userData: any) {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new HttpError(409, "User with this email already exists");
    }

    // Create new user
    const user = new UserModel({
      fullName: userData.fullName,
      username: userData.username,
      email: userData.email,
      phone: userData.phoneNumber || userData.phone,
      password: userData.password,
      role: userData.role || "user",
      profileImage: userData.imageUrl || null,
    });

    await user.save();
    return user;
  }

  async getAllUsers() {
    const users = await UserModel.find().select("-password");
    return users;
  }

  async deleteUser(id: string) {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  }
}

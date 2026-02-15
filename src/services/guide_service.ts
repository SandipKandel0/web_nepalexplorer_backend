// filepath: c:\Users\ACER\OneDrive\Desktop\main project web\backendwebnepal\src\services\guide_service.ts
import { GuideModel } from "../models/guide";
import { HttpError } from "../errors/http-error";
import jwt from "jsonwebtoken";

interface RegisterGuideInput {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  language: string;
  experience: string;
  city: string;
  bio?: string;
  profileImage?: string;
}

interface LoginGuideInput {
  email: string;
  password: string;
}

export class GuideService {
  async registerGuide(input: RegisterGuideInput) {
    // Check if guide already exists
    const existingGuide = await GuideModel.findOne({ email: input.email });
    if (existingGuide) {
      throw new HttpError(409, "Guide with this email already exists");
    }

    // Create new guide
    const guide = new GuideModel({
      fullName: input.fullName,
      email: input.email,
      password: input.password,
      phone: input.phone,
      language: input.language,
      experience: input.experience,
      city: input.city,
      bio: input.bio || "",
      profileImage: input.profileImage || null,
    });

    await guide.save();

    // Create JWT token
    const token = jwt.sign(
      { id: guide._id, email: guide.email, role: "guide" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    return {
      id: guide._id,
      fullName: guide.fullName,
      email: guide.email,
      phone: guide.phone,
      language: guide.language,
      experience: guide.experience,
      city: guide.city,
      bio: guide.bio,
      profileImage: guide.profileImage,
      token,
    };
  }

  async loginGuide(input: LoginGuideInput) {
    const guide = await GuideModel.findOne({ email: input.email }).select("+password");
    if (!guide) {
      throw new HttpError(401, "Invalid email or password");
    }

    const isPasswordValid = await guide.comparePassword(input.password);
    if (!isPasswordValid) {
      throw new HttpError(401, "Invalid email or password");
    }

    const token = jwt.sign(
      { id: guide._id, email: guide.email, role: "guide" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    return {
      id: guide._id,
      fullName: guide.fullName,
      email: guide.email,
      phone: guide.phone,
      language: guide.language,
      experience: guide.experience,
      city: guide.city,
      bio: guide.bio,
      profileImage: guide.profileImage,
      token,
    };
  }

  async getGuideById(id: string) {
    const guide = await GuideModel.findById(id);
    if (!guide) {
      throw new HttpError(404, "Guide not found");
    }
    return guide;
  }

  async updateGuide(id: string, data: Partial<RegisterGuideInput>) {
    const guide = await GuideModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!guide) {
      throw new HttpError(404, "Guide not found");
    }

    return guide;
  }

  async getAllGuides(filters?: { city?: string; language?: string }) {
    let query: any = {};

    if (filters?.city) {
      query.city = filters.city;
    }
    if (filters?.language) {
      query.language = filters.language;
    }

    return await GuideModel.find(query).select("-password");
  }
}
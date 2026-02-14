import UserModel from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserService {
  async register(data: any) {
    // Check if email already exists
    const existing = await UserModel.findOne({ email: data.email });
    if (existing) throw new Error("Email already exists");
    const existingUsername = await UserModel.findOne({ username: data.username });
    if (existingUsername) throw new Error("Username already exists");

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Convert isGuide to role
    const role = data.isGuide ? "guide" : "user";

    // Save user
    const user = await UserModel.create({ 
      ...data, 
      password: hashedPassword,
      role,
    });
    return user;
  }

  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    // Return JWT with role included
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
    return { user, token };
  }

  async getAllUsers() {
    const users = await UserModel.find().select("-password");
    return users;
  }

  async getUserById(id: string) {
    const user = await UserModel.findById(id).select("-password");
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUser(id: string, updateData: any) {
    // Check if username already exists (if being updated)
    if (updateData.username) {
      const existing = await UserModel.findOne({
        username: updateData.username,
        _id: { $ne: id },
      });
      if (existing) throw new Error("Username already exists");
    }

    // Check if email already exists (if being updated)
    if (updateData.email) {
      const existing = await UserModel.findOne({
        email: updateData.email,
        _id: { $ne: id },
      });
      if (existing) throw new Error("Email already exists");
    }

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");

    if (!user) throw new Error("User not found");
    return user;
  }

  async deleteUser(id: string) {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) throw new Error("User not found");
    return user;
  }
}

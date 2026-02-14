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

    // Save user
    const user = await UserModel.create({ ...data, password: hashedPassword });
    return user;
  }

  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    // Return JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    return { user, token };
  }
}

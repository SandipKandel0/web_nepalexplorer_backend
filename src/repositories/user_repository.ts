import { IUser, UserModel } from "../models/user";

export interface IUserRepository {
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(userData: Partial<IUser>): Promise<IUser>;
  getUserById(userId: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
  deleteUser(userId: string): Promise<boolean | null>;
}

export class UserRepository implements IUserRepository {
  async getUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await UserModel.findOne({ username });
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    await user.save();
    return user;
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return await UserModel.findById(userId);
  }

  async getAllUsers(): Promise<IUser[]> {
    return await UserModel.find();
  }

  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
  }

  async deleteUser(userId: string): Promise<boolean | null> {
    const user = await UserModel.findByIdAndDelete(userId);
    return user ? true : false;
  }
}

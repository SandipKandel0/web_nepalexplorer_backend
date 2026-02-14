import mongoose, { Schema, Document, model } from "mongoose";

// Interface for TypeScript
export interface IUser extends Document {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: "user" | "guide" | "admin";
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const UserSchema: Schema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "guide", "admin"], default: "user" },
    imageUrl: { type: String, required: false },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Export the model
const UserModel = model<IUser>("User", UserSchema);
export default UserModel;

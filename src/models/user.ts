 import mongoose, { Schema, Document, model } from "mongoose";
import bcrypt from "bcrypt";
 
 export interface IUser extends Document {
   fullName: string;
  username?: string;
   email: string;
  phone: string;
   password: string;
   role: "user" | "guide" | "admin";
  profileImage?: string | null;
  favourites: mongoose.Types.ObjectId[];
   createdAt: Date;
   updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
 }
 
 const UserSchema: Schema = new Schema<IUser>(
   {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, unique: true, sparse: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, minlength: 6, select: false },
     role: { type: String, enum: ["user", "guide", "admin"], default: "user" },
    profileImage: { type: String, default: null },
    favourites: [{ type: Schema.Types.ObjectId, ref: "Guide", default: [] }],
   },
  { timestamps: true }
);

UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

 const UserModel = model<IUser>("User", UserSchema);
 export default UserModel;
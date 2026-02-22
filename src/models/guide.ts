import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IGuide extends Document {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  language: string;
  experience: string;
  city: string;
  bio?: string;
  profileImage?: string;
  rating?: number;
  totalBookings?: number;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const guideSchema = new Schema<IGuide>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    language: {
      type: String,
      required: [true, "Language is required"],
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
      enum: ["1-3", "3-5", "5-10", "10+"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    bio: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
guideSchema.pre<IGuide>("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
guideSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const GuideModel = mongoose.model<IGuide>("Guide", guideSchema);
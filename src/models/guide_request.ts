import mongoose, { Schema, Document, model } from "mongoose";

// Interface for Guide Request
export interface IGuideRequest extends Document {
  guestId: mongoose.Types.ObjectId;
  guideId: mongoose.Types.ObjectId;
  tripDate: Date;
  duration: number; // in days
  location: string;
  description: string;
  budget: number;
  numberOfPeople: number;
  status: "pending" | "approved" | "declined";
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const GuideRequestSchema: Schema = new Schema<IGuideRequest>(
  {
    guestId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    guideId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tripDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    numberOfPeople: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Export the model
const GuideRequestModel = model<IGuideRequest>(
  "GuideRequest",
  GuideRequestSchema
);
export default GuideRequestModel;

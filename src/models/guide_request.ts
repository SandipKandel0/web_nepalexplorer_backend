import mongoose, { Schema, Document, model } from "mongoose";

// Interface for Guide Request
export interface IGuideRequest extends Document {
  guestId: mongoose.Types.ObjectId;
  guideId?: mongoose.Types.ObjectId;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  tripDate: Date;
  duration: number; // in days
  location: string;
  numberOfPeople: number;
  language: string;
  customMessage: string;
  status: "pending" | "approved" | "declined";
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const GuideRequestSchema: Schema = new Schema<IGuideRequest>(
  {
    guestId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    guideId: { type: Schema.Types.ObjectId, ref: "Guide", required: false },
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    guestPhone: { type: String, required: true },
    tripDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    location: { type: String, required: true },
    numberOfPeople: { type: Number, required: true },
    language: { type: String, required: true },
    customMessage: { type: String, required: false, default: "" },
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

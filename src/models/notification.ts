import mongoose, { Schema, Document, model } from "mongoose";

// Interface for Notification
export interface INotification extends Document {
  userId?: mongoose.Types.ObjectId;
  guideId?: mongoose.Types.ObjectId;
  guideRequestId?: mongoose.Types.ObjectId;
  type: "approval" | "decline" | "new_request" | "new_booking" | "booking_update" | "system";
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const NotificationSchema: Schema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    guideId: { type: Schema.Types.ObjectId, ref: "Guide", required: false },
    guideRequestId: {
      type: Schema.Types.ObjectId,
      ref: "GuideRequest",
      required: false,
    },
    type: {
      type: String,
      enum: ["approval", "decline", "new_request", "new_booking", "booking_update", "system"],
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Export the model
const NotificationModel = model<INotification>(
  "Notification",
  NotificationSchema
);
export default NotificationModel;

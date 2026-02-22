import mongoose, { Document, Schema } from "mongoose";

export interface IDestination extends Document {
  name: string;
  location: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const destinationSchema = new Schema<IDestination>(
  {
    name: {
      type: String,
      required: [true, "Destination name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Destination location is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const DestinationModel = mongoose.model<IDestination>(
  "Destination",
  destinationSchema
);

import { Request, Response } from "express";
import { DestinationModel } from "../models/destination";

export const createDestination = async (req: Request, res: Response) => {
  try {
    const { name, location, description } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "Name and location are required",
      });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const destination = await DestinationModel.create({
      name,
      location,
      description: description || "",
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Destination uploaded successfully",
      data: destination,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to upload destination",
    });
  }
};

export const getAllDestinations = async (_req: Request, res: Response) => {
  try {
    const destinations = await DestinationModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: destinations,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch destinations",
    });
  }
};

export const deleteDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const destination = await DestinationModel.findByIdAndDelete(id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Destination deleted successfully",
      data: destination,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete destination",
    });
  }
};

export const updateDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, location, description } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "Name and location are required",
      });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const destination = await DestinationModel.findByIdAndUpdate(
      id,
      {
        name,
        location,
        description: description || "",
        ...(imageUrl ? { imageUrl } : {}),
      },
      { new: true }
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Destination updated successfully",
      data: destination,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update destination",
    });
  }
};

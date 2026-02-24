import { Request, Response } from "express";
import { DestinationModel } from "../models/destination";

const parseStringArray = (value: unknown) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const parseJsonArray = <T>(value: unknown, fallback: T[] = []) => {
  if (!value || typeof value !== "string") return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
};

export const createDestination = async (req: Request, res: Response) => {
  try {
    const {
      name,
      location,
      description,
      bestTime,
      difficulty,
      fullDescription,
      activities,
      nearbyPlaces,
      popularHotels,
    } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "Name and location are required",
      });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const parsedActivities = parseStringArray(activities);
    const parsedNearbyPlaces = parseStringArray(nearbyPlaces);
    const parsedHotels = parseJsonArray(popularHotels, []);

    console.log("Debug - Creating destination:");
    console.log("Activities input:", activities);
    console.log("Parsed activities:", parsedActivities);
    console.log("NearbyPlaces input:", nearbyPlaces);
    console.log("Parsed nearbyPlaces:", parsedNearbyPlaces);
    console.log("PopularHotels input:", popularHotels);
    console.log("Parsed hotels:", parsedHotels);

    const destination = await DestinationModel.create({
      name,
      location,
      description: description || "",
      bestTime: bestTime || "",
      difficulty: difficulty || "",
      fullDescription: fullDescription || "",
      activities: parsedActivities,
      nearbyPlaces: parsedNearbyPlaces,
      popularHotels: parsedHotels,
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
    const {
      name,
      location,
      description,
      bestTime,
      difficulty,
      fullDescription,
      activities,
      nearbyPlaces,
      popularHotels,
    } = req.body;

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
        bestTime: bestTime || "",
        difficulty: difficulty || "",
        fullDescription: fullDescription || "",
        activities: parseStringArray(activities),
        nearbyPlaces: parseStringArray(nearbyPlaces),
        popularHotels: parseJsonArray(popularHotels, []),
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

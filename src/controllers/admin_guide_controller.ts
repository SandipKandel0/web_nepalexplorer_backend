import { Request, Response } from "express";
import { GuideModel } from "../models/guide";

export const getAllGuidesForAdmin = async (_req: Request, res: Response) => {
  try {
    const guides = await GuideModel.find().select("-password").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: guides,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch guides",
    });
  }
};

export const deleteGuideForAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const guide = await GuideModel.findByIdAndDelete(id);

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Guide deleted successfully",
      data: guide,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete guide",
    });
  }
};

import { Request, Response, NextFunction } from "express";
import { GuideService } from "../services/guide_service";
import { HttpError } from "../errors/http-error";

export class GuideController {
  private guideService = new GuideService();

  registerGuide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fullName, email, password, phone, language, experience, city, bio } = req.body;
      const profileImage = req.file?.filename || undefined;

      // Validation
      if (!fullName || !email || !password || !phone || !language || !experience || !city) {
        throw new HttpError(400, "Missing required fields");
      }

      if (password.length < 6) {
        throw new HttpError(400, "Password must be at least 6 characters");
      }

      const guide = await this.guideService.registerGuide({
        fullName,
        email,
        password,
        phone,
        language,
        experience,
        city,
        bio: bio || "",
        profileImage,
      });

      res.status(201).json({
        success: true,
        message: "Guide registered successfully",
        data: guide,
      });
    } catch (error) {
      next(error);
    }
  };

  loginGuide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new HttpError(400, "Email and password are required");
      }

      const guide = await this.guideService.loginGuide({ email, password });

      res.json({
        success: true,
        message: "Login successful",
        data: guide,
      });
    } catch (error) {
      next(error);
    }
  };

  getGuideById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const guide = await this.guideService.getGuideById(id);

      res.json({
        success: true,
        data: guide,
      });
    } catch (error) {
      next(error);
    }
  };

  updateGuide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const profileImage = req.file?.filename || undefined;

      const guide = await this.guideService.updateGuide(id, {
        ...req.body,
        profileImage,
      });

      res.json({
        success: true,
        message: "Guide updated successfully",
        data: guide,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllGuides = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { city, language } = req.query;

      const guides = await this.guideService.getAllGuides({
        city: city as string,
        language: language as string,
      });

      res.json({
        success: true,
        data: guides,
      });
    } catch (error) {
      next(error);
    }
  };
}

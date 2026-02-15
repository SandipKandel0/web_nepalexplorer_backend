import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user_service";
import { HttpError } from "../errors/http-error";

export class UserController {
  private userService = new UserService();

  registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fullName, email, password, confirmPassword, phone } = req.body;
      const profileImage = req.file?.filename || undefined;

      // Validation
      if (!fullName || !email || !password || !phone) {
        throw new HttpError(400, "Missing required fields");
      }

      if (password !== confirmPassword) {
        throw new HttpError(400, "Passwords do not match");
      }

      if (password.length < 6) {
        throw new HttpError(400, "Password must be at least 6 characters");
      }

      const user = await this.userService.registerUser({
        fullName,
        email,
        password,
        phone,
        profileImage,
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new HttpError(400, "Email and password are required");
      }

      const user = await this.userService.loginUser({ email, password });

      res.json({
        success: true,
        message: "Login successful",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const profileImage = req.file?.filename || undefined;

      const user = await this.userService.updateUser(id, {
        ...req.body,
        profileImage,
      });

      res.json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  addFavourite = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, guideId } = req.body;

      if (!userId || !guideId) {
        throw new HttpError(400, "User ID and Guide ID are required");
      }

      const user = await this.userService.addFavourite(userId, guideId);

      res.json({
        success: true,
        message: "Guide added to favourites",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  removeFavourite = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, guideId } = req.body;

      if (!userId || !guideId) {
        throw new HttpError(400, "User ID and Guide ID are required");
      }

      const user = await this.userService.removeFavourite(userId, guideId);

      res.json({
        success: true,
        message: "Guide removed from favourites",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  getFavourites = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      const favourites = await this.userService.getFavourites(userId);

      res.json({
        success: true,
        data: favourites,
      });
    } catch (error) {
      next(error);
    }
  };
}

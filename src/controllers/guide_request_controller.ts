import { Request, Response, NextFunction } from "express";
import { GuideRequestService } from "../services/guide_request_service";
import { HttpError } from "../errors/http-error";

export class GuideRequestController {
  private guideRequestService = new GuideRequestService();

  createGuideRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { 
        guestName, 
        guestEmail, 
        guestPhone, 
        tripDate, 
        duration, 
        location, 
        numberOfPeople, 
        language, 
        customMessage 
      } = req.body;

      // Get user ID from auth middleware (if available)
      const guestId = (req as any).user?.id;

      if (!guestId) {
        throw new HttpError(401, "Unauthorized - Please login to create a booking request");
      }

      const guideRequest = await this.guideRequestService.createGuideRequest({
        guestId,
        guestName,
        guestEmail,
        guestPhone,
        tripDate,
        duration,
        location,
        numberOfPeople,
        language,
        customMessage,
      });

      res.status(201).json({
        success: true,
        message: "Guide booking request created successfully",
        data: guideRequest,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyGuideRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new HttpError(401, "Unauthorized");
      }

      const requests = await this.guideRequestService.getRequestsByGuestId(userId);

      res.json({
        success: true,
        data: requests,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requests = await this.guideRequestService.getAllRequests();

      res.json({
        success: true,
        data: requests,
      });
    } catch (error) {
      next(error);
    }
  };

  getRequestById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const request = await this.guideRequestService.getRequestById(id);

      res.json({
        success: true,
        data: request,
      });
    } catch (error) {
      next(error);
    }
  };

  updateRequestStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const request = await this.guideRequestService.updateRequestStatus(id, status);

      res.json({
        success: true,
        message: `Request ${status} successfully`,
        data: request,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await this.guideRequestService.deleteRequest(id);

      res.json({
        success: true,
        message: "Guide request deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

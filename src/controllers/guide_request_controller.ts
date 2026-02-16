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

  getMyRequestedGuides = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("=== getMyRequestedGuides called ===");
      console.log("User from token:", (req as any).user);
      
      const guideId = (req as any).user?.id;

      if (!guideId) {
        console.log("No guideId found in request");
        throw new HttpError(401, "Unauthorized");
      }

      console.log("Fetching requests for guide:", guideId);
      const requests = await this.guideRequestService.getRequestsByGuideId(guideId);
      console.log("Found requests:", requests.length);

      res.json({
        success: true,
        data: requests,
      });
    } catch (error) {
      console.error("Error in getMyRequestedGuides:", error);
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

  approveRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const request = await this.guideRequestService.updateRequestStatus(id, "approved");

      res.json({
        success: true,
        message: "Request approved successfully",
        data: request,
      });
    } catch (error) {
      next(error);
    }
  };

  declineRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const request = await this.guideRequestService.updateRequestStatus(id, "declined");

      res.json({
        success: true,
        message: "Request declined successfully",
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

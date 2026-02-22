// Service for handling guide request operations
import GuideRequestModel, { IGuideRequest } from "../models/guide_request";
import { HttpError } from "../errors/http-error";
import { NotificationController } from "../controllers/notification_controller";

interface CreateGuideRequestInput {
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  tripDate: string;
  duration: number;
  location: string;
  numberOfPeople: number;
  language: string;
  customMessage: string;
}

export class GuideRequestService {
  private notificationController = new NotificationController();

  async createGuideRequest(input: CreateGuideRequestInput) {
    try {
      console.log("=== Creating guide request ===");
      console.log("Input:", input);
      
      const guideRequest = new GuideRequestModel({
        guestId: input.guestId,
        guestName: input.guestName,
        guestEmail: input.guestEmail,
        guestPhone: input.guestPhone,
        tripDate: new Date(input.tripDate),
        duration: input.duration,
        location: input.location,
        numberOfPeople: input.numberOfPeople,
        language: input.language,
        customMessage: input.customMessage,
        status: "pending",
      });

      await guideRequest.save();
      console.log("Guide request saved successfully:", guideRequest._id);

      // Create notification for all guides about the new request
      console.log("Creating notification for all guides...");
      const notificationData = {
        type: "new_request" as const,
        message: `New booking request from ${input.guestName} for ${input.location}`,
      };
      console.log("Notification data:", notificationData);
      
      const notification = await this.notificationController.createNotification(notificationData);
      console.log("Notification created successfully:", notification);

      return guideRequest;
    } catch (error: any) {
      console.error("Error in createGuideRequest:", error);
      throw new HttpError(500, error.message || "Failed to create guide request");
    }
  }

  async getRequestsByGuestId(guestId: string) {
    try {
      const requests = await GuideRequestModel.find({ guestId })
        .populate("guestId", "fullName email phone")
        .populate("guideId", "fullName email phone")
        .sort({ createdAt: -1 });

      return requests;
    } catch (error: any) {
      throw new HttpError(500, error.message || "Failed to fetch guide requests");
    }
  }

  async getRequestsByGuideId(guideId: string) {
    try {
      // For now, return all requests since guide assignment isn't implemented yet
      // Later: filter by guideId when you implement guide selection
      const requests = await GuideRequestModel.find()
        .sort({ createdAt: -1 });

      return requests;
    } catch (error: any) {
      console.error("Error in getRequestsByGuideId:", error);
      throw new HttpError(500, error.message || "Failed to fetch guide requests");
    }
  }

  async getAllRequests() {
    try {
      const requests = await GuideRequestModel.find()
        .populate("guestId", "fullName email phone")
        .populate("guideId", "fullName email phone")
        .sort({ createdAt: -1 });

      return requests;
    } catch (error: any) {
      throw new HttpError(500, error.message || "Failed to fetch all guide requests");
    }
  }

  async getRequestById(id: string) {
    try {
      const request = await GuideRequestModel.findById(id)
        .populate("guestId", "fullName email phone")
        .populate("guideId", "fullName email phone");

      if (!request) {
        throw new HttpError(404, "Guide request not found");
      }

      return request;
    } catch (error: any) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(500, error.message || "Failed to fetch guide request");
    }
  }

  async updateRequestStatus(id: string, status: "approved" | "declined") {
    try {
      console.log("=== Updating request status ===");
      console.log("Request ID:", id, "New status:", status);
      
      const request = await GuideRequestModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      )
        .populate("guestId", "fullName email phone")
        .populate("guideId", "fullName email phone");

      if (!request) {
        throw new HttpError(404, "Guide request not found");
      }

      console.log("Request updated successfully");

      // Create notification for the guest about the status update
      const statusMessage = status === "approved" 
        ? `Your booking request for ${request.location} has been approved!`
        : `Your booking request for ${request.location} has been declined.`;

      // Extract userId from populated guestId object
      let guestUserId: any = request.guestId;
      if (typeof request.guestId === "object" && request.guestId !== null) {
        guestUserId = (request.guestId as any)._id || request.guestId;
      }

      console.log("Creating status notification:", { userId: guestUserId, status, message: statusMessage });
      
      const notification = await this.notificationController.createNotification({
        userId: guestUserId,
        type: status === "approved" ? "approval" : "decline",
        message: statusMessage,
        guideRequestId: id,
      });
      
      console.log("Status notification created successfully:", notification);

      return request;
    } catch (error: any) {
      console.error("Error in updateRequestStatus:", error);
      if (error instanceof HttpError) throw error;
      throw new HttpError(500, error.message || "Failed to update guide request");
    }
  }

  async deleteRequest(id: string) {
    try {
      const request = await GuideRequestModel.findByIdAndDelete(id);

      if (!request) {
        throw new HttpError(404, "Guide request not found");
      }

      return { message: "Guide request deleted successfully" };
    } catch (error: any) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(500, error.message || "Failed to delete guide request");
    }
  }
}

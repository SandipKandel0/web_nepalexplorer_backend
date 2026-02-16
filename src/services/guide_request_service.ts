// Service for handling guide request operations
import GuideRequestModel, { IGuideRequest } from "../models/guide_request";
import { HttpError } from "../errors/http-error";

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
  async createGuideRequest(input: CreateGuideRequestInput) {
    try {
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

      return guideRequest;
    } catch (error: any) {
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

      return request;
    } catch (error: any) {
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

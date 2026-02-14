import GuideRequestModel from "../models/guide_request";
import NotificationModel from "../models/notification";
import UserModel from "../models/user";

export class GuideRequestService {
  // Create guide request
  async createGuideRequest(data: any) {
    const guideRequest = await GuideRequestModel.create(data);
    
    // Create notification for guide
    const guideNotification = await NotificationModel.create({
      userId: data.guideId,
      guideRequestId: guideRequest._id,
      type: "new_request",
      message: `New guide request from ${data.guestName}`,
      read: false,
    });

    return guideRequest;
  }

  // Get all guide requests
  async getAllGuideRequests() {
    const requests = await GuideRequestModel.find()
      .populate("guestId", "fullName email phoneNumber imageUrl")
      .populate("guideId", "fullName email phoneNumber imageUrl");
    return requests;
  }

  // Get guide requests for a specific guide
  async getGuideRequestsForGuide(guideId: string) {
    const requests = await GuideRequestModel.find({ guideId })
      .populate("guestId", "fullName email phoneNumber imageUrl")
      .sort({ createdAt: -1 });
    return requests;
  }

  // Get guide requests by guest
  async getGuideRequestsByGuest(guestId: string) {
    const requests = await GuideRequestModel.find({ guestId })
      .populate("guideId", "fullName email phoneNumber imageUrl")
      .sort({ createdAt: -1 });
    return requests;
  }

  // Get single guide request
  async getGuideRequestById(requestId: string) {
    const request = await GuideRequestModel.findById(requestId)
      .populate("guestId", "fullName email phoneNumber imageUrl")
      .populate("guideId", "fullName email phoneNumber imageUrl");
    if (!request) throw new Error("Guide request not found");
    return request;
  }

  // Approve guide request
  async approveGuideRequest(requestId: string) {
    const request = await GuideRequestModel.findByIdAndUpdate(
      requestId,
      { status: "approved" },
      { new: true }
    );

    if (!request) throw new Error("Guide request not found");

    // Create notification for guest
    await NotificationModel.create({
      userId: request.guestId,
      guideRequestId: request._id,
      type: "approval",
      message: "Your guide request has been approved!",
      read: false,
    });

    return request;
  }

  // Decline guide request
  async declineGuideRequest(requestId: string) {
    const request = await GuideRequestModel.findByIdAndUpdate(
      requestId,
      { status: "declined" },
      { new: true }
    );

    if (!request) throw new Error("Guide request not found");

    // Create notification for guest
    await NotificationModel.create({
      userId: request.guestId,
      guideRequestId: request._id,
      type: "decline",
      message: "Your guide request has been declined.",
      read: false,
    });

    return request;
  }

  // Delete guide request
  async deleteGuideRequest(requestId: string) {
    const request = await GuideRequestModel.findByIdAndDelete(requestId);
    if (!request) throw new Error("Guide request not found");
    return request;
  }
}

export class NotificationService {
  // Get user notifications
  async getUserNotifications(userId: string) {
    const notifications = await NotificationModel.find({ userId })
      .populate("guideRequestId")
      .sort({ createdAt: -1 });
    return notifications;
  }

  // Get unread notifications count
  async getUnreadCount(userId: string) {
    const count = await NotificationModel.countDocuments({
      userId,
      read: false,
    });
    return count;
  }

  // Mark notification as read
  async markAsRead(notificationId: string) {
    const notification = await NotificationModel.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    if (!notification) throw new Error("Notification not found");
    return notification;
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string) {
    const result = await NotificationModel.updateMany(
      { userId, read: false },
      { read: true }
    );
    return result;
  }

  // Delete notification
  async deleteNotification(notificationId: string) {
    const notification = await NotificationModel.findByIdAndDelete(
      notificationId
    );
    if (!notification) throw new Error("Notification not found");
    return notification;
  }
}

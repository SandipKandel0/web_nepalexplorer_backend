import express from "express";
import { GuideRequestController } from "../controllers/guide_request_controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = express.Router();
const guideRequestController = new GuideRequestController();

// Create a guide request (user authenticated)
router.post("/requests", authenticateUser, guideRequestController.createGuideRequest);

// Get my guide requests (as a guest/user who made requests)
router.get("/requests/my-requested-guides", authenticateUser, guideRequestController.getMyGuideRequests);

// Get guide requests for me (as a guide receiving requests)
router.get("/requests/my-guide-requests", authenticateUser, guideRequestController.getMyRequestedGuides);

// Get all guide requests (admin or guide can see)
router.get("/requests/all", guideRequestController.getAllRequests);

// Get a specific guide request
router.get("/requests/:id", authenticateUser, guideRequestController.getRequestById);

// Update request status (approve/decline)
router.patch("/requests/:id/approve", authenticateUser, guideRequestController.approveRequest);
router.patch("/requests/:id/decline", authenticateUser, guideRequestController.declineRequest);

// Delete a guide request
router.delete("/requests/:id", authenticateUser, guideRequestController.deleteRequest);

export default router;

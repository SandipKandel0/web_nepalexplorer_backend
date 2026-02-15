import express from "express";
import { GuideRequestController } from "../controllers/guide_request_controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = express.Router();
const guideRequestController = new GuideRequestController();

// Create a guide request (user authenticated)
router.post("/requests", authenticateUser, guideRequestController.createGuideRequest);

// Get my guide requests (as a guest)
router.get("/requests/my-requested-guides", authenticateUser, guideRequestController.getMyGuideRequests);

// Get all guide requests (admin or guide can see)
router.get("/requests/all", guideRequestController.getAllRequests);

// Get a specific guide request
router.get("/requests/:id", authenticateUser, guideRequestController.getRequestById);

// Update request status (approve/decline)
router.patch("/requests/:id/approve", authenticateUser, guideRequestController.updateRequestStatus);
router.patch("/requests/:id/decline", authenticateUser, guideRequestController.updateRequestStatus);

// Delete a guide request
router.delete("/requests/:id", authenticateUser, guideRequestController.deleteRequest);

export default router;

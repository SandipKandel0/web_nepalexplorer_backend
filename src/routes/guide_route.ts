import express from "express";
import { GuideController } from "../controllers/guide_controller";
import { uploads } from "../middlewares/upload.middleware";

const router = express.Router();
const guideController = new GuideController();

// Register guide
router.post("/register", uploads.single("profileImage"), guideController.registerGuide);

// Login guide
router.post("/login", guideController.loginGuide);

// Get all guides
router.get("/", guideController.getAllGuides);

// Get guide by ID
router.get("/:id", guideController.getGuideById);

// Update guide
router.put("/:id", uploads.single("profileImage"), guideController.updateGuide);

export default router;

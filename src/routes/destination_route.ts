import { Router } from "express";
import { getAllDestinations } from "../controllers/destination_controller";

const router = Router();

router.get("/", getAllDestinations);

export default router;

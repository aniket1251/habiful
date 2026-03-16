import express from "express";
import { getManager, getManagerProperties, updateManager } from "../controllers/managerControllers";
import { uploadProfileImage } from "../middlewares/uploadMiddleware";
const router = express.Router();

router.get("/:id", getManager);
router.put("/:id", uploadProfileImage, updateManager);
router.get("/:id/properties", getManagerProperties);

export default router;

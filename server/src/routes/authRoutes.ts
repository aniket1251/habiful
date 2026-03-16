import express from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/authControllers";
import { uploadProfileImage } from "../middlewares/uploadMiddleware";

const router = express.Router();

router.post("/register", uploadProfileImage, register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;

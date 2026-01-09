import express  from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import multer from "multer";
import { createProperty, getProperties, getProperty, getPropertyLeases } from "../controllers/propertyControllers";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage:storage});

router.get("/", getProperties);
router.get("/:id", getProperty);
router.post(
    "/",
    authMiddleware(["manager"]),
    upload.array("photos"),
    createProperty    
);
router.get("/:id/leases", getPropertyLeases);


export default router;
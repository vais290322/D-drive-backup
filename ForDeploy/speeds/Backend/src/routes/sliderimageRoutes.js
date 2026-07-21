import { Router } from "express";
import {
  createSliderImage,
  updateSliderImage,
  getSliderImageById,
  getAllSliderImages,
  deleteSliderImage,
} from "../controllers/sliderimageController.js";
import createCloudinaryUpload from "../service/cloudinary.js";
import { requireAuth, isAdmin } from "../middleware/authMiddleware.js";

const upload = createCloudinaryUpload("slider");
const router = Router();

router.post(
  "/",
  requireAuth,
  isAdmin(["ADMIN", "STAFF"]),
  upload.single("images"),
  createSliderImage
);
router.put(
  "/:id",
  requireAuth,
  isAdmin(["ADMIN", "STAFF"]),
  upload.single("images"),
  updateSliderImage
);
router.get("/", getAllSliderImages);
router.get("/:id", getSliderImageById);
router.delete("/:id", requireAuth, isAdmin(["ADMIN", "STAFF"]), deleteSliderImage);
export default router;

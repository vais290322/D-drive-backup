import { Router } from "express";

import { createHeadmasterSignaturePhoto, deleteHeadmasterSignaturePhoto, getHeadmasterSignaturePhoto, updateHeadmasterSignaturePhoto } from "../controllers/headmasterSignaturePhoto.controller.js";
import multer from 'multer';

const router = Router();

const upload = multer({ dest: 'uploads/' });

router.get("/:schoolId", getHeadmasterSignaturePhoto);
router.post("/", upload.single("photo"), createHeadmasterSignaturePhoto);
router.put("/", upload.single("photo"), updateHeadmasterSignaturePhoto);
router.delete("/", deleteHeadmasterSignaturePhoto);



export default router;

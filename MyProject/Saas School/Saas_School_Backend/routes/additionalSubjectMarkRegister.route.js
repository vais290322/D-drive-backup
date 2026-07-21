import express from "express";
import {
    createAdditionalSubjectMarkRegister,
    updateAdditionalSubjectMarkRegister,
    deleteAdditionalSubjectMarkRegister,
    additionalMarksheetData
} from "../controllers/additionalSubjectMarkRegister.controller.js";

const router = express.Router();

router.post("/create", createAdditionalSubjectMarkRegister);
router.put("/update", updateAdditionalSubjectMarkRegister);
router.delete("/delete", deleteAdditionalSubjectMarkRegister);
router.get("/additionalMarksheetData", additionalMarksheetData);

export default router;
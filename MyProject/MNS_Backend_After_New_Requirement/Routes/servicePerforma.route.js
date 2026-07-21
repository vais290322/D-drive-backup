import express from "express";
import { 
    createService, 
    getAllServices, 
    getServiceById, 
    updateService, 
    deleteService 
} from "../Controllers/servicePerfroma.controller.js";

const router = express.Router();

router.post("/create", createService);
router.get("/get-all", getAllServices);
router.get("/by-id/:id", getServiceById);
router.put("/update/:id", updateService);
router.delete("/delete/:id", deleteService);

export default router;

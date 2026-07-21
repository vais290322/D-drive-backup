import {Router} from "express";
import { createInventory, deleteInventory, getInventoryByCategory, getInventoryByCode, getInventoryBySchool, getInventoryBySubCategory, updateInventory, searchInventory } from "../controllers/inventory.controller.js";

const router = Router();

router.post("/", createInventory);
router.get("/category/:schoolId/:categoryId", getInventoryByCategory);
router.get("/subCategory/:schoolId/:subCategoryId", getInventoryBySubCategory);
router.get("/school/:schoolId", getInventoryBySchool);
router.get("/code/:schoolId/:code", getInventoryByCode);
router.put("/:schoolId/:id", updateInventory);
router.delete("/:schoolId/:id", deleteInventory);
router.get("/search/:schoolId", searchInventory);


export default router;

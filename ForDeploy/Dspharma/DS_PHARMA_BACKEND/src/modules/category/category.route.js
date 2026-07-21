import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  fetchAllCategories,
  updateCategory,
} from "./category.controller.js";

const categoryRouter = Router();

categoryRouter.post("/", createCategory);
categoryRouter.get("/", fetchAllCategories);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;

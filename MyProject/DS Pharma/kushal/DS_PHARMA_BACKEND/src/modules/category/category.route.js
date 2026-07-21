import { Router } from "express";
import { fetchAllCategories } from "./category.controller.js";

const categoryRouter = Router();

categoryRouter.get("/", fetchAllCategories);

export default categoryRouter;
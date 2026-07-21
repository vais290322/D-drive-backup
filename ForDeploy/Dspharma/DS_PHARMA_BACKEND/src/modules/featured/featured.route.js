import { Router } from "express";
import {
  addToFeatured,
  getFeatured,
  removeFeaturedItem,
} from "./featured.controller.js";

const featuredRouter = Router();

featuredRouter.post("/featured", addToFeatured);
featuredRouter.get("/featured", getFeatured);
featuredRouter.delete("/featured/:id", removeFeaturedItem);

export default featuredRouter;

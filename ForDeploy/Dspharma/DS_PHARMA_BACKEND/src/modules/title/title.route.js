import { Router } from "express";
import {
  createTitle,
  getTitles,
  getTitleById,
  updateTitle,
  deleteTitle,
} from "./title.controller.js";

const titleRouter = Router();

titleRouter.post("/addheading", createTitle);
titleRouter.get("/getheading", getTitles);
titleRouter.get("/getheadingbyid/:id", getTitleById);
titleRouter.put("/updateheading/:id", updateTitle);
titleRouter.delete("/deleteheading/:id", deleteTitle);

export default titleRouter;

import { Router } from "express";
import {
  createContact,
  getContacts,
  getContactById,
  deleteContact,
} from "./contact.controller.js";

const contactRouter = Router();

contactRouter.post("/", createContact);
contactRouter.get("/", getContacts);
contactRouter.get("/:id", getContactById);
contactRouter.delete("/:id", deleteContact);

export default contactRouter;

import { Router } from "express";
import {
  getAllParties,
  getParties,
  getPartyDetails,
} from "./party.controller.js";

const partyRouter = Router();

partyRouter.get("/", getParties);
partyRouter.get("/all", getAllParties);
partyRouter.get("/:rid", getPartyDetails);

export default partyRouter;

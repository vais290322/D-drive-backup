// routes/schema.routes.js
import { Router } from "express";
import { upsertSchema, getSchema } from "../controller/schemaDef.controller.js";

const router = Router();

router.post("/upsert-schema", upsertSchema);
router.get("/get-schema/:schemaName", getSchema);

export default router;
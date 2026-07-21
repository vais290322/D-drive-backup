import { Router } from "express";
import {
    fetchCustomerDashboardData,
    fetchExpiringProducts
} from "./dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get("/customer", fetchCustomerDashboardData);
dashboardRouter.get("/expiring", fetchExpiringProducts);

export default dashboardRouter;

import cron from "node-cron";
import { syncMastersDataService } from "../modules/mastersync/masterSync.service.js";

export const startCronJobs = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      await syncMastersDataService();
    } catch (error) {
      console.log(error);
    }
  });
};

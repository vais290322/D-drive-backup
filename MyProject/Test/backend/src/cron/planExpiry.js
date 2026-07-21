import cron from "node-cron";
import User from "../models/User.model.js";
import { sendEmail } from "../utils/mailer.js";

// Run every day at 00:00 (Midnight)
export const initCronJobs = () => {
    console.log("Initializing Cron Jobs...");

    cron.schedule("0 0 * * *", async () => {
        console.log("Running Daily Subscription Expiry Check...");

        try {
            const now = new Date();
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(now.getDate() + 7);

            // 1. Find users expiring in exactly 7 days (range check for better coverage)
            const startOfDay = new Date(sevenDaysFromNow.setHours(0, 0, 0, 0));
            const endOfDay = new Date(sevenDaysFromNow.setHours(23, 59, 59, 999));

            const expiringSoonUsers = await User.find({
                planExpiry: { $gte: startOfDay, $lte: endOfDay },
                plan: { $ne: "Free" }
            });

            for (const user of expiringSoonUsers) {
                await sendEmail(
                    user.email,
                    "Action Required: Your VasiCloud Subscription Expires in 7 Days",
                    `<p>Hi ${user.name},</p>
                    <p>Your subscription to the <strong>${user.plan}</strong> plan is set to expire on ${user.planExpiry.toDateString()}.</p>
                    <p>Please renew your plan to avoid any interruption in uploading new files.</p>
                    <p><a href="${process.env.FRONTEND_URL}/pricing">Renew Now</a></p>
                    <p>Regards,<br>VasiCloud Team</p>`
                );
                console.log(`Sent expiry warning to ${user.email}`);
            }

            // 2. Find users expired TODAY
            const yesterday = new Date();
            yesterday.setDate(now.getDate() - 1); // If expired yesterday/today transition
            // Ideally checks for precise match or simply users who expired < Now and haven't been notified (needs a flag).
            // For simplicity, let's check users whose expiry was 'Yesterday' (so they are now expired)

            const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
            const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

            const justExpiredUsers = await User.find({
                planExpiry: { $gte: startOfYesterday, $lte: endOfYesterday },
                plan: { $ne: "Free" }
            });

            for (const user of justExpiredUsers) {
                await sendEmail(
                    user.email,
                    "Alert: Your VasiCloud Subscription Has Expired",
                    `<p>Hi ${user.name},</p>
                    <p>Your subscription has expired. You can still access your files, but you will not be able to upload new content until you renew.</p>
                    <p><a href="${process.env.FRONTEND_URL}/pricing">Renew Subscription</a></p>
                    <p>Regards,<br>VasiCloud Team</p>`
                );
                console.log(`Sent expired notification to ${user.email}`);
            }

        } catch (error) {
            console.error("Error in Cron Job:", error);
        }
    });
};

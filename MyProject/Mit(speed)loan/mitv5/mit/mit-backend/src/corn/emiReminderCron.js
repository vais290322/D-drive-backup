const cron = require("node-cron");
const axios = require("axios");

const EmiSchedule = require("../models/EmiSchedule");


async function sendWhatsAppReminder(emi, customer) {
    // console.log("EMI:", emi);

  try {

    console.log("Sending reminder starting");
    const phonein = customer?.whatsapp_number || customer?.mobile_primary;
    const phone = `91${phonein.replace(/\D/g, "").slice(-10)}`;

    if (!phone) {
      console.log("No phone for customer");
      return;
    }

    //const paymentLink = `${process.env.FRONTEND_URL}/pay-emi/${emi._id}`;

    await axios.post(
      "https://backend.aisensy.com/campaign/t1/api/v2",
      {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "emi_payment_reminder_final",
        destination: phone,
        userName: customer.full_name,
        templateParams: [
          `${customer.full_name}`,
          `${emi.emi_amount}`,
          `${new Date(emi.due_date).toLocaleDateString("en-IN")}`,
          `${emi.loan_id.total_payable}`,
          `${emi.opening_balance+emi.loan_id. processing_fee+emi.loan_id.insurance_fee}`,
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AISENSY_API_KEY}`,
        },
      }
    );

    // emi.reminder_sent = true;
    // emi.reminder_sent_at = new Date();
    // await emi.save();

    console.log(`✅ Reminder sent to ${phone}`);
  } catch (error) {
    console.error(
      `❌ Failed EMI ${emi._id}`,
      error?.response?.data || error.message
    );
  }
}

cron.schedule("0 10 * * *", async () => {
  try {
    console.log("⏰ EMI Reminder Cron Running...");

    const today = new Date();

    const reminderDate = new Date();
    reminderDate.setDate(today.getDate() + 3);
    reminderDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(reminderDate);
    nextDay.setDate(reminderDate.getDate() + 1);

    console.log("Reminder date:", reminderDate);
    console.log("Next day:", nextDay);

    const emis = await EmiSchedule.find({
      due_date: {
        $gte: reminderDate,
        $lt: nextDay,
      },
      status: "pending",
    }).populate({
      path: "loan_id",
      populate: {
        path: "customer_id",
        model: "Customer",
      },
    });

    console.log("Emis found:", emis.length);

    for (const emi of emis) {
      const customer = emi.loan_id?.customer_id;

      if (!customer) continue;

      await sendWhatsAppReminder(emi, customer);
    }
  } catch (error) {
    console.error("Cron Error:", error.message);
  }
});
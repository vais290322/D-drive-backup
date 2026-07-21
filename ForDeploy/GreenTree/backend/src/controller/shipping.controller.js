const Shipping = require("../models/shipping.models");
const Order = require("../models/order.models");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config({ quiet: true });

// Create shipping record
exports.createShipping = async (req, res) => {
  try {
    const { order, awbNumber, courierCompany } = req.body;
    // Basic validation
    if (!order || !awbNumber || !courierCompany) {
      return res
        .status(400)
        .json({
          message: "Order ID, AWB number, and courier company are required",
        });
    }

    // Check if AWB already exists for the same order
    const existingShipping = await Shipping.findOne({ order });
    if (existingShipping) {
      return res
        .status(400)
        .json({
          message: "You have already added an AWB number for this order",
        });
    }

    // Create shipping record
    const shipping = new Shipping({ order, awbNumber, courierCompany });
    await shipping.save();

    // ✅ Fetch customer details from Order model
    const orderData = await Order.findById(order).populate(
      "user",
      "phone name"
    );
    if (!orderData) {
      return res.status(404).json({ message: "Order not found" });
    }

    const phone = orderData.user?.phone;
    console.log(phone)
    // const customerName = orderData.user?.name || "Customer";

    // ✅ Prepare SMS message
    if (phone) {
      const smsData = {
        route: "dlt",
        message:"201812",
        sender_id:"GTNSRY",
        variables_values: `${order}|${awbNumber}|${courierCompany}`,
        flash: 0,
        numbers: phone.toString(),
      };

      // ✅ Send SMS via Fast2SMS
      try {
        const response = await axios.post(
          "https://www.fast2sms.com/dev/bulkV2",
          smsData,
          {
            headers: {
              authorization: process.env.FAST2SMS_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("✅ Fast2SMS Response:", response.data);
      } catch (smsError) {
        console.error(
          "⚠️ SMS sending failed:",
          smsError.response?.data || smsError.message
        );
      }
    } else {
      console.warn("⚠️ No phone number found for user, SMS not sent.");
    }

    // ✅ Success response
    res
      .status(201)
      .json({
        message: "Shipping record created and SMS sent",
        data: shipping,
      });
  } catch (error) {
    console.error("❌ Error creating shipping:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all shipping records
// exports.getAllShipping = async (req, res) => {
//   try {
//     const records = await Shipping.findOne({ order: req.params.id }).populate(
//       "order"
//     );
//     res.status(200).json({ data: records });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Get shipping by ID
exports.getShippingById = async (req, res) => {
  try {
    const record = await Shipping.findOne({ order: req.params.id }).populate(
      "order"
    );
    if (!record)
      return res.status(404).json({ message: "Shipping record not found" });
    res.status(200).json({ data: record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update shipping record
exports.updateShipping = async (req, res) => {
  try {
    const { awbNumber, courierCompany } = req.body;

    // Validate input
    if (!awbNumber || !courierCompany) {
      return res
        .status(400)
        .json({ message: "AWB number and courier company are required" });
    }

    // Update shipping record
    const record = await Shipping.findOneAndUpdate(
      { order: req.params.id },
      { awbNumber, courierCompany },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Shipping record not found" });
    }

    // Fetch customer details from the related order
    const orderData = await Order.findById(req.params.id).populate(
      "user",
      "phone name"
    );
    if (!orderData) {
      return res.status(404).json({ message: "Order not found" });
    }
    console.log(orderData)
    const phone = orderData.user?.phone;
    console.log(phone)
    // const customerName = orderData.user?.name || "Customer";

    // Prepare and send SMS only if phone exists
    if (phone) {
      const smsData = {
        route: "dlt",
        message: "201812",
        sender_id: "GTNSRY",
        variables_values: `${req.params.id}|${awbNumber}|${courierCompany}`,
        flash: 0,
        numbers: phone.toString(),
      };

      // Send SMS via Fast2SMS
      try {
        const response = await axios.post(
          "https://www.fast2sms.com/dev/bulkV2",
          smsData,
          {
            headers: {
              authorization: process.env.FAST2SMS_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("✅ Fast2SMS Update Response:", response.data);
      } catch (smsError) {
        console.error(
          "⚠️ Failed to send SMS:",
          smsError.response?.data || smsError.message
        );
      }
    } else {
      console.warn("⚠️ No phone number found for user, SMS not sent.");
    }

    // Respond to client
    res.status(200).json({
      message: "Shipping updated and SMS sent successfully",
      data: record,
    });
  } catch (error) {
    console.error("❌ Error updating shipping:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete shipping record
exports.deleteShipping = async (req, res) => {
  try {
    const record = await Shipping.findByIdAndDelete(req.params.id);
    if (!record)
      return res.status(404).json({ message: "Shipping record not found" });
    res.status(200).json({ message: "Shipping deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

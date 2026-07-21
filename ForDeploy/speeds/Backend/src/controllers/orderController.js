import Order from "../models/order.js";
import Product from "../models/product.js";
import Cart from "../models/cart.js";
import Razorpay from "razorpay";
import nodemailer from "nodemailer";
import axios from "axios";
import Payhistory from "../models/payhistory.js";
import Register from "../models/authUser.js";
import dotenv from "dotenv";
import payhistory from "../models/payhistory.js";
dotenv.config({ quiet: true });

dotenv.config({ quiet: true });

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const userId = req.params.id;
    const userdata = await Register.findById(userId);

    const {
      orderItems,
      paymentMethod,
      shippingPrice,
      discount,
      totalPrice,
      taxPrice,
      addressLine1,
      addressLine2,
      street,
      city,
      state,
      postalCode,
      district,
      type,
      longitude,
      latitude,
      landmark,
    } = req.body;

    if (userdata.walletBalance < totalPrice) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient wallet balance" });
    }

    // 🔹 Validate input
    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: "No order items provided" });

    // 🔹 Create Order
    const order = await Order.create({
      user: userId,
      orderItems,
      paymentMethod,
      shippingPrice,
      discount,
      totalPrice,
      taxPrice,
      orderStatus: "Pending",
      addressLine1,
      addressLine2,
      type,
      longitude,
      latitude,
      street,
      city,
      state,
      postalCode,
      district,
      landmark,
    });
    console.log("User address and postal code:", order);
    // 🔹 Populate user data for Envia
    const populatedUser = await Order.findById(order._id)
      .populate("user")
      .populate("orderItems.product");

    userdata.walletBalance = userdata.walletBalance - totalPrice;
    await userdata.save();

    await Payhistory.create({
      user: userId,
      transactionId: `tran_${Date.now()}`,
      amount: totalPrice,
      description: "Payment for order",
      status: "SUCCESS",
      paymentId: `pay_${Date.now()}`,
    });

    // console.log("Order created successfully:", populatedUser);
    // // 🔹 Send invoice
    await sendInvoiceEmail(populatedUser);

    // 🔹 Clear user's cart
    await Cart.deleteMany({ user: userId });

    return res.status(201).json({
      success: true,
      message:
        "✅ Order created successfully,invoice sent to user email and SMS",
      data: order,
    });
  } catch (error) {
    console.error("❌ Order creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const sendInvoiceEmail = async (order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const amountInWords = convertAmountToWords(order.totalPrice);

    const emailHtml = generateInvoiceEmail({
      orderNumber: order._id,
      invoiceNumber: `INV-${order._id}`,
      orderDate: new Date().toLocaleDateString("en-IN"),
      invoiceDate: new Date().toLocaleDateString("en-IN"),
      storeAddress:
        "Rajpur, Chalka, Deganga, Chakla Dham, Pathorghata-Chakla Road, Debalaya, Chakla - 743424, West Bengal",
      storePhone: "8926010101",
      gstNumber: "19CNEPM8387H12B",
      customerName: order.user.fullName,
      customerAddress: `${order.addressLine1},  ${order.street}, ${order.city} - ${order.postalCode}, ${order.state} , India`,
      customerPhone: order.user.phoneNumber,
      paymentMethod: order.paymentMethod,
      orderStatus: order.orderStatus,
      orderItems: order.orderItems,
      shippingPrice: order.shippingPrice,
      taxPrice: order.taxPrice,
      discount: order.discount,
      totalPrice: order.totalPrice,
      amountInWords: amountInWords,
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: order.user.email,
      subject: `Order Confirmation - Invoice #INV-${order._id}`,
      html: emailHtml,
    });

    console.log(`✅ Invoice email sent to ${order.user.email}`);
  } catch (error) {
    console.error("Error sending invoice email:", error);
    throw error;
  }
};
const convertAmountToWords = (amount) => {
  // Handle decimals for paisa
  const [rupees, paisa] = Number(amount).toFixed(2).split(".");

  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (rupees.length > 9) return "Overflow";

  const n = ("000000000" + rupees)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;

  let str = "";
  str +=
    n[1] != 0
      ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore "
      : "";
  str +=
    n[2] != 0
      ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh "
      : "";
  str +=
    n[3] != 0
      ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand "
      : "";
  str +=
    n[4] != 0
      ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " Hundred "
      : "";
  str +=
    n[5] != 0
      ? (str != "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
        " "
      : "";

  // Add paisa if present
  const paisaNum = parseInt(paisa);
  if (paisaNum > 0) {
    str =
      str.trim() +
      " and " +
      (paisaNum < 20
        ? a[paisaNum]
        : b[Math.floor(paisaNum / 10)] +
          (paisaNum % 10 !== 0 ? " " + a[paisaNum % 10] : "")) +
      " Paisa Only";
  } else {
    str = str.trim() + " Only";
  }

  return str;
};
const generateInvoiceEmail = (data) => {
  const itemRows = data.orderItems
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.product.name}</td>
          <td>${item.product.brand}</td>
          <td>${item.quantity}</td>
          <td>₹${item.product.discountPrice}</td>
          <td>₹${item.quantity * item.product.discountPrice}</td>
        </tr>`
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 700px;
        margin: 30px auto;
        background: #fff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header h1 {
        color: #333;
      }
      .section {
        margin-bottom: 20px;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      .table th, .table td {
        border: 1px solid #ddd;
        padding: 8px;
        font-size: 14px;
        text-align: left;
      }
      .table th {
        background: #f0f0f0;
      }
      .summary {
        margin-top: 20px;
      }
      .summary table {
        width: 100%;
      }
      .summary td {
        padding: 5px 0;
      }
      .footer {
        margin-top: 30px;
        text-align: center;
        font-size: 13px;
        color: #555;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Tax Invoice</h1>
        <p>Invoice #: ${data.invoiceNumber}</p>
      </div>

      <div class="section">
        <strong>Store Details</strong><br/>
        ${data.storeAddress}<br/>
        GST: ${data.gstNumber}<br/>
        Phone: ${data.storePhone}
      </div>

      <div class="section">
        <strong>Customer Details</strong><br/>
        ${data.customerName}<br/>
        ${data.customerAddress}<br/>
        Phone: ${data.customerPhone}
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Brand</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <div class="summary">
        <table>
          <tr><td>Tax:</td><td>₹${data.taxPrice}</td></tr>
          <tr><td>Shipping:</td><td>₹${data.shippingPrice}</td></tr>
          <tr><td>Discount:</td><td>-₹${data.discount}</td></tr>
          <tr><td><strong>Total:</strong></td><td><strong>₹${data.totalPrice}</strong></td></tr>
          <tr><td><strong>Rupees In Words:</strong></td><td colspan="2"><em>${data.amountInWords}</em></td></tr>
        </table>
      </div>

      <div class="footer">
        Thank you for your purchase!<br/>
        For support, contact us at ${data.storePhone}.
      </div>
    </div>
  </body>
  </html>`;
};

// exports.trackOrderDelivery = async (req, res) => {
//   try {
//     const orderId = req.params.id;
//     const order = await Order.findById(orderId);
//     const shiprocketToken = await shiprocketLogin();

//     if (!order || !order.delivery || !order.delivery.shipment_id) {
//       return res
//         .status(404)
//         .json({ message: "Tracking info not found for this order" });
//     }

//     const shipment_id = order.delivery.shipment_id;

//     const response = await axios.get(
//       `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipment_id}`,
//       {
//         headers: {
//           Authorization: `Bearer ${shiprocketToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // Optionally, save tracking details to order
//     order.trackingDetails = response.data;
//     await order.save();

//     res.status(200).json({
//       message: "Order delivery tracking details fetched successfully",
//       data: order,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.admincreateOrder = async (req, res) => {
//   try {
//     console.log("Incoming order data:", req.body);
//     const shiprocketToken = await shiprocketLogin();
//     const userId = req.body.user;
//     const {
//       orderItems,
//       paymentMethod,
//       itemsPrice,
//       shippingPrice,
//       discount,
//       totalPrice,
//       taxPrice,
//       paidAmount,
//       dueAmount,
//       address,
//       street,
//       city,
//       state,
//       postalCode,
//       district,
//       landmark,
//     } = req.body;

//     // Basic validation
//     if (!orderItems || orderItems.length === 0)
//       return res.status(400).json({ message: "No order items provided" });

//     if (!paymentMethod)
//       return res.status(400).json({ message: "Payment method is required" });

//     // Create order
//     const order = await Order.create({
//       user: userId,
//       orderItems,
//       paymentMethod,
//       itemsPrice,
//       shippingPrice,
//       discount,
//       totalPrice,
//       dueAmount,
//       paidAmount,
//       taxPrice,
//       address,
//       street,
//       city,
//       state,
//       postalCode,
//       district,
//       landmark,
//       paymentStatus: "Pending",
//       orderStatus: "Processing",
//       isAdmin: true,
//     });
//     const populatedUser = await Order.findById(order._id)
//       .populate("user", "name email phone ")
//       .populate(
//         "orderItems.product",
//         "name brand quantity sellingprice type length width height weight weightUnit lengthUnit"
//       );

//     // const user = populatedUser?.user;
//     const products = populatedUser?.orderItems;

//     const orderPayload = {
//       order_id: populatedUser._id.toString(),
//       order_date: new Date().toISOString().slice(0, 16).replace("T", " "),

//       pickup_location: "Primary",

//       billing_customer_name: populatedUser?.user?.name || "",
//       billing_last_name: "",
//       billing_address: populatedUser?.address || "",
//       billing_address_2: "",
//       billing_city: populatedUser?.city || "",
//       billing_pincode: populatedUser?.postalCode || "",
//       billing_state: populatedUser?.state || "",
//       billing_country: "india",
//       billing_email: populatedUser?.user?.email || "",
//       billing_phone: populatedUser?.user?.phone || "",

//       shipping_is_billing: 1,

//       // shipping_customer_name: populatedUser?.user?.name || "Debanjan",
//       // shipping_last_name: "",
//       // shipping_address: "malviya nagar",
//       // shipping_address_2: "near metro station",
//       // shipping_city: "new delhi",
//       // shipping_pincode: "273303",
//       // shipping_country: "india",
//       // shipping_state: "delhi",
//       // shipping_email: "raushanra4@gmail.com",
//       // shipping_phone: "9721562372",

//       // order_items: [
//       //   {
//       //     name: "shoes",
//       //     sku: "shoes123",
//       //     units: "2",
//       //     selling_price: "1500",
//       //     discount: "0",
//       //     tax: "0",
//       //     hsn: "",
//       //   },
//       // ],

//       // ... existing code ...
//       order_items: products?.map((item) => ({
//         product_id: item?.product?._id.toString(),
//         name: item?.product?.name,
//         sku: `Pro-${item?.product?._id || ""}`,
//         units: Number(item?.quantity) || 1, // Ensure this is a number
//         selling_price: Number(item?.price) || 0, // Ensure this is a number
//         discount: 0,
//         tax: 0,
//         hsn: "",
//       })),
//       // ... existing code ...

//       payment_method: populatedUser?.paymentMethod || "COD",

//       shipping_charges: "0",
//       giftwrap_charges: "0",
//       transaction_charges: "0",
//       total_discount: "0",

//       sub_total: populatedUser?.paidAmount || "0",

//       length: products[0]?.product?.length || 10,
//       breadth: products[0]?.product?.width || 10,
//       height: products[0]?.product?.height || 10,
//       weight: products[0]?.product?.weight || 1,

//       order_status: "NEW", // Initial status of the order
//       ewaybill_no: "",
//       customer_gstin: "",
//       invoice_number: `INV-${populatedUser._id.toString()}`,
//       order_type: "",
//     };

//     console.log("Shiprocket Order Payload:", orderPayload);

//     // Call Shiprocket API to create shipment
//     const shiprocketResponse = await axios.post(
//       "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
//       orderPayload,
//       {
//         headers: {
//           Authorization: `Bearer ${shiprocketToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("Shiprocket Response:", shiprocketResponse);
//     // Save Shiprocket shipment details to order
//     order.delivery = {
//       order_id: shiprocketResponse.data.order_id,
//       channel_order_id: shiprocketResponse.data.channel_order_id,
//       shipment_id: shiprocketResponse.data.shipment_id,
//       awb_code: shiprocketResponse.data.awb_code,
//       courier_company: shiprocketResponse.data.courier_company,
//       tracking_url: shiprocketResponse.data.tracking_url,
//       status: shiprocketResponse.data.status,
//       response: shiprocketResponse.data,
//     };
//     await order.save();

//     return res.status(201).json({
//       message: "Order created successfully ",
//       data: order,
//     });
//   } catch (error) {
//     console.error("Order creation error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

// export const getUserAllOrders = async (req, res) => {
//   try {
//     let { page = 1, limit = 5, search = "" } = req.query;
//     const currentPage = parseInt(page, 10);
//     const perPage = parseInt(limit, 10);

//     // Step 1: Fetch all orders with populated user/product
//     const allOrders = await Order.find()
//       .populate(
//         "user",
//         "name email phone address postalCode city state street isAdmin"
//       )
//       .populate("orderItems.product")
//       .sort({ createdAt: -1 });

//     // Step 2: Filter only orders where user.isAdmin === true
//     const adminOrders = allOrders.filter((order) => order.isAdmin === false);

//     // Step 3: Apply search filtering
//     const filteredOrders = adminOrders.filter((order) => {
//       const user = order.user || {};
//       const productNames = order.orderItems
//         .map((item) => item.product?.name || "")
//         .join(" ");
//       const searchLower = search.toLowerCase();

//       return (
//         order._id.toString().toLowerCase().includes(searchLower) ||
//         order.orderStatus.toLowerCase().includes(searchLower) ||
//         order.paymentMethod.toLowerCase().includes(searchLower) ||
//         user.name?.toLowerCase().includes(searchLower) ||
//         user.email?.toLowerCase().includes(searchLower) ||
//         productNames.toLowerCase().includes(searchLower)
//       );
//     });

//     // Step 4: Pagination logic
//     const total = filteredOrders.length;
//     const paginatedOrders = filteredOrders.slice(
//       (currentPage - 1) * perPage,
//       currentPage * perPage
//     );

//     // Step 5: Return response
//     res.status(200).json({
//       message: "Admin user orders fetched successfully",
//       data: paginatedOrders,
//       pagination: {
//         totalItems: total,
//         totalPages: Math.ceil(total / perPage),
//         currentPage,
//         limit: perPage,
//       },
//     });
//   } catch (error) {
//     console.error("Get Orders Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

export const getAllOrders = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    const currentPage = parseInt(page, 10);
    const perPage = parseInt(limit, 10);

    // Step 1: Fetch all orders with populated user/product
    const allOrders = await Order.find()
      .populate("user")
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    // // Step 3: Apply search filtering
    const filteredOrders = allOrders.filter((order) => {
      const user = order.user || {};
      const productNames = order.orderItems
        .map((item) => item.product?.name || "")
        .join(" ");
      const searchLower = search.toLowerCase();

      return (
        order._id.toString().toLowerCase().includes(searchLower) ||
        order.orderStatus.toLowerCase().includes(searchLower) ||
        order.paymentMethod.toLowerCase().includes(searchLower) ||
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        productNames.toLowerCase().includes(searchLower)
      );
    });

    // // Step 4: Pagination logic
    const total = filteredOrders.length;
    const paginatedOrders = filteredOrders.slice(
      (currentPage - 1) * perPage,
      currentPage * perPage
    );

    // Step 5: Return response
    res.status(200).json({
      success: true,
      message: "all orders fetched successfully",
      data: paginatedOrders,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / perPage),
        currentPage,
        limit: perPage,
      },
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const getAdminAllOrders = async (req, res) => {
//   try {
//     let { page = 1, limit = 5, search = "" } = req.query;
//     const currentPage = parseInt(page, 10);
//     const perPage = parseInt(limit, 10);

//     // Step 1: Fetch all orders with populated user/product
//     const allOrders = await Order.find()
//       .populate(
//         "user",
//         "name email phone address postalCode city state street isAdmin"
//       )
//       .populate("orderItems.product")
//       .sort({ createdAt: -1 });

//     // Step 2: Filter only orders where user.isAdmin === true
//     const adminOrders = allOrders.filter((order) => order.isAdmin === true);

//     // Step 3: Apply search filtering
//     const filteredOrders = adminOrders.filter((order) => {
//       const user = order.user || {};
//       const productNames = order.orderItems
//         .map((item) => item.product?.name || "")
//         .join(" ");
//       const searchLower = search.toLowerCase();

//       return (
//         order._id.toString().toLowerCase().includes(searchLower) ||
//         order.orderStatus.toLowerCase().includes(searchLower) ||
//         order.paymentMethod.toLowerCase().includes(searchLower) ||
//         user.name?.toLowerCase().includes(searchLower) ||
//         user.email?.toLowerCase().includes(searchLower) ||
//         productNames.toLowerCase().includes(searchLower)
//       );
//     });

//     // Step 4: Pagination logic
//     const total = filteredOrders.length;
//     const paginatedOrders = filteredOrders.slice(
//       (currentPage - 1) * perPage,
//       currentPage * perPage
//     );

//     // Step 5: Return response
//     res.status(200).json({
//       message: "Admin user orders fetched successfully",
//       data: paginatedOrders,
//       pagination: {
//         totalItems: total,
//         totalPages: Math.ceil(total / perPage),
//         currentPage,
//         limit: perPage,
//       },
//     });
//   } catch (error) {
//     console.error("Get Orders Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

export const getOrderByIduser = async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await Order.find({ user: userId })
      .populate("orderItems.product")
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const admin = await Register.findOne({ role: "ADMIN" });
    console.log("Admin cashback limit:", admin);

    console.log("Updating order status to:", status);

    const order = await Order.findOne({ _id: req.params.id });
    if (order.orderStatus === "Delivered") {
      return res
        .status(400)
        .json({ success: false, message: "Order already delivered" });
    }
    console.log(order, req.params.id, status);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    order.orderStatus = status;

    if (status === "Delivered") {
      const cashbackLimit = Number(admin.cashback) || 10;
      const randomNumber =
        Math.floor(Math.random() * (cashbackLimit - 5 + 1)) + 5;
      console.log("Random cashback amount:", randomNumber);
      const userdata = await Register.findById(order.user);
      const data = await Register.findOne({ referralCode: userdata.buyerId });

      if (data) {
        await payhistory.create({
          user: data._id,
          transactionId: `tran_${Date.now()}`,
          amount: randomNumber,
          description: "Cashback for referral amount",
          status: "SUCCESS",
          paymentId: `pay_${Date.now()}`,
        });

        data.walletBalance = data.walletBalance + parseFloat(randomNumber);
        await data.save();
      }
    }
    await order.save();
    res
      .status(200)
      .json({ success: true, message: "Order status updated", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const cancelOrderAndRefund = async (req, res) => {
//   try {
//     const orderId = req.params.id;
//     const order = await Order.findById(orderId).populate("user");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (order.orderStatus === "Shipped") {
//       return res
//         .status(400)
//         .json({ message: "Shipped orders cannot be cancelled" });
//     }

//     if (order.orderStatus === "Cancelled") {
//       return res.status(400).json({ message: "Order already cancelled" });
//     }

//     // Only allow cancellation if not delivered
//     if (order.orderStatus === "Delivered") {
//       return res
//         .status(400)
//         .json({ message: "Delivered orders cannot be cancelled" });
//     }

//     // Mark order as cancelled
//     order.orderStatus = "Cancelled";
//     order.cancelledAt = Date.now();

//     // Refund logic using Razorpay
//     const refundAmount = order.paidAmount || order.totalPrice || 0;
//     if (!order.razorpayPaymentId) {
//       return res
//         .status(400)
//         .json({ message: "No Razorpay payment ID found for this order" });
//     }

//     // Initiate refund via Razorpay
//     let refund;
//     try {
//       refund = await razorpay.payments.refund(order.razorpayPaymentId, {
//         amount: Math.round(refundAmount * 100), // Razorpay expects amount in paise
//         speed: "optimum",
//       });
//     } catch (refundError) {
//       return res
//         .status(500)
//         .json({ message: "Refund failed", error: refundError.message });
//     }

//     // Optionally, record refund in order
//     order.refundAmount = refundAmount;
//     order.refundStatus = "Refunded";
//     order.razorpayRefundId = refund.id;

//     await order.save();

//     res.status(200).json({
//       message: "Order cancelled and refund processed via Razorpay",
//       order,
//       refund,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const userbyorder = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const orders = await Order.find({ user: userId })
//       .populate("orderItems.product")
//       // .populate("user", "name email phone address postalCode city state street")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ message: "Orders fetched successfully", orders });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getBestSellingProducts = async (req, res) => {
//   try {
//     // Aggregate orderItems to count total quantity sold per product
//     const bestSellers = await Order.aggregate([
//       { $unwind: "$orderItems" },
//       {
//         $group: {
//           _id: "$orderItems.product",
//           totalSold: { $sum: "$orderItems.qty" },
//         },
//       },
//       { $sort: { totalSold: -1 } },
//       { $limit: 10 }, // Top 10 best sellers
//     ]);

//     // Populate product details
//     const populated = await Product.find({
//       _id: { $in: bestSellers.map((b) => b._id) },
//     }).select("name sellingprice image costprice category stock");

//     // Merge sales data with product info
//     const result = bestSellers.map((seller) => {
//       const product = populated.find((p) => p._id.equals(seller._id));
//       return {
//         productId: seller._id,
//         name: product?.name,
//         sellingprice: product?.sellingprice,
//         image: product?.image,
//         stock: product?.stock,
//         costprice: product?.costprice,
//         category: product?.category,
//         totalSold: seller.totalSold,
//       };
//     });

//     res.status(200).json({
//       message: "Best Selling products fetched successfully",
//       data: result,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

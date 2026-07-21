const Order = require("../models/order.models");
const Product = require("../models/product.models");
const Cart = require("../models/cart.models");
const User = require("../models/register.models");
const Razorpay = require("razorpay");
const axios = require("axios");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config({ quiet: true });


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const shiprocketLogin = async () => {
  const response = await axios.post(process.env.SHIPROCKET_TOKEN_URL, {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });
  return response.data.token;
};

exports.createOrder = async (req, res) => {
  try {
    console.log("Incoming order data:", req.body);
    const shiprocketToken = await shiprocketLogin();
    console.log("Shiprocket token:", shiprocketToken);
    const userId = req.user.id;
   
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      discount,
      totalPrice,
      razorpayPaymentId,
      taxPrice,
      paidAmount,
      dueAmount,
      address,
      street,
      city,
      state,
      postalCode,
      district,
      landmark,
    } = req.body;

    // 🔹 Validate input
    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: "No order items provided" });

    if (!paymentMethod)
      return res.status(400).json({ message: "Payment method is required" });

    // 🔹 Create Order
    const order = await Order.create({
      user: userId,
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      discount,
      totalPrice,
      dueAmount,
      paidAmount,
      taxPrice,
      razorpayPaymentId,
      paymentStatus: "Pending",
      orderStatus: "Processing",
      address,
      street,
      city,
      state,
      postalCode,
      district,
      landmark,
      isAdmin: false,
    });

    // 🔹 Populate user data for Envia
    const populatedUser = await Order.findById(order._id)
      .populate("user", "name email phone ")
      .populate("orderItems.product", "name brand quantity sellingprice type length width height weight weightUnit lengthUnit");

    const user = populatedUser?.user;
    const products = populatedUser?.orderItems

    console.log("User and products:",populatedUser);

    // ✅ Validate user address before shipment
    if (!user || !populatedUser.address || !populatedUser.postalCode) {
      return res.status(400).json({
        message: "User shipping address or postal code missing.",
      });
    }

    console.log("User address and postal code:", user);

    // 🔹 Prepare Envia shipment data
    // const shipmentData = {
    //   origin: {
    //     name: "Green Tree Nursery",
    //     company: "Green Tree",
    //     email: "greentreenursery2015@gmail.com",
    //     phone: "8926010101",
    //     street: "Raipur,Chalka,Deganga,Chakla Dham, Pathorghata-Chakla Road",
    //     number: "1",
    //     district: "NORTH 24 PARGANAS",
    //     city: "Deganga",
    //     state: "WB",
    //     country: "IN",
    //     postalCode: "743704",
    //   },
    //   destination: {
    //     name: user?.name || "Customer",
    //     email: user?.email || "noemail@example.com",
    //     phone: user?.phone || "9999999999",
    //     address: populatedUser?.address || "Unknown Address",
    //     street: populatedUser?.street || "Unknown Street",
    //     number: user?.number || "1", // <-- Add this line
    //     city: populatedUser?.city || "Unknown City",
    //     state: populatedUser?.state ? populatedUser.state.substring(0, 2).toUpperCase() : "WB",
    //     district: populatedUser?.district || "Unknown District",
    //     country: "IN",
    //     postalCode: populatedUser?.postalCode || "000000",
    //   },
    //   packages: products.map((product) => ({
    //     content: product.product.name,
    //     amount: product.quantity || 1, // <-- Use quantity, not paidAmount, and ensure <= 15 total
    //     type: product.product.type || "box",
    //     dimensions: {
    //       length: product.product.length || 10,
    //       width: product.product.width || 10,
    //       height: product.product.height || 10,
    //     },
    //     weight: product.product.weight || 1,
    //     weightUnit: product.product.weightUnit ,
    //     lengthUnit: product.product.lengthUnit,
    //   })),
    //   shipment: {
    //     carrier: "delhivery", // <-- Change from "dhl" to a supported carrier
    //     service: "express",
    //     type: "standard",
    //   },
    //   settings:{
    //     printFormat: "PDF",
    //     printSize: "STOCK_4X6",
    //     comments: "comentarios de el envío"
    //   }
    // };

    // try {
    //   // 🔹 Call Envia API
    //   const enviaResponse = await axios.post(
    //     `${process.env.ENVIA_API_URL}`,
    //     shipmentData,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${process.env.ENVIA_API_KEY}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );

    //   // Log the actual response data for debugging
    //   console.log("Envia API response data:", enviaResponse.data);

    //   // Check for coverage error
    //   if (
    //     enviaResponse.data?.meta === "error" &&
    //     enviaResponse.data?.error?.message === "No coverage for requested area."
    //   ) {
    //     return res.status(400).json({
    //       message: "Sorry, we do not deliver to your address at this time.",
    //       details: enviaResponse.data.error
    //     });
    //   }

    //   // Safely extract tracking info
    //   let deliveryInfo = null;
    //   if (Array.isArray(enviaResponse.data) && enviaResponse.data.length > 0) {
    //     deliveryInfo = enviaResponse.data[0];
    //   } else if (enviaResponse.data && typeof enviaResponse.data === "object") {
    //     deliveryInfo = enviaResponse.data;
    //   }

    //   order.delivery = {
    //     provider: deliveryInfo?.carrier || "Unknown",
    //     trackingId: deliveryInfo?.trackingNumber  || null,
    //     service: deliveryInfo?.service ||  "Unknown",
    //     trackUrl: deliveryInfo?.trackUrl || null,
    //     details: deliveryInfo,
    //   };

    //   await order.save();
    // } catch (enviaError) {
    //   console.error("Envia API error:", enviaError?.response?.data || enviaError.message);
    // }

    const shiprocketOrderPayload = {
      order_id: order._id.toString(),
      order_date: new Date().toISOString().slice(0, 10),
      pickup_location: "Green Tree Nursery",
      channel_id: "", // Optional, if you use channels
      billing_customer_name: user?.name,
      billing_last_name: "",
      billing_address: order.address,
      billing_city: order.city,
      billing_pincode: order.postalCode,
      billing_state: order.state,
      billing_country: "India",
      billing_email: user?.email,
      billing_phone: user?.phone,
      shipping_is_billing: true,
      order_items: order.orderItems.map(item => ({
        name: item.product.name,
        sku: item.product._id.toString(),
        units: item.quantity,
        selling_price: item.product.sellingprice,
      })),
      payment_method: order.paymentMethod,
      sub_total: order.itemsPrice,
      length: order.orderItems[0]?.product.length || 10,
      breadth: order.orderItems[0]?.product.width || 10,
      height: order.orderItems[0]?.product.height || 10,
      weight: order.orderItems[0]?.product.weight || 1,
    };

    // Call Shiprocket API to create shipment
    const shiprocketResponse = await axios.post(
      process.env.SHIPROCKET_ORDER_URL,
      shiprocketOrderPayload,
      {
        headers: {
          Authorization: `Bearer ${shiprocketToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Save Shiprocket shipment details to order
    order.delivery = {
      shipment_id: shiprocketResponse.data.shipment_id,
      awb_code: shiprocketResponse.data.awb_code,
      courier_company: shiprocketResponse.data.courier_company,
      tracking_url: shiprocketResponse.data.tracking_url,
      status: shiprocketResponse.data.status,
      response: shiprocketResponse.data,
    };
    await order.save();

    const after7Days = new Date();
    after7Days.setDate(after7Days.getDate() + 7);
    const next7 = after7Days.toISOString().split("T")[0];
    const valuedata = {
      route: "dlt",
      message:"202096" ,
      sender_id:"GTNSRY",
      variables_values: `${order._id.toString()}| ${shiprocketResponse.data.awb_code}| ${next7}`,
      flash: 0,
      numbers:user?.phone.toString(), // Ensure this is a string
    };

    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      valuedata,
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Fast2SMS Response:", response.data);



    // 🔹 Send invoice
    await sendInvoiceEmail(populatedUser);

    // 🔹 Clear user's cart
    await Cart.deleteMany({ user: userId });

    return res.status(201).json({
      message:
        "✅ Order created successfully,invoice sent to user email and SMS",
      data: populatedUser,
      delivery: order.delivery || null,
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
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
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
      customerName: order.user.name,
      customerAddress: `${order.address},  ${order.street}, ${order.city} - ${order.postalCode}, ${order.state} ,${order.district}, India`,
      customerPhone: order.user.phone,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      orderItems: order.orderItems,
      itemsPrice: order.itemsPrice,
      shippingPrice: order.shippingPrice,
      taxPrice: order.taxPrice,
      discount: order.discount,
      totalPrice: order.totalPrice,
      dueAmount: order.dueAmount,
      paidAmount: order.paidAmount,
      amountInWords: amountInWords,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
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
          <td>₹${item.product.sellingprice}</td>
          <td>₹${item.quantity * item.product.sellingprice}</td>
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
          <tr><td>Subtotal:</td><td>₹${data.itemsPrice}</td></tr>
          <tr><td>Tax:</td><td>₹${data.taxPrice}</td></tr>
          <tr><td>Shipping:</td><td>₹${data.shippingPrice}</td></tr>
          <tr><td>Discount:</td><td>-₹${data.discount}</td></tr>
          <tr><td>Due Amount:</td><td>₹${data.dueAmount}</td></tr>
          <tr><td>Paid Amount:</td><td>₹${data.paidAmount}</td></tr>
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

exports.trackOrderDelivery = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    const shiprocketToken = await shiprocketLogin();

    if (!order || !order.delivery || !order.delivery.awb_code) {
      return res
        .status(404)
        .json({ message: "Tracking info not found for this order" });
    }


      const awbCode = order.delivery.awb_code;

      const response = await axios.get(
        `https://apiv2.shiprocket.in/v1/external/courier/track?awb=${awbCode}`,
        {
          headers: {
            Authorization: `Bearer ${shiprocketToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Optionally, save tracking details to order
      order.delivery.trackingDetails = response.data;
      await order.save();

    // const shipmentData = {
    //   trackingNumbers: [order.delivery.trackingId]
    // };

    // const response = await axios.get(
    //   `${process.env.ENVIA_TRACKING_API_URL}`,
    //   shipmentData,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.ENVIA_API_KEY}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // // Update order delivery status/details
    // order.trackingDetails = response.data;
    // await order.save();

    res.status(200).json({
      message: "Order delivery tracking details fetched successfully",
      delivery:response,
      data:order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.admincreateOrder = async (req, res) => {
  try {
    console.log("Incoming order data:", req.body);

    const userId = req.body.user;
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      discount,
      totalPrice,
      taxPrice,
      paidAmount,
      dueAmount,
      address,
      street,
      city,
      state,
      postalCode,
      district,
      landmark,
    } = req.body;

    // Basic validation
    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: "No order items provided" });

    if (!paymentMethod)
      return res.status(400).json({ message: "Payment method is required" });

    // Create order
    const order = await Order.create({
      user: userId,
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      discount,
      totalPrice,
      dueAmount,
      paidAmount,
      taxPrice,
      address,
      street,
      city,
      state,
      postalCode,
      district,
      landmark,
      paymentStatus: "Pending",
      orderStatus: "Processing",
      isAdmin: true,
    });

    return res.status(201).json({
      message: "Order created successfully and invoice sent to user email",
      data: order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get all orders (Admin)
exports.getUserAllOrders = async (req, res) => {
  try {
    let { page = 1, limit = 5, search = "" } = req.query;
    const currentPage = parseInt(page, 10);
    const perPage = parseInt(limit, 10);

    // Step 1: Fetch all orders with populated user/product
    const allOrders = await Order.find()
      .populate(
        "user",
        "name email phone address postalCode city state street isAdmin"
      )
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    // Step 2: Filter only orders where user.isAdmin === true
    const adminOrders = allOrders.filter((order) => order.isAdmin === false);

    // Step 3: Apply search filtering
    const filteredOrders = adminOrders.filter((order) => {
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

    // Step 4: Pagination logic
    const total = filteredOrders.length;
    const paginatedOrders = filteredOrders.slice(
      (currentPage - 1) * perPage,
      currentPage * perPage
    );

    // Step 5: Return response
    res.status(200).json({
      message: "Admin user orders fetched successfully",
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
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    let { page = 1, limit = 5, search = "" } = req.query;
    const currentPage = parseInt(page, 10);
    const perPage = parseInt(limit, 10);

    // Step 1: Fetch all orders with populated user/product
    const allOrders = await Order.find()
      .populate(
        "user",
        "name email phone address postalCode city state street isAdmin"
      )
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
      message: "user orders fetched successfully",
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
    res.status(500).json({ message: error.message });
  }
};

exports.getAdminAllOrders = async (req, res) => {
  try {
    let { page = 1, limit = 5, search = "" } = req.query;
    const currentPage = parseInt(page, 10);
    const perPage = parseInt(limit, 10);

    // Step 1: Fetch all orders with populated user/product
    const allOrders = await Order.find()
      .populate(
        "user",
        "name email phone address postalCode city state street isAdmin"
      )
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    // Step 2: Filter only orders where user.isAdmin === true
    const adminOrders = allOrders.filter((order) => order.isAdmin === true);

    // Step 3: Apply search filtering
    const filteredOrders = adminOrders.filter((order) => {
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

    // Step 4: Pagination logic
    const total = filteredOrders.length;
    const paginatedOrders = filteredOrders.slice(
      (currentPage - 1) * perPage,
      currentPage * perPage
    );

    // Step 5: Return response
    res.status(200).json({
      message: "Admin user orders fetched successfully",
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
    res.status(500).json({ message: error.message });
  }
};
// Get Orders by User
exports.getOrderByIduser = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
      .populate("orderItems.product")
      .populate("user", "name email phone address postalCode city state street")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Order Status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findOne({ _id: req.params.id });
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({ message: "Order already delivered" });
    }
    console.log(order, req.params.id, status);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;

    if (status === "Delivered") {
      order.paidAt = Date.now();
    }

    await order.save();
    res.status(200).json({ message: "Order status updated", data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Cancel Order and Refund using Razorpay
exports.cancelOrderAndRefund = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if(order.orderStatus === "Shipped"){
      return res.status(400).json({ message: "Shipped orders cannot be cancelled" });
    }

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    // Only allow cancellation if not delivered
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({ message: "Delivered orders cannot be cancelled" });
    }

    // Mark order as cancelled
    order.orderStatus = "Cancelled";
    order.cancelledAt = Date.now();

    // Refund logic using Razorpay
    const refundAmount = order.paidAmount || order.totalPrice || 0;
    if (!order.razorpayPaymentId) {
      return res.status(400).json({ message: "No Razorpay payment ID found for this order" });
    }

    // Initiate refund via Razorpay
    let refund;
    try {
      refund = await razorpay.payments.refund(order.razorpayPaymentId, {
        amount: Math.round(refundAmount * 100), // Razorpay expects amount in paise
        speed: "optimum"
      });
    } catch (refundError) {
      return res.status(500).json({ message: "Refund failed", error: refundError.message });
    }

    // Optionally, record refund in order
    order.refundAmount = refundAmount;
    order.refundStatus = "Refunded";
    order.razorpayRefundId = refund.id;

    await order.save();

    res.status(200).json({
      message: "Order cancelled and refund processed via Razorpay",
      order,
      refund
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getAdminAllOrders = async (req, res) => {
  try {
    let { page = 1, limit = 5, search = "" } = req.query;
    const currentPage = parseInt(page, 10);
    const perPage = parseInt(limit, 10);

    // Step 1: Fetch all orders with populated user/product
    const allOrders = await Order.find()
      .populate(
        "user",
        "name email phone address postalCode city state street isAdmin"
      )
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    // Step 2: Filter only orders where user.isAdmin === true
    const adminOrders = allOrders.filter((order) => order.isAdmin === true);

    // Step 3: Apply search filtering
    const filteredOrders = adminOrders.filter((order) => {
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

    // Step 4: Pagination logic
    const total = filteredOrders.length;
    const paginatedOrders = filteredOrders.slice(
      (currentPage - 1) * perPage,
      currentPage * perPage
    );

    // Step 5: Return response
    res.status(200).json({
      message: "Admin user orders fetched successfully",
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
    res.status(500).json({ message: error.message });
  }
};
// Get Orders by User
exports.getOrderByIduser = async (req, res) => {
  try {
    const userId = req.user.id;
    // const user_id = await User.findOne({userId:userId});
    const orders = await Order.find({ user: userId })
      .populate("orderItems.product")
      .populate("user", "name email phone address postalCode city state street")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Order Status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findOne({ _id: req.params.id });
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({ message: "Order already delivered" });
    }
    console.log(order, req.params.id, status);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;

    if (status === "Delivered") {
      order.paidAt = Date.now();
    }

    await order.save();
    res.status(200).json({ message: "Order status updated", data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Cancel Order and Refund using Razorpay
exports.cancelOrderAndRefund = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if(order.orderStatus === "Shipped"){
      return res.status(400).json({ message: "Shipped orders cannot be cancelled" });
    }

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    // Only allow cancellation if not delivered
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({ message: "Delivered orders cannot be cancelled" });
    }

    // Mark order as cancelled
    order.orderStatus = "Cancelled";
    order.cancelledAt = Date.now();

    // Refund logic using Razorpay
    const refundAmount = order.paidAmount || order.totalPrice || 0;
    if (!order.razorpayPaymentId) {
      return res.status(400).json({ message: "No Razorpay payment ID found for this order" });
    }

    // Initiate refund via Razorpay
    let refund;
    try {
      refund = await razorpay.payments.refund(order.razorpayPaymentId, {
        amount: Math.round(refundAmount * 100), // Razorpay expects amount in paise
        speed: "optimum"
      });
    } catch (refundError) {
      return res.status(500).json({ message: "Refund failed", error: refundError.message });
    }

    // Optionally, record refund in order
    order.refundAmount = refundAmount;
    order.refundStatus = "Refunded";
    order.razorpayRefundId = refund.id;

    await order.save();

    res.status(200).json({
      message: "Order cancelled and refund processed via Razorpay",
      order,
      refund
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.userbyorder = async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await Order.find({ user: userId })
      .populate("orderItems.product")
      // .populate("user", "name email phone address postalCode city state street")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBestSellingProducts = async (req, res) => {
  try {
    // Aggregate orderItems to count total quantity sold per product
    const bestSellers = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          totalSold: { $sum: "$orderItems.qty" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 } // Top 10 best sellers
    ]);

    // Populate product details
    const populated = await Product.find({
      _id: { $in: bestSellers.map(b => b._id) }
    }).select("name sellingprice image costprice category");

    // Merge sales data with product info
    const result = bestSellers.map(seller => {
      const product = populated.find(p => p._id.equals(seller._id));
      return {
        productId: seller._id,
        name: product?.name,
        sellingprice: product?.sellingprice,
        image: product?.image,
        costprice: product?.costprice,
        category: product?.category,
        totalSold: seller.totalSold
      };
    });

    res.status(200).json({
      message: "Best Selling products fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
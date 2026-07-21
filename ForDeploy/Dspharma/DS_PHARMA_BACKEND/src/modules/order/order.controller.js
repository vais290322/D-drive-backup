import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  createOrderService,
  fetchOrdersBySalesmanService,
  fetchOrdersService,
  updateOrderService,
  resendOTPService,
  fetchOrderByPartyService,
  updatePaymentStatusService,
  fetchMonthlyReportService,
} from "./order.service.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { salesManId } = req.params;
  const { OrderID, OrderNo, CustomerDetails, ProductDetails, PaymentDetails } =
    req.body;

  if (
    !OrderID ||
    !OrderNo ||
    !CustomerDetails ||
    !ProductDetails ||
    !PaymentDetails
  ) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid request"));
  }

  const data = await createOrderService(String(salesManId), {
    OrderID,
    OrderNo,
    CustomerDetails,
    ProductDetails,
    PaymentDetails,
  });

  res
    .status(200)
    .json(new ApiResponse(200, data, "Order created successfully"));
});

export const fetchOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 25, query = "" } = req.query;
  console.log("api call ");

  const { orders, totalOrders, totalPages, currentPage, hasMore } =
    await fetchOrdersService(page, limit, query);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        totalOrders,
        totalPages,
        page: Number(page),
        limit: Number(limit),
        totalPages: Number(totalPages),
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      "Orders fetched successfully",
    ),
  );
});

export const fetchOrderBySalesman = asyncHandler(async (req, res) => {
  const { salesManId } = req.params;
  const {
    page = 1,
    limit = 25,
    all = false,
    query = "",
    month = "",
    year = "",
  } = req.query;

  if (!salesManId) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid request"));
  }

  const { orders, totalOrders, totalPages, currentPage, hasMore } =
    await fetchOrdersBySalesmanService(
      String(salesManId),
      page,
      limit,
      all,
      query,
      month,
      year,
    );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        totalOrders,
        totalPages,
        page: Number(page),
        limit: Number(limit),
        totalPages: Number(totalPages),
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      "Orders fetched successfully",
    ),
  );
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { OrderID } = req.params;
  const { status } = req.body;

  const order = await updateOrderService(OrderID, status);

  res
    .status(200)
    .json(new ApiResponse(200, order, "Status changed successfully"));
});

export const resendOTP = asyncHandler(async (req, res) => {
  const { OrderID } = req.params;

  await resendOTPService(OrderID);

  res.status(200).json(new ApiResponse(200, {}, "OTP sent successfully"));
});

export const fetchOrderByParty = asyncHandler(async (req, res) => {
  const { rid } = req.user;

  const orders = await fetchOrderByPartyService(rid);

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { OrderID } = req.params;
  const { status } = req.body;

  const order = await updatePaymentStatusService(OrderID, status);

  res
    .status(200)
    .json(new ApiResponse(200, order, "Payment status changed successfully"));
});

export const fetchMonthlyReport = asyncHandler(async (req, res) => {
  const { mode = "yearly", year, month, startDate, endDate } = req.query;

  const { report, summary } = await fetchMonthlyReportService({
    mode,
    year,
    month,
    startDate,
    endDate,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { report, summary },
        "Monthly report fetched successfully",
      ),
    );
});

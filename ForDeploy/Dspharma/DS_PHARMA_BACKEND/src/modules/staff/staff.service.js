import mongoose from "mongoose";
import ApiError from "../../utils/apiError.js";
import margOrder from "../order/order.model.js";
import Staff from "./staff.model.js";

export const createStaffService = async (
  name,
  email = "",
  phone,
  password,
  address,
  role = "STAFF",
  isActive = true,
) => {
  if (!name || !phone || !password) {
    throw new ApiError(500, "Fill the required fields.");
  }

  try {
    const isExists = await Staff.findOne({ phone });

    console.log(isExists);

    if (isExists) {
      throw new ApiError(500, "Phone number already registered");
    }

    const staff = await Staff.create({
      name,
      email,
      phone,
      password,
      address,
      role: String(role).toUpperCase(),
      isActive,
    });

    return staff;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const fetchStaffService = async () => {
  try {
    const [staff, totalStaff, totalActiveStaff, totalInactiveStaff] =
      await Promise.all([
        Staff.find().select("-password").lean(),
        Staff.countDocuments(),
        Staff.countDocuments({ isActive: true }),
        Staff.countDocuments({ isActive: false }),
      ]);

    return { staff, totalStaff, totalActiveStaff, totalInactiveStaff };
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const updateStaffService = async (staffId, payload) => {
  if (!staffId) {
    throw new ApiError(500, "staffId is required.");
  }

  try {
    const staff = await Staff.findByIdAndUpdate(staffId, payload, {
      new: true,
      runValidators: true,
    });

    return staff;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const deleteStaffService = async (staffId) => {
  if (!staffId) {
    throw new ApiError(500, "staffId is required.");
  }

  try {
    await Staff.findByIdAndDelete(staffId);
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const fetchStaffByIdService = async (staffId) => {
  try {
    const staff = await Staff.findById(staffId).select("-password");

    if (!staff) {
      throw new ApiError(404, "Staff details not found");
    }

    return staff;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * mode: 'yearly'  → full 12-month breakdown for a year  (default)
 * mode: 'monthly' → day-by-day breakdown for a specific month
 * mode: 'custom'  → arbitrary date range, grouped by month
 * mode: 'all'     → all-time, grouped by year+month
 *
 * Query params:
 *   mode        – yearly | monthly | custom | all
 *   year        – YYYY  (yearly / monthly)
 *   month       – 1-12  (monthly only)
 *   startDate   – ISO   (custom only)
 *   endDate     – ISO   (custom only)
 */
export const fetchSalesmanMonthlyReportService = async (
  salesManId,
  options,
) => {
  try {
    const {
      mode = "yearly",
      year = new Date().getFullYear(),
      month,
      startDate,
      endDate,
    } = options;

    const parsedYear = parseInt(year, 10) || new Date().getFullYear();
    const parsedMonth = month ? parseInt(month, 10) : null;

    if (!mongoose.isValidObjectId(salesManId)) {
      throw new ApiError(400, "Invalid salesman ID format");
    }

    // ── Build date filter ──────────────────────────────────────────
    let dateFilter = null;

    if (mode === "yearly") {
      dateFilter = {
        $gte: new Date(parsedYear, 0, 1),
        $lt: new Date(parsedYear + 1, 0, 1),
      };
    } else if (mode === "monthly" && parsedMonth) {
      dateFilter = {
        $gte: new Date(parsedYear, parsedMonth - 1, 1),
        $lt: new Date(parsedYear, parsedMonth, 1),
      };
    } else if (mode === "custom" && startDate && endDate) {
      dateFilter = {
        $gte: new Date(startDate),
        $lt: new Date(
          new Date(endDate).setDate(new Date(endDate).getDate() + 1),
        ), // inclusive end
      };
    }

    const matchStage = {
      $match: {
        Sid: new mongoose.Types.ObjectId(salesManId),
        ...(dateFilter && { createdAt: dateFilter }),
      },
    };

    // ── Group key differs per mode ─────────────────────────────────
    const groupId =
      mode === "monthly"
        ? {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          }
        : { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };

    const pipeline = [
      matchStage,
      {
        $unwind: { path: "$ProductDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: {
            ...groupId,
            orderId: "$_id",
            customerId: "$CustomerDetails.CustomerID",
          },
          totalQty: {
            $sum: {
              $add: [
                {
                  $convert: {
                    input: "$ProductDetails.Quantity",
                    to: "double",
                    onError: 0,
                    onNull: 0,
                  },
                },
                {
                  $convert: {
                    input: "$ProductDetails.Free",
                    to: "double",
                    onError: 0,
                    onNull: 0,
                  },
                },
              ],
            },
          },
          orderValue: {
            $first: {
              $convert: {
                input: "$PaymentDetails.paymentmodeAmount",
                to: "double",
                onError: 0,
                onNull: 0,
              },
            },
          },
        },
      },
      {
        $group: {
          _id:
            mode === "monthly"
              ? { year: "$_id.year", month: "$_id.month", day: "$_id.day" }
              : { year: "$_id.year", month: "$_id.month" },
          totalOrders: { $sum: 1 },
          totalItemsSold: { $sum: "$totalQty" },
          uniqueCustomers: { $addToSet: "$_id.customerId" },
          totalOrderValue: { $sum: "$orderValue" },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          ...(mode === "monthly" && { day: "$_id.day" }),
          totalOrders: 1,
          totalItemsSold: 1,
          uniqueCustomers: { $size: "$uniqueCustomers" },
          totalOrderValue: { $round: ["$totalOrderValue", 2] },
        },
      },
      { $sort: { year: 1, month: 1, ...(mode === "monthly" && { day: 1 }) } },
    ];

    const rawReport = await margOrder.aggregate(pipeline);

    // ── Fill zeros for yearly/monthly modes ────────────────────────
    let report;

    if (mode === "yearly") {
      const monthMap = Object.fromEntries(rawReport.map((r) => [r.month, r]));
      report = MONTH_NAMES.map((name, idx) => {
        const monthNum = idx + 1;
        return {
          month: monthNum,
          monthName: name,
          year: parsedYear,
          totalOrders: monthMap[monthNum]?.totalOrders || 0,
          totalItemsSold: monthMap[monthNum]?.totalItemsSold || 0,
          uniqueCustomers: monthMap[monthNum]?.uniqueCustomers || 0,
          totalOrderValue: monthMap[monthNum]?.totalOrderValue || 0,
        };
      });
    } else if (mode === "monthly" && parsedMonth) {
      const daysInMonth = new Date(parsedYear, parsedMonth, 0).getDate();
      const dayMap = Object.fromEntries(rawReport.map((r) => [r.day, r]));
      report = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        return {
          day,
          month: parsedMonth,
          monthName: MONTH_NAMES[parsedMonth - 1],
          year: parsedYear,
          totalOrders: dayMap[day]?.totalOrders || 0,
          totalItemsSold: dayMap[day]?.totalItemsSold || 0,
          uniqueCustomers: dayMap[day]?.uniqueCustomers || 0,
          totalOrderValue: dayMap[day]?.totalOrderValue || 0,
        };
      });
    } else {
      // custom / all — return raw with monthName added
      report = rawReport.map((r) => ({
        ...r,
        monthName: MONTH_NAMES[r.month - 1],
      }));
    }

    // ── Summary totals ─────────────────────────────────────────────
    const summary = {
      mode,
      year: parsedYear,
      ...(mode === "monthly" && {
        month: parsedMonth,
        monthName: MONTH_NAMES[parsedMonth - 1],
      }),
      ...(mode === "custom" && { startDate, endDate }),
      totalOrders: report.reduce((s, m) => s + m.totalOrders, 0),
      totalItemsSold: report.reduce((s, m) => s + m.totalItemsSold, 0),
      totalOrderValue: parseFloat(
        report.reduce((s, m) => s + m.totalOrderValue, 0).toFixed(2),
      ),
      bestPeriod: report.reduce(
        (best, m) => (m.totalOrders > (best?.totalOrders || 0) ? m : best),
        null,
      ),
    };

    return { report, summary };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, error.message || "Internal server error");
  }
};

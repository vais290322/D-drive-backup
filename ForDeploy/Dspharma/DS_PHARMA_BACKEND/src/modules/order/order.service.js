import { ecomSalesManId } from '../../config/credentials.js';
import { generateOTP } from '../../helpers/generateOTP.js';
import ApiError from '../../utils/apiError.js';
import { syncMasterOrderDataService } from '../mastersync/masterSync.service.js';
import Orders from './order.model.js';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const createOrderService = async (
  salesManId,
  { OrderID, OrderNo, CustomerDetails, ProductDetails, PaymentDetails },
  type = 'S',
) => {
  try {
    await syncMasterOrderDataService(String(ecomSalesManId), type, {
      OrderID: String(OrderID),
      OrderNo: String(OrderNo),
      CustomerID: String(CustomerDetails?.CustomerID),
      ProductCode: String(ProductDetails?.map(item => item.code).join(',')),
      Quantity: String(ProductDetails?.map(item => item.Quantity).join(',')),
      Free: String(ProductDetails?.map(item => item.Free).join(',')),
      Lat: String(CustomerDetails?.Lat) || '',
      Lng: String(CustomerDetails?.Lng) || '',
      Address: String(CustomerDetails?.Address) || '',
      GpsID: '0',
      UserType: '1',
      Points: parseFloat(CustomerDetails?.Points || 0).toFixed(2),
      Discounts: String(CustomerDetails?.Discounts) || '0',
      Transport: String(CustomerDetails?.Transport) || '',
      Delivery: String(CustomerDetails?.Delivery) || '',
      Bankname: String(CustomerDetails?.Bankname) || '',
      BankAdd1: String(CustomerDetails?.BankAdd1) || '',
      BankAdd2: String(CustomerDetails?.BankAdd2) || '',
      shipname: String(CustomerDetails?.shipName) || '',
      shipAdd1: String(CustomerDetails?.shipAdd1) || '',
      shipAdd2: String(CustomerDetails?.shipAdd2) || '',
      shipAdd3: String(CustomerDetails?.shipAdd3) || '',
      paymentmode: String(PaymentDetails?.paymentmode) || '',
      paymentmodeAmount: String(PaymentDetails?.totalInvoiceValue) || '0',
      payment_remarks: String(PaymentDetails?.payment_remarks) || '',
      order_remarks: String(CustomerDetails?.order_remarks) || '',
      CustName: String(CustomerDetails?.CustName) || '',
      CustMobile: String(CustomerDetails?.CustMobile) || '',
    });

    const otp = generateOTP();

    const newOrder = await Orders.create({
      OrderID: OrderID,
      OrderNo: OrderNo,
      Sid: salesManId,
      CustomerDetails,
      PaymentDetails,
      ProductDetails,
      OTP: otp,
    });

    return newOrder;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const fetchOrdersService = async (page, limit, query) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.max(parseInt(limit, 10) || 10, 1);

  try {
    const filter = {};

    if (query) {
      filter.$or = [
        { 'CustomerDetails.CustName': { $regex: query, $options: 'i' } },
        { OrderID: { $regex: query, $options: 'i' } },
      ];
    }

    const baseQuery = Orders.find(filter)
      .populate('Sid')
      .sort({ createdAt: -1 })
      .select('-OTP')
      .lean();

    const [orders, totalOrders] = await Promise.all([
      baseQuery.skip((parsedPage - 1) * parsedLimit).limit(parsedLimit),
      Orders.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalOrders / parsedLimit);

    return {
      orders,
      totalOrders,
      totalPages,
      currentPage: parsedPage,
      hasMore: parsedPage < totalPages,
    };
  } catch (error) {
    console.log('error : ', error);
    throw new ApiError(500, error.message);
  }
};

export const fetchOrdersBySalesmanService = async (
  salesManId,
  page = 1,
  limit = 10,
  all = false,
  query,
  month,
  year,
) => {
  if (!salesManId) {
    throw new ApiError(400, 'salesManId is required');
  }

  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.max(parseInt(limit, 10) || 10, 1);

  try {
    const filter = { Sid: salesManId };

    if (query) {
      filter.$or = [
        { 'CustomerDetails.CustName': { $regex: query, $options: 'i' } },
        { OrderID: { $regex: query, $options: 'i' } },
      ];
    }

    if (month && year) {
      const parsedMonth = parseInt(month, 10);
      const parsedYear = parseInt(year, 10);

      const startDate = new Date(parsedYear, parsedMonth - 1, 1);
      const endDate = new Date(parsedYear, parsedMonth, 1);

      filter.createdAt = { $gte: startDate, $lt: endDate };
    }

    const queryBuilder = Orders.find(filter)
      .populate('Sid')
      .sort({ createdAt: -1 })
      .select('-OTP')
      .lean();

    const [orders, totalOrders] = await Promise.all([
      all
        ? queryBuilder
        : queryBuilder.skip((parsedPage - 1) * parsedLimit).limit(parsedLimit),
      Orders.countDocuments(filter),
    ]);

    const totalPages = all ? 1 : Math.ceil(totalOrders / parsedLimit);

    return {
      orders,
      totalOrders,
      totalPages,
      currentPage: parsedPage,
      hasMore: !all && parsedPage < totalPages,
    };
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const resendOTPService = async OrderID => {
  if (!OrderID) {
    throw new ApiError(400, 'OrderID is required');
  }

  try {
    const order = await Orders.findOneAndUpdate(
      { OrderID },
      { $set: { OTP: generateOTP() } },
      {
        new: true,
      },
    );

    if (!order) {
      throw new ApiError(404, 'Invalid OrderID');
    }

    return order;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const updateOrderService = async (OrderID, status) => {
  if (!OrderID) {
    throw new ApiError(400, 'OrderID is required');
  }

  if (!status) {
    throw new ApiError(400, 'Status is required');
  }

  try {
    const order = await Orders.findOneAndUpdate(
      { OrderID },
      { $set: { Status: status } },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    return order;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const fetchOrderByPartyService = async CustomerId => {
  console.log(CustomerId);

  try {
    const orders = await Orders.find({
      'CustomerDetails.CustomerID': CustomerId,
    });

    return orders;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const updatePaymentStatusService = async (OrderID, status) => {
  if (!OrderID) {
    throw new ApiError(400, 'OrderID is required');
  }

  if (!status) {
    throw new ApiError(400, 'Status is required');
  }

  try {
    const order = await Orders.findOneAndUpdate(
      { OrderID },
      { $set: { 'PaymentDetails.paymentStatus': status } },
      {
        new: true,
        runValidators: true,
      },
    );

    return order;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const fetchMonthlyReportService = async options => {
  try {
    const {
      mode = 'yearly',
      year = new Date().getFullYear(),
      month,
      startDate,
      endDate,
    } = options;

    const parsedYear = parseInt(year, 10) || new Date().getFullYear();
    const parsedMonth = month ? parseInt(month, 10) : null;

    // ── Build date filter ──────────────────────────────────────────
    let dateFilter = null;

    if (mode === 'yearly') {
      dateFilter = {
        $gte: new Date(parsedYear, 0, 1),
        $lt: new Date(parsedYear + 1, 0, 1),
      };
    } else if (mode === 'monthly' && parsedMonth) {
      dateFilter = {
        $gte: new Date(parsedYear, parsedMonth - 1, 1),
        $lt: new Date(parsedYear, parsedMonth, 1),
      };
    } else if (mode === 'custom' && startDate && endDate) {
      dateFilter = {
        $gte: new Date(startDate),
        $lt: new Date(
          new Date(endDate).setDate(new Date(endDate).getDate() + 1),
        ), // inclusive end
      };
    }

    const matchStage = {
      $match: {
        ...(dateFilter && { createdAt: dateFilter }),
      },
    };

    // ── Group key differs per mode ─────────────────────────────────
    const groupId =
      mode === 'monthly'
        ? {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          }
        : { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } };

    const pipeline = [
      matchStage,
      {
        $unwind: { path: '$ProductDetails', preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: {
            ...groupId,
            orderId: '$_id',
            customerId: '$CustomerDetails.CustomerID',
          },
          totalQty: {
            $sum: {
              $add: [
                {
                  $convert: {
                    input: '$ProductDetails.Quantity',
                    to: 'double',
                    onError: 0,
                    onNull: 0,
                  },
                },
                {
                  $convert: {
                    input: '$ProductDetails.Free',
                    to: 'double',
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
                input: '$PaymentDetails.paymentmodeAmount',
                to: 'double',
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
            mode === 'monthly'
              ? { year: '$_id.year', month: '$_id.month', day: '$_id.day' }
              : { year: '$_id.year', month: '$_id.month' },
          totalOrders: { $sum: 1 },
          totalItemsSold: { $sum: '$totalQty' },
          uniqueCustomers: { $addToSet: '$_id.customerId' },
          totalOrderValue: { $sum: '$orderValue' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          ...(mode === 'monthly' && { day: '$_id.day' }),
          totalOrders: 1,
          totalItemsSold: 1,
          uniqueCustomers: { $size: '$uniqueCustomers' },
          totalOrderValue: { $round: ['$totalOrderValue', 2] },
        },
      },
      { $sort: { year: 1, month: 1, ...(mode === 'monthly' && { day: 1 }) } },
    ];

    const rawReport = await Orders.aggregate(pipeline);

    // ── Fill zeros for yearly/monthly modes ────────────────────────
    let report;

    if (mode === 'yearly') {
      const monthMap = Object.fromEntries(rawReport.map(r => [r.month, r]));
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
    } else if (mode === 'monthly' && parsedMonth) {
      const daysInMonth = new Date(parsedYear, parsedMonth, 0).getDate();
      const dayMap = Object.fromEntries(rawReport.map(r => [r.day, r]));
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
      report = rawReport.map(r => ({
        ...r,
        monthName: MONTH_NAMES[r.month - 1],
      }));
    }

    // ── Summary totals ─────────────────────────────────────────────
    const summary = {
      mode,
      year: parsedYear,
      ...(mode === 'monthly' && {
        month: parsedMonth,
        monthName: MONTH_NAMES[parsedMonth - 1],
      }),
      ...(mode === 'custom' && { startDate, endDate }),
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
    throw new ApiError(500, error.message || 'Internal server error');
  }
};

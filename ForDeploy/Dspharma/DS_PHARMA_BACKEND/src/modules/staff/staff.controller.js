import ApiError from '../../utils/apiError.js';
import ApiResponse from '../../utils/apiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import {
  createStaffService,
  deleteStaffService,
  fetchSalesmanMonthlyReportService,
  fetchStaffByIdService,
  fetchStaffService,
  updateStaffService,
} from './staff.service.js';

export const createStaff = asyncHandler(async (req, res) => {
  const { name, email, phone, password, address, role, isActive } = req.body;

  const staff = await createStaffService(
    name,
    email,
    phone,
    password,
    address,
    role,
    isActive,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, staff, 'Staff assigned successfully'));
});

export const getAllStaff = asyncHandler(async (req, res) => {
  const { staff, totalStaff, totalActiveStaff, totalInactiveStaff } =
    await fetchStaffService();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { staff, totalStaff, totalActiveStaff, totalInactiveStaff },
        'Staff fetched successfully',
      ),
    );
});

export const updateStaff = asyncHandler(async (req, res) => {
  const { ...payload } = req.body;
  const { staffId } = req.params;

  const staff = await updateStaffService(staffId, payload);

  return res
    .status(200)
    .json(new ApiResponse(200, staff, 'Staff updated successfully'));
});

export const deleteStaff = asyncHandler(async (req, res) => {
  const { staffId } = req.params;

  await deleteStaffService(staffId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Staff deleted successfully'));
});

export const fetchStaffById = asyncHandler(async (req, res) => {
  const { staffId } = req.params;

  const staff = await fetchStaffByIdService(staffId);

  return res
    .status(200)
    .json(new ApiResponse(200, staff, 'Staff fetched successfully'));
});

export const fetchStaffReport = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, 'User ID is required');
  }

  const { staffReport } = await fetchStaffByIdService(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, { staffReport }, 'Staff fetched successfully'));
});

export const fetchSalesmanMonthlyReport = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const {
    mode = 'yearly',
    year = String(new Date().getFullYear()),
    month,
    startDate,
    endDate,
  } = req.query;

  if (!userId) {
    throw new ApiError(400, 'User ID is required');
  }

  if (mode === 'monthly' && !month) {
    throw new ApiError(400, 'month (1-12) is required for monthly mode');
  }

  if (mode === 'custom' && (!startDate || !endDate)) {
    throw new ApiError(400, 'startDate and endDate are required for custom mode');
  }

  const { report, summary } = await fetchSalesmanMonthlyReportService(userId, {
    mode,
    year,
    month,
    startDate,
    endDate,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { summary, report },
      'Salesman report fetched successfully',
    ),
  );
});

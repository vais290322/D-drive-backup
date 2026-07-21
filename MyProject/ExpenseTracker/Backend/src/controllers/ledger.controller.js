import { LedgerDay } from "../models/ledger.model.js";
import { User } from "../models/auth.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Normalize date to UTC midnight
const normalizeDate = (dateVal) => {
  const d = new Date(dateVal);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

// Cascades opening/closing balances and sub-item serial numbers chronologically
export const recalculateBalances = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const startingBalance = user.initialOpeningBalance || 0;

  // Fetch all days for the user sorted by date ascending
  const days = await LedgerDay.find({ user: userId }).sort({ date: 1 });

  let runningBalance = startingBalance;

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    day.serialNumber = i + 1;
    day.opening = runningBalance;

    // Calculate totals of subItems
    let dayReceipts = 0;
    let dayIssues = 0;

    day.subItems.forEach((item, index) => {
      dayReceipts += item.inward || 0;
      dayIssues += item.outward || 0;

      // Update subItem closing (inward - outward)
      item.closing = (item.inward || 0) - (item.outward || 0);

      // Generate subItem serial like "1.a", "1.b", etc.
      const letterCode = String.fromCharCode(97 + (index % 26)); // maps 0->a, 1->b...
      const roundMultiplier = Math.floor(index / 26);
      const suffix = roundMultiplier > 0 ? roundMultiplier + 1 : "";
      item.serial = `${day.serialNumber}.${letterCode}${suffix}`;
    });

    day.receipts = dayReceipts;
    day.issues = dayIssues;
    day.total = day.opening + day.receipts;
    day.closing = day.total - day.issues;

    await day.save();

    // Carry closing to next day's opening
    runningBalance = day.closing;
  }
};

export const getLedger = asyncHandler(async (req, res) => {
  // Always trigger recalculate first to ensure exact balances are served
  await recalculateBalances(req.user._id);

  const ledger = await LedgerDay.find({ user: req.user._id }).sort({ date: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, ledger, "Ledger fetched successfully"));
});

export const addTransaction = asyncHandler(async (req, res) => {
  const { date, description, inward, outward } = req.body;

  if (!date || !description) {
    throw new ApiError(400, "Date and description are required");
  }

  const normalizedDate = normalizeDate(date);
  const inwardNum = parseFloat(inward) || 0;
  const outwardNum = parseFloat(outward) || 0;

  if (inwardNum < 0 || outwardNum < 0) {
    throw new ApiError(400, "Amounts cannot be negative");
  }

  // Find or create a LedgerDay for that date
  let ledgerDay = await LedgerDay.findOne({
    user: req.user._id,
    date: normalizedDate,
  });

  if (!ledgerDay) {
    ledgerDay = new LedgerDay({
      user: req.user._id,
      date: normalizedDate,
      serialNumber: 1, // Will be corrected by recalculation
      opening: 0,
      receipts: 0,
      issues: 0,
      total: 0,
      closing: 0,
      subItems: [],
    });
  }

  // Add the subItem transaction
  ledgerDay.subItems.push({
    serial: "temp", // Will be corrected by recalculation
    description,
    inward: inwardNum,
    outward: outwardNum,
    closing: inwardNum - outwardNum,
  });

  await ledgerDay.save();

  // Cascade recalculation starting from first record
  await recalculateBalances(req.user._id);

  // Return the newly updated day
  const updatedDay = await LedgerDay.findById(ledgerDay._id);

  return res
    .status(201)
    .json(
      new ApiResponse(201, updatedDay, "Transaction added successfully")
    );
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const { dayId, subItemId } = req.params;
  const { date, description, inward, outward } = req.body;

  if (!description) {
    throw new ApiError(400, "Description is required");
  }

  const inwardNum = parseFloat(inward) || 0;
  const outwardNum = parseFloat(outward) || 0;

  if (inwardNum < 0 || outwardNum < 0) {
    throw new ApiError(400, "Amounts cannot be negative");
  }

  // Find the ledger day containing the subItem
  const currentDay = await LedgerDay.findOne({
    _id: dayId,
    user: req.user._id,
  });

  if (!currentDay) {
    throw new ApiError(404, "Ledger day not found");
  }

  const subItem = currentDay.subItems.id(subItemId);
  if (!subItem) {
    throw new ApiError(404, "Transaction not found");
  }

  const oldDate = normalizeDate(currentDay.date).getTime();
  const newDate = date ? normalizeDate(date).getTime() : oldDate;

  if (oldDate !== newDate) {
    // Transaction date changed: move transaction to a different ledger day
    const normalizedNewDate = normalizeDate(date);

    // Remove subItem from current day
    currentDay.subItems.pull(subItemId);

    if (currentDay.subItems.length === 0) {
      await LedgerDay.findByIdAndDelete(currentDay._id);
    } else {
      await currentDay.save();
    }

    // Find or create the target ledger day
    let targetDay = await LedgerDay.findOne({
      user: req.user._id,
      date: normalizedNewDate,
    });

    if (!targetDay) {
      targetDay = new LedgerDay({
        user: req.user._id,
        date: normalizedNewDate,
        serialNumber: 1, // Will be corrected
        opening: 0,
        receipts: 0,
        issues: 0,
        total: 0,
        closing: 0,
        subItems: [],
      });
    }

    targetDay.subItems.push({
      serial: "temp", // Will be corrected
      description,
      inward: inwardNum,
      outward: outwardNum,
      closing: inwardNum - outwardNum,
    });

    await targetDay.save();
  } else {
    // Modify in place on the same day
    subItem.description = description;
    subItem.inward = inwardNum;
    subItem.outward = outwardNum;
    subItem.closing = inwardNum - outwardNum;
    await currentDay.save();
  }

  // Cascade recalculate
  await recalculateBalances(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Transaction updated successfully"));
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const { dayId, subItemId } = req.params;

  const day = await LedgerDay.findOne({
    _id: dayId,
    user: req.user._id,
  });

  if (!day) {
    throw new ApiError(404, "Ledger day not found");
  }

  const subItem = day.subItems.id(subItemId);
  if (!subItem) {
    throw new ApiError(404, "Transaction not found");
  }

  // Remove the subItem
  day.subItems.pull(subItemId);

  if (day.subItems.length === 0) {
    // If the day contains no more transactions, delete it
    await LedgerDay.findByIdAndDelete(day._id);
  } else {
    await day.save();
  }

  // Cascade recalculate
  await recalculateBalances(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Transaction deleted successfully"));
});

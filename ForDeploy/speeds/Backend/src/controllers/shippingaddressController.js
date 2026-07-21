import UserAddresses from "../models/shippingAddress.js"; // Correct case
import Store from "../models/store.js";
import { calculateDistance } from "../utils/distance.js";

async function ensureUserAddresses(userId) {
  let doc = await UserAddresses.findOne({ userId });
  if (!doc) doc = await UserAddresses.create({ userId, addresses: [] });
  return doc;
}
export async function getAllAddresses(req, res) {
  const { userId } = req.params;
  const doc = await ensureUserAddresses(userId);
  res.json({
    success: true,
    message: "User addresses fetched successfully",
    data: doc,
  });
}
export async function addAddress(req, res) {
  const { userId } = req.params;
  const { storeId } = req.query;
  const address = req.body;
  const store = storeId ? await Store.findById(storeId) : await Store.findOne();
  if (!store)
    return res.status(404).json({ success: false, message: "Store not found" });
  const distance = calculateDistance(
    store.latitude,
    store.longitude,
    Number(address.latitude),
    Number(address.longitude)
  );
  if (distance > store.deliveryRadiusKm) {
    return res.json({
      success: false,
      message: `Delivery not available beyond ${store.deliveryRadiusKm} km radius.`,
      data: null,
    });
  }
  const doc = await ensureUserAddresses(userId);
  const isFirst = doc.addresses.length === 0;
  doc.addresses.push({ ...address, isDefault: isFirst });
  await doc.save();
  res.json({
    success: true,
    message: "Address added successfully",
    data: {
      shippingAddress: doc.addresses[doc.addresses.length - 1],
      deliveryStore: store,
      distanceKm: distance,
    },
  });
}
export async function updateAddress(req, res) {
  const { userId } = req.params;
  const address = req.body;
  if (!address._id)
    return res
      .status(400)
      .json({ success: false, message: "Address _id is required for update" });
  const doc = await ensureUserAddresses(userId);
  const idx = doc.addresses.findIndex(
    (a) => String(a._id) === String(address._id)
  );
  if (idx === -1)
    return res
      .status(404)
      .json({ success: false, message: "Address not found" });
  const isDefault = doc.addresses[idx].isDefault;
  doc.addresses[idx] = {
    ...doc.addresses[idx],
    ...address,
    isDefault,
  };
  await doc.save();
  res.json({
    success: true,
    message: "Address updated successfully",
    data: doc.addresses[idx],
  });
}
export async function deleteAddress(req, res) {
  const { userId, addressId } = req.params;
  const doc = await ensureUserAddresses(userId);
  const before = doc.addresses.length;
  doc.addresses = doc.addresses.filter(
    (a) => String(a._id) !== String(addressId)
  );
  await doc.save();
  if (before === doc.addresses.length)
    return res
      .status(404)
      .json({ success: false, message: "Address not found" });
  res.json({
    success: true,
    message: "Address deleted successfully",
    data: null,
  });
}
export async function setDefaultAddress(req, res) {
  const { userId, addressId } = req.params;
  const doc = await ensureUserAddresses(userId);
  let found = false;
  doc.addresses.forEach((a) => {
    const match = String(a._id) === String(addressId);
    if (match) found = true;
    a.isDefault = match;
  });
  if (!found)
    return res
      .status(404)
      .json({ success: false, message: "Address not found" });
  await doc.save();
  const def = doc.addresses.find((a) => a.isDefault);
  res.json({
    success: true,
    message: "Default address updated successfully",
    data: def,
  });
}

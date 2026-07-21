import Store from "../models/store.js";
import { calculateDistance, isWithinDeliveryRange } from "../utils/distance.js";

export async function addStore(req, res) {
  try {
    const newData = req.body;
    const existing = await Store.findOne();
    if (existing) {
      Object.assign(existing, newData);
      const saved = await existing.save();
      return res.json({
        success: true,
        message: "Store added successfully",
        data: saved,
      });
    }
    const saved = await Store.create(newData);
    res.json({
      success: true,
      message: "Store added successfully",
      data: saved,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}
export async function getAllStores(req, res) {
  const stores = await Store.find();
  res.json({
    success: true,
    message: "Stores fetched successfully",
    data: stores,
  });
}
export async function getStoreById(req, res) {
  const store = await Store.findById(req.params.storeId);
  if (!store)
    return res.status(404).json({ success: false, message: "Store not found" });
  res.json({
    success: true,
    message: "Store fetched successfully",
    data: store,
  });
}
export async function checkDelivery(req, res) {
  const { storeId } = req.params;
  const { lat, lon } = req.query;
  const store = await Store.findById(storeId);
  if (!store)
    return res.status(404).json({ success: false, message: "Store not found" });
  const distance = calculateDistance(
    store.latitude,
    store.longitude,
    Number(lat),
    Number(lon)
  );
  const eligible = isWithinDeliveryRange(
    store.latitude,
    store.longitude,
    Number(lat),
    Number(lon),
    store.deliveryRadiusKm
  );
  res.json({
    success: true,
    message: "Delivery check completed",
    data: { distanceKm: distance, eligible },
  });
}
// export async function updateStore(req, res) {
//   try {
//     const { storeId } = req.params;
//     const updates = req.body || {};

//     const updated = await Store.findByIdAndUpdate(storeId, updates, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updated) {
//       return res.status(404).json({ success: false, message: "Store not found" });
//     }

//     res.json({
//       success: true,
//       message: "Store updated successfully",
//       data: updated,
//     });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// }

import ShippingPrice from "../models/shippingPrice.js";
import Order from "../models/order.js";
import Store from "../models/store.js";
import { calculateDistance } from "../utils/distance.js";

export async function createShippingPrice(req, res) {
  try {
    const {startRange, endRange, shippingPrice } = req.body;
    console.log(req.body);
    const shipping = await ShippingPrice.create({
      startRange: Number(startRange),
      endRange: Number(endRange),
      shippingPrice: Number(shippingPrice),
    });
    res.status(201).json({
      success: true,
      message: "Shipping price created successfully",
      data: shipping,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function getShippingPrices(req, res) {
  try {
    const prices = await ShippingPrice.find({});
    res.status(200).json({
      success: true,
      message: "Shipping prices fetched successfully",
      data: prices,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function deleteShippingPrice(req, res) {
  try {
    const { id } = req.params;
    const deleted = await ShippingPrice.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Shipping price not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Shipping price deleted successfully",
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function updateShippingPrice(req, res) {
  try {
    const { id } = req.params;
    const { startRange, endRange, shippingPrice } = req.body;
    const updated = await ShippingPrice.findByIdAndUpdate(
      id,
      { startRange, endRange, shippingPrice },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Shipping price not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Shipping price updated successfully",
      data: updated,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function shippingPriceInDistance(req, res) {
  const userId = req.user.id;
  const { storeId } = req.query;

  const address = req.body;

  const store = storeId ? await Store.findById(storeId) : await Store.findOne();
  // console.log("Store:", store);

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
    });
  }

  const Orderdata = await Order.findOne({ user: userId });
  let shipping;

  if (!Orderdata) {
    shipping = 0;
  } else {
    const shippingdata = await ShippingPrice.findOne({
      $and: [
        { startRange: { $lte: distance } },
        { endRange: { $gte: distance } },
      ],
    });
    shipping = shippingdata ? shippingdata.shippingPrice : 0;
  }

  res.json({
    success: true,
    message: "shippingPrice send successfully",
    data: { shipping, distance },
  });
}

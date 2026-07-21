import Delivery from "../models/deliveryassi.js";
import Order from "../models/order.js";

export async function assignDelivery(req, res) {
  try {
    const { userId, orderId } = req.body;
    if (!userId || !orderId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID and Order ID are required" });
    }
    const assignment = await Delivery.create({
      user: userId,
      order: orderId,
    });
    res.status(201).json({
      success: true,
      message: "Delivery assigned successfully",
      data: assignment,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function getAssignments(req, res) {
  try {
    const userId = req.params.id;
      const assignments = await Delivery.find({ user: userId })
      .populate("user", "fullName email phoneNumber")
      .populate({
        path: "order",
        populate: {
          path: "user",
          model: "AuthUser",   // your user model name
        }
      })
      .sort({ createdAt: -1 });

      // console.log(assignments);
      
    res.status(200).json({
      success: true,
        message: "Delivery assignments fetched successfully",
      data: assignments,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function getAllAssignments(req, res) {
  try {
    const assignments = await Delivery.find({order:req.params.id})
        .populate("user", "fullName email phoneNumber")
        .populate("order")
        .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "All delivery assignments fetched successfully",
      data: assignments,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const assignment = await Delivery.findById(id);
    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }
    const Order =await Order.findById(assignment.order);
    if (!Order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    Order.status = status;
    await Order.save();
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: Order,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

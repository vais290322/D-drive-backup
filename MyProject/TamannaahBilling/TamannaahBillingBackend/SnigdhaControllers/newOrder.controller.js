import { Order } from '../SnigdhaModels/newOrder.model.js';
import SnigdhaItem from "../SnigdhaModels/snigdhaItem.model.js"


// Create new order

const createOrder = async (req, res) => {
  try {
    const orderDetails = req.body;

    // Calculate total quantity safely
    const totalQuantity = orderDetails.sizes?.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    ) || 0;

    if (totalQuantity === 0) {
      return res.status(400).json({ message: 'Total quantity cannot be zero' });
    }

    const unitPrice =
      orderDetails.totalPrice > 0 ? orderDetails.totalPrice / totalQuantity : 0;

    const newItem = orderDetails.item_id;
    const item = await SnigdhaItem.findOne({ item_id: newItem }); // ✅ changed from find() to findOne()

    if (item) {
      const totalPurchase = (item.totalPurchase || 0) + totalQuantity;
      const newTotalPrice = (item.total_prize || 0) + (orderDetails.totalPrice || 0);
      const newQuantity = (item.quantity || 0) + totalQuantity;
      const newUnitPrice = newQuantity > 0 ? newTotalPrice / newQuantity : 0;

      await SnigdhaItem.updateOne(
        { item_id: newItem },
        {
          $set: {
            totalPurchase,
            unit_prize: newUnitPrice,
            total_prize: newTotalPrice,
            quantity: newQuantity,
          },
        }
      );
    } else {
      const newAddedItem = {
        item_name: orderDetails.dName,
        item_id: orderDetails.item_id,
        group: orderDetails.category,
        openingStock: totalQuantity,
        totalPurchase: totalQuantity,
        totalSalses: 0,
        uom: 'pcs',
        gst: 0,
        unit_prize: unitPrice,
        sellingPrice: 0,
        total_prize: orderDetails.totalPrice || 0,
        quantity: totalQuantity,
        hsnCode: '00',
        cgst: 0,
        igst: 0,
        sgst: 0,
      };

      const createdItem = new SnigdhaItem(newAddedItem);
      await createdItem.save();
    }

    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json({
      message: 'Order created successfully',
      data: savedOrder,
      success: true,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ message: 'Orders retrieved successfully', data: orders, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order

const updateOrder = async (req, res) => {
  try {
    const orderDetails = req.body;
    const orderId = req.params.id;

    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) return res.status(404).json({ message: 'Order not found' });

    const existingItemId = existingOrder.item_id;
    const exitingItem = await SnigdhaItem.findOne({ item_id: existingItemId }); // ✅ findOne instead of find

    const exitingQuantityInOrder = existingOrder.sizes?.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    ) || 0;

    const existingTotalPriceInOrder = existingOrder.totalPrice || 0;

    const existingUnitPrice =
      exitingQuantityInOrder > 0 ? existingTotalPriceInOrder / exitingQuantityInOrder : 0;

    // New Order Details
    const totalQuantity = orderDetails.sizes?.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    ) || 0;

    if (totalQuantity === 0) {
      return res.status(400).json({ message: 'Total quantity cannot be zero' });
    }

    const unitPrice =
      orderDetails.totalPrice > 0 ? orderDetails.totalPrice / totalQuantity : 0;

    const updateItemId = orderDetails.item_id;
    const item = await SnigdhaItem.findOne({ item_id: updateItemId }); // ✅ findOne

    // 🧩 If updating the same item
    if (existingItemId === updateItemId) {
      if (item) {
        const totalPurchase =
          (item.totalPurchase || 0) - exitingQuantityInOrder + totalQuantity;
        const newTotalPrice =
          (item.total_prize || 0) - existingTotalPriceInOrder + (orderDetails.totalPrice || 0);
        const newQuantity =
          (item.quantity || 0) - exitingQuantityInOrder + totalQuantity;
        const newUnitPrice = newQuantity > 0 ? newTotalPrice / newQuantity : 0;

        await SnigdhaItem.updateOne(
          { item_id: updateItemId },
          {
            $set: {
              totalPurchase,
              unit_prize: newUnitPrice,
              total_prize: newTotalPrice,
              quantity: newQuantity,
            },
          }
        );
      }
    } else {
      // 🧩 If changing to a different item
      if (exitingItem) {
        const totalPurchase = (exitingItem.totalPurchase || 0) - exitingQuantityInOrder;
        const newTotalPrice =
          (exitingItem.total_prize || 0) - existingTotalPriceInOrder;
        const newQuantity = (exitingItem.quantity || 0) - exitingQuantityInOrder;
        const newUnitPrice = newQuantity > 0 ? newTotalPrice / newQuantity : 0;

        await SnigdhaItem.updateOne(
          { item_id: existingItemId },
          {
            $set: {
              totalPurchase,
              unit_prize: newUnitPrice,
              total_prize: newTotalPrice,
              quantity: newQuantity,
            },
          }
        );
      }

      if (item) {
        const totalPurchase = (item.totalPurchase || 0) + totalQuantity;
        const newTotalPrice =
          (item.total_prize || 0) + (orderDetails.totalPrice || 0);
        const newQuantity = (item.quantity || 0) + totalQuantity;
        const newUnitPrice = newQuantity > 0 ? newTotalPrice / newQuantity : 0;

        await SnigdhaItem.updateOne(
          { item_id: updateItemId },
          {
            $set: {
              totalPurchase,
              unit_prize: newUnitPrice,
              total_prize: newTotalPrice,
              quantity: newQuantity,
            },
          }
        );
      } else {
        const newAddedItem = {
          item_name: orderDetails.dName,
          item_id: orderDetails.item_id,
          group: orderDetails.category,
          openingStock: totalQuantity,
          totalPurchase: totalQuantity,
          totalSalses: 0,
          uom: 'pcs',
          gst: 0,
          unit_prize: unitPrice,
          sellingPrice: 0,
          total_prize: orderDetails.totalPrice || 0,
          quantity: totalQuantity,
          hsnCode: '0000',
          cgst: 0,
          igst: 0,
          sgst: 0,
        };

        await SnigdhaItem.create(newAddedItem);
      }
    }

    const order = await Order.findByIdAndUpdate(orderId, req.body, { new: true });
    res.status(200).json({
      message: 'Order updated successfully',
      data: order,
      success: true,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) return res.status(404).json({ message: 'Order not found' });

    const existingItemId = existingOrder.item_id;
    const exitingItem = await SnigdhaItem.findOne({ item_id: existingItemId }); // ✅ findOne

    const exitingQuantityInOrder = existingOrder.sizes?.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    ) || 0;

    const existingTotalPriceInOrder = existingOrder.totalPrice || 0;

    if (!exitingItem) {
      await Order.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: 'Order deleted successfully (no linked item)' });
    }

    // 🧩 When deleting last stock of that item
    if ((exitingItem.quantity || 0) === exitingQuantityInOrder) {
      await SnigdhaItem.deleteOne({ item_id: existingItemId });
    } else {
      const totalPurchase = (exitingItem.totalPurchase || 0) - exitingQuantityInOrder;
      const newTotalPrice =
        (exitingItem.total_prize || 0) - existingTotalPriceInOrder;
      const newQuantity = (exitingItem.quantity || 0) - exitingQuantityInOrder;
      const newUnitPrice = newQuantity > 0 ? newTotalPrice / newQuantity : 0;

      await SnigdhaItem.updateOne(
        { item_id: existingItemId },
        {
          $set: {
            totalPurchase,
            unit_prize: newUnitPrice,
            total_prize: newTotalPrice,
            quantity: newQuantity,
          },
        }
      );
    }

    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: error.message });
  }
};


export { createOrder, getAllOrders, getOrder, updateOrder, deleteOrder };
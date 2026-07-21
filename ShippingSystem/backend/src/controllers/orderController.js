const Order = require('../models/Order');
const Product = require('../models/Product');
const shiprocketService = require('../utils/shiprocketService');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;
    
    // Generate order number
    const orderNumber = 'ORD' + Date.now().toString().slice(-8);
    
    // Create order in database
    const order = new Order({
      orderNumber,
      customer,
      items,
      totalAmount,
      paymentStatus: 'paid', // Assuming payment is already done
      orderStatus: 'processing'
    });
    
    const savedOrder = await order.save();
    
    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a dummy order with Shiprocket integration
exports.createDummyOrder = async (req, res) => {
  try {
    // Get 5 random products
    const products = await Product.aggregate([{ $sample: { size: 5 } }]);
    
    // Create order items
    const items = products.map(product => ({
      product: product._id,
      name: product.name,
      sku: product.sku,
      quantity: Math.floor(Math.random() * 3) + 1, // Random quantity between 1-3
      price: product.price
    }));
    
    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create customer data
    const customer = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '9876543210',
      address: {
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      }
    };
    
    // Generate order number
    const orderNumber = 'ORD' + Date.now().toString().slice(-8);
    
    // Create order in database
    const order = new Order({
      orderNumber,
      customer,
      items,
      totalAmount,
      paymentStatus: 'paid',
      orderStatus: 'processing'
    });
    
    const savedOrder = await order.save();
    
    // Create order data for Shiprocket
    const shiprocketOrderData = {
      order_id: savedOrder.orderNumber,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: "Primary",
      billing_customer_name: customer.name,
      billing_last_name: "",
      billing_address: customer.address.street,
      billing_city: customer.address.city,
      billing_pincode: customer.address.pincode,
      billing_state: customer.address.state,
      billing_country: customer.address.country,
      billing_email: customer.email,
      billing_phone: customer.phone,
      shipping_is_billing: true,
      order_items: items.map(item => ({
        name: item.name,
        sku: item.sku,
        units: item.quantity,
        selling_price: item.price,
        discount: 0,
        tax: 0
      })),
      payment_method: "Prepaid",
      sub_total: totalAmount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 1
    };
    
    // Create order in Shiprocket
    const shiprocketResponse = await shiprocketService.createOrder(shiprocketOrderData);
    
    // Update order with Shiprocket details
    savedOrder.shippingDetails = {
      shiprocketOrderId: shiprocketResponse.order_id,
      shipmentId: shiprocketResponse.shipment_id
    };
    
    await savedOrder.save();
    
    res.status(201).json({
      message: 'Dummy order created successfully',
      order: savedOrder,
      shiprocketResponse
    });
  } catch (error) {
    console.error('Error creating dummy order:', error);
    res.status(400).json({ message: error.message });
  }
};

// Process Shiprocket order (assign AWB, generate pickup, etc.)
exports.processShiprocketOrder = async (req, res) => {
  try {
    const { orderId, courierId } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const shipmentId = order.shippingDetails.shipmentId;
    
    // Assign AWB
    const awbResponse = await shiprocketService.assignAWB(shipmentId, courierId);
    
    // Generate pickup
    const pickupResponse = await shiprocketService.generatePickup(shipmentId);
    
    // Generate manifest
    const manifestResponse = await shiprocketService.generateManifest(shipmentId);
    
    // Print manifest
    const manifestPrintResponse = await shiprocketService.printManifest(manifestResponse.manifest_id);
    
    // Generate label
    const labelResponse = await shiprocketService.generateLabel(shipmentId);
    
    // Print invoice
    const invoiceResponse = await shiprocketService.printInvoice(order.shippingDetails.shiprocketOrderId);
    
    // Update order with shipping details
    order.shippingDetails.awbCode = awbResponse.awb_code;
    order.shippingDetails.courierName = awbResponse.courier_name;
    order.shippingDetails.manifestUrl = manifestPrintResponse.manifest_url;
    order.shippingDetails.labelUrl = labelResponse.label_url;
    order.shippingDetails.invoiceUrl = invoiceResponse.invoice_url;
    order.orderStatus = 'shipped';
    
    await order.save();
    
    res.status(200).json({
      message: 'Order processed successfully',
      order,
      awbResponse,
      pickupResponse,
      manifestResponse,
      manifestPrintResponse,
      labelResponse,
      invoiceResponse
    });
  } catch (error) {
    console.error('Error processing Shiprocket order:', error);
    res.status(400).json({ message: error.message });
  }
};

// Track shipment
exports.trackShipment = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const awbCode = order.shippingDetails.awbCode;
    if (!awbCode) {
      return res.status(400).json({ message: 'AWB code not found for this order' });
    }
    
    const trackingResponse = await shiprocketService.trackShipment(awbCode);
    
    res.status(200).json({
      order,
      tracking: trackingResponse
    });
  } catch (error) {
    console.error('Error tracking shipment:', error);
    res.status(400).json({ message: error.message });
  }
};
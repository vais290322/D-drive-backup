const shiprocketService = require('../utils/shiprocketService');

// Check serviceability
exports.checkServiceability = async (req, res) => {
  try {
    const { pickup_postcode, delivery_postcode, weight, cod } = req.query;
    const serviceability = await shiprocketService.checkServiceability(
      pickup_postcode,
      delivery_postcode,
      weight,
      cod
    );
    res.status(200).json(serviceability);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Shiprocket token
exports.getToken = async (req, res) => {
  try {
    const token = await shiprocketService.getToken();
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create order in Shiprocket
exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const response = await shiprocketService.createOrder(orderData);
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating Shiprocket order:', error);
    res.status(400).json({ message: error.message });
  }
};

// Assign AWB to shipment
exports.assignAWB = async (req, res) => {
  try {
    const { shipment_id, courier_id } = req.body;
    const response = await shiprocketService.assignAWB(shipment_id, courier_id);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error assigning AWB:', error);
    res.status(400).json({ message: error.message });
  }
};

// Generate pickup
exports.generatePickup = async (req, res) => {
  try {
    const { shipment_id } = req.body;
    const response = await shiprocketService.generatePickup(shipment_id);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error generating pickup:', error);
    res.status(400).json({ message: error.message });
  }
};

// Generate manifest
exports.generateManifest = async (req, res) => {
  try {
    const { shipment_id } = req.body;
    const response = await shiprocketService.generateManifest(shipment_id);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error generating manifest:', error);
    res.status(400).json({ message: error.message });
  }
};

// Print manifest
exports.printManifest = async (req, res) => {
  try {
    const { manifest_id } = req.body;
    const response = await shiprocketService.printManifest(manifest_id);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error printing manifest:', error);
    res.status(400).json({ message: error.message });
  }
};

// Generate label
exports.generateLabel = async (req, res) => {
  try {
    const { shipment_id } = req.body;
    const response = await shiprocketService.generateLabel(shipment_id);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error generating label:', error);
    res.status(400).json({ message: error.message });
  }
};

// Print invoice
exports.printInvoice = async (req, res) => {
  try {
    const { order_id } = req.body;
    const response = await shiprocketService.printInvoice(order_id);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error printing invoice:', error);
    res.status(400).json({ message: error.message });
  }
};

// Track shipment
exports.trackShipment = async (req, res) => {
  try {
    const { awb_code } = req.params;
    const response = await shiprocketService.trackShipment(awb_code);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error tracking shipment:', error);
    res.status(400).json({ message: error.message });
  }
};

// Process complete order flow
exports.processCompleteOrder = async (req, res) => {
  try {
    const { orderData, courierId } = req.body;
    
    // Step 1: Create order
    const orderResponse = await shiprocketService.createOrder(orderData);
    const shipmentId = orderResponse.shipment_id;
    
    // Step 2: Assign AWB
    const awbResponse = await shiprocketService.assignAWB(shipmentId, courierId);
    
    // Step 3: Generate pickup
    const pickupResponse = await shiprocketService.generatePickup(shipmentId);
    
    // Step 4: Generate manifest
    const manifestResponse = await shiprocketService.generateManifest(shipmentId);
    
    // Step 5: Print manifest
    const manifestPrintResponse = await shiprocketService.printManifest(manifestResponse.manifest_id);
    
    // Step 6: Generate label
    const labelResponse = await shiprocketService.generateLabel(shipmentId);
    
    // Step 7: Print invoice
    const invoiceResponse = await shiprocketService.printInvoice(orderResponse.order_id);
    
    res.status(200).json({
      message: 'Order processed successfully',
      orderResponse,
      awbResponse,
      pickupResponse,
      manifestResponse,
      manifestPrintResponse,
      labelResponse,
      invoiceResponse
    });
  } catch (error) {
    console.error('Error processing complete order:', error);
    res.status(400).json({ message: error.message });
  }
};
import SnigdhaPurchaseOrderNew from '../SnigdhaModels/SnigdhaPurchaseOrderNew.model.js';
import SnigdhaItem from '../SnigdhaModels/snigdhaItem.model.js';
import SnigdhaGrn from "../SnigdhaModels/SnigdhaGrn.model.js"
import mongoose from 'mongoose';


const generateGRNNumber = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1–12

    // Determine financial year (FY starts on March 1)
    let startYear, endYear;

    if (month >= 3) {
        // From March onward: FY = currentYear - nextYear
        startYear = year;
        endYear = String(year + 1).slice(-2);
    } else {
        // Before March: FY = previousYear - currentYear
        startYear = year - 1;
        endYear = String(year).slice(-2);
    }

    const yearRange = `${startYear}-${endYear}`;

    // Find last GRN of this financial year
    const lastOrder = await SnigdhaPurchaseOrderNew
        .findOne({ grnNumber: { $regex: `${yearRange}$` } })
        .sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastOrder) {
        const lastNum = parseInt(lastOrder.grnNumber.split("/")[1]);
        nextNumber = lastNum + 1;
    }

    const paddedNumber = String(nextNumber).padStart(4, "0");

    return `GRN/${paddedNumber}/${yearRange}`;
};


// Create a new purchase order
export const createPurchaseOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const purchaseOrderData = req.body;

        // Validate required fields
        const requiredFields = ['invoiceNumber', 'items',];
        const missingFields = requiredFields.filter(field => !purchaseOrderData[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Required fields missing: ${missingFields.join(', ')}`
            });
        }

        // Validate items array
        if (!Array.isArray(purchaseOrderData.items) || purchaseOrderData.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Items array is required and cannot be empty"
            });
        }

        // Validate each item has required fields
        const requiredItemFields = ['itemName', 'item_id', 'group', 'quantity'];
        for (const item of purchaseOrderData.items) {
            const missingItemFields = requiredItemFields.filter(field => !item[field]);
            if (missingItemFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Item is missing required fields: ${missingItemFields.join(', ')}`
                });
            }
        }

        // // Validate vendor name
        // if (!purchaseOrderData.vendorName) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Vendor name is required"
        //     });
        // }

        // Process each item in the purchase order
        for (const purchaseItem of purchaseOrderData.items) {
            // Ensure numeric values
            purchaseItem.quantity = Number(purchaseItem.quantity);
            purchaseItem.unitPrice = Number(purchaseItem.unitPrice || 0);
            purchaseItem.amount = Number(purchaseItem.amount || 0);
            purchaseItem.cgst = Number(purchaseItem.cgst || 0);
            purchaseItem.sgst = Number(purchaseItem.sgst || 0);
            purchaseItem.igst = Number(purchaseItem.igst || 0);

            // Calculate GST total if not already set
            if (!purchaseItem.gst) {
                purchaseItem.gst = purchaseItem.cgst + purchaseItem.sgst + purchaseItem.igst;
            } else {
                purchaseItem.gst = Number(purchaseItem.gst);
            }

            // Find if item already exists in inventory
            const existingItem = await SnigdhaItem.findOne({ item_id: purchaseItem.item_id }).session(session);

            if (existingItem) {
                // Item exists, update it
                const previousQuantity = Number(existingItem.quantity);
                const newQuantity = previousQuantity + purchaseItem.quantity;

                // Calculate new unit price using weighted average
                const newUnitPrice = (
                    (Number(existingItem.unit_prize) * previousQuantity) +
                    (purchaseItem.unitPrice * purchaseItem.quantity)
                ) / newQuantity;

                // Update total price
                const newTotalPrice = Number(existingItem.total_prize) + purchaseItem.amount;
                const newTotalPurchase = (existingItem.totalPurchase || 0) + purchaseItem.quantity;


                // Update GST values
                const newCgst = purchaseItem.cgst !== undefined ? purchaseItem.cgst : Number(existingItem.cgst || 0);
                const newSgst = purchaseItem.sgst !== undefined ? purchaseItem.sgst : Number(existingItem.sgst || 0);
                const newIgst = purchaseItem.igst !== undefined ? purchaseItem.igst : Number(existingItem.igst || 0);
                // const newGst = newCgst + newSgst + newIgst;

                let newGst;

                if (purchaseOrderData?.taxGroup === "State Tax") {
                    newGst = newCgst + newSgst;
                } else {
                    newGst = newIgst;
                }

                // Update the item
                await SnigdhaItem.findByIdAndUpdate(
                    existingItem._id,
                    {
                        quantity: newQuantity,
                        unit_prize: newUnitPrice,
                        total_prize: newTotalPrice,
                        totalPurchase: newTotalPurchase,
                        updated_date: new Date(),
                        cgst: newCgst,
                        sgst: newSgst,
                        igst: newIgst,
                        gst: newGst,
                        // Update UOM if provided
                        ...(purchaseItem.unit && { uom: purchaseItem.unit || purchaseItem.uom || '' }),
                    },
                    { session }
                );
            } else {
                // Item doesn't exist, create a new one
                await SnigdhaItem.create([{
                    item_name: purchaseItem.itemName,
                    item_id: purchaseItem.item_id,
                    group: purchaseItem.group,
                    openingStock: purchaseItem.quantity,
                    quantity: purchaseItem.quantity,
                    totalPurchase: purchaseItem.quantity,
                    unit_prize: purchaseItem.unitPrice,
                    total_prize: purchaseItem.amount,
                    hsnCode: purchaseItem.hsnCode || '',
                    cgst: purchaseItem.cgst,
                    sgst: purchaseItem.sgst,
                    igst: purchaseItem.igst,
                    gst: purchaseItem.gst,
                    uom: purchaseItem.unit || purchaseItem.uom || '',
                    created_date: new Date(),
                    updated_date: new Date()
                }], { session });
            }
        }

        const grnNumber = await generateGRNNumber();

        const newPurchaseOrderData = {
            ...req.body,
            grnNumber,
            items: req.body.items
                .map(item => ({
                    ...item,
                    uom: item.unit || item.uom || '',

                }))
        }

        // Create new purchase order
        const newPurchaseOrder = await SnigdhaPurchaseOrderNew.create([newPurchaseOrderData], { session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success: true,
            message: "Purchase order created successfully and inventory updated",
            purchaseOrder: newPurchaseOrder[0]
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("Error creating purchase order:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating purchase order",
            error: error.message
        });
    }
};

// Get all purchase orders
export const getAllPurchaseOrders = async (req, res) => {
    try {
        const purchaseOrders = await SnigdhaPurchaseOrderNew.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: purchaseOrders.length,
            purchaseOrders
        });
    } catch (error) {
        console.error("Error fetching purchase orders:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching purchase orders",
            error: error.message
        });
    }
};

// Get a single purchase order by ID
export const getPurchaseOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const purchaseOrder = await SnigdhaPurchaseOrderNew.findById(id);

        if (!purchaseOrder) {
            return res.status(404).json({
                success: false,
                message: "Purchase order not found"
            });
        }

        return res.status(200).json({
            success: true,
            purchaseOrder
        });
    } catch (error) {
        console.error("Error fetching purchase order:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching purchase order",
            error: error.message
        });
    }
};

// Update a purchase order
export const updatePurchaseOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;
        const updateData = req.body;
        // console.log("Received update data:", updateData);

        // Find the original purchase order
        const originalPurchaseOrder = await SnigdhaPurchaseOrderNew.findById(id).session(session);

        if (!originalPurchaseOrder) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "Purchase order not found"
            });
        }

        // If items are being updated, handle inventory changes
        if (updateData.items && Array.isArray(updateData.items)) {
            // First, revert the effects of the original items
            for (const originalItem of originalPurchaseOrder.items) {
                const existingItem = await SnigdhaItem.findOne({ item_id: originalItem.item_id }).session(session);

                if (existingItem) {
                    // Calculate new quantity after removing this item
                    const newQuantity = existingItem.quantity - originalItem.quantity;

                    const newTotalPurchase = Math.max(0, (existingItem.totalPurchase || 0) - originalItem.quantity);


                    if (newQuantity <= 0) {
                        // If quantity becomes zero or negative, consider removing the item
                        await SnigdhaItem.findByIdAndDelete(existingItem._id).session(session);
                    } else {
                        // Recalculate unit price and total price
                        const remainingValue = existingItem.total_prize - originalItem.amount;
                        const newUnitPrice = remainingValue / newQuantity;

                        await SnigdhaItem.findByIdAndUpdate(
                            existingItem._id,
                            {
                                quantity: newQuantity,
                                totalPurchase: newTotalPurchase,
                                unit_prize: newUnitPrice,
                                total_prize: remainingValue,
                                updated_date: new Date()
                            },
                            { session }
                        );
                    }
                }
            }

            // Then, apply the effects of the new items
            for (const newItem of updateData.items) {
                // Ensure numeric values
                newItem.quantity = Number(newItem.quantity);
                newItem.unitPrice = Number(newItem.unitPrice || 0);
                newItem.amount = Number(newItem.amount || 0);
                newItem.cgst = Number(newItem.cgst || 0);
                newItem.sgst = Number(newItem.sgst || 0);
                newItem.igst = Number(newItem.igst || 0);

                // Calculate GST total if not already set
                if (!newItem.gst) {
                    newItem.gst = newItem.cgst + newItem.sgst + newItem.igst;
                } else {
                    newItem.gst = Number(newItem.gst);
                }

                const existingItem = await SnigdhaItem.findOne({ item_id: newItem.item_id }).session(session);

                if (existingItem) {
                    // Item exists, update it
                    const previousQuantity = Number(existingItem.quantity);
                    const newQuantity = previousQuantity + newItem.quantity;

                    // Calculate new unit price using weighted average
                    const newUnitPrice = (
                        (Number(existingItem.unit_prize) * previousQuantity) +
                        (newItem.unitPrice * newItem.quantity)
                    ) / newQuantity;

                    // Update total price
                    const newTotalPrice = Number(existingItem.total_prize) + newItem.amount;
                    const newTotalPurchase = (existingItem.totalPurchase || 0) + newItem.quantity;


                    // Update GST values
                    const newCgst = newItem.cgst !== undefined ? newItem.cgst : Number(existingItem.cgst || 0);
                    const newSgst = newItem.sgst !== undefined ? newItem.sgst : Number(existingItem.sgst || 0);
                    const newIgst = newItem.igst !== undefined ? newItem.igst : Number(existingItem.igst || 0);
                    const newGst = newCgst + newSgst + newIgst;

                    await SnigdhaItem.findByIdAndUpdate(
                        existingItem._id,
                        {
                            quantity: newQuantity,
                            unit_prize: newUnitPrice,
                            totalPurchase: newTotalPurchase,
                            total_prize: newTotalPrice,
                            updated_date: new Date(),
                            cgst: newCgst,
                            sgst: newSgst,
                            igst: newIgst,
                            gst: newGst,
                            ...(newItem.unit && { uom: newItem.unit || newItem.uom || '' }),
                        },
                        { session }
                    );
                } else {
                    // Item doesn't exist, create a new one
                    await SnigdhaItem.create([{
                        item_name: newItem.itemName,
                        item_id: newItem.item_id,
                        group: newItem.group,
                        openingStock: newItem.quantity,
                        totalPurchase: newItem.quantity,
                        quantity: newItem.quantity,
                        unit_prize: newItem.unitPrice,
                        total_prize: newItem.amount,
                        hsnCode: newItem.hsnCode || '',
                        cgst: newItem.cgst,
                        sgst: newItem.sgst,
                        igst: newItem.igst,
                        gst: newItem.gst,
                        uom: newItem.unit || newItem.uom || '',
                        created_date: new Date(),
                        updated_date: new Date()
                    }], { session });
                }
            }
        }

        // Update the purchase order
        const updatedPurchaseOrder = await SnigdhaPurchaseOrderNew.findByIdAndUpdate(
            id,
            {
                ...updateData,
                uom: updateData.unit || updateData.uom || '',
            },
            { new: true, runValidators: true, session }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Purchase order and inventory updated successfully",
            purchaseOrder: updatedPurchaseOrder
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("Error updating purchase order:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating purchase order",
            error: error.message
        });
    }
};

// Delete a purchase order
export const deletePurchaseOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;

        // Find the purchase order to be deleted
        const purchaseOrder = await SnigdhaPurchaseOrderNew.findById(id).session(session);

        if (!purchaseOrder) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "Purchase order not found"
            });
        }


        // First, delete all related GRNs with their deletion logic
        const relatedGrns = await SnigdhaGrn.find({ invoiceNumber: purchaseOrder.invoiceNumber }).session(session);

        // Reverse inventory changes for each related GRN
        for (const grn of relatedGrns) {
            // reverse changes for each damage item in the GRN
            for (const oldIt of grn.damageItems) {
                const item = await SnigdhaItem.findOne({ item_id: oldIt.item_id }).session(session);
                if (item) {
                    // remove damage record for this grnNumber
                    item.damage = (item.damage || []).filter(d => String(d.grnNumber) !== String(grn.grnNumber));
                    item.totalDamageQty = Math.max(0, (item.totalDamageQty || 0) - (Number(oldIt.damageQty) || 0));
                    item.totalDamageAmount = Math.max(0, (item.totalDamageAmount || 0) - (Number(oldIt.damageAmount) || 0));
                    // add back quantity
                    item.totalRemainingQty = (Number(item.quantity) || 0) + (Number(oldIt.damageQty) || 0);
                    item.updated_date = new Date();
                    await item.save({ session });
                }
            }

            // Delete the GRN document
            await SnigdhaGrn.findByIdAndDelete(grn._id).session(session);
        }

        // Revert inventory changes for each item in the purchase order
        for (const item of purchaseOrder.items) {
            // Ensure numeric values
            item.quantity = Number(item.quantity);
            item.amount = Number(item.amount || 0);

            const existingItem = await SnigdhaItem.findOne({ item_id: item.item_id }).session(session);

            if (existingItem) {
                // Calculate new quantity after removing this item
                const newQuantity = Number(existingItem.quantity) - item.quantity;
                // Calculate new totalPurchase after removing this item
                const newTotalPurchase = Math.max(0, Number(existingItem.totalPurchase || 0) - item.quantity);

                if (newQuantity <= 0) {
                    // If quantity becomes zero or negative, consider removing the item
                    await SnigdhaItem.findByIdAndDelete(existingItem._id).session(session);
                } else {
                    // Recalculate unit price and total price
                    const remainingValue = Number(existingItem.total_prize) - item.amount;
                    const newUnitPrice = remainingValue / newQuantity;

                    await SnigdhaItem.findByIdAndUpdate(
                        existingItem._id,
                        {
                            quantity: newQuantity,
                            unit_prize: newUnitPrice,
                            total_prize: remainingValue,
                            totalPurchase: newTotalPurchase,
                            updated_date: new Date()
                        },
                        { session }
                    );
                }
            }
        }

        // Delete the purchase order
        await SnigdhaPurchaseOrderNew.findByIdAndDelete(id).session(session);

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Purchase order deleted successfully and inventory updated"
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("Error deleting purchase order:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting purchase order",
            error: error.message
        });
    }
};

// Get purchase orders by vendor code
export const getPurchaseOrdersByVendor = async (req, res) => {
    try {
        const { vendorCode } = req.params;

        const purchaseOrders = await SnigdhaPurchaseOrderNew.find({ vendorCode }).sort({ date: -1 });

        if (purchaseOrders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No purchase orders found for this vendor"
            });
        }

        return res.status(200).json({
            success: true,
            count: purchaseOrders.length,
            purchaseOrders
        });
    } catch (error) {
        console.error("Error fetching vendor purchase orders:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching vendor purchase orders",
            error: error.message
        });
    }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { paidOne } = req.body;

        const updatedPurchaseOrder = await SnigdhaPurchaseOrderNew.findByIdAndUpdate(
            id,
            { paidOne },
            { new: true }
        );

        if (!updatedPurchaseOrder) {
            return res.status(404).json({
                success: false,
                message: "Purchase order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            purchaseOrder: updatedPurchaseOrder
        });
    } catch (error) {
        console.error("Error updating payment status:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating payment status",
            error: error.message
        });
    }
};

// Get purchase orders by date range
export const getPurchaseOrdersByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Both start date and end date are required"
            });
        }

        const purchaseOrders = await SnigdhaPurchaseOrderNew.find({
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            count: purchaseOrders.length,
            purchaseOrders
        });
    } catch (error) {
        console.error("Error fetching purchase orders by date range:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching purchase orders by date range",
            error: error.message
        });
    }
};

// Get purchase orders by invoice number
export const getPurchaseOrderByInvoiceNumber = async (req, res) => {
    try {
        const { invoiceNumber } = req.params;

        const purchaseOrder = await SnigdhaPurchaseOrderNew.findOne({ invoiceNumber });

        if (!purchaseOrder) {
            return res.status(404).json({
                success: false,
                message: "Purchase order not found"
            });
        }

        return res.status(200).json({
            success: true,
            purchaseOrder
        });
    } catch (error) {
        console.error("Error fetching purchase order by invoice number:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching purchase order by invoice number",
            error: error.message
        });
    }
};
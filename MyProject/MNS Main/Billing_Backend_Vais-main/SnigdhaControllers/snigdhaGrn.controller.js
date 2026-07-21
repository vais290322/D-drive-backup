import mongoose from "mongoose";
import SnigdhaItem from "../SnigdhaModels/snigdhaItem.model.js";
import SnigdhaGrn from "../SnigdhaModels/SnigdhaGrn.model.js";

// helper: validate damage items payload
function validateDamageItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
        return "damageItems must be a non-empty array";
    }
    for (const it of items) {
        if (!it.item_id) return "Each damage item must have item_id";
        if (!it.itemName) return "Each damage item must have itemName";
        if (it.damageQty == null) return "Each damage item must have damageQty";
        if (it.unitPrice == null) return "Each damage item must have unitPrice";
    }
    return null;
}

// Create GRN
export const createGrn = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { grnNumber, invoiceNumber, vendorName, damageItems, totals, date } = req.body;

        console.log(totals)

        // required checks
        if (!grnNumber) return res.status(400).json({ success: false, message: "grnNumber is required" });

        const existingGrn = await SnigdhaGrn.findOne({ grnNumber }).session(session);
        if (existingGrn) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: "GRN number already exists" });
        }

        const err = validateDamageItems(damageItems);
        if (err) return res.status(400).json({ success: false, message: err });

        // compute totals if not provided
        const computedTotals = {
            totalDamageQty: 0,
            totalDamageAmount: totals?.totalDamageAmount || 0,
            totalInvoiceValue: totals?.totalInvoiceValue || 0,
            totalAcceptedAmount: totals?.totalAcceptedAmount || 0,
        };
        for (const it of damageItems) {
            const dq = Number(it.damageQty) || 0;
            const up = Number(it.unitPrice) || 0;
            // it.damageAmount = Number((dq * up).toFixed(2));
            computedTotals.totalDamageQty += dq;
            // computedTotals.totalDamageAmount += it.damageAmount;
        }
        // computedTotals.totalDamageAmount = Number(computedTotals.totalDamageAmount.toFixed(2));

        // create GRN
        const grnDoc = await SnigdhaGrn.create([{
            grnNumber, invoiceNumber, vendorName, date, damageItems, totals: { ...computedTotals }
        }], { session });

        // update inventory items
        for (const it of damageItems) {
            const item = await SnigdhaItem.findOne({ item_id: it.item_id }).session(session);
            if (!item) {
                await session.abortTransaction();
                return res.status(404).json({ success: false, message: `Item not found inventory: ${it.item_id}` });
            }

            // decrement stock quantity
            const newQty = Number(item.quantity) - Number(it.damageQty);

            if (newQty < 0) {
                await session.abortTransaction();
                return res.status(400).json({ success: false, message: `Insufficient stock for item ${it.item_id}` });
            }
            // update total remaining quantity
            item.totalRemainingQty = (item.quantity || 0) - Number(it.damageQty);

            // push damage entry and update totals
            item.damage.push({
                damageQty: Number(it.damageQty),
                damageAmount: Number(it.damageAmount),
                grnNumber
            });
            item.totalDamageQty = (item.totalDamageQty || 0) + Number(it.damageQty);
            item.totalDamageAmount = (item.totalDamageAmount || 0) + Number(it.damageAmount);
            item.updated_date = new Date();

            await item.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({ success: true, data: grnDoc[0], message: "Grn added successfully and also update the inventory" });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Get single GRN by id
export const getGrn = async (req, res) => {
    try {
        const { id } = req.params;
        const grn = await SnigdhaGrn.findById(id);
        if (!grn) return res.status(404).json({ success: false, message: "GRN not found" });
        res.status(200).json({ success: true, data: grn });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// List GRNs 
export const listGrns = async (req, res) => {
    try {
        // const page = Number(req.query.page || 1);
        // const limit = Number(req.query.limit || 25);
        // const skip = (page - 1) * limit;
        // const total = await SnigdhaGrn.countDocuments();
        // const data = await SnigdhaGrn.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
        const data = await SnigdhaGrn.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: data, message: "All Grn data fetched successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update GRN: reverse previous inventory impacts, then apply new damage items
export const updateGrn = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        const payload = req.body;
        const grn = await SnigdhaGrn.findById(id).session(session);
        if (!grn) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: "GRN not found" });
        }

        // validate incoming items
        const err = validateDamageItems(payload.damageItems || []);
        if (err) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: err });
        }

        // 1) Reverse previous changes for each existing damage item
        for (const oldIt of grn.damageItems) {
            const item = await SnigdhaItem.findOne({ item_id: oldIt.item_id }).session(session);
            if (!item) {
                // await session.abortTransaction();
                // return res.status(404).json({ success: false, message: `Item not found when reversing ${oldIt.item_id}` });
                 // Item no longer exists, continue with update but log warning
                console.warn(`Item ${oldIt.item_id} not found when reversing GRN ${grn.grnNumber}`);
                continue;
            }
            // remove damage entry matching this grnNumber
            item.damage = (item.damage || []).filter(d => String(d.grnNumber) !== String(grn.grnNumber));
            item.totalDamageQty = Math.max(0, (item.totalDamageQty || 0) - (Number(oldIt.damageQty) || 0));
            item.totalDamageAmount = Math.max(0, (item.totalDamageAmount || 0) - (Number(oldIt.damageAmount) || 0));
            item.totalRemainingQty = (Number(item.quantity) || 0) + (Number(oldIt.damageQty) || 0);
            item.updated_date = new Date();
            await item.save({ session });
        }

        // 2) Apply new items from payload
        let totQty = 0, totAmt = 0;
        for (const it of payload.damageItems) {
            const item = await SnigdhaItem.findOne({ item_id: it.item_id }).session(session);
            if (!item) {
                await session.abortTransaction();
                return res.status(404).json({ success: false, message: `Item not found ${it.item_id}` });
            }
            const dq = Number(it.damageQty) || 0;
            const up = Number(it.unitPrice) || 0;
            const damAmt = Number((dq * up).toFixed(2));

            // decrement stock
            if ((Number(item.quantity) - dq) < 0) {
                await session.abortTransaction();
                return res.status(400).json({ success: false, message: `Insufficient stock for item ${it.item_id}` });
            }
            item.totalRemainingQty = Number(item.quantity) - dq;

            // push new damage entry
            item.damage.push({
                damageQty: dq,
                damageAmount: damAmt,
                grnNumber: grn.grnNumber
            });

            item.totalDamageQty = (item.totalDamageQty || 0) + dq;
            item.totalDamageAmount = (item.totalDamageAmount || 0) + damAmt;
            item.updated_date = new Date();
            await item.save({ session });

            totQty += dq;
            totAmt += damAmt;

            // normalize values to 2 decimals
        }

        // 3) Update GRN doc fields
        grn.damageItems = payload.damageItems.map(it => ({
            ...it,
            damageAmount: Number(((Number(it.damageQty) || 0) * (Number(it.unitPrice) || 0)).toFixed(2))
        }));
        grn.totals = {
            totalInvoiceValue: payload.totals?.totalInvoiceValue || grn.totals?.totalInvoiceValue || 0,
            totalDamageQty: totQty,
            totalDamageAmount: payload.totals?.totalDamageAmount || grn.totals?.totalDamageAmount || 0,
            totalAcceptedAmount: payload.totals?.totalAcceptedAmount || grn.totals?.totalAcceptedAmount || 0
        };
        grn.invoiceNumber = payload.invoiceNumber || grn.invoiceNumber;
        grn.vendorName = payload.vendorName || grn.vendorName;
        grn.date = payload.date || grn.date;


        await grn.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, data: grn, message: "GRN updated successfully" });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete GRN: reverse inventory and remove grn
export const deleteGrn = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        const grn = await SnigdhaGrn.findById(id).session(session);
        if (!grn) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: "GRN not found" });
        }

        // reverse changes
        for (const oldIt of grn.damageItems) {
            const item = await SnigdhaItem.findOne({ item_id: oldIt.item_id }).session(session);
            if (!item) {
                // await session.abortTransaction();
                // return res.status(404).json({ success: false, message: `Item not found when reversing ${oldIt.item_id}` });
                // Item no longer exists, continue with deletion but log warning
                console.warn(`Item ${oldIt.item_id} not found when deleting GRN ${grn.grnNumber}`);
                continue;
            }
            // remove damage record for this grnNumber
            item.damage = (item.damage || []).filter(d => String(d.grnNumber) !== String(grn.grnNumber));
            item.totalDamageQty = Math.max(0, (item.totalDamageQty || 0) - (Number(oldIt.damageQty) || 0));
            item.totalDamageAmount = Math.max(0, (item.totalDamageAmount || 0) - (Number(oldIt.damageAmount) || 0));
            // add back quantity
            item.totalRemainingQty = (Number(item.quantity) || 0) + (Number(oldIt.damageQty) || 0);
            item.updated_date = new Date();
            await item.save({ session });
        }

        await SnigdhaGrn.findByIdAndDelete(id).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: "GRN deleted" });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Damage summary by item id (detail lines and totals)
export const damageSummaryByItem = async (req, res) => {
    try {
        const { item_id } = req.params;
        // aggregate GRN collection
        const details = await SnigdhaGrn.aggregate([
            { $unwind: "$damageItems" },
            { $match: { "damageItems.item_id": item_id } },
            {
                $project: {
                    grnNumber: 1,
                    date: 1,
                    invoiceNumber: 1,
                    item_id: "$damageItems.item_id",
                    quantity: "$damageItems.damageQty",
                    unitPrice: "$damageItems.unitPrice",
                    amount: "$damageItems.damageAmount"
                }
            },
            { $sort: { date: -1 } }
        ]);
        const totals = details.reduce((acc, d) => {
            acc.totalQuantity += Number(d.quantity || 0);
            acc.totalAmount += Number(d.amount || 0);
            return acc;
        }, { totalQuantity: 0, totalAmount: 0 });
        totals.totalAmount = Number(totals.totalAmount.toFixed(2));
        res.status(200).json({ success: true, totals, details });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
}; 


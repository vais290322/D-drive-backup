import PurchaseModel from "../models/Purchase.model.js";
import InventoryModel from "../models/Inventory.model.js";

const createPurchase = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { purchaseNo, date, sellerName, sellerPhone, sellerAddress, items, grossAmount, discount, netAmount, roundOff, totalAmount, createdBy } = req.body;

        const requiredFields = {
            schoolId,
            purchaseNo,
            date,
            sellerName,
            items,
            grossAmount,
            discount,
            netAmount,
            roundOff,
            totalAmount
        };


        const missingFields = Object.keys(requiredFields).filter(
            key =>
                requiredFields[key] === undefined ||
                requiredFields[key] === null ||
                requiredFields[key] === ""
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                status: false,
                message: `Missing required field(s): ${missingFields.join(", ")}`,
                data: null,
                error: true
            });
        }

        // 2️⃣ Items validation
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "At least one item is required",
            });
        }

        // 3️⃣ Validate each item
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            const requiredItemFields = [
                "name",
                "code",
                "categoryId",
                "category",
                "unit",
                "quantity",
                "price",
                "totalPrice",
            ];

            for (const field of requiredItemFields) {
                if (
                    item[field] === undefined ||
                    item[field] === null ||
                    item[field] === ""
                ) {
                    return res.status(400).json({
                        message: `Item ${i + 1}: ${field} is required`,
                    });
                }
            }

            if (item.quantity <= 0 || item.price < 0) {
                return res.status(400).json({
                    message: `Item ${i + 1}: quantity and price must be valid`,
                });
            }
        }

        // check if item already exists and update stock
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const existingItem = await InventoryModel.findOne({ schoolId, code: item.code });
            if (existingItem) {
                // Item exists, update it
                const previousQuantity = Number(existingItem.stock);
                const newQuantity = previousQuantity + Number(item.quantity);

                // Calculate new unit price using weighted average
                const newUnitPrice = (
                    (Number(existingItem.price) * previousQuantity) +
                    (Number(item.price) * Number(item.quantity))
                ) / newQuantity;

                // Update total price
                const newTotalPrice = Number(existingItem.totalPrice) + Number(item.totalPrice);
                const newTotalPurchase = (existingItem.totalPurchaseStock || 0) + Number(item.quantity);

                existingItem.stock = newQuantity;
                existingItem.price = newUnitPrice;
                existingItem.totalPrice = newTotalPrice;
                existingItem.totalPurchaseStock = newTotalPurchase;

                await existingItem.save();
            } else {
                // Item does not exist, create it
                const newItem = new InventoryModel({
                    schoolId,
                    code: item.code,
                    name: item.name,
                    category: item.category,
                    subCategory: item.subCategory,
                    categoryId: item.categoryId,
                    subCategoryId: item.subCategoryId,
                    unit: item.unit,
                    stock: Number(item.quantity),
                    price: Number(item.price),
                    totalPrice: Number(item.totalPrice),
                    totalPurchaseStock: Number(item.quantity),
                });
                await newItem.save();
            }
        }

        const newPurchase = new PurchaseModel({
            schoolId,
            purchaseNo,
            date,
            sellerName,
            sellerPhone,
            sellerAddress,
            items,
            grossAmount,
            discount,
            netAmount,
            roundOff,
            totalAmount,
            createdBy
        });
        
        await newPurchase.save();
        if (!newPurchase) {
            return res.status(400).json({
                success: false,
                message: "Purchase not created",
                data: null,
                error: true
            });
        }

        res.status(200).json({
            success: true,
            message: "Purchase created successfully",
            data: newPurchase,
            error: false
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
            data: null,
            error: true
        });
    }
};

const getAllPurchase = async (req, res) => {
    try {
        const { schoolId } = req.params;
        if (!schoolId) {
            return res.status(400).json({
                success: false,
                message: "School ID is required",
                data: null,
                error: true
            });
        }
        const purchases = await PurchaseModel.find({ schoolId }).sort({ createdAt: -1 });
        if (!purchases) {
            return res.status(400).json({
                success: false,
                message: "No purchases found for this school",
                data: null,
                error: true
            });
        }
        res.status(200).json({
            success: true,
            message: "Purchases found successfully for this school",
            data: purchases,
            error: false
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
            data: null,
            error: true
        });
    }
};

const updatePurchase = async (req, res) => {
    try {
        const { schoolId, id } = req.params;
        const {
            purchaseNo,
            date,
            sellerName,
            sellerPhone,
            sellerAddress,
            items,
            grossAmount,
            discount,
            netAmount,
            roundOff,
            totalAmount,
            createdBy
        } = req.body;

        /* -------------------- 1️⃣ Required field validation -------------------- */

        const requiredFields = {
            schoolId,
            purchaseNo,
            date,
            sellerName,
            items,
            grossAmount,
            discount,
            netAmount,
            roundOff,
            totalAmount,
        };

        const missingFields = Object.keys(requiredFields).filter(
            (key) =>
                requiredFields[key] === undefined ||
                requiredFields[key] === null ||
                requiredFields[key] === ""
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required field(s): ${missingFields.join(", ")}`,
                data: null,
                error: true,
            });
        }

        /* -------------------- 2️⃣ Items validation -------------------- */

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one item is required",
                data: null,
                error: true,
            });
        }

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            const requiredItemFields = [
                "name",
                "code",
                "categoryId",
                "category",
                "unit",
                "quantity",
                "price",
                "totalPrice",
            ];

            for (const field of requiredItemFields) {
                if (
                    item[field] === undefined ||
                    item[field] === null ||
                    item[field] === ""
                ) {
                    return res.status(400).json({
                        success: false,
                        message: `Item ${i + 1}: ${field} is required`,
                        data: null,
                        error: true,
                    });
                }
            }

            if (item.quantity <= 0 || item.price < 0) {
                return res.status(400).json({
                    success: false,
                    message: `Item ${i + 1}: quantity and price must be valid`,
                    data: null,
                    error: true,
                });
            }
        }

        /* -------------------- 3️⃣ Fetch existing purchase -------------------- */

        const purchase = await PurchaseModel.findOne({ _id: id, schoolId });

        if (!purchase) {
            return res.status(404).json({
                success: false,
                message: "Purchase not found",
                data: null,
                error: true,
            });
        }

        /* -------------------- 4️⃣ ROLLBACK OLD PURCHASE STOCK -------------------- */

        for (const oldItem of purchase.items) {
            const inventoryItem = await InventoryModel.findOne({
                schoolId,
                code: oldItem.code,
            });

            if (inventoryItem) {
                const updatedStock =
                    Number(inventoryItem.stock) - Number(oldItem.quantity);

                const updatedTotalPurchaseStock =
                    (inventoryItem.totalPurchaseStock || 0) -
                    Number(oldItem.quantity);

                const updatedTotalPrice =
                    Number(inventoryItem.totalPrice) -
                    Number(oldItem.totalPrice);

                // Safety: prevent negatives
                inventoryItem.stock = updatedStock > 0 ? updatedStock : 0;
                inventoryItem.totalPurchaseStock =
                    updatedTotalPurchaseStock > 0 ? updatedTotalPurchaseStock : 0;
                inventoryItem.totalPrice =
                    updatedTotalPrice > 0 ? updatedTotalPrice : 0;

                // ✅ RE-CALCULATE AVERAGE PRICE
                inventoryItem.price =
                    inventoryItem.stock > 0
                        ? inventoryItem.totalPrice / inventoryItem.stock
                        : 0;

                await inventoryItem.save();
            }
        }


        /* -------------------- 5️⃣ APPLY NEW PURCHASE STOCK -------------------- */

        for (const item of items) {
            const existingItem = await InventoryModel.findOne({
                schoolId,
                code: item.code,
            });

            if (existingItem) {
                const previousQuantity = Number(existingItem.stock);
                const newQuantity = previousQuantity + Number(item.quantity);

                const newUnitPrice =
                    newQuantity === 0
                        ? 0
                        : ((Number(existingItem.price) * previousQuantity) +
                            (Number(item.price) * Number(item.quantity))) /
                        newQuantity;

                existingItem.stock = newQuantity;
                existingItem.price = newUnitPrice;
                existingItem.totalPrice =
                    Number(existingItem.totalPrice) + Number(item.totalPrice);
                existingItem.totalPurchaseStock =
                    (existingItem.totalPurchaseStock || 0) +
                    Number(item.quantity);

                await existingItem.save();
            } else {
                const newInventoryItem = new InventoryModel({
                    schoolId,
                    code: item.code,
                    name: item.name,
                    category: item.category,
                    subCategory: item.subCategory,
                    categoryId: item.categoryId,
                    subCategoryId: item.subCategoryId,
                    unit: item.unit,
                    stock: Number(item.quantity),
                    price: Number(item.price),
                    totalPrice: Number(item.totalPrice),
                    totalPurchaseStock: Number(item.quantity),
                });

                await newInventoryItem.save();
            }
        }

        /* -------------------- 6️⃣ Update Purchase -------------------- */

        const updatedPurchase = await PurchaseModel.findByIdAndUpdate(
            id,
            {
                schoolId,
                purchaseNo,
                date,
                sellerName,
                sellerPhone,
                sellerAddress,
                items,
                grossAmount,
                discount,
                netAmount,
                roundOff,
                totalAmount,
                createdBy: createdBy ? createdBy : purchase.createdBy || {},
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Purchase updated successfully",
            data: updatedPurchase,
            error: false,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
            data: null,
            error: true,
        });
    }
};


const deletePurchase = async (req, res) => {
    try {
        const { schoolId, id } = req.params;
        if (!schoolId || !id) {
            return res.status(400).json({
                success: false,
                message: "School ID and Purchase ID are required",
                data: null,
                error: true
            });
        }

        /* -------------------- 1️⃣ Fetch Purchase -------------------- */

        const purchase = await PurchaseModel.findOne({
            _id: id,
            schoolId,
        });

        if (!purchase) {
            return res.status(404).json({
                success: false,
                message: "Purchase not found",
                data: null,
                error: true,
            });
        }

        /* -------------------- 2️⃣ ROLLBACK INVENTORY STOCK -------------------- */

        for (const item of purchase.items) {
            const inventoryItem = await InventoryModel.findOne({
                schoolId,
                code: item.code,
            });

            if (inventoryItem) {
                const updatedStock =
                    Number(inventoryItem.stock) - Number(item.quantity);

                const updatedTotalPurchaseStock =
                    (inventoryItem.totalPurchaseStock || 0) -
                    Number(item.quantity);

                const updatedTotalPrice =
                    Number(inventoryItem.totalPrice) -
                    Number(item.totalPrice);

                // Safety: prevent negative values
                inventoryItem.stock = updatedStock > 0 ? updatedStock : 0;
                inventoryItem.totalPurchaseStock =
                    updatedTotalPurchaseStock > 0 ? updatedTotalPurchaseStock : 0;
                inventoryItem.totalPrice =
                    updatedTotalPrice > 0 ? updatedTotalPrice : 0;

                // ✅ RE-CALCULATE WEIGHTED AVERAGE PRICE
                inventoryItem.price =
                    inventoryItem.stock > 0
                        ? inventoryItem.totalPrice / inventoryItem.stock
                        : 0;

                await inventoryItem.save();
            }
        }


        /* -------------------- 3️⃣ Delete Purchase -------------------- */

        const deletedPurchase = await PurchaseModel.findByIdAndDelete(id);

        if (!deletedPurchase) {
            return res.status(400).json({
                success: false,
                message: "Purchase not deleted",
                data: null,
                error: true,
            });
        }

        /* -------------------- 4️⃣ Success Response -------------------- */

        return res.status(200).json({
            success: true,
            message: "Purchase deleted successfully",
            data: deletedPurchase,
            error: false,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
            data: null,
            error: true,
        });
    }
};

export { createPurchase, getAllPurchase, updatePurchase, deletePurchase };
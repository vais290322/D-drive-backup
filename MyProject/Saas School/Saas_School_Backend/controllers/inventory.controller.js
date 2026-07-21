import InventoryModel from "../models/Inventory.model.js";

const createInventory = async (req, res) => {
    try {
        let { name, code, schoolId, categoryId, subCategoryId, unit, stock, price, sellPrice, totalPrice, category, subCategory } = req.body;

        const requiredFields = {
            name,
            code,
            schoolId,
            categoryId,
            unit,
            stock,
            price,
            category,
            subCategory
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

        const exitingItem = await InventoryModel.findOne({ code, schoolId });
        if (exitingItem) {
            return res.status(400).json({
                status: false,
                message: "Item already exists",
                data: null,
                error: true
            });
        }

        stock = Number(stock)
        price = Number(price)
        sellPrice = Number(sellPrice)
        totalPrice = Number(totalPrice)

        if (stock < 0 || price < 0 || sellPrice < 0 || totalPrice < 0) {
            return res.status(400).json({
                status: false,
                message: "Stock, price, sell price and total price cannot be negative",
                data: null,
                error: true
            });
        }

        totalPrice = stock * price

        const inventory = await InventoryModel.create({ name, code, schoolId, categoryId, subCategoryId, unit, stock, price, sellPrice, totalPrice, category, subCategory });
        return res.status(200).json({ status: true, message: "Inventory created successfully", data: inventory, error: false });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message || "Internal Server Error", data: null, error: true });
    }
}

const getInventoryByCategory = async (req, res) => {
    try {
        const { schoolId, categoryId } = req.params;
        if (!schoolId || !categoryId) {
            return res.status(400).json({ status: false, message: "SchoolId and categoryId are required", data: null, error: true });
        }
        const inventory = await InventoryModel.find({ schoolId, categoryId });
        if (!inventory) {
            return res.status(404).json({ status: false, message: "Inventory not found for this category in this school", data: null, error: true });
        }
        return res.status(200).json({ status: true, message: "Inventory fetched successfully", data: inventory, error: false });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message || "Internal Server Error", data: null, error: true });
    }
}

const getInventoryBySubCategory = async (req, res) => {
    try {
        const { schoolId, subCategoryId } = req.params;
        if (!schoolId || !subCategoryId) {
            return res.status(400).json({ status: false, message: "SchoolId and subCategoryId are required", data: null, error: true });
        }
        const inventory = await InventoryModel.find({ schoolId, subCategoryId });
        if (!inventory) {
            return res.status(404).json({ status: false, message: "Inventory not found for this sub category in this school", data: null, error: true });
        }
        return res.status(200).json({ status: true, message: "Inventory fetched successfully", data: inventory, error: false });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message || "Internal Server Error", data: null, error: true });
    }
}

const getInventoryBySchool = async (req, res) => {
    try {
        const { schoolId } = req.params;
        if (!schoolId) {
            return res.status(400).json({ status: false, message: "SchoolId is required", data: null, error: true });
        }
        const inventory = await InventoryModel.find({ schoolId });
        if (!inventory) {
            return res.status(404).json({ status: false, message: "Inventory not found for this school", data: null, error: true });
        }
        return res.status(200).json({ status: true, message: "Inventory fetched successfully", data: inventory, error: false });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message || "Internal Server Error", data: null, error: true });
    }
}

const getInventoryByCode = async (req, res) => {
    try {
        const { schoolId, code } = req.params;
        if (!schoolId || !code) {
            return res.status(400).json({ status: false, message: "SchoolId and code are required", data: null, error: true });
        }
        const inventory = await InventoryModel.findOne({ schoolId, code });
        if (!inventory) {
            return res.status(404).json({ status: false, message: "Inventory not found for this code in this school", data: null, error: true });
        }
        return res.status(200).json({ status: true, message: "Inventory fetched successfully", data: inventory, error: false });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message || "Internal Server Error", data: null, error: true });
    }
}

const searchInventory = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { search } = req.query;

    // 1️⃣ Validate required params
    if (!schoolId || !search) {
      return res.status(400).json({
        status: false,
        message: "schoolId and search query are required",
        data: null,
        error: true,
      });
    }

    // 2️⃣ MongoDB query (schoolId AND search mandatory)
    const inventory = await InventoryModel.find({
      $and: [
        { schoolId },
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { code: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
          ],
        },
      ],
    })
      .sort({ createdAt: -1 });

    // 3️⃣ No data found
    if (inventory.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No inventory found for this search",
        data: [],
        error: true,
      });
    }

    // 4️⃣ Success response
    return res.status(200).json({
      status: true,
      message: "Inventory fetched successfully",
      data: inventory,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
      data: null,
      error: true,
    });
  }
};


const updateInventory = async (req, res) => {
    try {
        const { schoolId, id } = req.params;
        let { name, categoryId, subCategoryId, unit, stock, price, sellPrice, totalPrice, category, subCategory, code } = req.body;
        if (!schoolId || !id) {
            return res.status(400).json({ status: false, message: "SchoolId and id are required", data: null, error: true });
        }
        const inventory = await InventoryModel.findOne({ schoolId, _id: id });
        if (!inventory) {
            return res.status(404).json({ status: false, message: "Inventory not found for this id in this school", data: null, error: true });
        }

        const exitingItem = await InventoryModel.findOne({ schoolId, code });
        if (exitingItem) {
            if (exitingItem._id.toString() !== id) {
                return res.status(400).json({ status: false, message: "Item already exists with this code", data: null, error: true });
            }
        }

        stock = Number(stock)
        price = Number(price)
        sellPrice = Number(sellPrice)
        totalPrice = Number(totalPrice)

        if (stock < 0 || price < 0 || sellPrice < 0 || totalPrice < 0) {
            return res.status(400).json({
                status: false,
                message: "Stock, price, sell price and total price cannot be negative",
                data: null,
                error: true
            });
        }

        totalPrice = stock * price


        inventory.name = name;
        inventory.code = code;
        inventory.categoryId = categoryId;
        inventory.subCategoryId = subCategoryId;
        inventory.unit = unit;
        inventory.stock = stock;
        inventory.price = price;
        inventory.sellPrice = sellPrice;
        inventory.totalPrice = totalPrice;
        inventory.category = category;
        inventory.subCategory = subCategory;
        await inventory.save();
        return res.status(200).json({ status: true, message: "Inventory updated successfully", data: inventory, error: false });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message || "Internal Server Error", data: null, error: true });
    }
}

const deleteInventory = async (req, res) => {
    try {
        const { schoolId, id } = req.params;
        if (!schoolId || !id) {
            return res.status(400).json({ status: false, message: "SchoolId and id are required", data: null, error: true });
        }
        const inventory = await InventoryModel.findOne({ schoolId, _id: id });
        if (!inventory) {
            return res.status(404).json({ status: false, message: "Inventory not found for this id in this school", data: null, error: true });
        }
        await inventory.deleteOne();
        return res.status(200).json({ status: true, message: "Inventory deleted successfully", data: inventory, error: false });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message || "Internal Server Error", data: null, error: true });
    }
}

export { createInventory, getInventoryByCategory, getInventoryBySubCategory, getInventoryBySchool, getInventoryByCode, searchInventory,updateInventory, deleteInventory };
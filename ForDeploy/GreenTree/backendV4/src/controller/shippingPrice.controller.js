const ShippingPrice = require("../models/shippingPrice.models");
const Register = require("../models/register.models");
const Address = require("../models/address.models");
const Tax = require("../models/tax.models");

// Create or update shipping price for a pin code
exports.createShippingPrice = async (req, res) => {
  try {
    const { pinCode, price } = req.body;
    console.log(pinCode, price);
    if (!pinCode || price == null) {
      return res
        .status(400)
        .json({ message: "Pin code and price are required" });
    }
    const existingShippingPrice = await ShippingPrice.findOne({ pinCode });
    if (existingShippingPrice) {
      return res.status(400).json({ message: "Pin code already exist" });
    }

    const shippingPrice = await ShippingPrice({ pinCode, price });
    await shippingPrice.save();
    res
      .status(200)
      .json({ message: "Shipping price create ", data: shippingPrice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateShippingPrice = async (req, res) => {
  try {
    const { pinCode, price } = req.body;
    if (!pinCode || price == null) {
      return res
        .status(400)
        .json({ message: "Pin code and price are required" });
    }

    const shippingPrice = await ShippingPrice.findOneAndUpdate(
      { _id: req.params.id },
      { price, pinCode },
      { upsert: true, new: true }
    );
    res
      .status(200)
      .json({ message: "Shipping price set", data: shippingPrice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get shipping price by pin code
exports.getShippingPrice = async (req, res) => {
  try {
    let { page = 1, limit = 5, search } = req.query;
  
    page = Number(page);
    limit = Number(limit);
  
    // ✅ Don't convert search to number
    // ✅ Keep search as string for regex
    const searchFilter = search
      ? {
          $or: [
            { pinCode: { $regex: search, $options: "i" } }, // works for numeric fields too
          ],
        }
      : {};
  
    const totalCount = await ShippingPrice.countDocuments(searchFilter);
  
    const shippingPrice = await ShippingPrice.find(searchFilter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  
    res.status(200).json({
      message: "Shipping prices fetched",
      data: shippingPrice,
      pagination: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }  
};

exports.getShippingPricebypin = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Fetch logged-in user
    const user = await Address.findOne({user: userId});

    if (!user || !user.postalCode) {
      return res.status(400).json({ message: "User postal code not found" });
    }

    const pincode = Number(user.postalCode);

    // ✅ Fetch matching shipping price
    const shippingPrice = await ShippingPrice.findOne({ pinCode: pincode });

    if (shippingPrice) {
      res.status(200).json({
        message: "Shipping price fetched successfully",
        data: {
          shippingCharge: shippingPrice.price
        },
      });
    }else {
     const shippingPrice = await Tax.findOne({}).select("-taxPercentage");
      res.status(200).json({
        message: "Shipping price fetched successfully",
        data: shippingPrice,
      }); 
    }
  } catch (error) {
    console.error("Error in getShippingPricebypin:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.deleteShippingPrice = async (req, res) => {
  try {
    const shippingPrice = await ShippingPrice.findOneAndDelete({
      _id: req.params.id,
    });
    if (!shippingPrice) {
      return res
        .status(404)
        .json({ message: "Shipping price not found for this pin code" });
    }
    res
      .status(200)
      .json({ message: "Shipping price deleted", data: shippingPrice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

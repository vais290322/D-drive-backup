const Coupon = require("../models/coupon.models");
const Cart = require("../models/cart.models");
// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const {code,discountValue,categoryName} = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }
     const existingCategory = await Coupon.findOne({ categoryName: categoryName });
     if (existingCategory) {
       return res.status(400).json({ message: "Coupon already exists for this category" });
     }
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountValue,
      categoryName
    });

    res.status(201).json({ message: "Coupon created successfully", data:coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all coupons with pagination
exports.getCoupons = async (req, res) => {
  try {
  
    const coupons = await Coupon.find({})
      .sort({ createdAt: -1 })

    res.status(200).json({
      message: "Coupons fetched successfully",
      data:coupons,
     
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Validate and apply coupon
// exports.applyCoupon = async (req, res) => {
//   try {
//     const { code, totalAmount } = req.body;

//     const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
//     if (!coupon) return res.status(404).json({ message: "Invalid coupon code" });

//     if (new Date(coupon.expiryDate) < new Date()) {
//       return res.status(400).json({ message: "Coupon has expired" });
//     }

//     if (totalAmount < coupon.minPurchase) {
//       return res.status(400).json({
//         message: `Minimum purchase amount must be ₹${coupon.minPurchase}`,
//       });
//     }

//     let discount = 0;
//     if (coupon.discountType === "percentage") {
//       discount = (totalAmount * coupon.discountValue) / 100;
//       if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
//         discount = coupon.maxDiscount;
//       }
//     } else if (coupon.discountType === "flat") {
//       discount = coupon.discountValue;
//     }

//     const finalAmount = Math.max(totalAmount - discount, 0);

//     res.status(200).json({
//       message: "Coupon applied successfully",
//       discount,
//       finalAmount,
//       coupon,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.applyCoupon = async (req, res) => {
  try {
    const userId=req.user.id;
    // const user_id = await User.findOne({userId:userId});
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase()});
    if (!coupon) return res.status(404).json({ message: "Invalid coupon code" });

    const categorydata = coupon.categoryName;
    const category = await Cart.find({ category: categorydata , user: userId });
    const categorylength= await Cart.find({ user: userId });
    if (!category) return res.status(404).json({ message: "Coupon not applicable for this category" });
    if(category.length===categorylength.length){
      return res.status(200).json({ message:"Coupon applied successfully",data:coupon});
    }else{
      const datas=await Coupon.findOne({categoryName:"All"})
      return res.status(200).json({ message: "Coupon applied successfully" ,data:datas  });  
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discountValue } = req.body;

    // Find coupon by ID
    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    // Update fields if provided
    if (code) coupon.code = code.toUpperCase();
    if (discountValue !== undefined) coupon.discountValue = discountValue;

    await coupon.save();
    res.status(200).json({ message: "Coupon updated successfully", data: coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete coupon
exports.deleteCoupon = async (req, res) => {
  try {
    console.log(req.params.id);
    const coupon = await Coupon.findOne({_id:req.params.id});
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    await Coupon.findOneAndDelete({_id:req.params.id});
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

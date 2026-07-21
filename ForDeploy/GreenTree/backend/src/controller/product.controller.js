const Product = require("../models/product.models");
const CategoryData = require("../models/category.models");
const User = require("../models/register.models");
const Order = require("../models/order.models");
const cloudinary = require("../config/cloudinary").cloudinary;

// Create Product with multiple images
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      units,
      quantity,
      costprice,
      sellingprice,
      stock,
      category,
      subCategory,
      productType,
      minimumQuantity,
      wholeSellingPrice,
      length,
      width,
      height,
      weight,
      weightUnit,
      lengthUnit,
      type,
    } = req.body;
    if (
      !name ||
      !description ||
      !brand ||
      !units ||
      !quantity ||
      !costprice ||
      !sellingprice ||
      !stock ||
      !category ||
      !productType
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }
    if (req.files.length > 6) {
      return res.status(400).json({ message: "Maximum 6 images allowed" });
    }

    let imagesData = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);

        imagesData.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }
    if (imagesData.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const product = await Product.create({
      name,
      description,
      brand,
      units,
      quantity,
      costprice,
      sellingprice,
      stock,
      category,
      subCategory,
      productType,
      minimumQuantity,
      wholeSellingPrice,
      length,
      width,
      height,
      weight,
      weightUnit,
      lengthUnit,
      type,
      image: imagesData,
    });

    res
      .status(201)
      .json({ message: "Product created successfully", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    const currentPage = parseInt(page, 10);
    const perPage = parseInt(limit, 10);
    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { subCategory: { $regex: search, $options: "i" } },
      ],
    };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Products fetched successfully",
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / perPage),
        currentPage,
        limit: perPage,
      },
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res
      .status(200)
      .json({ message: "Product fetched successfully", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update Product with multiple images
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const {
      name,
      description,
      brand,
      units,
      quantity,
      costprice,
      productType,
      sellingprice,
      stock,
      category,
      subCategory,
      minimumQuantity,
      wholeSellingPrice,
      length,
      width,
      height,
      weight,
      weightUnit,
      lengthUnit,
      type,
    } = req.body;

    // Replace images if new files uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images
      for (const img of product.image) {
        if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
      }

      const imagesData = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        imagesData.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      product.image = imagesData;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.units = units || product.units;
    product.quantity = quantity || product.quantity;
    product.costprice = costprice || product.costprice;
    product.productType = productType || product.productType;
    product.sellingprice = sellingprice || product.sellingprice;
    product.stock = stock || product.stock;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    product.minimumQuantity = minimumQuantity || product.minimumQuantity;
    product.wholeSellingPrice = wholeSellingPrice || product.wholeSellingPrice;
    product.length = length || product.length;
    product.width = width || product.width;
    product.height = height || product.height;
    product.weight = weight || product.weight;
    product.weightUnit = weightUnit || product.weightUnit;
    product.lengthUnit = lengthUnit || product.lengthUnit;
    product.type = type || product.type;

    await product.save();
    res
      .status(200)
      .json({ message: "Product updated successfully", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Delete Product and all images
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete all images from Cloudinary
    for (const img of product.image) {
      if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductBysubcategoryuser = async (req, res) => {
  try {
    const { subCategory } = req.params;
    const { minPrice, maxPrice } = req.query; // Optional filters from query params

    const formattedSubCategory = subCategory.replace(/-/g, " ").trim();

    // console.log("Searching for subcategory:", formattedSubCategory);

    // Dynamic filter
    const filter = {
      subCategory: { $regex: new RegExp(`^${formattedSubCategory}$`, "i") },
    };

    // Add optional price range filter
    if (minPrice || maxPrice) {
      filter.sellingprice = {};
      if (minPrice) filter.sellingprice.$gte = Number(minPrice);
      if (maxPrice) filter.sellingprice.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter);

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this subcategory" });
    }

    res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products by subcategory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProductBycategoryuser = async (req, res) => {
  try {
    const { category } = req.params; // Category from URL (e.g., /products/category/Health-Care)
    const { minPrice, maxPrice } = req.query; // Price filters from query (e.g., ?minPrice=100&maxPrice=500)

    const formattedCategory = category.replace(/-/g, " ").trim();
    // console.log("Searching for category:", formattedCategory);

    // Build dynamic filter
    const filter = {
      category: { $regex: new RegExp(`^${formattedCategory}$`, "i") },
    };

    // Add price range filter if provided
    if (minPrice || maxPrice) {
      filter.sellingprice = {};
      if (minPrice) filter.sellingprice.$gte = Number(minPrice);
      if (maxPrice) filter.sellingprice.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter);

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProductsUsersearch = async (req, res) => {
  try {
    let { search = "" } = req.query;
    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ],
    };
    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductByproducttypeuser = async (req, res) => {
  try {
    const { productType } = req.query;
    //  console.log(productType);

    const product = await Product.find({ productType: productType });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res
      .status(200)
      .json({ message: "Product fetched successfully", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductByIduser = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res
      .status(200)
      .json({ message: "Product fetched successfully", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getcatrgoryByproduct = async (req, res) => {
  try {
    const category = await CategoryData.find();
    console.log(category);

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    let products = [];
    for (let categoryId of category) {
      const productByCategory = await Product.find({
        category: categoryId.name,
      });
      products.push({
        categoryName: categoryId.name,
        product: productByCategory,
      });
    }
    res
      .status(200)
      .json({ message: "Product fetched successfully", data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET /api/products (with filters, pagination)
exports.getFilteredProducts = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice } = req.query;

    const filter = {};

    // Category filter (multiple, comma separated)
    if (category) {
      const categories = category.split(",").map((c) => c.trim());
      filter.category = { $in: categories };
    }

    // Brand filter
    if (brand) {
      const brands = brand.split(",").map((b) => b.trim());
      filter.brand = { $in: brands };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.sellingprice = {};
      if (minPrice) filter.sellingprice.$gte = Number(minPrice);
      if (maxPrice) filter.sellingprice.$lte = Number(maxPrice);
    }

    const products = Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const customerCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();

    const ravenew = await Order.find();
    const revenue = ravenew.reduce((total, order) => {
      return total + order.totalPrice;
    }, 0);

    // Optional: add revenue, recent orders, etc. later
    res.status(200).json({
      message: "Dashboard data fetched successfully",
      data: {
        totalProducts: productCount,
        totalCustomers: customerCount,
        totalOrders: orderCount,
        totalRevenue: revenue,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

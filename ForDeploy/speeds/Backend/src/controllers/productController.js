import Product from "../models/product.js";
import { cloudinary } from "../service/cloudinary.js";

export async function createProduct(req, res) {
  try {
    const productData = { ...req.body };
    console.log(req.files);
    console.log("Creating product with data:", productData);

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => {
        return file.path;
      });
    }

    const created = await Product.create(productData);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: created,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function updateProduct(req, res) {
  const { id } = req.params;
  try {
    const productData = { ...req.body };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));
    }

    const updated = await Product.findByIdAndUpdate(id, productData, {
      new: true,
    });
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function getProductById(req, res) {
  const item = await Product.findById(req.params.id);
  res.json({
    success: true,
    message: "Product fetched successfully",
    data: item,
  });
}

export async function getAllProducts(req, res) {
  const items = await Product.find();
  res.json({
    success: true,
    message: "Products fetched successfully",
    data: items,
  });
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted)
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  res.json({ success: true, message: "Product deleted", data: deleted });
}

export async function searchProductInAllProducts(req, res) {
  const query = req.query.query || "";
  const regex = new RegExp(query, "i");
  const items = await Product.find({
    $or: [
      { name: regex },
      { description: regex },
      { brand: regex },
      { sku: regex },
    ],
  });
  res.json({ success: true, message: "Search results", data: items });
}

export async function getProductsByCategoryId(req, res) {
  const items = await Product.find({ categoryId: req.params.categoryId });
  res.json({
    success: true,
    message: "Products fetched by categoryId",
    data: items,
  });
}

export async function getProductsBySubCategoryId(req, res) {
  const items = await Product.find({ subCategoryId: req.params.subCategoryId });
  res.json({
    success: true,
    message: "Products fetched by subCategoryId",
    data: items,
  });
}

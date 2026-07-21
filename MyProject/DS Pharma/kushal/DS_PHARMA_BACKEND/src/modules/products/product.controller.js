import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  deleteProductImageService,
  fetchProductsService,
  getProductDetailsService,
  uploadProductImageService,
} from "./product.service.js";

export const fetchProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 25, query = "" } = req.query;

  const { products, totalProducts, totalPages } = await fetchProductsService(
    page,
    limit,
    query.trim().toLowerCase()
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        totalProducts,
        page: Number(page),
        limit: Number(limit),
        totalPages: Number(totalPages),
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      "Products fetched successfully",
    ),
  );
});

export const getProductDetails = asyncHandler(async (req, res) => {
  const { rid } = req.params;

  const product = await getProductDetailsService(rid);

  res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product details fetched successfully"),
    );
});

export const uploadProductImage = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const { images } = req.body;

  const updatedProduct = await uploadProductImageService(String(rid), images);

  console.log('dakjsfhjkdshf',rid);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProduct,
        "Product image uploaded successfully",
      ),
    );
});

export const deleteProductImage = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const { images } = req.body;

  const updatedProduct = await deleteProductImageService(rid, images);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProduct,
        "Product image deleted successfully",
      ),
    );
});

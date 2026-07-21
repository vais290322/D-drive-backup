import ApiError from '../../utils/apiError.js';
import ApiResponse from '../../utils/apiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import {
  addCategoryToProductService,
  createProductRequestService,
  fetchExpiredProductsService,
  fetchExpiringProductsService,
  fetchFeaturedProductsService,
  fetchLowStockProductsService,
  fetchProductsByCategoryService,
  fetchProductsService,
  getProductDetailsService,
  updateProductDetailsService,
  updateRequestStatusService,
  fetchProductRequestsService,
} from './product.service.js';

export const fetchProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 25,
    query = '',
    sortBy = 'name',
    order = 1,
    stock = 2,
    minPrice = 0,
    maxPrice = '',
    is_deleted = '0',
  } = req.query;

  const {
    products,
    totalProducts,
    totalInventoryValue,
    totalPages,
    totalInStock,
    totalOutStock,
  } = await fetchProductsService(
    Number(page),
    Number(limit),
    query.trim().toLowerCase(),
    sortBy,
    Number(order),
    Number(stock),
    Number(minPrice),
    Number(maxPrice),
    is_deleted,
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        totalProducts,
        totalInventoryValue,
        totalInStock,
        totalOutStock,
        page: Number(page),
        limit: Number(limit),
        totalPages: Number(totalPages),
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      'Products fetched successfully',
    ),
  );
});

export const fetchProductsByCategory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 25, query = '' } = req.query;
  const { categoryId } = req.params;

  const { products, totalProducts, totalPages } =
    await fetchProductsByCategoryService(
      page,
      limit,
      query.trim().toLowerCase(),
      categoryId,
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
      'Products fetched successfully',
    ),
  );
});

export const getProductDetails = asyncHandler(async (req, res) => {
  const { rid } = req.params;

  const product = await getProductDetailsService(rid);

  res
    .status(200)
    .json(
      new ApiResponse(200, product, 'Product details fetched successfully'),
    );
});

export const fetchFeaturedProducts = asyncHandler(async (req, res) => {
  const { query = '' } = req.query;

  const products = await fetchFeaturedProductsService(
    query.trim().toLowerCase(),
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, products, 'Featured products fetched successfully'),
    );
});

export const updateProductDetails = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const { images, categoryId, isFeatured, hsn, taxRate } = req.body;
  
  console.log({ images, categoryId, isFeatured, hsn, taxRate })

  const updatedProduct = await updateProductDetailsService(
    rid,
    images,
    categoryId,
    Boolean(isFeatured),
    hsn,
    taxRate
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProduct,
        'Product details updated successfully',
      ),
    );
});

export const addCategoryToProduct = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const { categoryId } = req.body;

  const updatedProduct = await addCategoryToProductService(rid, categoryId);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProduct,
        'Category added to product successfully',
      ),
    );
});

export const fetchLowStockProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 25, query = '' } = req.query;

  const { lowStockProducts, totalProducts, totalPages } =
    await fetchLowStockProductsService(page, limit, query.trim().toLowerCase());
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        lowStockProducts,
        totalProducts,
        totalPages,
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      'Low stock products fetched successfully',
    ),
  );
});

export const fetchExpiringProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 25, days = 30, query = '' } = req.query;

  const { expiringProducts, totalProducts, totalPages } =
    await fetchExpiringProductsService(
      page,
      limit,
      days,
      query.trim().toLowerCase(),
    );
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        expiringProducts,
        totalProducts,
        totalPages,
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      'Expiring products fetched successfully',
    ),
  );
});

export const fetchExpiredProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 25, query = '' } = req.query;

  const { expiredProducts, totalProducts, totalPages } =
    await fetchExpiredProductsService(page, limit, query.trim().toLowerCase());
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        expiredProducts,
        totalProducts,
        totalPages,
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      'Expired products fetched successfully',
    ),
  );
});

export const createProductRequest = asyncHandler(async (req, res) => {
  const { productId, requestedBy, quantity, remarks } = req.body;

  if (!productId || !requestedBy)
    throw new ApiError(500, 'Product code and customer code is required');

  const request = await createProductRequestService({
    productId,
    requestedBy,
    quantity,
    remarks,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, request, 'Product request created'));
});

export const updateRequestStatus = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  if (!requestId) throw new ApiError(500, 'Request ID is required');

  const request = await updateRequestStatusService({ requestId, status });

  return res
    .status(200)
    .json(new ApiResponse(200, request, 'Request status updated'));
});

export const fetchProductRequests = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query = '', status = '' } = req.query;

  const { requests, totalRequests, totalPages, currentPage } =
    await fetchProductRequestsService({
      page: Number(page),
      limit: Number(limit),
      query: query.trim().toLowerCase(),
      status: status,
    });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        requests,
        totalRequests,
        page: Number(page),
        limit: Number(limit),
        totalPages: Number(totalPages),
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      "Product requests fetched successfully",
    ),
  );
});


import fs from 'fs';
import { uploadImage } from '../../config/vaisBucket.js';
import MargProducts from '../mastersync/marg_products.model.js';
import ProductInfo from './productInfo.model.js';
import ApiError from '../../utils/apiError.js';
import MargParties from '../mastersync/marg_parties.model.js';
import RequestedProduct from './requestedProduct.model.js';

export const fetchProductsService = async (
  page,
  limit,
  query = '',
  sortBy = 'name',
  order = 1,
  stock,
  minPrice = 0,
  maxPrice = 0,
) => {
  try {
    const parsedLimit = parseInt(limit);
    const skip = (page - 1) * parsedLimit;

    const allowedSortFields = ['name', 'MRP', 'stock', 'company'];
    const safeSortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';

    const baseMatch = {
      Is_Deleted: '0',
      ...(query && {
        $or: [
          {
            name: {
              $regex: `^${query}`,
              $options: 'i',
            },
          },
        ],
      }),
    };

    const priceFilter =
      minPrice > 0 || maxPrice > 0
        ? {
            $expr: {
              $and: [
                { $gte: [{ $toDouble: '$MRP' }, minPrice] },
                ...(maxPrice > 0 ? [{ $lte: [{ $toDouble: '$MRP' }, maxPrice] }] : []),
              ],
            },
          }
        : null;

    const result = await MargProducts.aggregate([
      { $match: baseMatch },
      ...(priceFilter ? [{ $match: priceFilter }] : []),
      {
        $facet: {
          // ---------------- PRODUCTS ----------------
          products: [
            ...(stock === 1
              ? [
                  {
                    $match: {
                      $expr: { $gt: [{ $toDouble: '$stock' }, 0] },
                    },
                  },
                ]
              : stock === 0
                ? [
                    {
                      $match: {
                        $expr: { $lte: [{ $toDouble: '$stock' }, 0] },
                      },
                    },
                  ]
                : []),

            { $sort: { [safeSortField]: order } },
            { $skip: skip },
            { $limit: parsedLimit },

            // Lookup AFTER pagination (very important)
            {
              $lookup: {
                from: 'productinfos',
                localField: 'rid',
                foreignField: 'rid',
                as: 'productInfoData',
              },
            },
            {
              $addFields: {
                images: {
                  $ifNull: [{ $arrayElemAt: ['$productInfoData.images', 0] }, []],
                },
                categoryId: {
                  $ifNull: [{ $arrayElemAt: ['$productInfoData.categoryId', 0] }, ''],
                },
                isFeatured: {
                  $ifNull: [{ $arrayElemAt: ['$productInfoData.isFeatured', 0] }, false],
                },
                hsn: {
                  $ifNull: [{ $arrayElemAt: ['$productInfoData.hsn', 0] }, ''],
                },
                taxRate: {
                  $ifNull: [{ $arrayElemAt: ['$productInfoData.taxRate', 0] }, ''],
                },
                hsnCode: {
                  $ifNull: [{ $arrayElemAt: ['$productInfoData.hsnCode', 0] }, ''],
                },
                description: {
                  $ifNull: [{ $arrayElemAt: ['$productInfoData.description', 0] }, ''],
                },
              },
            },
            {
              $project: {
                productInfoData: 0,
              },
            },
          ],

          // ---------------- TOTAL COUNT ----------------
          totalCount: [{ $count: 'total' }],

          // ---------------- GLOBAL IN-STOCK ----------------
          inStockCount: [
            {
              $match: {
                $expr: { $gt: [{ $toDouble: '$stock' }, 0] },
              },
            },
            { $count: 'total' },
          ],

          // ---------------- GLOBAL OUT-STOCK ----------------
          outStockCount: [
            {
              $match: {
                $expr: { $lte: [{ $toDouble: '$stock' }, 0] },
              },
            },
            { $count: 'total' },
          ],

          // ---------------- INVENTORY VALUE ----------------
          inventoryValue: [
            {
              $group: {
                _id: null,
                total: {
                  $sum: {
                    $multiply: [{ $toDouble: '$stock' }, { $toDouble: '$Prate' }],
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    const products = result[0]?.products || [];
    const totalProducts = result[0]?.totalCount[0]?.total || 0;
    const totalInStock = result[0]?.inStockCount[0]?.total || 0;
    const totalOutStock = result[0]?.outStockCount[0]?.total || 0;
    const totalInventoryValue = result[0]?.inventoryValue[0]?.total || 0;

    const totalPages = parsedLimit ? Math.ceil(totalProducts / parsedLimit) : 0;

    return {
      products,
      totalProducts,
      totalInStock,
      totalOutStock,
      totalInventoryValue,
      totalPages,
    };
  } catch (error) {
    throw error;
  }
};

export const getProductDetailsService = async rid => {
  try {
    const product = await MargProducts.aggregate([
      {
        $match: {
          rid,
        },
      },
      {
        $lookup: {
          from: 'productinfos',
          localField: 'rid',
          foreignField: 'rid',
          as: 'productInfoData',
        },
      },
      {
        $addFields: {
          images: {
            $ifNull: [{ $arrayElemAt: ['$productInfoData.images', 0] }, []],
          },
          categoryId: {
            $ifNull: [{ $arrayElemAt: ['$productInfoData.categoryId', 0] }, ''],
          },
          isFeatured: {
            $ifNull: [{ $arrayElemAt: ['$productInfoData.isFeatured', 0] }, false],
          },
          hsn: {
            $ifNull: [{ $arrayElemAt: ['$productInfoData.hsn', 0] }, ''],
          },
          taxRate: {
            $ifNull: [{ $arrayElemAt: ['$productInfoData.taxRate', 0] }, ''],
          },
          hsnCode: {
            $ifNull: [{ $arrayElemAt: ['$productInfoData.hsnCode', 0] }, ''],
          },
          description: {
            $ifNull: [{ $arrayElemAt: ['$productInfoData.description', 0] }, ''],
          },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $addFields: {
          categoryDetails: {
            $ifNull: [{ $arrayElemAt: ['$categoryDetails', 0] }, {}],
          },
        },
      },
      {
        $lookup: {
          from: 'hsns',
          localField: 'hsnCode',
          foreignField: '_id',
          as: 'hsnDetails',
        },
      },
      {
        $addFields: {
          hsnDetails: {
            $ifNull: [{ $arrayElemAt: ['$hsnDetails', 0] }, {}],
          },
        },
      },
      {
        $project: {
          productInfoData: 0,
          categoryId: 0,
          'categoryDetails.images': 0,
          hsnCode: 0,
        },
      },
    ]);

    console.log('product :: ', product);

    return product[0] || null;
  } catch (error) {
    console.error('Error in getProductDetailsService:', error);
    throw error;
  }
};

export const fetchProductsByCategoryService = async (
  page,
  limit,
  query = '',
  categoryId,
) => {
  try {
    const products = await MargProducts.aggregate([
      {
        $match: {
          $or: [{ name: { $regex: query, $options: 'i' } }],
          $or: [{ company: { $regex: query, $options: 'i' } }],
        },
      },
      {
        $lookup: {
          from: 'productinfos',
          localField: 'rid',
          foreignField: 'rid',
          as: 'productInfoData',
        },
      },
      {
        $addFields: {
          images: {
            $ifNull: [{ $arrayElemAt: ['$productInfoData.images', 0] }, []],
          },
          categoryId: {
            $ifNull: [{ $arrayElemAt: ['$productInfoData.categoryId', 0] }, ''],
          },
          isFeatured: {
            $ifNull: [{ $arrayElemAt: ['$productInfoData.isFeatured', 0] }, false],
          },
        },
      },
      {
        $match: {
          categoryId: categoryId,
        },
      },
      {
        $addFields: {
          categoryIdObject: {
            $cond: {
              if: { $ne: ['$categoryId', ''] },
              then: { $toObjectId: '$categoryId' },
              else: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryIdObject',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $addFields: {
          categoryDetails: {
            $ifNull: [{ $arrayElemAt: ['$categoryDetails', 0] }, {}],
          },
        },
      },
      {
        $project: {
          productInfoData: 0,
          categoryId: 0,
          categoryIdObject: 0,
          'categoryDetails.images': 0,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    // Count total products in this category matching the query
    const allCategoryProducts = await MargProducts.aggregate([
      {
        $match: {
          $or: [{ name: { $regex: query, $options: 'i' } }],
          $or: [{ company: { $regex: query, $options: 'i' } }],
        },
      },
      {
        $lookup: {
          from: 'productinfos',
          localField: 'rid',
          foreignField: 'rid',
          as: 'productInfoData',
        },
      },
      {
        $addFields: {
          categoryId: {
            $ifNull: [{ $arrayElemAt: ['$productInfoData.categoryId', 0] }, ''],
          },
        },
      },
      {
        $match: {
          categoryId: categoryId,
        },
      },
      {
        $count: 'total',
      },
    ]);

    const totalProducts = allCategoryProducts[0]?.total || 0;
    const totalPages = Math.ceil(totalProducts / limit);

    return { products, totalProducts, totalPages };
  } catch (error) {
    throw error;
  }
};

export const fetchFeaturedProductsService = async (query = '') => {
  try {
    const products = await ProductInfo.aggregate([
      {
        $match: {
          isFeatured: true,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'rid',
          foreignField: 'rid',
          as: 'productData',
        },
      },
      {
        $addFields: {
          productDetails: {
            $ifNull: [{ $arrayElemAt: ['$productData', 0] }, {}],
          },
        },
      },
      {
        $addFields: {
          categoryIdObject: {
            $cond: {
              if: { $ne: ['$categoryId', ''] },
              then: { $toObjectId: '$categoryId' },
              else: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryIdObject',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $addFields: {
          categoryDetails: {
            $ifNull: [{ $arrayElemAt: ['$categoryDetails', 0] }, {}],
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$productDetails',
              {
                images: '$images',
                categoryDetails: '$categoryDetails',
                isFeatured: '$isFeatured',
              },
            ],
          },
        },
      },
      {
        $project: {
          categoryIdObject: 0,
          'categoryDetails.images': 0,
        },
      },
    ]);

    return products;
  } catch (error) {
    throw error;
  }
};

export const updateProductDetailsService = async (
  rid,
  images,
  categoryId,
  isFeatured,
  hsn,
  taxRate,
) => {
  try {
    // const existedProduct = await ProductInfo.findOne({ rid });

    // if (!existedProduct) {
    //   await ProductInfo.create({
    //     rid,
    //     categoryId,
    //     images,
    //     isFeatured,
    //     hsn,
    //     taxRate,
    //   });

    //   return getProductDetailsService(rid);
    // }

    
    
    await ProductInfo.findOneAndUpdate(
      { rid },
      { images, categoryId, isFeatured, hsn, taxRate },
      { new: true },
    );

    return getProductDetailsService(rid);
  } catch (error) {
    console.error('Error in updateProductDetailsService:', error);
    throw error;
  }
};

export const uploadProductImageService = async (rid, images) => {
  try {
    console.log({ rid, images });

    for (const image of images) {
      const file = fs.createReadStream(image.path);

      await uploadImage(file);
    }
  } catch (error) {
    throw error;
  }
};

export const deleteProductImageService = async (rid, images) => {
  try {
    const updatedProduct = await ProductInfo.findOneAndUpdate(
      { rid },
      { images },
      { new: true },
    );

    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

export const addCategoryToProductService = async (rid, categoryId) => {
  try {
    const existingProduct = await ProductInfo.findOne({ rid });

    if (!existingProduct) {
      const newProductInfo = new ProductInfo({
        rid,
        categoryId,
      });
      await newProductInfo.save();

      return newProductInfo;
    }

    const updatedProductInfo = await ProductInfo.findOneAndUpdate(
      { rid },
      { categoryId },
      { new: true },
    );

    return updatedProductInfo;
  } catch (error) {
    throw error;
  }
};

export const fetchLowStockProductsService = async (page, limit, query) => {
  try {
    const result = await MargProducts.aggregate([
      {
        $match: {
          Is_Deleted: '0',
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { company: { $regex: query, $options: 'i' } },
            { code: { $regex: query, $options: 'i' } },
            { curbatch: { $regex: query, $options: 'i' } },
          ],
          $expr: {
            $and: [
              { $gt: [{ $toDouble: '$stock' }, 0] },
              { $lt: [{ $toDouble: '$stock' }, 20] },
            ],
          },
        },
      },
      {
        $sort: {
          stock: 1, // Sort by stock ascending (lowest first)
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    const totalCount = await MargProducts.countDocuments({
      Is_Deleted: '0',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } },
        { curbatch: { $regex: query, $options: 'i' } },
      ],
      $expr: {
        $and: [
          { $gt: [{ $toDouble: '$stock' }, 0] },
          { $lt: [{ $toDouble: '$stock' }, 20] },
        ],
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      lowStockProducts: result,
      totalProducts: totalCount,
      totalPages,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchExpiringProductsService = async (page, limit, days = 30, query) => {
  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    const result = await MargProducts.aggregate([
      {
        $match: {
          Is_Deleted: '0',
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { company: { $regex: query, $options: 'i' } },
            { code: { $regex: query, $options: 'i' } },
            { curbatch: { $regex: query, $options: 'i' } },
          ],
          $expr: {
            $gt: [{ $toDouble: '$stock' }, 0],
          },
          exp: { $ne: '' },
        },
      },
      {
        $addFields: {
          expDate: {
            $dateFromString: {
              dateString: '$exp',
              format: '%Y%m%d',
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $match: {
          expDate: {
            $ne: null,
            $lte: expiryDate,
            $gte: new Date(),
          },
        },
      },
      {
        $sort: {
          expDate: 1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
      {
        $project: {
          expDate: 0,
        },
      },
    ]);

    const totalCountResult = await MargProducts.aggregate([
      {
        $match: {
          Is_Deleted: '0',
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { company: { $regex: query, $options: 'i' } },
            { code: { $regex: query, $options: 'i' } },
            { curbatch: { $regex: query, $options: 'i' } },
          ],
          exp: { $ne: '' },
        },
      },
      {
        $addFields: {
          expDate: {
            $dateFromString: {
              dateString: '$exp',
              format: '%Y%m%d',
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $match: {
          expDate: {
            $ne: null,
            $lte: expiryDate,
            $gte: new Date(),
          },
        },
      },
      {
        $count: 'total',
      },
    ]);

    const totalCount = totalCountResult[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      expiringProducts: result,
      totalProducts: totalCount,
      totalPages,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchExpiredProductsService = async (page, limit, query) => {
  try {
    const result = await MargProducts.aggregate([
      {
        $match: {
          Is_Deleted: '0',
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { company: { $regex: query, $options: 'i' } },
            { code: { $regex: query, $options: 'i' } },
            { curbatch: { $regex: query, $options: 'i' } },
          ],
          $expr: {
            $gt: [{ $toDouble: '$stock' }, 0],
          },
          exp: { $ne: '' },
        },
      },
      {
        $addFields: {
          expDate: {
            $dateFromString: {
              dateString: '$exp',
              format: '%Y%m%d',
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $match: {
          expDate: {
            $ne: null,
            $lt: new Date(),
          },
        },
      },
      {
        $sort: {
          expDate: -1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
      {
        $project: {
          expDate: 0,
        },
      },
    ]);

    const totalCountResult = await MargProducts.aggregate([
      {
        $match: {
          Is_Deleted: '0',
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { company: { $regex: query, $options: 'i' } },
            { code: { $regex: query, $options: 'i' } },
            { curbatch: { $regex: query, $options: 'i' } },
          ],
          exp: { $ne: '' },
        },
      },
      {
        $addFields: {
          expDate: {
            $dateFromString: {
              dateString: '$exp',
              format: '%Y%m%d',
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $match: {
          expDate: {
            $ne: null,
            $lt: new Date(),
          },
        },
      },
      {
        $count: 'total',
      },
    ]);

    const totalCount = totalCountResult[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      expiredProducts: result,
      totalProducts: totalCount,
      totalPages,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createProductRequestService = async ({
  productId,
  requestedBy,
  quantity,
  remarks,
}) => {
  try {
    const product = await MargProducts.findOne({
      rid: productId,
    });

    if (!product) throw new ApiError(404, 'Invalid product code');

    const party = await MargParties.findOne({
      rid: requestedBy,
    });

    if (!party) throw new ApiError(404, 'Invalid party code');

    const request = await RequestedProduct.create({
      productId,
      requestedBy,
      quantity,
      remarks,
    });

    return request;
  } catch (error) {
    throw error;
  }
};

export const updateRequestStatusService = async ({ requestId, status }) => {
  try {
    const request = await RequestedProduct.findById(requestId);

    if (!request) throw new ApiError(404, 'Invalid request id');

    request.status = status;

    await request.save();

    return request;
  } catch (error) {
    throw error;
  }
};

export const fetchProductRequestsService = async ({
  page = 1,
  limit = 10,
  query,
  status,
}) => {
  try {
    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $addFields: {
          productIdStr: { $toString: '$productId' },
          requestedByStr: { $toString: '$requestedBy' },
        },
      },
      ...(status ? [{ $match: { status } }] : []),
      {
        $lookup: {
          from: 'marg_products',
          localField: 'productIdStr',
          foreignField: 'rid',
          as: 'product',
        },
      },
      {
        $unwind: {
          path: '$product',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'marg_parties',
          localField: 'requestedByStr',
          foreignField: 'rid',
          as: 'requestedByUser',
        },
      },
      {
        $unwind: {
          path: '$requestedByUser',
          preserveNullAndEmptyArrays: true,
        },
      },
      ...(query
        ? [
            {
              $match: {
                $or: [
                  { 'product.name': { $regex: query, $options: 'i' } },
                  { 'requestedByUser.name': { $regex: query, $options: 'i' } },
                  { remarks: { $regex: query, $options: 'i' } },
                ],
              },
            },
          ]
        : []),
      {
        $facet: {
          requests: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: parseInt(limit) },
          ],
          totalCount: [{ $count: 'total' }],
        },
      },
    ];

    const result = await RequestedProduct.aggregate(pipeline);

    const requests = result[0]?.requests || [];
    const totalRequests = result[0]?.totalCount[0]?.total || 0;
    const totalPages = Math.ceil(totalRequests / limit);

    return {
      requests,
      totalRequests,
      totalPages,
      currentPage: parseInt(page),
    };
  } catch (error) {
    throw error;
  }
};

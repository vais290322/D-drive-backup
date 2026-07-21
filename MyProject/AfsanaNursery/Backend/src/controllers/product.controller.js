import { uploadProductPermission } from "../helpers/permission.js";
import { ProductModel } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { categoryModel } from "../models/category.model.js";

const uploadProductController = asyncHandler(async (req, res) => {
    try {
        const sessionUser = req.userId;
        if (!uploadProductPermission(sessionUser)) {
            throw new ApiError(403, "permission denied");
        }
        const uploadProduct = new ProductModel(req.body);
        const saveProduct = await uploadProduct.save();
        res.status(200).json(
            new ApiResponse(200, saveProduct, "product upload sucessfull")
        );
    } catch (error) {
        throw new ApiError(
            400,
            error?.message || "product upload not sucessfull "
        );
    }
});

const updateProductController = asyncHandler(async (req, res) => {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new ApiError(403, "permission denied");
        }
        const { _id, ...resBody } = req.body;
        const updateProduct = await ProductModel.findByIdAndUpdate(
            _id,
            resBody
        );
        res.status(200).json(
            new ApiResponse(200, updateProduct, "product update sucessfull")
        );
    } catch (error) {
        throw new ApiError(
            400,
            error?.message || "product update not sucessfull "
        );
    }
});

const deleteProductController = asyncHandler(async (req, res) => {
    try {
        // Check user permissions
        // if (!uploadProductPermission(req.userId)) {
        //     throw new ApiError(403, "Permission denied");
        // }

        // Extract product ID from the request
        const { _id } = req.body;
        if (!_id) {
            throw new ApiError(400, "Product ID is required for deletion");
        }

        // Find and delete the product
        const deletedProduct = await ProductModel.findByIdAndDelete(_id);
        if (!deletedProduct) {
            throw new ApiError(404, "Product not found");
        }

        res.status(200).json(
            new ApiResponse(200, deletedProduct, "Product deleted successfully")
        );
    } catch (error) {
        throw new ApiError(
            400,
            error?.message || "Product deletion not successful"
        );
    }
});

const searchProductController = asyncHandler(async (req, res) => {
    try {
        const query = req.query.q;
        const regx = new RegExp(query, "i", "g");
        const searchProduct = await ProductModel.find({
            $or: [{ productName: regx }, { category: regx }],
        });

        res.status(200).json(
            new ApiResponse(200, searchProduct, "product search sucessfull")
        );
    } catch (error) {
        throw new ApiError(
            400,
            error?.message || "product search not sucessfull "
        );
    }
});

const getProductDetailsController = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await ProductModel.findById(productId);

        res.status(200).json(new ApiResponse(200, product, "product details"));
    } catch (error) {
        throw new ApiError(
            400,
            error?.message || "product details not be fetched "
        );
    }
});

const getProductController = asyncHandler(async (req, res) => {
    try {
        const allProduct = await ProductModel.find().sort({ createdAt: -1 });
        res.status(200).json(
            new ApiResponse(
                200,
                allProduct,
                "get all product fetched sucessfull"
            )
        );
    } catch (error) {
        throw new ApiError(
            400,
            error?.message || "get product not be fetched "
        );
    }
});

const getCategoryWiseProductController = asyncHandler(async (req, res) => {
    try {
        const { category } = req.body || req?.query;

        const product = await ProductModel.find({ category: category });

        res.status(200).json(
            new ApiResponse(
                200,
                product,
                "category wise product fetched sucessfull"
            )
        );
    } catch (error) {
        throw new ApiError(
            400,
            error?.message || "category wise product not be fetched "
        );
    }
});

const getCategoryProductOneController = asyncHandler(async (req, res) => {
    try {
        const productCategory = await ProductModel.distinct("category");
        // console.log("productCategory",productCategory);

        // array to sotre one product from each category

        const productByCategory = [];

        for (const category of productCategory) {
            const product = await ProductModel.findOne({ category: category });

            if (product) {
                productByCategory.push(product);
            }
        }

        res.status(200).json(
            new ApiResponse(
                200,
                productByCategory,
                "get category product one fetched sucessfull"
            )
        );
    } catch (error) {
        throw new ApiError(
            400,
            error?.message || "get category product one not be fetched "
        );
    }
});

const filterProductController = asyncHandler(async (req, res) => {
    try {
        const categoryList = req?.body?.category || [];

        const product = await ProductModel.find({
            category: {
                $in: categoryList,
            },
        });

        res.status(200).json(
            new ApiResponse(200, product, "filter product fetched sucessfull")
        );
    } catch (error) {
        throw new ApiError(
            400,
            error?.message || "filter product not be fetched "
        );
    }
});

const productCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;

        // Validation
        if (!name) {
            return res
                .status(400)
                .json({ success: false, message: "Category name is required" });
        }

        // Check if category already exists
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res
                .status(400)
                .json({ success: false, message: "Category already exists" });
        }

        const newCategory = new categoryModel({ name });
        await newCategory.save();

        res.status(201).json({
            success: true,
            newCategory,
            message: "Category added successfully",
        });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

const fetchCategory = asyncHandler(async (req, res) => {
    try {
        const categories = await categoryModel.find();
        res.status(200).json({ success: true, categories });
    } catch (error) {
        // console.error("Error fetching categories:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

const fetchAllProduct = asyncHandler(async(req,res)=>{
    try {
        const allProduct = await ProductModel.find().sort({ createdAt: -1 });
        // console.log("allProduct data ", allProduct);
        res.status(200).json({ success: true, allProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
})

const advanceSearchProductController = asyncHandler(async (req, res) => {
  try {
   

    const { query } = req.query;
 // -------------------- PIPELINE START --------------------
    const aggregationPipeline = [
      {
        // Stage 1: Full-text search using MongoDB Atlas Search
        $search: {
          index: "product_search",   // must match the index name in Atlas
          autocomplete: {
            query: query,  // user input (e.g. "lap")
            path: "productName", // search in both fields
            fuzzy: {
              maxEdits: 2,      // allow up to 2 typos (e.g. "laptpo" -> "laptop")
              prefixLength: 3,  // first 3 chars must match exactly
              maxExpansions: 10 // max number of variations to consider
            }
          }
        }
      },
      {
        // Stage 2: Select only the fields we want to return
        $project: {
          _id: 1,
          productName: 1,
          category: 1,
        //   description: 1 // keep description since we’re searching on it
        }
      },
      {
        // Stage 3: Limit total results to avoid huge response
        $limit: 20
      },
      {
        // Stage 4: Group results by category
        $group: {
          _id: "$category",        // group by category field
          products: { $push: "$$ROOT" } // push full product docs into array
        }
      },
      {
        // Stage 5: Remove groups with null category
        $match: { _id: { $ne: null } }
      },
      {
        // Stage 6: Break "products" array back into individual docs
        $unwind: "$products"
      },
      {
        // Stage 7: Final limit for the grouped results
        $limit: 6
      }
    ];
    // -------------------- PIPELINE END --------------------

    // Execute aggregation query
    const result = await ProductModel.aggregate(aggregationPipeline);

    // Send response
    res.status(200).json({
      success: true,
      data: result,
      message: "Advance search products fetched successfully"
    });

  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});



// -------------------- CONTROLLER --------------------
const advanceSearchProductController1 = asyncHandler(async (req, res) => {
  try {
    const { query } = req.query; // Get user's search query from URL params
    const aggregationPipeline = [
      {
        // Stage 1: Atlas Search across productName + description
        $search: {
          index: "product-search", // must match your Atlas index name
          compound: {
            should: [
              {
                autocomplete: {
                  query: query,   // user input
                  path: "productName",     // search productName
                  fuzzy: {
                    maxEdits: 2,          // allow 2 typos
                    prefixLength: 3,      // first 3 chars must match
                    maxExpansions: 10
                  }
                }
              },
              {
                autocomplete: {
                  query: req.body.query,   // same user input
                  path: "description",     // also search description
                  fuzzy: {
                    maxEdits: 2,
                    prefixLength: 3,
                    maxExpansions: 10
                  }
                }
              }
            ]
          }
        }
      },
      {
        // Stage 2: Select only required fields
        $project: {
          _id: 1,
          productName: 1,
          category: 1,
          description: 1
        }
      },
      {
        // Stage 3: Limit to 20 matches for performance
        $limit: 20
      },
      {
        // Stage 4: Group by category
        $group: {
          _id: "$category",
          products: { $push: "$$ROOT" }
        }
      },
      {
        // Stage 5: Remove null categories
        $match: { _id: { $ne: null } }
      },
      {
        // Stage 6: Flatten grouped products
        $unwind: "$products"
      },
      {
        // Stage 7: Final limit
        $limit: 6
      }
    ];

    // Execute pipeline
    const result = await ProductModel.aggregate(aggregationPipeline);

    res.status(200).json({
      success: true,
      data: result,
      message: "Advance search products fetched successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});




export {
    uploadProductController,
    updateProductController,
    deleteProductController,
    searchProductController,
    getProductDetailsController,
    getProductController,
    getCategoryWiseProductController,
    advanceSearchProductController,
    getCategoryProductOneController,
    filterProductController,
    productCategory,
    fetchCategory,
    fetchAllProduct
};

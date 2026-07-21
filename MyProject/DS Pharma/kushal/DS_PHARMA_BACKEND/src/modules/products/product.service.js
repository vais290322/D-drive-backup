import ProductImage from "./productImage.model.js";
import ProN from "./proN.model.js";

export const fetchProductsService = async (page, limit, query = "") => {
  try {
    const products = await ProN.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { address: { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $lookup: {
          from: "productimages",
          localField: "rid",
          foreignField: "rid",
          as: "imageData",
        },
      },
      {
        $addFields: {
          images: {
            $ifNull: [{ $arrayElemAt: ["$imageData.images", 0] }, []],
          },
        },
      },
      {
        $project: {
          imageData: 0,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    const totalProducts = await ProN.countDocuments({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
      ],
    });
    const totalPages = Math.ceil(totalProducts / limit);

    return { products, totalProducts, totalPages };
  } catch (error) {
    throw error;  
  }
};

export const getProductDetailsService = async (rid) => {
  try {
    const product = await ProN.aggregate([
      {
        $match: {
          rid,
        },
      },
      {
        $lookup: {
          from: "productimages",
          localField: "rid", // lowercase
          foreignField: "rid", // lowercase
          as: "imageData",
        },
      },
      {
        $addFields: {
          images: {
            $ifNull: [{ $arrayElemAt: ["$imageData.images", 0] }, []],
          },
        },
      },
      {
        $project: {
          imageData: 0,
        },
      },
    ]);

    return product[0] || null;
  } catch (error) {
    console.error("Error in getProductDetailsService:", error);
    throw error;
  }
};

export const uploadProductImageService = async (rid, images) => {
  try {
    console.log({ rid, images });

    const existingImages = await ProductImage.findOne({ rid });

    if (!existingImages) {
      const newProductImage = new ProductImage({
        rid,
        images,
      });
      await newProductImage.save();

      console.log(newProductImage);

      return newProductImage;
    }

    const updatedProduct = await ProductImage.findOneAndUpdate(
      { rid },
      { images: [...existingImages.images, ...images] },
      { new: true },
    );

    console.log(updatedProduct);
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

export const deleteProductImageService = async (rid, images) => {
  try {
    const updatedProduct = await ProductImage.findOneAndUpdate(
      { rid },
      { images },
      { new: true },
    );

    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

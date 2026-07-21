const config = {
  productBaseUrl: `${import.meta.env.VITE_MEDIA_CLOUD_BASE_URL}/api/v1/products`,
  withoutPaginationProductBaseUrl: `${import.meta.env.VITE_URL}/productusersearch`,
  categoryBaseUrl: `${import.meta.env.VITE_URL}/category`,
  featuredBaseUrl: `${import.meta.env.VITE_MEDIA_CLOUD_BASE_URL}/api/v1/products/featured`,
};

export const productUrl = {
  getAllProducts: `${config.productBaseUrl}`,
  createProduct: `${config.productBaseUrl}`,
  updateProduct: `${config.productBaseUrl}`,
  updateImages: (id) => `${config.productBaseUrl}/${id}`,
  deleteProduct: `${config.productBaseUrl}`,
  withoutPagination: `${config.withoutPaginationProductBaseUrl}`,
};

export const featuredProductUrl = {
  getFeaturedProducts: `${config.featuredBaseUrl}`,
  addFeaturedProduct: `${config.featuredBaseUrl}`,
  removeFeaturedProduct: `${config.featuredBaseUrl}`,
};

export const categoryUrl = {
  getAllCategories: `${config.categoryBaseUrl}`,
};

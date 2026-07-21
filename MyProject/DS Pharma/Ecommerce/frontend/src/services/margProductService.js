import axios from "axios";

const apiurl = import.meta.env.VITE_MEDIA_CLOUD_BASE_URL;

const MARG_API_URL = `${apiurl}/api/v1/products`;

/**
 * Normalizes raw Marg product data into UI model
 */
export const normalizeMargProduct = (raw) => {
  return {
    id: raw._id || raw.rid,
    name: (raw.name || "").trim(),
    company: (raw.company || "").trim(),
    mrp: parseFloat(raw.MRP) || 0,
    purchaseRate: parseFloat(raw.PRate) || 0,
    sellingRate: parseFloat(raw.Rate) || 0,
    stock: parseFloat(raw.stock) || 0,
    expiry: (raw.exp || "").trim() || "N/A",
    code: raw.code,
    salt: (raw.Salt || "").trim(),
    images: Array.isArray(raw.images) ? raw.images : [],
    rid: raw.rid,


  };
};

export const margProductService = {
  /**
   * Fetch products from Marg ERP API with pagination support
   * @param {Object} params - { page, limit, search }
   */
  getProducts: async ({ page = 1, limit = 50, search = "" } = {}) => {
    try {
      const response = await axios.get(MARG_API_URL, {
        params: { page, limit, search },
      });

      console.log("response : ",response)

      // console.log("[MargProductService] Response:", response.data);

      const rawData = response.data;
      const productsData =
        rawData.data?.products || rawData.data || rawData.products || [];
      const total =
        rawData.data?.total || rawData.total || productsData.length || 0;
      const totalPages =
        rawData.data?.totalPages ||
        rawData.totalPages ||
        Math.ceil(total / limit) ||
        1;

      const normalized = Array.isArray(productsData)
        ? productsData.map(normalizeMargProduct)
        : [];

      return {
        products: normalized,
        total,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      console.error("[MargProductService] Fetch Error:", error);
      throw error;
    }
  },
};

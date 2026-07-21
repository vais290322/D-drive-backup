import apiClient from "./api/apiClient";
import { API_ENDPOINTS } from "./api/baseURL";

const marqueeService = {
  /**
   * Add a new marquee message
   * @param {string} message - The message text
   * @returns {Promise<Object>} The created message
   */
  addMessage: async (data) => {
    const content =
      typeof data === "string"
        ? data
        : data.title || data.message || data.heading;
    const isVisible = typeof data === "object" ? data.isVisible : true;
    const color = typeof data === "object" ? data.color : "#e94242";
    const speed = typeof data === "object" ? data.speed : "medium";

    const response = await apiClient.post(API_ENDPOINTS.ADD_HEADING, {
      title: content,
      color: color,
      speed: speed,
      active: isVisible,
    });
    return response.data;
  },

  /**
   * Get all marquee messages for admin
   * @returns {Promise<Array>} List of all messages
   */
  getMessages: async (options = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_HEADINGS, options);
      const data = response.data.data || response.data || [];

      // Deduplicate by ID and Content
      const seen = new Set();
      const uniqueData = data.filter((item) => {
        const id = item._id || item.id;
        const content = (item.title || item.message || item.heading || "")
          .trim()
          .toLowerCase();
        if (seen.has(content) || (id && seen.has(id))) return false;
        if (id) seen.add(id);
        if (content) seen.add(content);
        return true;
      });

      const mappedData = uniqueData.map((item) => ({
        ...item,
        isVisible: item.active !== false,
      }));

      // Cache for fallback
      localStorage.setItem(
        "ds-pharma-marquee-cache",
        JSON.stringify(mappedData),
      );
      return mappedData;
    } catch (error) {
      if (error.name === "CanceledError") throw error;
      console.error("Failed to fetch marquee messages, using cache:", error);
      const cached = localStorage.getItem("ds-pharma-marquee-cache");
      return cached ? JSON.parse(cached) : [];
    }
  },

  /**
   * Get visible marquee messages for website
   * @returns {Promise<Array>} List of visible messages
   */
  getVisibleMessages: async (options = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_HEADINGS, options);
      const data = response.data.data || response.data || [];

      // Deduplicate and Filter
      const seen = new Set();
      const uniqueData = data.filter((item) => {
        const id = item._id || item.id;
        const content = (item.title || item.message || item.heading || "")
          .trim()
          .toLowerCase();
        if (seen.has(content) || (id && seen.has(id))) return false;
        if (id) seen.add(id);
        if (content) seen.add(content);
        return true;
      });

      const visibleData = uniqueData
        .filter((item) => item.active !== false)
        .map((item) => ({
          ...item,
          isVisible: true,
        }));

      // Cache for fallback
      localStorage.setItem(
        "ds-pharma-marquee-visible-cache",
        JSON.stringify(visibleData),
      );
      return visibleData;
    } catch (error) {
      if (error.name === "CanceledError") throw error;
      console.error(
        "Failed to fetch visible marquee messages, using cache:",
        error,
      );
      const cached = localStorage.getItem("ds-pharma-marquee-visible-cache");
      return cached ? JSON.parse(cached) : [];
    }
  },

  /**
   * Toggle visibility of a marquee message
   * @param {string} id - Message ID
   * @param {Object} currentData - The current message object
   * @returns {Promise<Object>} Updated message
   */
  toggleVisibility: async (id, currentData) => {
    const response = await apiClient.put(API_ENDPOINTS.UPDATE_HEADING(id), {
      title: currentData.title || currentData.message || currentData.heading,
      color: currentData.color,
      speed: currentData.speed,
      active: !currentData.isVisible,
    });
    return response.data;
  },

  /**
   * Update a marquee message
   * @param {string} id - Message ID
   * @param {Object} data - Updated message data
   * @returns {Promise<Object>} Updated message
   */
  updateMessage: async (id, data) => {
    const content = data.title || data.heading || data.message;
    const response = await apiClient.put(API_ENDPOINTS.UPDATE_HEADING(id), {
      title: content,
      color: data.color,
      speed: data.speed,
      active: data.isVisible !== false,
    });
    return response.data;
  },

  /**
   * Delete a marquee message
   * @param {string} id - Message ID
   * @returns {Promise<Object>} Success status
   */
  deleteMessage: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.DELETE_HEADING(id));
    return response.data;
  },
};

export default marqueeService;

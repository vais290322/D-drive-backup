import { authService } from "@/services/authService";

/**
 * Customer Service (Admin)
 */
export const customerService = {
  /**
   * Get all customers from backend and apply client-side search
   * @param {Object} params { search: string }
   */
  getCustomers: async (params) => {
    try {
      const response = await authService.getAdminCustomers();
      const allUsers = response.data || response || [];

      if (!Array.isArray(allUsers)) {
        console.warn("customerService.getCustomers: Expected array, got:", typeof allUsers);
        return [];
      }

      let filtered = allUsers;
      const { search } = params || {};

      if (search) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter((u) => {
          const name = u?.name || "";
          const email = u?.email || "";
          const phone = u?.phone || "";
          return (
            name.toLowerCase().includes(lowerSearch) ||
            email.toLowerCase().includes(lowerSearch) ||
            phone.toLowerCase().includes(lowerSearch)
          );
        });
      }

      // Transform backend users to UI customer format
      return filtered.map((u) => ({
        id: u._id || u.id,
        name: u.name || 'Unknown',
        email: u.email || 'N/A',
        phone: u.phone || 'N/A',
        joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A',
        orders: u.ordersCount || u.orders?.length || 0,
        totalSpent: u.totalSpent || 0,
        status: u.status || "Active",
        profileImage: u.profileImage || u.image
      }));
    } catch (error) {
      console.error("customerService.getCustomers error:", error);
      throw error;
    }
  },

  /**
   * Get single customer details
   * @param {string} id 
   */
  getCustomer: async (id) => {
    try {
      // For now, we fetch all and find the specific one 
      // since there isn't a dedicated getCustomerById admin route mentioned
      const response = await authService.getAdminCustomers();
      const allUsers = response.data || response || [];
      const user = allUsers.find(u => (u._id || u.id) === id);

      if (!user) throw new Error("Customer not found");

      return {
        id: user._id || user.id,
        name: user.name || 'Unknown',
        email: user.email || 'N/A',
        phone: user.phone || 'N/A',
        joined: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Jan 2024',
        orders: user.ordersCount || user.orders?.length || 0,
        totalSpent: user.totalSpent || 0,
        status: user.status || "Active",
        recentOrders: (user.orders || []).slice(0, 5),
        address: user.address || "N/A"
      };
    } catch (error) {
      console.error("customerService.getCustomer error:", error);
      throw error;
    }
  }
};

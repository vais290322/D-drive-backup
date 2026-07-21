// Address Service - Global Store Sync Mode
// ============================================================
// Updated to use useDataStore as the single source of truth

import useDataStore from "@/store/useDataStore";

// Simulate async API call delay for realistic UX
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const addressService = {
  // Fetch all addresses
  fetchAddresses: async () => {
    await delay(300);
    const addresses = useDataStore.getState().addresses;
    return { data: addresses };
  },

  // Fetch address by ID
  fetchAddressById: async (id) => {
    await delay(200);
    const addresses = useDataStore.getState().addresses;
    const address = addresses.find((addr) => addr.id === id);
    return { data: address || null };
  },

  // Add new address
  addAddress: async (addressData) => {
    await delay(400);
    useDataStore.getState().addAddress(addressData);
    // Get the newly added address (usually it will have a new ID)
    const addresses = useDataStore.getState().addresses;
    return { data: addresses[addresses.length - 1] };
  },

  // Update address
  updateAddress: async (id, addressData) => {
    await delay(400);
    useDataStore.getState().updateAddress(id, addressData);
    const updatedAddress = useDataStore
      .getState()
      .addresses.find((a) => a.id === id);
    return { data: updatedAddress };
  },

  // Delete address
  deleteAddress: async (id) => {
    await delay(300);
    useDataStore.getState().deleteAddress(id);
    return { data: { success: true, id } };
  },
};

export default addressService;

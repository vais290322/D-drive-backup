import {
  addAddressService,
  getAddressesService,
  updateAddressService,
  deleteAddressService,
  setDefaultAddressService,
  getDefaultAddressService,
} from "./address.service.js";

// Add new address
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const newAddress = await addAddressService(userId, req.body);
    res
      .status(201)
      .json({ message: "Address added successfully", data: newAddress });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Get all addresses for user
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await getAddressesService(userId);
    res
      .status(200)
      .json({ message: "Addresses fetched successfully", data: addresses });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;
    const userId = req.user.id;
    const address = await updateAddressService(addressId, userId, req.body);
    res
      .status(200)
      .json({ message: "Address updated successfully", data: address });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;
    const userId = req.user.id;
    await deleteAddressService(addressId, userId);
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Set default address
export const setaddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updatedAddress = await setDefaultAddressService(id, userId, req.body);
    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

// Get default address for user
export const getAddressesbyuser = async (req, res) => {
  try {
    const userId = req.user.id;
    const address = await getDefaultAddressService(userId);
    res
      .status(200)
      .json({ message: "Addresses fetched successfully", data: address });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

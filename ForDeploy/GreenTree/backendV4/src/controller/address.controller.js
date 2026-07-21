const Address = require("../models/address.models");
const Register = require("../models/register.models");

// Add new address
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, city, state, postalCode, street, district, landmark, isDefault } = req.body;

    const existingAddress = await Register.findOne({ _id: userId });

    if (!existingAddress.name || !existingAddress.email || existingAddress.name.length > 3 || existingAddress.email.length > 3 ) {
      return res.status(400).json({ message: "Please Update Your Profile" });
    }

    // Check if user already has any addresses
    const addressCount = await Address.countDocuments({ user: userId });

    // If this is the first address, set isDefault to true
    const setDefault = addressCount === 0 ? true : !!isDefault;

    console.log(req.body);
    const newAddress = new Address({
      user: userId,
      // name,
      // phone,
      address,
      city,
      state,
      postalCode,
      street,
      district,
      landmark,
      isDefault: setDefault
    });
    await newAddress.save();
    res.status(201).json({ message: "Address added successfully", data: newAddress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all addresses for user
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ user: userId });
    res.status(200).json({ message: "Addresses fetched successfully", data: addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.user.id;
    const updateData = req.body;
    const address = await Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      updateData,
      { new: true, runValidators: true }
    );
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.status(200).json({ message: "Address updated successfully", data: address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.user.id;
    const data = await Address.findOne({ _id: addressId, user: userId , isDefault: true });
    if (data) {
      return res.status(400).json({ message: "Cannot delete delivery address" }); 
    }
    const address = await Address.findOneAndDelete({ _id: addressId, user: userId });
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setaddress = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;
  
      // If making this address default, unset others
      if (updateData.isDefault) {
        await Address.updateMany({ user: userId }, { isDefault: false });
      }
  
      const updatedAddress = await Address.findByIdAndUpdate(id, updateData, { new: true });
  
      res.status(200).json({
        success: true,
        message: "Address updated successfully",
        data: updatedAddress,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  

  exports.getAddressesbyuser = async (req, res) => {
    try {
      const userId = req.user.id;
      const addresses = await Address.findOne({ user: userId , isDefault: true });
      res.status(200).json({ message: "Addresses fetched successfully", data: addresses });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
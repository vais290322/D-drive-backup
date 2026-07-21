import Address from './address.model.js';
import Party from '../party/party.model.js';

export const addAddressService = async (userId, body) => {
  const {
    name,
    phone,
    address,
    city,
    state,
    postalCode,
    street,
    district,
    landmark,
    isDefault,
  } = body;

  const addressCount = await Address.countDocuments({ user: userId });
  const setDefault = addressCount === 0 ? true : !!isDefault;

  const newAddress = new Address({
    user: userId,
    name,
    phone,
    address,
    city,
    state,
    postalCode,
    street,
    district,
    landmark,
    isDefault: setDefault,
  });

  await newAddress.save();
  return newAddress;
};

export const getAddressesService = async userId => {
  const addresses = await Address.find({ user: userId });
  return addresses;
};

export const updateAddressService = async (addressId, userId, updateData) => {
  const address = await Address.findOneAndUpdate(
    { _id: addressId, user: userId },
    updateData,
    { new: true, runValidators: true },
  );

  if (!address) {
    const error = new Error('Address not found');
    error.statusCode = 404;
    throw error;
  }

  return address;
};

export const deleteAddressService = async (addressId, userId) => {
  const isDefault = await Address.findOne({
    _id: addressId,
    user: userId,
    isDefault: true,
  });

  const address = await Address.findOneAndDelete({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    const error = new Error('Address not found');
    error.statusCode = 404;
    throw error;
  }

  return address;
};

export const setDefaultAddressService = async (
  addressId,
  userId,
  updateData,
) => {
  if (updateData.isDefault) {
    await Address.updateMany({ user: userId }, { isDefault: false });
  }

  const updatedAddress = await Address.findByIdAndUpdate(
    addressId,
    updateData,
    { new: true },
  );
  return updatedAddress;
};

export const getDefaultAddressService = async userId => {
  const address = await Address.findOne({ user: userId, isDefault: true });
  return address;
};

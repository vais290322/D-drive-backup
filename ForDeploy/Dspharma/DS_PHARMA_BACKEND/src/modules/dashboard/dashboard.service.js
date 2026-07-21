import Party from "../party/party.model.js";
import ProN from "../products/proN.model.js";

export const fetchCustomerDashboardDataService = async () => {
  try {
    const customerData = await Party.find();

    return customerData;
  } catch (error) {
    throw new Error(error.message);
  }
};



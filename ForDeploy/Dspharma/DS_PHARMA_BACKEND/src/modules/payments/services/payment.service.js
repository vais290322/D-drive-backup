import phonePeClient from '../../config/phonePe';
import ApiError from '../../utils/apiError';
import { paymentRequest } from '../utils/paymentRequest';

export const createPhonepeOrderService = async amount => {
  try {
    if (!amount || amount <= 0) {
      throw new ApiError(400, 'Invalid amount');
    }

    const request = paymentRequest();

    const response = await phonePeClient.getClient().pay(request);

    return response;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const createPhonepeSDKOrderService = async amount => {
  try {
    if (!amount || amount <= 0) {
      throw new ApiError(400, 'Invalid amount');
    }

    const request = paymentRequest();

    const response = await phonePeClient.getClient().createSdkOrder(request);

    return response;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const checkPhonepeOrderStatusService = async merchantOrderId => {
  try {
    if (!merchantOrderId) {
      throw new ApiError(400, 'Invalid merchantOrderId');
    }

    const response = await phonePeClient
      .getClient()
      .getOrderStatus(merchantOrderId);

    return response;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

import ApiResponse from '../../utils/apiResponse';
import asyncHandler from '../../utils/asyncHandler';
import {
  checkPhonepeOrderStatusService,
  createPhonepeOrderService,
  createPhonepeSDKOrderService,
} from '../services/payment.service';

export const createPhonepeOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  const data = await createPhonepeOrderService(amount);

  return res
    .status(200)
    .json(new ApiResponse(200, data, 'PhonePe order created successfully'));
});

export const createPhonepeOrderSDK = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  const data = await createPhonepeSDKOrderService(amount);

  return res
    .status(200)
    .json(new ApiResponse(200, data, 'PhonePe order created successfully'));
});

export const checkPhonepeOrderStatus = asyncHandler(async (req, res) => {
  const { merchantOrderId } = req.params;

  const data = await checkPhonepeOrderStatusService(merchantOrderId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, data, 'PhonePe order status fetched successfully'),
    );
});

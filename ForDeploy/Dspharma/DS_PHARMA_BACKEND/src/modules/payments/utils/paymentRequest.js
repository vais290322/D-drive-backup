import { MetaInfo, StandardCheckoutPayRequest } from 'pg-sdk-node';
import { randomUUID } from 'crypto';
import { phonepeDetails } from '../../config/credentials';

export const paymentRequest = () => {
  const merchantOrderId = `ORDER_${randomUUID()}`;
  const redirectUrl = `${phonepeDetails.redirectUrl}?orderId=${merchantOrderId}`;
  const metaInfo = MetaInfo.builder()
    .udf1('udf1')
    .udf2('udf2')
    .udf3('udf3')
    .build();

  const request = StandardCheckoutPayRequest.builder()
    .merchantOrderId(merchantOrderId)
    .amount(amount * 100)
    .metaInfo(metaInfo)
    .redirectUrl(redirectUrl)
    .expireAfter(3600)
    .message('Message that will be shown for UPI collect transaction')
    .build();

  return request;
};

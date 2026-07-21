import { margClient } from './margClient.js';
import { makeRequest } from './margRequest.js';

export const fetchMasterData = async (datetime = '', index = 0) => {
  const payload = {
    ...margClient,
    Datetime: datetime,
    Index: index.toString(),
  };

  return makeRequest('MargMST2017', payload);
};

export const fetchMasterOrderDispatchData = async (
  datetime = '',
  index = 0,
  salesManId = '',
  type = 'S',
) => {
  console.log('datetime', datetime);

  const payload = {
    ...margClient,
    Datetime: datetime,
    Index: index.toString(),
    SalesManID: salesManId,
    Type: type,
  };

  return makeRequest('LiveOrderDispatchStatus2017', payload);
};

export const fetchMasterOrderData = async (
  salesManId = '',
  type = 'S',
  data,
) => {
  const payload = {
    MargID: Number(margClient.MargID),
    CompanyCode: margClient.CompanyCode,
    Sid: Number(salesManId),
    Type: type,
    OrderFrom: margClient.CompanyCode,
    ...data,
  };

  return makeRequest('InsertOrderDetail', payload);
};

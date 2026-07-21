import { margClient } from "./margClient.js";
import { makeRequest } from "./margRequest.js";

export const fetchMasterData = async (datetime = "", index = 0) => {
  console.log("fetchMasterData");

  const payload = {
    ...margClient,
    Datetime: datetime,
    Index: index.toString(),
  };

  return makeRequest("MargMST2017", payload);
};

export const fetchMasterOrderDispatchData = async (
  datetime = "",
  index = 0,
  salesManId = "",
  type = "S",
) => {
  console.log("datetime", datetime);

  const payload = {
    ...margClient,
    Datetime: datetime,
    Index: index.toString(),
    SalesManID: salesManId,
    Type: type,
  };

  return makeRequest("LiveOrderDispatchStatus2017", payload);
};

export const fetchMasterOrderData = async (salesManId = "", type = "S", data) => {
  const payload = {
    Margid: margClient.MargID,
    CompanyCode: margClient.CompanyCode,
    Sid: salesManId,
    Type: type,
    ...data,
  };

  return makeRequest("InsertOrderDetail", payload);
};

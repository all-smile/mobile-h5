// 封装api
import http from "@/libs/http";
import { apiPrefix } from "@/libs/config";

console.log("apiPrefix", apiPrefix);

export const testModel = (data) => {
  const api = {
    // url: "model-face/age_gender_model-weights_manifest.json",
    url: `${apiPrefix.isp}/model-face/age_gender_model-weights_manifest.json`,
    mockUrl: "",
  };
  return http.get(api, data);
};

export const getListAPI = (data) => {
  const api = {
    url: "getListAPI",
    mockUrl: "./mock_data/getListAPI.json",
  };
  return http.get(api, data);
};

export const getUserInfo = (data) => {
  const api = {
    url: "getUserInfo",
    mockUrl: "./mock_data/getUserInfo.json",
  };
  return http.get(api, data);
};

export const getOrderPayInfo = (data) => {
  const { payOrderId = "" } = data;
  const api = {
    url: `api/zypg/order/queryBehalfPayMentOrderInfo/${payOrderId}`,
    mockUrl: "",
  };
  return http.post(api);
};

export const getOrderPayList = (data) => {
  const api = {
    url: "api/zypg/order/queryBehalfPayMentAmtDetail",
    mockUrl: "",
  };
  return http.post(api, data);
};

export const getAutherInfo = (data) => {
  const api = {
    url: "api/zypg/openWarranty",
    mockUrl: "",
  };
  return http.post(api, data);
};

export const getPhoneSms = (data) => {
  const api = {
    url: "api/zypg/smsVerification",
    mockUrl: "",
  };
  return http.post(api, data);
};

export const authLogin = (data) => {
  const api = {
    url: "api/zypg/verificationCode",
    mockUrl: "",
  };
  return http.post(api, data);
};

export const cancelPay = (data) => {
  const api = {
    url: "api/zypg/order/cancelPay",
    mockUrl: "",
  };
  return http.post(api, data);
};

export const fetchTaskList = (data) => {
  const api = {
    url: "mock_data/taskList.json",
    mockUrl: "mock_data/taskList.json",
  };
  return http.get(api, data);
};

export const fetchApproveUserList = (data) => {
  const api = {
    url: "",
    mockUrl: "",
  };
  return http.get(api, data);
};

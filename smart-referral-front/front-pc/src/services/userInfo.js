import { http } from "@/utils/http";
import { apiUrl } from "../utils/api";

/**
 * 获取用户信息
 */
export const getUserInfo = (params) => {
  return new Promise((reslove, reject) => {
    http
      .get(apiUrl.getUserInfo, { params })
      .then((res) => {
        let data = res.retData;
        reslove(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getPaths = (params) => {
  return new Promise((reslove, reject) => {
    http
      .get(apiUrl.getPermitMenuUrl, { params })
      .then((res) => {
        let data = res.retData;
        reslove(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const pushOperateLogs = (params) => {
  return new Promise((reslove, reject) => {
    http
      .post(apiUrl.pushOperateLogs, { params })
      .then((res) => {
        let data = res.retData;
        reslove(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

import axios from "axios";
import qs from "qs";
import { errorHandler } from "./errorHandler";
import _msg from "./msg";
import { storage } from "./storage";

// 创建 axios 实例
const axiosInstance = axios.create({
  // 设置超时时间
  timeout: 5 * 60 * 1000,
  // 序列化 params
  paramsSerializer: function (params) {
    return qs.stringify(params, { arrayFormat: "repeat", allowDots: true });
  },
});

// 请求拦截
axiosInstance.interceptors.request.use((config) => {
  let token = JSON.parse(storage.getSessionStorage("userInfo")).token;
  // 添加token
  config.headers.token = token;
  return config;
});

// 响应拦截
axiosInstance.interceptors.response.use((res) => {
  // 取消正在加载
  _msg.hideLoading();
  let obj = res.data;
  let isRetCode;
  try {
    isRetCode = "retCode" in obj;
  } catch {}
  if (!isRetCode) return res.data;
  if (obj.retCode == 0) return res.data;
  _msg.toast(obj.retInfo, "error");
}, errorHandler);

// 统一封装 http 请求
const http = {
  /**
   *
   * @param {string} url 请求地址
   * @param {object} opts 配置项，可以包含以下成员
   * @param {object} opts.params 附加的请求参数
   * @param {boolean} opts.showLoading 是否显示'载入中'提示框，默认false
   * @param {boolean} opts.clearTrimParam 是否清除属性的前后空格，默认true
   */
  get: (url, opts = {}) => {
    let { showLoading = false, clearTrimParam = true } = opts;
    if (!url) {
      throw new Error("url parameter is required!");
    }
    if (showLoading) {
      _msg.showLoading();
    }
    if (clearTrimParam) {
      for (let i in opts.params) {
        if (toString.call(opts.params[i]) == "[object String]") {
          opts.params[i] = opts.params[i].toString().trim();
        }
      }
    }
    return axiosInstance({
      method: "GET",
      url,
      params: opts.params,
    });
  },
  /**
   *
   * @param {string} url 请求地址
   * @param {object} opts 配置项，可以包含以下成员：
   * @param {boolean} opts.showLoading 是否显示'载入中'提示框，默认true
   * @param {boolean} opts.clearTrimParam 是否清除属性的前后空格，默认true
   * @param {object} urlParams url 传参
   */
  post: (url, opts = {}, urlParams = {}) => {
    let { showLoading = true, clearTrimParam = true } = opts;
    if (!url) {
      throw new Error("url parameter is required!");
    }
    if (showLoading) {
      _msg.showLoading();
    }
    if (clearTrimParam) {
      for (let i in opts.params) {
        if (toString.call(opts.params[i]) == "[object String]") {
          opts.params[i] = opts.params[i].toString().trim();
        }
      }
      if (Object.keys(urlParams).length != 0) {
        for (let i in urlParams) {
          if (toString.call(urlParams[i]) == "[object String]") {
            urlParams[i] = urlParams[i].toString().trim();
          }
        }
      }
    }
    return axiosInstance({
      method: "POST",
      url,
      data: opts.params,
      params: urlParams,
    });
  },
  /**
   * 上传文件
   * @param {string} url 请求地址
   * @param {object} opts 配置项，可包含以下成员
   * @param {object} opts.params 上传的url参数
   * @param {FormData} opts.formData 上传的formData对象
   */
  uploadFile: (url, opts = {}) => {
    return axiosInstance({
      method: "POST",
      url,
      params: opts.params,
      data: opts.formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  /**
   *
   * @param {string} url 请求地址
   * @param {object} opts 配置项，可包含以下成员
   * @param {object} opts.params 上传的参数
   */
  downloadFilePost: (url, opts = {}) => {
    return axiosInstance({
      method: "POST",
      url,
      data: opts.params,
      responseType: "blob",
    });
  },
  downloadFileGet: (url, opts = {}) => {
    return axiosInstance({
      method: "GET",
      url,
      params: opts.params,
      responseType: "blob",
    });
  },
};

export { axiosInstance, http };

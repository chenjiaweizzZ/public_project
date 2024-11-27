import axios from "axios";
import Vue from "vue";
import router from "@/router";
import ASE from "../utils/ASE.js";
import qs from "qs";

const axiosInsance = axios.create({
  timeout: 180000
});

axiosInsance.defaults.headers.get["Content-Type"] =
  "application/x-www-form-urlencoded";
axiosInsance.defaults.headers.post["Content-Type"] = "application/json";

let requestingCount = 0;
let loadingInstance;
const startLoading = () => {
  loadingInstance = Vue.prototype.$loading({
    fullscreen: true,
    text: "正在加载...",
    background: "rgba(256,256,256,0.9)"
  });
};
const stopLoading = () => {
  if (loadingInstance) {
    loadingInstance.close();
  }
};
const handleRequest = () => {
  if (!requestingCount) {
    startLoading();
  }
  requestingCount++;
};
const handleResponse = () => {
  requestingCount--;
  if (!requestingCount) {
    stopLoading();
  }
};

//请求拦截器
axiosInsance.interceptors.request.use(
  request => {
    if (["post", "put", "patch"].includes(request.method)) {
      if (
        request.headers["Content-Type"] == "application/x-www-form-urlencoded"
      ) {
        request.data = Vue.prototype.$qs.stringify({ ...request.data });
      }
    }
    if (request.method === "get") {
      request.paramsSerializer = function(params) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      };
    }
    const { needToken = true, isLoading = false } = request;
    if (needToken) {
      request.headers.common["token"] = Vue.prototype.$cookie.get("token")
        ? Vue.prototype.$cookie.get("token")
        : sessionStorage.getItem("token");
    }
    if (isLoading) {
      handleRequest();
    }
    request.headers.common["traceId"] = new Date().getTime();
    return request;
  },
  error => {
    if (isLoading) {
      handleRequest();
    }
    return Promise.reject(error);
  }
);

const showErrorMessage = (message, type) => {
  if (Vue.prototype.$message) {
    if (type && type >= 20000) {
      Vue.prototype.$message({
        message,
        type: "warning"
      });
    } else {
      Vue.prototype.$message.error({
        message
      });
    }
  } else {
    alert(message);
  }
};

// 响应拦截器
axiosInsance.interceptors.response.use(
  response => {
    handleResponse();
    if (response.data.data) {
      let data = JSON.parse(ASE.decrypt(response.data.data));
      if (data.ret_code === 0 || data.retCode === 0) {
        return data.ret_data || data.retData;
      } else if (data.ret_code === -100) {
        stopLoading();
        router.replace("/nopermission?message=" + data.ret_info);
      } else {
        stopLoading();
        showErrorMessage(data.ret_info || data.retInfo, data.retCode);
        return Promise.reject(data);
      }
    } else if (
      response.data.hasOwnProperty("ret_code") ||
      response.data.hasOwnProperty("retCode")
    ) {
      if (response.data.ret_code === 0 || response.data.retCode === 0) {
        return response.data.ret_data || response.data.retData;
      } else if (response.data.ret_code === -100) {
        stopLoading();
        router.replace("/nopermission?message=" + response.data.ret_info);
      } else {
        stopLoading();
        showErrorMessage(
          response.data.ret_info || response.data.retInfo,
          response.data.retCode
        );
        return Promise.reject(response.data);
      }
    } else {
      if (response.data) {
        return response.data;
      } else {
        showErrorMessage("系统异常，请稍后重试");
        return Promise.reject(response.data);
      }
    }
  },
  error => {
    stopLoading();
    if (error.response.status == "403") {
      if (Vue.prototype.$isProduction) {
        location.replace(
          location.origin + "/Account/AuthError?err_msg=login_error "
        );
      } else {
        Vue.prototype.$message.error("token错误");
      }
    } else if (error.response.status == "401") {
      showErrorMessage(error.response.data.retInfo);
    } else if (error.response.status == "404") {
      showErrorMessage("404, not found!");
    } else {
      showErrorMessage("系统异常，请稍后重试");
    }
    return Promise.reject(error);
  }
);

export { axiosInsance, startLoading, stopLoading };

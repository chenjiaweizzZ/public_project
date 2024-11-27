/**
 * @description axios 封装
 * @author 刘晨明
 */
import axios from "axios";
// 获取返回的状态码
import get from "lodash/get";
// 针对get请求，数组类型参数格式转换
import qs from "qs";
// import _msg from "../utils/msg";
import _utils from "../utils/utils";
import _apiUrl from "../server/api";
import { storage } from "../storage";
const service = axios.create({
  timeout: 10000,
});
// 错误状态码
const errorHandler = (error) => {
  const status = get(error, "response.status");
  switch (status) {
    case 400:
      error.message = "请求错误";
      break;
    case 401:
      error.message = "未授权，请登录";
      window.location.href = _apiUrl.login;
      break;
    case 403:
      error.message = "拒绝访问";
      break;
    case 404:
      error.message = `请求地址出错: ${error.response.config.url}`;
      break;
    case 408:
      error.message = "请求超时";
      break;
    case 500:
      error.message = "服务器内部错误";
      break;
    case 501:
      error.message = "服务未实现";
      break;
    case 502:
      error.message = "网关错误";
      break;
    case 503:
      error.message = "服务不可用";
      break;
    case 504:
      error.message = "网关超时";
      break;
    case 505:
      error.message = "HTTP版本不受支持";
      break;
    default:
      break;
  }
  return Promise.reject(error);
};

/**
 * 请求拦截
 */
service.interceptors.request.use((config) => {
  let token = storage.getLocalStorage("token");
  config.headers.common["token"] = token;
  config.headers.common["WorkWeixinFlag"] = 1;
  if (config.method === "get") {
    config.paramsSerializer = (params) => {
      return qs.stringify(params, { arrayFormat: "repeat" });
    };
  }
  return config;
});

/**
 * 响应拦截
 */
service.interceptors.response.use(function (response) {
  return response.data.ret_data || response.data.retData;
}, errorHandler);

/**
 * 将`name` - `value`对转换为支持嵌套结构的对象数组
 *
 *     var objects = toQueryObjects('hobbies', ['reading', 'cooking', 'swimming']);
 *
 *     // objects then equals:
 *     [
 *         { name: 'hobbies', value: 'reading' },
 *         { name: 'hobbies', value: 'cooking' },
 *         { name: 'hobbies', value: 'swimming' },
 *     ];
 *
 *     var objects = toQueryObjects('dateOfBirth', {
 *         day: 3,
 *         month: 8,
 *         year: 1987,
 *         extra: {
 *             hour: 4
 *             minute: 30
 *         }
 *     }, true); // Recursive
 *
 *     // objects then equals:
 *     [
 *         { name: 'dateOfBirth[day]', value: 3 },
 *         { name: 'dateOfBirth[month]', value: 8 },
 *         { name: 'dateOfBirth[year]', value: 1987 },
 *         { name: 'dateOfBirth[extra][hour]', value: 4 },
 *         { name: 'dateOfBirth[extra][minute]', value: 30 },
 *     ];
 *
 * @param {String} name
 * @param {object | Array} value
 * @param {boolean} [recursive=false] 是否递归
 * @return {array}
 */
const toQueryObjects = (name, value, recursive) => {
  var objects = [],
    i,
    ln;

  if (_utils.isArray(value)) {
    for (i = 0, ln = value.length; i < ln; i++) {
      if (recursive) {
        objects = objects.concat(
          toQueryObjects(name + "[" + i + "]", value[i], true)
        );
      } else {
        objects.push({
          name: name,
          value: value[i],
        });
      }
    }
  } else if (_utils.isObject(value)) {
    for (i in value) {
      if (value.hasOwnProperty(i)) {
        if (recursive) {
          objects = objects.concat(
            toQueryObjects(name + "[" + i + "]", value[i], true)
          );
        } else {
          objects.push({
            name: name,
            value: value[i],
          });
        }
      }
    }
  } else {
    objects.push({
      name: name,
      value: value,
    });
  }

  return objects;
};

/**
 * 把对象转换为查询字符串
 * e.g.:
 *     toQueryString({foo: 1, bar: 2}); // returns "foo=1&bar=2"
 *     toQueryString({foo: null, bar: 2}); // returns "foo=&bar=2"
 *     toQueryString({date: new Date(2011, 0, 1)}); // returns "date=%222011-01-01T00%3A00%3A00%22"
 * @param {Object} object 需要转换的对象
 * @param {Boolean} [recursive=false] 是否递归
 * @return {String} queryString
 */
const toQueryString = (obj, recursive) => {
  var paramObjects = [],
    params = [],
    i,
    j,
    ln,
    paramObject,
    value;

  for (i in obj) {
    if (obj.hasOwnProperty(i)) {
      paramObjects = paramObjects.concat(toQueryObjects(i, obj[i], recursive));
    }
  }

  for (j = 0, ln = paramObjects.length; j < ln; j++) {
    paramObject = paramObjects[j];
    value = paramObject.value;

    if (_utils.isEmpty(value)) {
      value = "";
    } else if (_utils.isDate(value)) {
      value =
        value.getFullYear() +
        "-" +
        Ext.String.leftPad(value.getMonth() + 1, 2, "0") +
        "-" +
        Ext.String.leftPad(value.getDate(), 2, "0") +
        "T" +
        Ext.String.leftPad(value.getHours(), 2, "0") +
        ":" +
        Ext.String.leftPad(value.getMinutes(), 2, "0") +
        ":" +
        Ext.String.leftPad(value.getSeconds(), 2, "0");
    }

    params.push(
      encodeURIComponent(paramObject.name) +
      "=" +
      encodeURIComponent(String(value))
    );
  }

  return params.join("&");
};

// 封装请求
let http = {
  /**
   * 以get方式请求获取JSON数据
   * @param {String} url 请求地址
   * @param {Object} opts 配置项，可包含以下成员:
   * @param {Object} opts.params 附加的请求参数
   * @param {Boolean} opts.showLoading 是否显示'载入中'提示框，默认false
   * @param {Boolean} opts.clearTrimParam 是否清除属性的前后空格，默认true
   * @param {Boolean} opts.cancelCache 是否取消幂等性，默认false
   */
  get: function (url, opts = {}, headers = {}) {
    let {
      showLoading = false,
      clearTrimParam = true,
      cancelCache = false,
    } = opts;

    if (!url) {
      throw new Error("url parameter is required!");
    }
    if (showLoading) {
      // _msg.showLoading();
    }
    if (clearTrimParam) {
      for (var key in opts.params) {
        if (toString.call(opts.params[key]) == "[object String]") {
          opts.params[key] = opts.params[key].toString().trim();
        }
      }
    }

    if (cancelCache && opts.params) {
      opts.params._dt = Date.now();
    }

    return service.get(url, {
      params: opts.params,
      headers,
    });
  },
  /**
   * 以post方式请求获取JSON数据
   * @param {String} url 请求地址
   * @param {Object} opts 配置项，可包含以下成员:
   * @param {Object} opts.params 附加的请求参数
   * @param {Boolean} opts.showLoading 是否显示'载入中'提示框，默认true
   * @param {Boolean} opts.isBlob 下载文件，默认false
   * @param {Boolean} opts.clearTrimParam 是否清除属性的前后空格，默认true
   * @param {Object} urlParams url传参(query参数)，默认空对象
   */
  post: function (url, opts = {}, urlParams = {}) {
    let { showLoading = true, clearTrimParam = true, isBlob = false } = opts;

    let urlStr = "";

    if (!url) {
      throw new Error("url parameter is required!");
    }

    if (showLoading) {
      // _msg.showLoading();
    }

    if (JSON.stringify(urlParams) != "{}") {
      urlStr = toQueryString(urlParams);
    }

    if (clearTrimParam && toString.call(opts.params) == "[object Object") {
      for (var key in opts.params) {
        if (toString.call(opts.params[key]) == "[object String]") {
          opts.params[key] = opts.params[key].toString().trim();
        }
      }
    }

    let fullURL = url;

    if (!_utils.isEmpty(urlStr)) {
      fullURL = fullURL + "?" + urlStr;
    }

    return service.post(fullURL, opts.params, {
      responseType: isBlob ? "blob" : null,
    });
  },
  /**
   * 上传文件
   * @param {Object} url 上传地址Url
   * @param {Object} opts 配置项，可包含以下成员:
   * @param {Object} opts.params 上传的参数
   * @param {Object} opts.formData 上传的formData
   * @param {Function} opts.uploadingCallback 上传中的回调函数
   */
  uploadFile: function (url, opts = {}) {
    let queryString = toQueryString(opts.params);
    url += "?" + queryString;

    return service.post(url, opts.formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: opts.responseType ? opts.responseType : null,
      onUploadProgress: function (progressEvent) {
        opts.uploadingCallback && opts.uploadingCallback(progressEvent);
      },
    });
  },
};

export default http;

/**
 * @description 公共方法
 * @author 刘晨明
 */
let utils = {
  /**
   * 判断是否Array对象
   * @param {Object} value 判断的对象
   * @return {Boolean}
   */
  isArray: function (value) {
    return toString.call(value) === "[object Array]";
  },

  /**
   * 判断是否日期对象
   * @param {Object} value 判断的对象
   * @return {Boolean}
   */
  isDate: function (value) {
    return toString.call(value) === "[object Date]";
  },

  /**
   * 判断是否Object对象
   * @param {Object} value 判断的对象
   * @return {Boolean}
   */
  isObject: function (value) {
    return toString.call(value) === "[object Object]";
  },

  /**
   * 判断是否为空
   * @param {Object} value 判断的对象
   * @return {Boolean}
   */
  isEmpty: function (value) {
    return (
      value === null ||
      value === undefined ||
      value === "" ||
      (this.isArray(value) && value.length === 0)
    );
  },
  isDef: function (value) {
    return value !== undefined && value !== null;
  },
  getFileFromUrl: function (url, fileName) {
    return new Promise((resolve, reject) => {
      var blob = null;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.setRequestHeader("Accept", "image/png");
      xhr.responseType = "blob";
      // 加载时处理
      xhr.onload = () => {
        // 获取返回结果
        blob = xhr.response;
        let file = new File([blob], fileName, { type: "image/png" });
        // 返回结果
        resolve(file);
      };
      xhr.onerror = (e) => {
        reject(e);
      };
      // 发送
      xhr.send();
    });
  },
};

export default utils;

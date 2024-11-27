import dayjs from "dayjs";
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

  /**
   * 判断是否为对象
   * @param {Object} value 判断的对象
   * @return {Boolean}
   */
  isObject: function (value) {
    return toString.call(value) === "[object Object]";
  },

  /**
   * 判断是否为字符串
   * @param {Object} value 判断的对象
   * @return {Boolean}
   */
  isString: function (value) {
    return toString.call(value) === "[object String]";
  },

  /**
   * 接口数据过滤
   * @param {array} list 需要过滤的 key
   * @param {object} obj 过滤的数据对象
   */
  dataFilter: (list, obj) => {
    class format {
      constructor(list, obj) {
        let that = this;
        list.forEach((val) => {
          that[val] = obj[val];
        });
      }
    }
    return new format(list, obj);
  },

  /**
   * 文件下载
   * @param data 文件流
   * @param filename 文件名
   * @param type 文件类型
   */
  download(data, filename, type) {
    let url = window.URL.createObjectURL(new Blob([data], { type }));
    let link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  },

  /**
   * 获取近一个月的时间范围
   */
  getAMonth() {
    let end = new Date();
    let year = end.getFullYear();
    let month = end.getMonth() + 1; //0-11表示1-12月
    let day = end.getDate();
    let dateArr = [];
    dateArr[1] =
      year +
      "-" +
      (month >= 1 && month <= 9 ? "0" : "") +
      month +
      "-" +
      (day >= 0 && day <= 9 ? "0" : "") +
      day;
    let endMonthDay = new Date(year, month, 0).getDate(); //当前月的总天数
    if (month - 1 <= 0) {
      //如果是1月，年数往前推一年
      dateArr[0] =
        year - 1 + "-" + 12 + "-" + (day >= 0 && day <= 9 ? "0" : "") + day;
    } else {
      let startMonthDay = new Date(year, parseInt(month) - 1, 0).getDate();
      if (startMonthDay < day) {
        //1个月前所在月的总天数小于现在的天日期
        if (day < endMonthDay) {
          //当前天日期小于当前月总天数
          dateArr[0] =
            year +
            "-" +
            (month - 1 >= 1 && month - 1 <= 9 ? "0" : "") +
            (month - 1) +
            "-" +
            (startMonthDay - (endMonthDay - day) >= 1 &&
              startMonthDay - (endMonthDay - day) <= 9
              ? "0"
              : "") +
            (startMonthDay - (endMonthDay - day));
        } else {
          dateArr[0] =
            year +
            "-" +
            (month - 1 >= 1 && month - 1 <= 9 ? "0" : "") +
            (month - 1) +
            "-" +
            (startMonthDay >= 0 && startMonthDay <= 9 ? "0" : "") +
            startMonthDay;
        }
      } else {
        dateArr[0] =
          year +
          "-" +
          (month - 1 >= 1 && month - 1 <= 9 ? "0" : "") +
          (month - 1) +
          "-" +
          (day >= 0 && day <= 9 ? "0" : "") +
          day;
      }
    }
    return dateArr;
  },

  /**
   * 格式化日期
   * @param {string} date
   * @param {string} format
   */
  formatDate(date, format = "YYYY-MM-DD") {
    if (date === undefined || date) {
      return dayjs(date).format(format);
    } else {
      return "";
    }
  },
  /**
   * 格式化表格日期
   * @param {string} date
   * @param {string} format
   */
  formatTableDate(format = "YYYY-MM-DD") {
    return function (row, col, value) {
      if (!value) {
        return "";
      }
      return dayjs(value).format(format);
    };
  },
  calculateAge(birthDateString) {
      const birthDate = new Date(birthDateString);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth();
      const day = today.getDate();
      if (month < birthDate.getMonth() || (month === birthDate.getMonth() && day < birthDate.getDate())) {
        age--;
      }
      return age;
  }
};

export default utils;

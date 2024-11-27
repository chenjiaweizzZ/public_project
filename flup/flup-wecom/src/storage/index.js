
/**
 * @description storage 方法统一封装
 * @author 刘晨明
 */
import utils from "../utils/utils.js";
import { encrypt, decrypt } from "./encryptionDecrypt.js";
let CIS_NEV = process.env.CIS_NEV;
let isEnsrypt = false;
// 根据环境判断是否加解密
switch (CIS_NEV) {
  case "dev":
    isEnsrypt = false;
    break;
  case "prod":
    isEnsrypt = true;
    break;
  default:
    break;
}
// localStorage与sessionStorage封装
let localConfig = {
  type: "localStorage", //本地存储类型
  prefix: "flup-wecom", //名称前缀 建议项目名+版本号
  isEnsrypt: isEnsrypt, //是否加解密
};

// sessionStorage本身就是个临时存储，暂不设置过期时间，后续有需要在配置
let sessionConfig = {
  type: "sessionStorage", //本地存储类型
  prefix: "flup-wecom", //名称前缀 建议项目名+版本号
  isEnsrypt: isEnsrypt, //是否加解密
};

export const storage = {
  /**
   * 设置localStorage
   * @param {*} key 键
   * @param {*} value 键值
   * @param {Number} expire 过期时间（单位分）
   */
  setLocalStorage: function (key, value, expire) {
    if (!key) {
      throw new Error("key parameter is required!");
    }
    if (utils.isEmpty(value)) {
      value = null;
    }
    let data = expire
      ? {
          value: value,
          time: Date.now(),
          expire: expire * 60 * 1000,
        }
      : { value: value };
    const encryptString = !localConfig.isEnsrypt
      ? JSON.stringify(data)
      : encrypt(JSON.stringify(data));
    window[localConfig.type].setItem(this.autoAddPrefix(key), encryptString);
  },
  /**
   * 获取localStorage
   * @param {*} key 键
   */
  getLocalStorage: function (key) {
    // 判断key是否存在，防止获取不存在的值报错
    if (!window[localConfig.type].getItem(this.autoAddPrefix(key))) {
      return null;
    }
    // 获取storage
    const storage = !localConfig.isEnsrypt
      ? JSON.parse(window[localConfig.type].getItem(this.autoAddPrefix(key)))
      : JSON.parse(
          decrypt(window[localConfig.type].getItem(this.autoAddPrefix(key)))
        );
    let nowTime = Date.now();

    if (storage.expire) {
      // 过期删除
      if (storage.expire < nowTime - storage.time) {
        this.removeLocalStorage(key);
        return null;
      } else {
        // 未过期调用自动续期
        this.setLocalStorage(key, storage.value, 20);
        return storage.value;
      }
    } else {
      return storage.value;
    }
  },
  /**
   * 获取所有的localStorage
   */
  getLocalStorageAll: function () {
    let len = window[localConfig.type].length;
    let arr = new Array();
    for (let i = 0; i < len; i++) {
      // 获取key
      let getKey = window[localConfig.type].key(i);
      // 获取key对应的值
      let getValue = !localConfig.isEnsrypt
        ? JSON.parse(window[localConfig.type].getItem(getKey))
        : JSON.parse(decrypt(window[localConfig.type].getItem(getKey)));
      arr.push({
        key: this.reductionPrefix(getKey),
        val: getValue,
      });
    }
    return arr;
  },
  /**
   * 删除 removeStorage
   * @param {*} key 键
   */
  removeLocalStorage: function (key) {
    window[localConfig.type].removeItem(this.autoAddPrefix(key));
  },
  /**
   * 清空localStorage
   */
  clearLocalStorage: function () {
    window[localConfig.type].clear();
  },
  /**
   * 设置sessionStorage
   * @param {*} key 键
   * @param {*} value 键值
   */
  setSessionStorage: function (key, value) {
    if (!key) {
      throw new Error("key parameter is required!");
    }
    if (utils.isEmpty(value)) {
      value = null;
    }
    const encryptString = !sessionConfig.isEnsrypt
      ? JSON.stringify(value)
      : encrypt(JSON.stringify(value));
    window[sessionConfig.type].setItem(this.autoAddPrefix(key), encryptString);
  },
  /**
   * 获取sessionStorage
   * @param {*} key 键
   */
  getSessionStorage: function (key) {
    if (!window[sessionConfig.type].getItem(this.autoAddPrefix(key))) {
      return null;
    }

    const storage = !sessionConfig.isEnsrypt
      ? JSON.parse(window[sessionConfig.type].getItem(this.autoAddPrefix(key)))
      : JSON.parse(
          decrypt(window[sessionConfig.type].getItem(this.autoAddPrefix(key)))
        );
    return storage;
  },
  /**
   * 获取所有sessionStorage
   */
  getSessionStorageAll: function () {
    let len = window[sessionConfig.type].length;
    let arr = new Array();
    for (let i = 0; i < len; i++) {
      // 获取key
      let getKey = window[sessionConfig.type].key(i);
      // 获取key对应的值
      let getValue = !sessionConfig.isEnsrypt
        ? JSON.parse(window[sessionConfig.type].getItem(getKey))
        : JSON.parse(decrypt(window[sessionConfig.type].getItem(getKey)));
      arr.push({
        key: this.reductionPrefix(getKey),
        val: getValue,
      });
    }
    return arr;
  },
  /**
   * 删除 removeStorage
   * @param {*} key 键
   */
  removeSessionStorage: function (key) {
    window[sessionConfig.type].removeItem(this.autoAddPrefix(key));
  },
  /**
   * 清空localStorage
   */
  clearSessionStorage: function () {
    window[sessionConfig.type].clear();
  },
  /**
   * 名称自动添加前缀
   * @param {*} key
   */
  autoAddPrefix: function (key) {
    const prefix = localConfig.prefix ? localConfig.prefix + "_" : "";
    return prefix + key;
  },
  /**
   * 名称自动还原
   * @param {*} key
   */
  reductionPrefix: function (key) {
    const len = localConfig.prefix ? localConfig.prefix.length + 1 : 0;
    const prefix = localConfig.prefix ? key.slice(len) : key;
    return prefix;
  },
};

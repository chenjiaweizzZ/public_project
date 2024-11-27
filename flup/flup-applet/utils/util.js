const REGEX = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
export const formatTimeall = (val, format) => {
  if (val) {
    /**
     * @instructions 如果不是时间戳格式，且含有字符 '-' 则将 '-' 替换成 '/' && 删除小数点及后面的数字
     * @reason 将 '-' 替换成 '/' && 删除小数点及后面的数字 的原因是safari浏览器仅支持 '/' 隔开的时间格式
     */
    if (val.toString().indexOf('-') > 0) {
      val = val.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/') // 将 '-' 替换成 '/'
      val = val.slice(0, val.indexOf('.')) // 删除小数点及后面的数字
    }
    let date = new Date(val)
    date.setHours(date.getHours() + 8)
    const [whole, yy, MM, dd, hh, mm, ss] = date.toISOString().match(REGEX)
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const dates = new Date().getDate()
    if (format) {
      return format
        .replace('yyyy', yy)
        .replace('yy', yy.slice(2))
        .replace('MM', MM)
        .replace('dd', dd)
        .replace('hh', hh)
        .replace('mm', mm)
        .replace('ss', ss)
    } else {
      return [yy, MM, dd].join('/') + ' ' + [hh, mm, ss].join(':')
    }
  } else {
    return '--'
  }
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTime1 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + 'T' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 计算可滚动布局的高度
 */
const getContentHeight = usedHeight => {
  let sysinfo = wx.getSystemInfoSync()
  return sysinfo.windowHeight - usedHeight * sysinfo.windowWidth / 375;
}

/**
 * url:String
 * params:Object
 * targets:Arrays
 */
function navigateCbk(url, params = {}, target = "pagebackdata") {
  console.log(url, params, target)
  wx.navigateTo({
    url: url + `?params=${JSON.stringify(params)}&target=${target}`
  })
}

/**
 * 放到OnLoad传入options return 上个页面的传参和设置返回的方法
 */
function makeCbk(options) {
  let {
    params,
    target
  } = options
  if (typeof params == 'string') {
    try {
      params = JSON.parse(params);
    } catch (e) {

    }
  }

  return {
    params,
    target,
    setCbk(Obj, byself, func) {
      let pages = getCurrentPages();
      let last = pages[pages.length - 2];
      if (!byself)
        last.setData({
          [target]: Obj
        })
      else {
        let tmp = {}
        for (let key in Obj) {
          tmp[[key]] = Obj[key];
        }
        last.setData(tmp)
      }
      if (func) func();
      else wx.navigateBack()
    }
  }
}


function navigateForResult(requestCode, url) {
  wx.navigateTo({
    url: url + `${url.includes('?') ? '&' :'?'}requestCode=${requestCode}`
  })
}

function navigateBackByResult(requestCode, Obj, position = 2, delta = 1) {
  let pages = getCurrentPages();
  let last = pages[pages.length - position];
  last.onNavigatorResult(requestCode, Obj)
  if (delta > 0)
    wx.navigateBack({
      delta: delta
    })
}


function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

function paramformat(json) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key])
  })).join('&')
}

function checkPhone(phone) {
  return /^1[345789]\d{9}$/.test(phone);
}

/**
 * 对象转url参数
 * @param {*} data
 * @param {*} isPrefix
 */
function queryParams(data, isPrefix = false) {
  isPrefix = isPrefix ? isPrefix : false
  let prefix = isPrefix ? '?' : ''
  let _result = []
  for (let key in data) {
    let value = data[key]
    // 去掉为空的参数
    if (['', undefined, null].includes(value)) {
      continue
    }
    if (value.constructor === Array) {
      value.forEach(_value => {
        _result.push(key + '[]=' + _value)
      })
    } else {
      _result.push(key + '=' + value)
    }
  }
  return _result.length ? prefix + _result.join('&') : ''
}

function getHideidCard(e) {
  return e.substring(0, 6) + "*********" + e.substring(14)
}

function isGreaterThanXhours(date, hours = 72) {
  var d = new Date(date);
  if ((new Date().getTime() - d.getTime()) > hours * 3600 * 1000) {
    return true;
  } else {
    return false
  }
}

function debounce(fn, interval) {
  let timer;
  let delay = interval || 1000; // 间隔的时间，如果interval不传，则默认1秒
  return function () {
      let that = this;
      let args = arguments; // 保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
      if (timer) {
          clearTimeout(timer);
      }
      timer = setTimeout(function () {
          fn.apply(that, args); // 用apply指向调用debounce的对象，相当于this.fn(args);
      }, delay);
  };
}

module.exports = {
  formatTime: formatTime,
  formatTime1: formatTime1,
  getContentHeight: getContentHeight,
  checkPhone,
  navigateCbk,
  makeCbk,
  navigateForResult,
  navigateBackByResult,
  paramformat,
  queryParams,
  getHideidCard: getHideidCard,
  isGreaterThanXhours: isGreaterThanXhours,
  formatTimeall: formatTimeall,
  debounce
}
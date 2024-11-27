/**
 * 网络请求工具类
 */
// const globalConfig = require('./globalConfig.js');
var netcount = 0

function startrequest() {
  netcount += 1
}

function endrequest() {
  if (netcount <= 0) return
  netcount -= 1
}

function reuqest(API, data, _options = {}) {
  if (netcount >= 5) {
    return new Promise((r, e) => {
      setTimeout(() => {
        r(reuqest(API, data, _options))
      }, 1000)
    })
  }
  // console.log('current requesting count is ',netcount)
  let options = Object.assign({
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    showLoading: true,
    reqend: () => {},
    successCode: 0
  }, _options)
  if (options.showLoading) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  }
  return new Promise((resolve, reject) => {
    startrequest()
    wx.request({
      url: API,
      method: options.method,
      header: options.header,
      data: data,
      success: res => {
        endrequest()
        // console.log(` ${API} resp => `, res)
        // wx.hideLoading()
        if (options.showLoading) wx.hideLoading()
        //自定义错误提示
        let msg = options.reqend(null, res.data);
        if (msg) reject(new Error(msg))
        //结果返回, 设置了codekey和datakey时,取出对应值返回, 否则直接返回data对应
        if (res.statusCode == 200) {
          if (options.codekey && res.data[options.codekey] == options.successCode) {
            if (options.datakey) {
              resolve(res.data[options.datakey])
            } else resolve(res.data)
          } else {
            // if (res.data.ret_code == 2) {
            //   登录过期, 跳转登录页 
            //   wx.navigateTo({
            //     url: '/pages/user/login',
            //   })
            //   getApp().removeLoginInfo();//移除登录信息
            //   setTimeout(() => {
            //     wx.reLaunch({
            //       url: '/pages/index/index',
            //     })
            //   }, 1000);              
            // }
            // console.log('net finish ',res)

            if (res.data.retCode == 10010) {
              // console.log('登录过期, 跳转登录页',res)
              wx.removeStorageSync('userInfo')
              wx.removeStorageSync('token')
              wx.removeStorageSync('is_health_admin')
              wx.removeStorageSync('IMData')
              wx.$TUIKit && wx.$TUIKit.logout()
              wx.$TUIKit = null
              wx.showToast({
                title: "登录信息过期，请重新登录!",
                icon: "none"
              })
              //登录过期, 跳转登录页 
              wx.navigateTo({
                url: '/pages/login/login',
              })
              // wx.clearStorage();//移除登录信息

              // setTimeout(() => {
              //   wx.reLaunch({
              //     url: '/pages/index/index',
              //   })
              // }, 1000);              
            }
            // console.log('net finish ', res)
            resolve(res.data)
          }
        } else {
          if (res.statusCode == 401 && (res.data.retCode == 10010 || res.data.retCode == 10015)) {
            // console.log('登录过期, 跳转登录页22222',res)
            // wx.clearStorage();//移除登录信息
            wx.removeStorageSync('userInfo')
            wx.removeStorageSync('token')
            wx.removeStorageSync('is_health_admin')
            wx.removeStorageSync('IMData')
            wx.$TUIKit && wx.$TUIKit.logout()
            wx.$TUIKit = null
            wx.showToast({
              title: "登录信息过期，请重新登录!",
              icon: "none"
            })
            //登录过期, 跳转登录页 
            wx.navigateTo({
              url: '/pages/login/login',
            })

          } else {
            // console.log('这这这 ',res)
            reject(new Error("未知错误"))
          }
        }
      },
      fail: error => {
        endrequest()
        wx.hideLoading()
        options.reqend(error)
        console.error("request fail,", error);
        reject(error)
      }
    })

  })
}


import {
  paramformat
} from "./util.js"

// 测试环境
const baseUrl = 'https://premisd.zwjk.com/flup/api'
const flupUrl = 'https://premisd.zwjk.com/flup/api'
const referralUrl = 'https://premisd.zwjk.com/referral/api'

// 预生产环境
// const baseUrl = 'https://xiangya-zjhm.zwjk.com/flup/api'
// const flupUrl = 'https://xiangya-zjhm.zwjk.com/flup/api'
// const referralUrl = 'https://xiangya-zjhm.zwjk.com/referral/api'

// 湘雅生产环境
// const baseUrl = 'https://qbcgl.xiangya.com.cn/flup/api'
// const flupUrl = 'https://qbcgl.xiangya.com.cn/flup/api' // 湘雅
// const referralUrl = 'https://qbcgl.xiangya.com.cn/referral/api'

// 其他本地环境
// const baseUrl = 'http://192.168.3.193:9981'//'http://192.168.33.54:8088'
// const baseUrl = 'http://192.168.14.109:8088' // 天宇本地
// const baseUrl = 'http://192.168.3.193:9981'

// const nurseUrl = globalConfig.getLocalConfig().nurseUrl
// const mbUrl = globalConfig.getLocalConfig().mbUrl
// const flupUrl = 'http://192.168.3.193:9981'//'http://192.168.33.54:8088'
// const flupUrl = 'http://192.168.14.109:8088'
// const flupUrl = 'http://192.168.3.193:9981'

    //生产服务器测试环境
    // const  baseUrl= 'https://qbcgl.xiangya.com.cn/test/api'
    // const flupUrl = 'https://qbcgl.xiangya.com.cn/test/api'
    // const referralUrl = 'https://qbcgl.xiangya.com.cn/test/api'

class api {
  constructor(url, params = {}) {
    this.app = getApp();
    this._url = url
    this._query = params.query || {};
    this._body = params.body || {};
    this._option = params.option || {};
    this._method = 'get'
    this._baseurl = baseUrl
    this._reqend = (error, resp) => {
      // debugger
      let errmsg = "",
        reqfail = false
      if (error) {
        errmsg = error.message
        reqfail = true
      } else {
        if (!(resp.ret_code != undefined && resp.ret_code === 0) && !(resp.retCode != undefined && resp.retCode === 0)) {
          errmsg = resp.ret_info || resp.message || resp.retInfo
          reqfail = true
        }
      }
      if (!this._hideerror && reqfail) {
        wx.showToast({
          title: errmsg || "未知错误!",
          icon: "none"
        })
        return errmsg || "未知错误!"
      }

    }
  }
  reqend(func) {
    this._reqend = func;
    return this;
  }
  nurse() {
    this._baseurl = nurseUrl
    return this
  }
  flup() {
    this._baseurl = flupUrl
    return this
  }
  referral() {
    this._baseurl = referralUrl
    return this
  }
  fullurl() {
    this._fullurl = true
    return this
  }

  query(data) {
    this._query = data;
    return this;
  }
  needToken(needToken) {
    this._needToken = needToken;
    return this;
  }

  body(data) {
    this._body = data;
    return this;
  }

  hideLoading() {
    this._hideloading = true;
    return this;
  }

  hideError() {
    this._hideerror = true;
    return this;
  }

  option(opt) {
    this._option = opt;
    return this;
  }
  mb() {
    // this._baseurl = mbUrl
    return this
  }
  get() {
    this._method = 'get'
    return this;
  }

  post() {
    this._method = 'post'
    return this;
  }

  login() {
    this._login = true
    return this;
  }

  exec(appenToken, type) {

    let token
    if (getApp())
      // token = wx.getStorageSync("token")||getApp().globalData.userInfo ? (getApp().globalData.userInfo.token || undefined) : undefined;
      token = wx.getStorageSync("token");
    // token = wx.getStorageSync('userInfo').token
    if (this._login && !token) {
      let pages = getCurrentPages()
      let currentpage = pages[pages.length - 1]
      // console.log(currentpage.keepPgae)
      if (currentpage.keepPgae) {
        currentpage.tigback()
        wx.navigateTo({
          url: '/pages/login/login'
        })
      } else {
        wx.switchTab({
          url: '/pages/index/index',
          complete(res) {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        })
      }


      // wx.navigateTo({
      //   url: '/pages/user/login',
      // })


      // return Promise.reject(new Error(" not login"));
    }


    // if (this._login) {
    if (!this._query)
      this._query = {}

    if (this._login || appenToken) {
      this._query['token'] = token
    }

    // }

    let query = ''
    if (this._url.indexOf('getPatientDetailByCode') == -1) {
      query = ''.concat(paramformat(Object.assign({
        // domain,
        // source,
        // hospitalId: getApp()? (getApp().getSingleHospital() ? getApp().getSingleHospital().hospitalId:undefined):undefined
      }, this._query)))
    } else {
      // console.log('进入了么')
      query = ''.concat(paramformat(Object.assign({
        // domain,
        // source,
        // hospitalId:'1120010613414232310'
      }, this._query)))
    }
    let option = Object.assign({
      showLoading: true
    }, this._option, {
      showLoading: !this._hideloading
    })
    // console.log(`request => ${baseUrl}${this._url}?${query} - ${this._method}`,this._body)
    return reuqest(`${this._fullurl ? '' : this._baseurl}${this._url}?${query}`, this._method == 'get' ? {} : this._body, {
      method: this._method,
      showLoading: option.showLoading,
      header: {
        'content-type': type ? 'application/x-www-form-urlencoded' : 'application/json',
        'token': token
      },
      datakey: 'ret_data',
      codekey: 'ret_code',
      successCode: 0,
      reqend: this._reqend
    })

  }
}

function uploadFile(_options = {}) {
  let options = Object.assign({
    showLoading: false,
    filePath: "",
    type: 1
  }, _options)

  if (options.showLoading) {
    wx.showLoading({
      title: '正在上传图片',
      mask: true,
    })
  }
  let {
    idcard
  } = options
  return wx.uploadFile({
    url: baseUrl + (idcard ? "/util/patient/idCardOCR?" : '/util/fileUpload/uploadFile?') + paramformat({
      // token: getApp().globalData.userInfo ? (getApp().globalData.userInfo.token || '') : '',
      type: options.type,
      cardSide: idcard
    }),
    filePath: options.filePath,
    name: 'file',
    success: function (res) {
      if (typeof res.data == 'string') {
        res.data = JSON.parse(res.data);
      }
      if (res.data.ret_code == 0) {
        if (options.success) {
          options.success(res.data.ret_data)
        }
      } else {
        wx.showToast({
          title: '上传失败',
        })
        if (options.fail) {
          options.fail(res)
        }
      }
    },
    fail: function (res) {
      wx.showToast({
        title: '上传失败',
      })
      if (options.fail) {
        options.fail(res)
      }
    },
    complete: function (res) {
      if (options.showLoading)
        wx.hideLoading()
    }
  })
}

/**
 * options
 * url: 接口
 * customUrl: 是否自定义url
 * method: 请求类型
 * data: 参数，json类型
 */
function RUrequest(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: options.customUrl ? options.url : baseUrl + options.url,
      header: {
        "content-type": "application/json;charset=UTF-8"
      },
      data: options.data,
      method: options.method || 'GET',
      success: function (res) {
        resolve(res.data)
      },
      fail: function (err) {
        reject(err)
      },
    })
  })
}

module.exports = {
  reuqest: reuqest,
  api,
  RUrequest: RUrequest,
  uploadFile: uploadFile,
  baseUrl: baseUrl
  // baiduak: globalConfig.getLocalConfig().baiduak
}
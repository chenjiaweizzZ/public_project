import Aegis from "./lib/aegis";
import {
  wechatLogin,
} from "/utils/api.js";
import eventBus from "./utils/eventBus.js"
App({
  eventBus: eventBus,
  globalData: {
    //测试环境
    baseUrl: 'https://premisd.zwjk.com/flup/api', // 测试
    webUrl: "https://premisd.zwjk.com/flup/web/h5/#",

    //预生产环境
    // baseUrl: 'https://xiangya-zjhm.zwjk.com/flup/api', // 演示
    // webUrl: "https://xiangya-zjhm.zwjk.com/flup/web/h5/#",

    //湘雅生产环境
    // baseUrl: 'https://qbcgl.xiangya.com.cn/flup/api', // 湘雅
    // webUrl: "https://qbcgl.xiangya.com.cn/flup/web/h5/#",

     // 天宇本地
    // baseUrl: 'http://192.168.14.109:8088',

    //生产服务器测试环境
    // baseUrl: 'https://qbcgl.xiangya.com.cn/test/api',

   
    // 全局隐藏聊天室AI开关
    description: "1",
    isBusyLine: false,
    signallingType: 0
  },
  onLaunch() {
    wx.$globalData = {
      userInfo: null,
      headerHeight: 0,
      statusBarHeight: 0,
      sdkAppID: "",
      userID: "",
      userSig: "",
      token: "",
      expiresIn: "",
      phone: "",
      sessionID: "",
      safeArea: {},
      groupMemberList: [], // 群成员列表
    };
    this.aegisInit();
    this.aegisReportEvent('onLaunch', 'onLaunch-success')
  },
  aegisInit() {
    wx.aegis = new Aegis({
      id: 'iHWefAYqxqlqtLQVcA', // 项目key
      reportApiSpeed: true, // 接口测速
      reportAssetSpeed: true, // 静态资源测速
      pagePerformance: true, // 开启页面测速
    });
    this.init()
  },
  /**
   * 获取私有cos存储签名
   */
  async getPrivateCosSignImage(url = "") {
    if (!url) return url;
    if (url.indexOf("private") === -1) return url;
    if (url.indexOf("?") !== -1 && url.indexOf("sign=") !== -1) {
      url = url.split("?")[0];
    }
    let signStr = this.globalData.cosSign;
    if (!signStr) {
      let temp = wx.getStorageSync(HLWYY_MP_COSSIGN);
      if (temp) {
        let signObj = temp;
        if (
          new Date().getTime() / 1000 - signObj.time < 20 * 60 * 60 &&
          signObj.sign
        ) {
          signStr = signObj.sign;
          this.globalData.cosSign = signStr;
          console.log("sign未过期: ", signObj);
        }
      }
    }
    if (!signStr) {
      signStr = await cosSign();
      wx.setStorageSync(HLWYY_MP_COSSIGN, {
        time: new Date().getTime() / 1000,
        sign: signStr,
      });
      this.globalData.cosSign = signStr;
    }
    if (!url) {
      return signStr;
    }
    url =
      url.indexOf("?") !== -1 ?
      `${url}&sign=${encodeURIComponent(signStr)}` :
      `${url}?sign=${encodeURIComponent(signStr)}`;
    return url;
  },

  aegisReportEvent(name, ext1) {
    const IMData = wx.getStorageSync('IMData')
    if (!this.aegisReportEvent[name]) {
      wx.aegis.reportEvent({
        name,
        ext1,
        ext2: 'wxSimpleDemo',
        ext3: IMData.appid,
      })
      this.aegisReportEvent[name] = true
    }
  },

  /**
   * 用户状态初始化
   * 1. 执行wx.login拿到code
   * 2. 将code发送后台，判断用户是否注册，并且获取openId, sessionKey
   * 3. openId存入缓存中，以便其它页面使用
   */
  init: function (e) {
    var _this = this;
    if (wx.getStorageSync('openId') && wx.getStorageSync('token')) {
      // wx.reLaunch({
      //   url: '/pages/index/index'
      // })
    } else if (!wx.getStorageSync('openId')) {
      wx.login({
        success: res => {
          if (res.code) {
            wechatLogin({
              code: res.code
            }).then(response => {
              if (response.retCode == 0) {
                wx.setStorageSync("openId", response.retData.openId)
                // if (response.retData.token) {
                //   // wx.setStorageSync("token", response.retData.token)
                //   // wx.reLaunch({
                //   //   url: '/pages/index/index'
                //   // })
                // } else {
                //   wx.reLaunch({
                //     url: '/pages/login/login'
                //   })
                // }
                wx.reLaunch({
                  url: '/pages/login/login'
                })
              } else {
                wx.showToast({
                  title: response.retData.retInfo,
                  icon: 'none'
                })
                wx.reLaunch({
                  url: '/pages/login/login'
                })
              }
            })
          } else {
            console.log(res.errMsg);
          }
        },
        fail: res => {
          console.log('wx.login失败：' + res.errMsg)
        }
      })
    } else {
      wx.reLaunch({
        url: '/pages/login/login'
      })
    }
  }
});
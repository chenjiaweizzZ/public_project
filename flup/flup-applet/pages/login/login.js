import {
  checkPhone,
} from "../../utils/util.js";
import {
  loginByMsg,
  sendVerifyCode,
  wechatBinding,
  refreshSessionKey,
  dictPoByDictCode
} from "../../utils/api.js"
const app = getApp()
Page({
  data: {
    userID: '',
    form: {
      loginName: "",
      code: ""
    },
    mode: 'code', //'password'
    getcodebtn: '获取验证码',
    valid: false,
    phonevalid: false,
    regetcodetime: 60,
    logoUrl: '../../assets/images/user-logo-xy.png',
    logoName: '../../assets/images/program-name.png',
    showLoading: false,
  },
  usernameinput(e) {
    let value = e.detail.value
    this.setData({
      ["form.loginName"]: value,
      phonevalid: checkPhone(value),
      valid: checkPhone(value) && this.data.form.code.length == 6
    })
  },
  codeinput(e) {
    let value = e.detail.value
    this.setData({
      ["form.code"]: value,
      valid: checkPhone(this.data.form.loginName) && value.length == 6
    })
  },
  getCaptcha() {
    if (!checkPhone(this.data.form.loginName)) {
      wx.showToast({
        title: '请检查手机号格式',
        icon: 'none'
      })
      return
    }
    this.selectComponent('#codecheck').codecheck((result) => {
      console.log(result, 'resultresultresult')
      sendVerifyCode({
        captchaCode: result.code,
        purpose: 11,
        codeLength: 6,
        phoneNo: this.data.form.loginName,
      }).then(() => {
        wx.showToast({
          title: "已将验证码发送到您手机,因网络原因可能有延迟,请稍后",
          icon: 'none'
        })
        let timeinterval = setInterval(() => {
          if (this.data.regetcodetime > 1)
            this.setData({
              getcodebtn: `重新获取(${this.data.regetcodetime - 1}s)`,
              regetcodetime: this.data.regetcodetime - 1
            })
          else {
            clearInterval(timeinterval);
            this.setData({
              getcodebtn: `重新获取`,
              regetcodetime: 60
            })
          }

        }, 1000)
      })
    })
  },
  goservice() {
    wx.navigateTo({
      url: '/pages/mine/helpdetail?name=服务协议&type=yw',
    })
  },
  goprivacy() {
    wx.navigateTo({
      url: '/pages/mine/helpdetail?name=隐私政策&type=yw',
    })
  },
  phoneinput(e) {
    let value = e.detail.value
    this.setData({
      ["form.loginName"]: value,
      valid: checkPhone(value) && this.data.form.password
    })
  },
  passwordinput(e) {
    let value = e.detail.value
    this.setData({
      ["form.password"]: value,
      valid: checkPhone(this.data.form.loginName) && value.length > 5
    })
  },
  changecode() {
    wx.navigateTo({
      url: "/pages/user/loginbycode"
    })
    // this.setData({
    //   mode:'code'
    // })
  },
  forgetpwd() {
    wx.navigateTo({
      url: '/pages/user/forgetpwd',
    })
  },
  goreg() {
    wx.navigateTo({
      url: '/pages/user/reg',
    })
  },
  submit() {
    loginByMsg({
      type: 88, // 标记来源是小程序
      acount: wx.getStorageSync("openId"),
      phone: this.data.form.loginName,
      code: this.data.form.code,
      channel: 1
    }).then(res => {
      if (res.retCode == 0) {
        wx.requestSubscribeMessage({
          tmplIds: [
            "0vKM6iLYfw26FQRad00vmAWaXUPBDK8lFz7ZYxgSpns",
            "gfbcIm3_kh-cuDTeKagJtktM64prQMZsh_PYJUfyyL8",
            "W_LIVV4q2Ld9F24nwh4-w_4MTrOlPBaKbwQolrKOhxE"
          ]
        })
        wx.setStorageSync('userInfo', res.retData);
        wx.setStorageSync('token', res.retData.token);
        this.getDictPoByDictCode()
        wx.reLaunch({
          url: '/pages/index/index'
        })
      } else {
        wx.showToast({
          title: res.data.retInfo,
          icon: 'none'
        })
      }
    })

  },
  //微信一键授权登录
  getPhoneNumber(e) {
    let _ = this;
    wx.checkSession({
      success(a) {
        _.loginSuccessHandler(e.detail)
      },
      fail() {
        _.loginFailHandler(e.detail)
      }
    })
  },
  /**
   * 若一键登录时sessionKey没有过期
   * 1. 拿到app.js中获取到的openId，这是用户的唯一标识
   * 2. 调用一键登录绑定的接口
   */
  loginSuccessHandler(obj) {
    this.setData({
      showLoading: true
    })
    if (wx.getStorageSync("openId")) {
      this.bindInfo(obj)
    } else {
      this.loginFailHandler()
      this.bindInfo(obj)
    }
  },
  loginFailHandler() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          refreshSessionKey({
            code: res.code
          }).then(response => {
            if (response.retCode == 0) {
              wx.setStorageSync("openId", response.retData)
            } else {
              wx.showToast({
                title: response.retInfo,
                icon: 'none'
              })
            }
          })
        } else {
          console.log('登录失败!');
        }
      },
      fail: res => {

      }
    })
  },
  bindInfo(obj) {
    wechatBinding({
      encryptedData: obj.encryptedData,
      iv: obj.iv,
      openId: wx.getStorageSync("openId"),
    }).then(res => {
      if (res.retCode == 0) {
        this.setData({
          showLoading: false
        })
        wx.setStorageSync("token", res.retData.token)
        wx.setStorageSync("userInfo", res.retData)
        //
        this.getDictPoByDictCode()
        wx.reLaunch({
          url: '/pages/index/index'
        })
      } else {
        wx.showToast({
          title: res.data.retInfo,
          icon: 'none'
        })
      }
    })
  },
  // getUserInfo() {
  //   wechatBinding({
  //     encryptedData: obj.encryptedData,
  //     iv: obj.iv,
  //     openId: wx.getStorageSync("openId"),
  //   }).then(res => {
  //     if (res.retCode == 0) {
  //       // app.init()
  //       this.setData({
  //         showLoading: false
  //       })
  //       wx.reLaunch({
  //         url: '/pages/index/index'
  //       })

  //     } else {
  //       wx.showToast({
  //         title: res.data.retInfo,
  //         icon: 'none'
  //       })
  //     }
  //   })
  // },
  onBack() {
    wx.navigateBack({
      delta: 1,
    });
  },

  bindInputUserID(e) {
    this.setData({
      userID: e.detail.value,
    });
  },
  getDictPoByDictCode() {
    dictPoByDictCode({
      dictCode: "AI_SWITCH"
    }).then(res => {
      console.log(res, 1212)
      if (res.retCode == 0) {
        app.globalData.description = res.retData.description
      } else {
        app.globalData.description = '1'
      }
    }).catch(err => {
      app.globalData.description = '1'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    if (!wx.getStorageSync('openId')) {
      this.loginFailHandler()
    } else {}
  },
  onUnload() {
    // wx.$TUIKit.off(wx.TencentCloudChat.EVENT.SDK_READY, this.onSDKReady, this);

  },
  onSDKReady(event) {
    // 监听到此事件后可调用 SDK 发送消息等 API，使用 SDK 的各项功能。
  }

});
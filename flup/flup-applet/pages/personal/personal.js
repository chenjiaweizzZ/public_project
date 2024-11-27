// pages/personal/personal.js
const app = getApp()
import {
  logout,
  getDoctorUserInfo,
  wechatLogin,
  getIncomeInfo
} from "../../utils/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        icon: '../Resources/icon/text-1.png',
        name: '常用语设置',
        path: '',
        extra: 1,
      },
    ],
    userId: '',
    userName: '',
    incomeInfo: {},
    leader: false
  },

  viewTeamIncome() {
    wx.navigateTo({
      url: `../income/teamIncome`,
    })
  },

  viewMyIncome() {
    wx.navigateTo({
      url: `../income/myIncome`,
    })
  },

  getIncome() {
    getIncomeInfo().then(res => {
      let { retData } = res
      this.setData({
        incomeInfo: retData,
        leader: retData?.leader
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let is_health_admin = wx.getStorageSync('is_health_admin')
    let index = is_health_admin == 1 ? 3 : 2
    if (typeof this.getTabBar == 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: index
      })
    }
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userId: wx.getStorageSync('userInfo').phone,
        userName: wx.getStorageSync('userInfo').userName || ''
      });
      this.getIncome()
    } else {
      this.getUserInfo();
    }
  },
  toPatient() {
    // wx.navigateTo({
    //   url: '/pages/patientInfo/PatientInfo',
    // })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 路由跳转
  handleRouter(e) {
    const data = e.currentTarget.dataset.item;
    console.log(data.path)
    switch (data.extra) {
      case 1:
        wx.navigateTo({
          url: '../../Setting/pages/CLSetting/index',
        })
      break;
      case 2:
        wx.navigateTo({
          url: '../referralExamine/referralExamine',
        })
      break;
      default:
        // wx.clearStorage();
        wx.removeStorage('userInfo')
        wx.removeStorage('token')
        wx.$globalData = {};
        wx.redirectTo({
          url: `${data.path}`
        });
        break;
    }
  },
  getUserInfo() {
    getDoctorUserInfo({
      // openId: wx.getStorageSync("openId"),
    }).then(res => {
      if (res.retCode == 0) {
        wx.setStorageSync('userInfo', res.retData);
        wx.setStorageSync("token", res.retData.token)
        this.setData({
          userId: wx.getStorageSync('userInfo').phone,
          userName: wx.getStorageSync('userInfo').userName || ''
        });
      } else {
        wx.showToast({
          title: res.retInfo,
          icon: 'none'
        })
      }
    })
  },
  login() {
    wx.reLaunch({
      url: '/pages/login/login'
    })
  },
  unLogin() {
    logout({
      // openId: wx.getStorageSync("openId"),
    }).then(res => {
      if (res.retCode == 0) {
        // wx.clearStorage();
        wx.removeStorageSync('userInfo')
        wx.removeStorageSync('token')
        wx.removeStorageSync('is_health_admin')
        wx.removeStorageSync('IMData')
        wx.$TUIKit && wx.$TUIKit.logout()
        wx.$TUIKit = null
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
        };
        // this.init()
        this.setData({
          userId: '',
        });
        wx.reLaunch({
          url: '/pages/login/login'
        })
      } else {
        wx.showToast({
          title: res.retInfo,
          icon: 'none'
        })
      }
    })
  },
  init() {
    wx.login({
      success: res => {
        if (res.code) {
          wechatLogin({
            code: res.code
          }).then(response => {
            if (response.retCode == 0) {
              wx.setStorageSync("openId", response.retData.openId)
              // wx.setStorageSync("token", response.retData.token)
            } else {
              wx.showToast({
                title: response.retData.retInfo,
                icon: 'none'
              })
            }
          })
        }
      },
      fail: res => {
        console.log('wx.login失败：' + res.errMsg)
      }
    })
  }
});
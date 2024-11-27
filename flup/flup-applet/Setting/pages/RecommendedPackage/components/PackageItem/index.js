import {
  sendMessageCallback,
  personalSendMessageCallback
} from "../../../../../utils/api"
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    packageInfo: {
      type: Object,
      observer(newVal) {
        this.setData({
          packageItem: newVal
        });
      },
    },
    roomId: {
      type: String,
      value: "",
      observer(newVal) {
        this.setData({
          roomId: newVal
        })
      }
    },
    roomType: {
      type: String,
      value: "",
      observer(newVal) {
        this.setData({
          roomType: newVal
        })
      }
    },
    consultId: {
      type: String,
      value: "",
      observer(newVal) {
        this.setData({
          consultId: newVal
        })
      }
    },
    sendUserName: {
      type: String,
      value: "",
      observer(newVal) {
        this.setData({
          sendUserName: newVal
        })
      }
    },
    sendUserId: {
      type: String,
      value: "",
      observer(newVal) {
        this.setData({
          sendUserId: newVal
        })
      }
    },
    type: {
      type: Number,
      value: 1,
      observer(newVal) {
        this.setData({
          type: newVal
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    packageItem: {},
    roomId: "",
    roomType: "",
    consultId: "",
    sendUserId: "",
    sendUserName: "",
    type: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail() {
      let webUrl = `${app.globalData.webUrl}/healthControl?packageId=${this.data.packageItem.packageId}&packageName=${this.data.packageItem.packageName}&isShow=true`
      wx.navigateTo({
        url: `/Setting/pages/packageDetail/index?webUrl=${encodeURIComponent(webUrl)}`,
      })
    },
    send() {
      // 创建消息
      const message = wx.$TUIKit.createCustomMessage({
        to: this.data.roomId,
        conversationType: this.data.roomType,
        payload: {
          description: "套餐推荐",
          data: JSON.stringify({
            url: `${app.globalData.webUrl}/healthControl?packageId=${this.data.packageItem.packageId}&packageName=${this.data.packageItem.packageName}`,
            url1: `${app.globalData.webUrl}/healthControl?packageId=${this.data.packageItem.packageId}&packageName=${this.data.packageItem.packageName}&isShow=true`,
            previewUrl: this.data.packageItem.previewUrl,
            packageName: this.data.packageItem.packageName,
            packageDiscription: this.data.packageItem.packageDiscription,
            floorPrice: this.data.packageItem.floorPrice,
            type: 6
          })
        },
      });
      wx.$TUIKit.sendMessage(message, {
        offlinePushInfo: {
          disablePush: true,
        },
      }).then(res => {
        wx.showToast({
          title: '推送成功'
        })
        let pages = getCurrentPages(); // 当前页面栈
        if (pages.length > 1) {
          let beforePage = pages[pages.length - 2] // 获取上一页面的实例对象
          beforePage.setData({
            message: message
          })
          beforePage.refreshRoom()
        }
        // 回调接口
        let msg = '你有一条新的消息'
        if (this.data.type == 1) {
          personalSendMessageCallback({
            consultId: this.data.consultId,
            message: msg,
            sendUserId: this.data.sendUserId,
            sendUserName: this.data.sendUserName
          })
        } else {
          sendMessageCallback({
            consultId: this.data.consultId,
            message: msg,
            sendUserId: this.data.sendUserId,
            sendUserName: this.data.sendUserName
          })
        }
        wx.navigateBack()
      })
    }
  }
})
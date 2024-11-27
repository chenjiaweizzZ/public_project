import TencentCloudChat from '@tencentcloud/chat';
import TIMUploadPlugin from 'tim-upload-plugin';
import TIMProfanityFilterPlugin from 'tim-profanity-filter-plugin';
import SignalingModule from '@tencentcloud/chat/modules/signaling-module'
import {
  getIMData,
  readMessageCallback
} from "../../utils/api"
Page({
  // 其他代码
  data: {
    currentConversationID: "",
    unreadCount: "",
    consultId: "",
    type: "1",
    patientId: "",
    patientName: "",
    patientCardNo:'',
    patientPhone:'',
    sourceId: "",
    message: "",
    isUrlLink: false
  },
  onLoad(e) {
    console.log(e,'kkkkkkkkkkkkkkkkkkkkkkkkk')
    if (!wx.$TUIKit) {
      getIMData().then(res => {
        let obj = JSON.parse(res.retData);
        wx.setStorageSync('IMData', obj)
        let userID = obj.userId;
        let userSig = obj.userSig;
        let sdkAppID = obj.appid
        wx.$globalData.userID = userID;
        wx.$globalData.userSig = userSig;
        wx.$TUIKit = TencentCloudChat.create({
          SDKAppID: sdkAppID,
          modules: {
            'signaling-module': SignalingModule, // 信令
          }
        });
        wx.TencentCloudChat = TencentCloudChat;
        wx.$TUIKit.registerPlugin({
          'tim-upload-plugin': TIMUploadPlugin
        });
        wx.$TUIKit.registerPlugin({
          'tim-profanity-filter-plugin': TIMProfanityFilterPlugin
        });
        wx.$TUIKit.login({
          userID: userID,
          userSig: userSig
        }).then(() => {
          this.setData({
            currentConversationID: `GROUP${e.currentConversationID}`,
            unreadCount: e.unreadCount,
            consultId: e.consultId,
            type: e.type,
            sourceId: e.sourceId,
            patientId: e.patientId,
            isUrlLink: e.isUrlLink,
            patientName: e.patientName,
            patientCardNo:e.patientCardNo,
            patientPhone:e.patientPhone
          })
        })
      })
    } else {
      this.setData({
        currentConversationID: `GROUP${e.currentConversationID}`,
        unreadCount: e.unreadCount,
        consultId: e.consultId,
        type: e.type,
        sourceId: e.sourceId,
        patientId: e.patientId,
        isUrlLink: e.isUrlLink,
        patientName: e.patientName,
        patientCardNo:e.patientCardNo,
        patientPhone:e.patientPhone
      })
    }
  },
  onUnload() {
    readMessageCallback({
      consultId: this.data.consultId
    })
  },
  // 重新渲染房间
  refreshRoom() {
    // 获取dom元素
    this.selectComponent("#TUIKit").showMessage(this.data.message)
  }
});
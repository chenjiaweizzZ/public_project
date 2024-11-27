import TencentCloudChat from '@tencentcloud/chat';
import TIMUploadPlugin from 'tim-upload-plugin';
import TIMProfanityFilterPlugin from 'tim-profanity-filter-plugin';
import {
  getIMData,
  personalReadMessageCallback
} from "../../utils/api"
Page({
  data: {
    currentConversationID: "",
    type: "3",
    consultId: "",
    message: "",
    patientId: "",
    sourceId: "",
    patientName: "",
  },
  onLoad(e) {
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
        }).then(res => {
          this.setData({
            currentConversationID: `GROUP${e.currentConversationID}`,
            type: e.type,
            consultId: e.consultId,
            sourceId: e.sourceId,
            patientId: e.patientId,
            patientName: e.patientName,
          })
        })
      })
    } else {
      this.setData({
        currentConversationID: `GROUP${e.currentConversationID}`,
        type: e.type,
        consultId: e.consultId,
        sourceId: e.sourceId,
        patientId: e.patientId,
        patientName: e.patientName,
      })
    }
  },
  onUnload() {
    personalReadMessageCallback({
      personalConsultId: this.data.consultId
    })
  },
  // 重新渲染房间
  refreshRoom() {
    // 获取dom元素
    this.selectComponent("#TUIConsultChat").showMessage(this.data.message)
  }
});
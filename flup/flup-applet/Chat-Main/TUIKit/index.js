// TUIKitWChat/Chat/index.js
import constant from './utils/constant';
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    conversationID: {
      type: String,
      value: '',
      observer(conversationID) {
        this.setData({
          outsideConversation: true,
          currentConversationID: conversationID,
        });
      },
    },
    consultId: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          consultId: newVal
        })
      }
    },
    type: {
      type: String,
      value: '',
      observer(type) {
        this.setData({
          type
        })
      }
    },
    patientId: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          patientId: newVal
        })
      }
    },
    patientName: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          patientName: newVal
        })
      }
    },
    // 患者身份证号
    patientCardNo: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          patientCardNo: newVal
        })
      }
    },
    // 患者电话
    patientPhone: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          patientPhone: newVal
        })
      }
    },
    sourceId: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          sourceId: newVal
        })
      }
    },
    isUrlLink: {
      type: Boolean,
      value: false,
      observer(newVal) {
        this.setData({
          isUrlLink: newVal
        })
      }
    }
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    isUrlLink: false,
    type: "1",
    isShowConversation: false,
    isShowConversationList: false,
    currentConversationID: '',
    unreadCount: 0,
    hasCallKit: false,
    outsideConversation: false,
    consultId: "",
    patientId: "",
    sourceId: "",
    patientName: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      if (this.data.outsideConversation) {
        this.currentConversationID({
          detail: {
            currentConversationID: this.data.currentConversationID,
            unreadCount: 0
          }
        })
      }
    },
    currentConversationID(event) {
      this.setData({
        isShowConversation: true,
        currentConversationID: event.detail.currentConversationID,
        unreadCount: event.detail.unreadCount,
      }, () => {
        const TUIChat = this.selectComponent('#TUIChat');
        TUIChat.init();
      });
    },
    handleCall(event) {
      this.TUICallKit = this.selectComponent('#TUICallKit');
      if (event.detail.groupID) {
        this.TUICallKit.groupCall(event.detail);
      } else {
        this.TUICallKit.call(event.detail);
      }
    },
    sendMessage(event) {
      this.selectComponent('#TUIChat').sendMessage(event);
    },
    showMessage(message) {
      this.selectComponent("#TUIChat").showMessage(message)
    }
  },
});
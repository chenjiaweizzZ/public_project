import logger from '../../utils/logger';
import {
  selectGraphicGroupUserInfoList,
  consultDetailsById
} from "../../../../utils/api"

const inputStyle = `
  --padding: 20px
`;

let newInputStyle = `
--padding: 0px
`;

const setNewInputStyle = (number) => {
  const height = number;
  newInputStyle = `--padding: ${height}px`;
};

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 房间ID
    currentConversationID: {
      type: String,
      value: '',
      observer(currentConversationID) {
        this.setData({
          conversationID: currentConversationID,
        });
      },
    },
    // 咨询ID
    consultId: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          consultId: newVal,
        });
      },
    },
    type: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          type: newVal
        })
      }
    },
    // 患者ID
    patientId: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          patientId: newVal
        })
      }
    },
    patientName:{
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          patientName: newVal
        })
      }
    },
    // 医院ID
    sourceId: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          sourceId: newVal
        })
      }
    },
    serialNo: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          serialNo: newVal
        })
      }
    },
  },

  lifetimes: {
    ready() {
      this.init()
      const query = wx.createSelectorQuery().in(this);
      query.select('.message-list').boundingClientRect((rect) => {
        this.setData({
          chatContainerHeight: rect && rect.height ? rect.height : 0
        })
      }).exec();
    },
    // detached() {
    //   personalReadMessageCallback({
    //     personalConsultId: this.data.consultId
    //   })
    // }
  },
  /**
   * 组件的初始数据
   */
  data: {
    patientId: "",
    sourceId: "",
    consultId: "",
    type: "3",
    conversation: {},
    conversationID: '',
    viewData: {
      style: inputStyle,
    },
    chatContainerHeight: 0,
    groupUserInfoList: [], // 群成员列表
    isReferral: null,
    isShowInput: true,
    isOpenAi: false,
    patientName:"",
    serialNo: "",
    referralStatus: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      // 获取房间咨询详情
      this.getConsultDetailsById()
      // 将某会话下的未读消息状态设置为已读
      // wx.$TUIKit.setMessageRead({
      //   conversationID: this.data.conversationID
      // }).then(() => {
      //   logger.log('| TUI-chat | setMessageRead | ok');
      // });
      // 获取会话资料的接口，当点击会话列表中的某个会话时，调用该接口获取会话的详细信息。
      wx.$TUIKit.getConversationProfile(this.data.conversationID).then((res) => {
        const {
          conversation
        } = res.data;
        this.setData({
          conversation,
        });
      });
    },
    /**
     * 获取房间详细信息
     */
    getConsultDetailsById() {
      consultDetailsById({
        consultId: this.data.consultId
      }).then(res => {
        if (res.retCode == 0) {
          let isReferral = res.retData.isReferral
          let referralStatus  = res.retData.referralStatus
          this.setData({
            isReferral,
            referralStatus,
            isOpenAi: res.retData.aiEnabled == 1 ? true : false
          })
          // 获取房间群成员
          this.getGroupUserInfoList()
        }
      })
    },
    // 获取群成员列表
    getGroupUserInfoList() {
      wx.hideLoading()
      selectGraphicGroupUserInfoList({
        roomId: this.data.conversationID.slice(5)
      }).then(res => {
        if (res.retCode == 0) {
          this.setData({
            groupUserInfoList: res.retData
          })
        }
        wx.hideLoading()
      })
    },
    // 将自己发送的消息写进消息列表里面
    sendMessage(event) {
      this.selectComponent('#MessageList').updateMessageList(event.detail.message);
    },
    // 返回上一级
    goBack() {
      wx.reLaunch({
        url: '/pages/index/index'
      })
    },
    // 监听键盘，获取焦点时将输入框推到键盘上方
    pullKeysBoards(event) {
      setNewInputStyle(event.detail.event.detail.height);
      this.setData({
        'viewData.style': newInputStyle,
      }, () => {
        this.selectComponent('#MessageList').updateScrollToBottom();
      });
    },
    // 监听键盘，失去焦点时收起键盘
    downKeysBoards(event) {
      this.setData({
        'viewData.style': inputStyle,
      });
    },
    inputHeightChange() {
      this.selectComponent('#MessageList').updateScrollToBottom();
    },
    triggerClose() {
      this.selectComponent('#MessageInput') && this.selectComponent('#MessageInput').handleClose();
    },
    hideInput() {
      this.setData({
        isShowInput: false
      })
    },
    showMessage(message) {
      this.selectComponent("#MessageList").showMessage(message)
    }
  },
});
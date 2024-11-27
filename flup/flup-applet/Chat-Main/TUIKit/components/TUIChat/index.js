// TUIKit-WChat/Chat/index.js
import logger from '../../utils/logger';
import constant from '../../utils/constant';
import {
  consultDetailsById,
  readMessageCallback,
  selectManagerListByDept,
  doctorInitiatesReferral
} from "../../../../utils/api"
const app = getApp();

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
    unreadCount: {
      type: Number,
      value: '',
      observer(unreadCount) {
        this.setData({
          unreadCount,
        });
      },
    },
    hasCallKit: {
      type: Boolean,
      value: false,
      observer(hasCallKit) {
        this.setData({
          hasCallKit,
        });
      },
    },
    // 咨询ID
    consultId: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          consultId: newVal
        })
        this.getConsultDetailsById()
      }
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
    patientId: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          patientId: newVal
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
    patientName: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          patientName: newVal
        })
      }
    },
    sourceId: {
      type: String,
      value: '',
      observer(newVal) {
        console.log(newVal)
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

  lifetimes: {
    attached() {
      this.getPersonalManagerList()
      // if (app.globalData && app.globalData.reportType === constant.OPERATING_ENVIRONMENT) {
      //   this.setData({
      //     showTips: true,
      //   });
      // }
    },
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
    //   readMessageCallback({
    //     consultId: this.data.consultId
    //   })
    // }
  },
  /**
   * 组件的初始数据
   */
  data: {
    isUrlLink: false,
    patientId: "",
    sourceId: "",
    type: "1",
    consultId: "",
    conversationName: '',
    conversation: {},
    messageList: [],
    isShow: false,
    showImage: false,
    showChat: true,
    conversationID: '',
    config: {
      sdkAppID: '',
      userID: '',
      userSig: '',
      type: 1,
      tim: null,
    },
    unreadCount: 0,
    hasCallKit: false,
    viewData: {
      style: inputStyle,
    },
    KeyboardHeight: 0,
    showTips: false,
    showGroupTips: false,
    showAll: false,
    chatContainerHeight: 0,
    newGroupProfile: {},
    GroupMemberList: [],
    referralStatus: false, // 是否处于转诊状态
    referralUserId: "", // 当前转诊的医生ID
    isShowConsult: false,
    isShowInput: false,
    filterateObj: {},
    isCurrentUser: true,
    PersonalManagerList: [],
    isShowEndConsultationObj: {},
    isOpenAi: false,
    patientName: "",
    extendUserId: "",
    is_health_admin: "",
    patientPhone:'',
    patientCardNo:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取个案管理师
    getPersonalManagerList() {
      selectManagerListByDept({
        hospitalId: "1118033010334208499"
      }).then(res => {
        if (res.retCode == 0) {
          let arr = [];
          const keys = Object.keys(res.retData);
          keys.forEach((item) => {
            res.retData[item].forEach(items => {
              arr.push({
                userId: items.UserId,
                userName: items.name
              })
            })
          });
          this.setData({
            PersonalManagerList: arr
          })
        }
      })
    },
    $getMessageList(e) {
      let userId = wx.getStorageSync('userInfo').UserId
      this.setData({
        filterateObj: e.detail
      })
      if (e.detail.extendUserId && userId != e.detail.userID) {
        this.setData({
          isCurrentUser: false
        })
      } else {
        this.setData({
          isCurrentUser: true
        })
      }
    },
    /**
     * 获取房间详细信息
     */
    getConsultDetailsById() {
      consultDetailsById({
        consultId: this.data.consultId
      }).then(res => {
        if (res.retCode == 0) {
          let obj = res.retData;
          this.setData({
            isShowEndConsultationObj: {
              referralStatus: obj.referralStatus,
              referralUserId: obj.referralUserId,
              activationId: obj.activationId
            },
            isOpenAi: obj.aiEnabled == 1 ? true : false,
          })
          let userInfo = wx.getStorageSync('userInfo')
          let activationId = obj.activationId
          // 获取当前登入用户ID
          let userId = userInfo.UserId
          let is_health_admin = wx.getStorageSync('is_health_admin')
          this.setData({
            is_health_admin: is_health_admin
          })
          // 处于转诊状态表示是医生
          if (obj.referralStatus == true) {
            if (userId == res.retData.referralUserId) {
              this.setData({
                isShowConsult: true,
                isShowInput: true,
              })
            } else {
              this.setData({
                isShowConsult: false,
                isShowInput: false,
              })
            }
          } else {
            // 这个账号是健管师并当前房间的健管师与这个账号的健管师id匹配才显示
            if (is_health_admin && userId == activationId) {
              this.setData({
                isShowConsult: false,
                isShowInput: true,
              })
            } else {
              this.setData({
                isShowConsult: false,
                isShowInput: false
              })
            }
          }
        }
      })
    },
    $getGroupMemberList(e) {
      let index = e.detail.findIndex(item=>{
        return item.extendUserId == wx.$globalData.userID
      })
      if(index > -1){
        e.detail.splice(index,1)
      }
      this.setData({
        GroupMemberList: e.detail
      })
    },
    $getGroupUserInfoList() {
      this.selectComponent('#TUIGroup').getGroupUserInfoList(this.data.conversation.groupProfile.groupID)
    },
    init() {
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
          conversationName: this.getConversationName(conversation),
          conversation,
          isShow: conversation.type === wx.TencentCloudChat.TYPES.CONV_GROUP,
        });
        // if (conversation.type !== wx.TencentCloudChat.TYPES.CONV_GROUP) return;
        // if (!this.data.showTips) {
        //   this.setData({
        //     showGroupTips: true,
        //   });
        // } else {
        //   this.setData({
        //     showAll: true,
        //   });
        // }
      });
    },
    getConversationName(conversation) {
      if (conversation.type === '@TIM#SYSTEM') {
        this.setData({
          showChat: false,
        });
        return '系统通知';
      }
      if (conversation.type === wx.TencentCloudChat.TYPES.CONV_C2C) {
        return conversation.remark || conversation.userProfile.nick || conversation.userProfile.userID;
      }
      if (conversation.type === wx.TencentCloudChat.TYPES.CONV_GROUP) {
        return conversation.groupProfile.name || conversation.groupProfile.groupID;
      }
    },
    sendMessage(event) {
      // 将自己发送的消息写进消息列表里面
      this.selectComponent('#MessageList').updateMessageList(event.detail.message);
    },
    showMessageErrorImage(event) {
      this.selectComponent('#MessageList').sendMessageError(event);
    },
    triggerClose() {
      this.selectComponent('#MessageInput') && this.selectComponent('#MessageInput').handleClose();
    },
    handleCall(event) {
      if (event.detail.conversationType === wx.TencentCloudChat.TYPES.CONV_GROUP) {
        this.selectComponent('#TUIGroup').callShowMoreMember(event);
      } else {
        this.triggerEvent('handleCall', event.detail);
      }
    },
    groupCall(event) {
      const {
        selectedUserIDList,
        type,
        groupID
      } = event.detail;
      const userIDList = selectedUserIDList;
      this.triggerEvent('handleCall', {
        userIDList,
        type,
        groupID
      });
    },
    goBack() {
      if (this.data.isUrlLink == true) {
        wx.reLaunch({
          url: '/pages/index/index'
        })
      } else {
        wx.navigateBack()
      }
      // if (this.data.type == 1) {
      // wx.reLaunch({
      //   url: '/pages/index/index'
      // })
      // } else {
      //   wx.navigateBack()
      // }
    },
    showConversationList() {
      this.triggerEvent('showConversationList');
    },
    changeMemberCount(event) {
      this.selectComponent('#TUIGroup').updateMemberCount(event.detail.groupOperationType);
    },
    resendMessage(event) {
      this.selectComponent('#MessageInput').onInputValueChange(event);
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
    typing(event) {
      const {
        STRING_TEXT,
        FEAT_NATIVE_CODE
      } = constant;
      if (this.data.conversation.type === wx.TencentCloudChat.TYPES.CONV_C2C) {
        if (event.detail.typingMessage.typingStatus === FEAT_NATIVE_CODE.ISTYPING_STATUS && event.detail.typingMessage.actionParam === constant.TYPE_INPUT_STATUS_ING) {
          this.setData({
            conversationName: STRING_TEXT.TYPETYPING,
          });
          setTimeout(() => {
            this.setData({
              conversationName: this.getConversationName(this.data.conversation),
            });
          }, (1000 * 30));
        } else if (event.detail.typingMessage.typingStatus === FEAT_NATIVE_CODE.NOTTYPING_STATUS && event.detail.typingMessage.actionParam === constant.TYPE_INPUT_STATUS_END) {
          this.setData({
            conversationName: this.getConversationName(this.data.conversation),
          });
        }
      }
    },
    handleReport() {
      const url = '/pages/TUI-User-Center/webview/webview?url=https://cloud.tencent.com/apply/p/xc3oaubi98g';
      wx.navigateTo({
        url,
      });
    },
    handleNewGroupProfile(event) {
      const newGroupProfile = event.detail;
      for (let key in newGroupProfile) {
        // 群名称变更
        if (key === 'groupName') {
          const conversationName = newGroupProfile[key];
          this.setData({
            conversationName: conversationName
          })
        }
      }
    },
    contactPatient() {
      let that = this
      console.log(this.data.consultId)
      wx.showModal({
        title: '提示',
        content: '确定联系患者?',
        success (res) {
          if (res.confirm) {
            doctorInitiatesReferral({
              consultId: that.data.consultId
            }).then(res => {
              if(res.retCode == 0) {
                console.log(res)
              }
            })
          } else if (res.cancel) {
          }
        }
      })
    },
    showMessage(message) {
      this.selectComponent("#MessageList").showMessage(message)
    },
  },
});
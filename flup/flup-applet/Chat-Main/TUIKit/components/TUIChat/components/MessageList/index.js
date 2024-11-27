import constant from '../../../../utils/constant';
import {
  selectConsultRecordTime,
  selectGroupUserInfoList,
  consultDetailsById,
  historyQuery,
  imEndConsultation,
  recallMsg,
  satisfaction,
  endConsultationAndReferral,
  referral
} from "../../../../../../utils/api";
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 群信息
    conversation: {
      type: Object,
      value: {},
      observer(newVal) {
        if (!newVal.conversationID) return;
        this.setData({
          conversation: newVal,
        })
        this.init()
      },
    },
    chatContainerHeight: {
      type: Number,
      value: '',
      observer(newVal) {
        this.setData({
          chatContainerHeight: newVal,
        });
      },
    },
    type: {
      type: String,
      value: '',
      observer(type) {
        this.setData({
          type
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
        // this.getConsultDetailsById()
      }
    },
    // 信息过滤条件
    filterateObj: {
      type: Object,
      value: {},
      observer(newVal) {
        if (!newVal.userID) return
        this.setData({
          paramA: newVal.is_health_admin,
          paramB: newVal.timeArr,
          extendUserId: newVal.extendUserId,
          isCurrentUserId: newVal.userID,
          selectName: newVal.name,
          messageList: [],
          nextReqMessageID: '',
          isEnd: false,
          isCompleted: false,
          currentpage: 1,
          enddate: "",
        })
        wx.showLoading({
          title: '加载中',
        })
        this.getMessageList(this.data.conversation)
        this.getShowEnd()
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
    patientName: {
      type: String,
      value: '',
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
    // 健管师显示结束咨询条件
    isShowEndConsultationObj: {
      type: Object,
      value: {},
      observer(newVal) {
        this.setData({
          referralStatus: newVal.referralStatus,
          referralUserId: newVal.referralUserId,
          activationId: newVal.activationId
        })
        this.getShowEnd()
      }
    },
    // 群成员列表
    groupMemberList: {
      type: Array,
      value: [],
      observer(newVal) {
        this.setData({
          groupMemberList: newVal
        })
      }
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    patientId: "", // 患者ID
    sourceId: "", // 医院ID
    consultId: "", // 咨询ID
    type: "", // 房间入口
    conversation: {}, // 当前会话
    messageList: [], // 视图展示的消息列表
    triggered: true,
    nextReqMessageID: '', // 下一条消息标志
    isCompleted: false, // 当前会话消息是否已经请求完毕
    messageID: '',
    checkID: '',
    selectedMessage: {},
    deleteMessage: '',
    RevokeID: '', // 撤回消息的ID用于处理对方消息展示界面
    showName: '',
    showUpJump: false,
    jumpAim: '',
    messageIndex: '',
    isShow: false,
    chargeLastmessage: '',
    groupOperationType: 0,
    messageTime: '',
    messageHistoryTime: '',
    messageTimeID: {},
    showMessageTime: false,
    showMessageHistoryTime: false,
    showMessageError: false,
    personalProfile: {},
    showPersonalProfile: false,
    resendMessage: {},
    newArr: {},
    errorMessage: {},
    errorMessageID: '',
    typingMessage: {},
    isScrollToBottom: true, // 是否在最底部
    chatContainerHeight: 0,
    newGroupProfile: {}, // 修改的群资料
    arr: [], // 消息列表
    paramA: null, // 当前选中医生、健管师身份
    paramB: [], // 过滤时间区间
    extendUserId: "", // 当前选中医生、健管师即时通讯IM那边的ID
    isCurrentUserId: null, // 当前选中医生、健管师ID
    memberList: [], // 群成员列表
    activationId: "", // 当前群聊聊天的医生、健管师ID
    selectName: "", // 当前选中人姓名
    isEnd: false, // 是否拉取完所有消息
    currentpage: 1, // 消息列表分页
    enddate: "", // 拉取视讯平台消息结束时间参数
    isShowEnd: false,
    Show: false,
    identifier: wx.getStorageSync('IMData').identifier,
    showSatisfaction: false,
    satisfactionData: {
      sumValue: 0,
      procedureValue: 0,
      serviceValue: 0,
      advice: ""
    },
    displayReferral: false,
    groupMemberList: [],
    isPc: false
  },

  lifetimes: {
    ready() {
      wx.getSystemInfo({
        success: (res) => {
          if (res.platform === 'windows' || res.platform === 'mac') {
            // PC端代码
            this.setData({
              isPc: true
            })
          } else if (res.platform === 'android' || res.platform === 'ios') {
            return
          } else {
            // 其他平台代码
            this.setData({
              isPc: true
            })
          }
        }
      });
      this.setData({
        identifier: wx.getStorageSync('IMData').identifier
      })
      wx.$TUIKit.on(wx.TencentCloudChat.EVENT.MESSAGE_RECEIVED, this.$onMessageReceived, this);
      wx.$TUIKit.on(wx.TencentCloudChat.EVENT.MESSAGE_REVOKED, this.$onMessageRevoked, this)
    },
    detached() {
      wx.$TUIKit.off(wx.TencentCloudChat.EVENT.MESSAGE_RECEIVED, this.$onMessageReceived);
      wx.$TUIKit.off(wx.TencentCloudChat.EVENT.MESSAGE_REVOKED, this.$onMessageRevoked, this)
    },
  },
  methods: {
    handleCheckReferral() {
      this.setData({
        displayReferral: true
      })
    },
    $handleCloseCards() {
      this.setData({
        displayReferral: false
      })
    },
    // 获取roomId
    getToAccount() {
      if (!this.data.conversation || !this.data.conversation.conversationID) {
        return '';
      }
      switch (this.data.conversation.type) {
        case wx.TencentCloudChat.TYPES.CONV_C2C:
          return this.data.conversation.conversationID.replace(wx.TencentCloudChat.TYPES.CONV_C2C, '');
        case wx.TencentCloudChat.TYPES.CONV_GROUP:
          return this.data.conversation.conversationID.replace(wx.TencentCloudChat.TYPES.CONV_GROUP, '');
        default:
          return this.data.conversation.conversationID;
      }
    },
    // 医生转诊
    $Referral(e) {
      let doctorId = e.detail.userId
      let doctorName = e.detail.userName
      if (this.data.is_health_admin) {
        referral({
          consultId: this.data.consultId,
          doctorId: doctorId,
          doctorName: doctorName
        }).then(res => {
          console.log(res)
          if (res.retCode == 0) {
            wx.showToast({
              title: '转诊成功',
              duration: 800
            });
            // 关闭弹窗
            this.selectComponent("#Referral").handleClose()
            // 重新房间详细信息
            this.triggerEvent("getConsultDetailsById")
          } else {
            wx.showToast({
              title: "转诊失败",
              icon: "error",
              duration: 800
            });
          }
        })
      } else {
        const endUserId = wx.getStorageSync('userInfo').UserId
        endConsultationAndReferral({
          consultId: this.data.consultId,
          targetDoctorId: doctorId,
          targetDoctorName: doctorName
        }).then(res => {
          console.log(res)
          if (res.retCode == 0) {
            wx.showToast({
              title: '转诊成功',
              duration: 800
            });
            // 关闭弹窗
            this.selectComponent("#Referral").handleClose()
            // 重新房间详细信息
            this.triggerEvent("getConsultDetailsById")
          } else {
            wx.showToast({
              title: "转诊失败",
              icon: "error",
              duration: 800
            });
          }
        })
      }
    },
    goInspect() {
      wx.navigateTo({
        url: `/pages/patientInfo/PatientInfo?currentTab=1&activeTreatKey=3&patientId=${this.data.patientId}&hospitalId=${this.data.sourceId}&consultId=${this.data.consultId}&roomType=${this.data.conversation.type}&roomId=${this.getToAccount()}`,
      })
    },
    goTest() {
      wx.navigateTo({
        url: `/pages/patientInfo/PatientInfo?currentTab=1&activeTreatKey=2&patientId=${this.data.patientId}&hospitalId=${this.data.sourceId}&consultId=${this.data.consultId}&roomType=${this.data.conversation.type}&roomId=${this.getToAccount()}`,
      })
    },
    $seeSatisfactionDetail(e) {
      satisfaction(e.detail).then(res => {
        if (res.retData && res.retData.sumValue) {
          this.setData({
            showSatisfaction: true,
            satisfactionData: res.retData
          })
        } else {
          wx.showToast({
            title: '患者未填写',
            icon: 'none'
          })
        }
      })
    },
    $seePrescriptionDetail(e) {
      console.log(e.detail)
      let { detail } = e
      // let webUrl = `${app.globalData.webUrl}/XXX?id=${detail}` //开单信息h5的路径
      let webUrl = `${app.globalData.webUrl}/diagnoseDetail?orderId=${detail}`  //测试路径
      wx.navigateTo({
        url: `/pages/myWebView/myWebView?webUrl=${encodeURIComponent(webUrl)}`,
      })
    },
    Close() {
      this.setData({
        showSatisfaction: false
      })
    },
    // 去除语音播放动画效果
    closePlay() {
      const domInstance = this.selectAllComponents(".my-class")
      domInstance.forEach(item => {
        item.stop()
      })
    },
    // 个管师帮医生结束咨询
    endConsultation() {
      let that = this
      wx.showModal({
        content: '是否结束咨询？结束咨询后患者将自动被转接至个案管理师管理。',
        confirmColor: '#00982D',
        cancelColor: '#666666',
        success(res) {
          if (res.confirm) {
            imEndConsultation({
              consultId: that.data.consultId
            }).then(res => {
              if (res.retCode == 0) {
                // 重新房间详细信息
                that.triggerEvent("getConsultDetailsById")
                wx.showToast({
                  title: '操作成功',
                })
              } else {
                wx.showToast({
                  title: '操作失败',
                  icon: "error"
                })
              }
            })
          }
        }
      })
    },
    // 跳转到患者详情页面
    getMemberProfile(e) {
      let id = e.currentTarget.dataset.value.fromAccount
      if (id == this.data.patientId) {
        wx.navigateTo({
          url: `/pages/patientInfo/PatientInfo?patientId=${this.data.patientId}&hospitalId=${this.data.sourceId}`,
        })
      }
    },
    // 获取咨询详细信息
    getConsultDetailsById() {
      consultDetailsById({
        consultId: this.data.consultId
      }).then(res => {
        if (res.retCode == 0) {
          let obj = res.retData;
          this.setData({
            referralStatus: obj.referralStatus,
            referralUserId: obj.referralUserId,
            activationId: obj.activationId
          })
          this.getShowEnd()
        }
      })
    },
    // 初始化
    async init() {
      // wx.showLoading({
      //   title: '加载中',
      // })
      // 当前登入用户姓名
      this.setData({
        selectName: wx.getStorageSync('userInfo').userName
      })

      // 获取群成员列表
      await selectGroupUserInfoList({
        roomId: this.data.conversation.conversationID.slice(5)
      }).then(res => {
        if (res.retCode == 0) {
          this.setData({
            memberList: res.retData
          })
        }
      })

      // 第一次进入获取当前登入人的会话时间区间
      selectConsultRecordTime({
        consultId: this.data.consultId
      }).then(res => {
        // let UserId = wx.getStorageSync('userInfo').UserId
        let arr = res.retData.filter(item => {
          return item.recordId
        })
        let timeArr = []
        arr.forEach(item => {
          // replace 解决苹果报警告的问题
          let startTime = new Date(item.consultStartTime.replace(/-/g, "/")).getTime()
          let endTime = new Date(item.consultEndTime.replace(/-/g, "/")).getTime()
          timeArr.push([startTime / 1000, endTime / 1000])
        })
        if (timeArr.length > 0) {
          this.setData({
            paramB: timeArr,
            isCompleted: false,
            messageList: []
          })
          this.getMessageList(this.data.conversation)
        } else {
          wx.hideLoading()
          this.setData({
            messageList: []
          })
        }
      })
    },
    /**
     * 获取腾讯即时通讯IM聊天记录
     * @param {object} conversation 房间详细信息 
     */
    getMessageList(conversation) {
      if (!this.data.isCompleted) {
        wx.$TUIKit.getMessageList({
          conversationID: conversation.conversationID,
          nextReqMessageID: this.data.nextReqMessageID,
          count: 15,
        }).then((res) => {
          console.log(res)
          let {
            messageList
          } = res.data; // 消息列表
          this.data.nextReqMessageID = res.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
          this.data.isCompleted = res.data.isCompleted; // 表示是否已经拉完所有消息。
          messageList = this.formatWxMessageList(messageList) // 格式化数据
          this.data.arr = [...messageList, ...this.data.arr]
          if (this.data.arr.length >= 15) {
            let list = [...this.data.arr, ...this.data.messageList]
            this.setData({
              messageList: list,
              triggered: false,
            })
            wx.hideLoading()
            // 确保页面渲染完成在设置jumpAim，否则可能会失效
            wx.nextTick(() => {
              this.setData({
                jumpAim: this.data.arr.length > 0 ? `${this.data.arr[this.data.arr.length - 1].ID}` : "",
                arr: []
              })
            })
          } else {
            // 腾讯即时通讯IM 聊天记录拉完之后，开始拉试训平台的聊天记录
            if (this.data.isCompleted) {
              let list = [...this.data.arr, ...this.data.messageList]
              console.log("list", list)
              // let time = list.length > 0 ? list[0].time : this.format(new Date((enddate - 1) * 1000))
              let time = list.length > 0 ? list[0].time : Math.floor(new Date().getTime() / 1000)
              // let time = this.formatTime(Date.now())
              // let time = Math.floor(new Date().getTime() / 1000)
              this.setData({
                enddate: time
              })
              this.getChatHistory(conversation.conversationID, time)
            } else {
              this.getMessageList(conversation);
            }
          }
        });
      }
    },
    formatTime(time) {
      // 创建一个Date对象
      const date = new Date(time);
      // 获取年份
      const year = date.getFullYear();
      // 获取月份（注意月份是从0开始计数的，所以需要加1）
      const month = date.getMonth() + 1;
      // 获取日期
      const day = date.getDate();
      // 将结果拼接成年月日的格式
      const dateString = `${year}-${month<10?'0'+month:month}-${day<10?'0'+day:day}`;
      return dateString
    },
    /**
     * 获取历史消息记录
     * @param {string} conversationID 咨询ID
     * @param {array} enddate 获取即时通讯最后一条消息发送的时间
     */
    getChatHistory(conversationID, enddate) {
      console.log("endtime",enddate)
      let that = this
      if (!this.data.isEnd) {
        historyQuery({
          enddate: enddate ? that.format(new Date((enddate - 1) * 1000)) : that.format(new Date()),
          pagesize: 15,
          currentpage: that.data.currentpage,
          roomId: conversationID.slice(5)
        }).then(async (res) => {
          let resObj = JSON.parse(res.retData)
          if (resObj.ErrorCode == 0) {
            let serviceMessageList = JSON.parse(resObj.Data)
            // 小于 15 表示聊天记录全部获取完毕
            if (serviceMessageList.length < 15) {
              this.setData({
                isEnd: true
              })
            }
            let messageList = this.formatHistoryMessageList(serviceMessageList)
            this.data.arr = [...messageList.reverse(), ...this.data.arr]
            if (this.data.arr.length >= 15 || this.data.isEnd) {
              wx.hideLoading()
              this.setData({
                messageList: [...this.data.arr, ...this.data.messageList],
                triggered: false,
              })
              wx.nextTick(() => {
                this.setData({
                  jumpAim: this.data.arr.length > 0 ? `${this.data.arr[this.data.arr.length - 1].ID}` : "",
                  arr: [],
                })
              })
            } else {
              this.setData({
                currentpage: this.data.currentpage + 1
              })
              this.getChatHistory(conversationID, enddate)
            }
          }
        })
      }
    },
    // 下拉刷新消息列表
    refresh() {
      wx.showLoading({
        title: '加载中',
      })
      // 表示聊天记录全部获取完毕
      if ((this.data.isCompleted && this.data.isEnd) || this.data.messageList.length < 1) {
        this.setData({
          isCompleted: true,
          isEnd: true,
          triggered: false,
        });
        wx.hideLoading()
        return;
      }
      let enddate = this.data.enddate || this.data.messageList[0].time
      if (!this.data.isCompleted) {
        this.getMessageList(this.data.conversation);
      } else {
        this.setData({
          currentpage: this.data.currentpage + 1
        })
        let conversationID = this.data.conversation.conversationID
        this.getChatHistory(conversationID, enddate)
      }
    },
    // 聊天信息定位到最新一条
    updateScrollToBottom() {
      const ID = `${this.data.messageList[this.data.messageList.length - 1].ID}`;
      this.setData({
        jumpAim: '',
      }, () => {
        this.setData({
          jumpAim: ID
        })
      })
    },
    // 收到的消息
    async $onMessageReceived(value) {
      wx.$TUIKit.setMessageRead({
        conversationID: this.data.conversation.conversationID
      }).then(() => {});
      value.data.forEach((item) => {
        switch (item.type) {
          case 'TIMCustomElem':
            let desc = item.payload.description
            // 重新获取群详细信息
            if (item.conversationID == this.data.conversation.conversationID && desc != 'TIMImageElem') {
              // this.getConsultDetailsById()
              setTimeout(() => {
                this.triggerEvent("getConsultDetailsById")
              }, 500)
            }
            break;
          default:
            break;
        }
      });
      // 当前选中或当前登入的用户id
      let userId = this.data.isCurrentUserId == null ? wx.getStorageSync('userInfo').UserId : this.data.isCurrentUserId
      if (userId == this.data.activationId) {
        const list = [];
        let extendUserId = this.data.extendUserId || wx.getStorageSync('IMData').identifier
        value.data.forEach((item) => {
          if (item.conversationID != this.data.conversation.conversationID) return
          let localMsg = {
            fromAccount: item.from,
            fromAccountNick: "",
            random: 0,
            seq: item.sequence,
            time: item.time,
            subType: 0,
            sessId: item.to,
            sessType: "Group",
            type: item.type,
            ID: `ID-${item.from}-${item.time}`
          }
          switch (item.type) {
            // 文本消息
            case "TIMTextElem":
              localMsg['content'] = item.payload.text
              break
              // 图片消息
            case "TIMImageElem":
              item.payload.imageInfoArray.forEach(imageItem => {
                if (imageItem.type == 3) {
                  localMsg['smallImage'] = imageItem.imageUrl
                } else if (imageItem.type == 2) {
                  localMsg['bigImage'] = imageItem.imageUrl
                } else {
                  localMsg['oriImage'] = imageItem.imageUrl
                }
              })
              break
            case "TIMVideoFileElem":
              localMsg['videoUrl'] = item.payload.videoUrl
              break
              // 自定义消息
            case "TIMCustomElem":
              let desc = item.payload.description
              if (desc == 'TIMImageElem') {
                localMsg.type = 'TIMImageElem'
                localMsg.bigImage = JSON.parse(item.payload.data).imageUrl
              } else if (desc == 'TIMVideoFileElem') {
                localMsg.type = 'TIMVideoFileElem'
                localMsg.videoUrl = JSON.parse(item.payload.data).videoUrl
              } else {
                let contentobj = {}
                contentobj.desc = desc
                contentobj.ext = item.payload.extension
                contentobj.data = JSON.parse(item.payload.data)
                localMsg['content'] = contentobj
              }
              break
              // 语音消息
            case "TIMSoundElem":
              localMsg['content'] = item.payload
              localMsg['payload'] = item.payload
              break
            default:
              localMsg['type'] = 'TIMTextElem'
              localMsg['content'] = "未知消息类型"
              break
          }
          // 自己的消息，显示在右边，别人的消息显示在左边(患者的消息显示在左边，其它的显示在右边)
          console.log(this.data.patientId)
          if (localMsg.fromAccount == this.data.patientId) {
            localMsg.isSend = false
          } else if (localMsg.fromAccount != 'administrator') {
            localMsg.isSend = true
          }
          // 设置发送人姓名
          let newArr = this.data.memberList.filter(items => {
            return localMsg.fromAccount == items.extendUserId
          })
          if (newArr.length > 0) {
            localMsg.name = newArr[0].userName
          } else {
            localMsg.name = "小雅"
          }
          let reg = RegExp(/为您服务/)
          if (localMsg.type == 'TIMCustomElem' && localMsg.content.data.type == 4) {
            if (reg.exec(localMsg.content.data.text)) {
              return false;
            }
          }
          list.push(localMsg);
        });

        this.setData({
          messageList: this.data.messageList.concat(list),
        });
        if (this.data.isScrollToBottom) {
          wx.nextTick(() => {
            this.setData({
              jumpAim: `${this.data.messageList[this.data.messageList.length - 1].ID}`
            })
          })
        }
      }
    },
    // 撤回的消息
    async $onMessageRevoked(value) {
      value.data.forEach((item) => {
        if (item.conversationID != this.data.conversation.conversationID) return
        let index = this.data.messageList.findIndex(items => {
          return items.ID == `ID-${item.from}-${item.time}`
        })
        if (index == -1) return
        let _isRevoked = `messageList[${index}].isRevoked`
        this.setData({
          [_isRevoked]: true
        })
      });
    },
    // 消息上屏
    showMessage(message) {
      this.updateMessageList(message)
    },
    // 自己的消息上屏
    async updateMessageList(message) {
      if (message.conversationID !== this.data.conversation.conversationID) return;
      // 对数据进行格式化处理
      let localMsg = {
        fromAccount: message.from,
        fromAccountNick: "",
        random: 0,
        seq: message.sequence,
        time: message.time,
        subType: 0,
        sessId: message.to,
        sessType: "Group",
        type: message.type,
        ID: `ID-${message.from}-${message.time}`,
        status: message.status
      }
      switch (message.type) {
        // 文本消息
        case "TIMTextElem":
          localMsg['content'] = message.payload.text
          break
          // 图片消息
        case "TIMImageElem":
          message.payload.imageInfoArray.forEach(imageItem => {
            if (imageItem.type == 3) {
              localMsg['smallImage'] = imageItem.imageUrl
            } else if (imageItem.type == 2) {
              localMsg['bigImage'] = imageItem.imageUrl
            } else {
              localMsg['oriImage'] = imageItem.imageUrl
            }
          })
          break
        case "TIMVideoFileElem":
          localMsg['videoUrl'] = item.payload.videoUrl
          break
          // 自定义消息
        case "TIMCustomElem":
          let desc = message.payload.description
          if (desc == 'TIMImageElem') {
            localMsg.type = 'TIMImageElem'
            localMsg.bigImage = JSON.parse(message.payload.data).imageUrl
          } else if (desc == 'TIMVideoFileElem') {
            localMsg.type = 'TIMVideoFileElem'
            localMsg.videoUrl = JSON.parse(message.payload.data).videoUrl
          } else {
            let contentobj = {}
            contentobj.desc = desc
            contentobj.ext = message.payload.extension
            contentobj.data = JSON.parse(message.payload.data)
            localMsg['content'] = contentobj
          }
          break
          break
          // 语音消息
        case "TIMSoundElem":
          localMsg['content'] = message.payload
          localMsg['payload'] = message.payload
          break
        default:
          localMsg['type'] = 'TIMTextElem'
          localMsg['content'] = "未知消息类型"
          break
      }
      // 添加姓名
      let newArr = this.data.memberList.filter(items => {
        return localMsg.fromAccount == items.extendUserId
      })
      if (newArr.length > 0) {
        localMsg.name = newArr[0].userName
      }
      let extendUserId = this.data.extendUserId || wx.getStorageSync('IMData').identifier
      // if (localMsg.fromAccount == extendUserId) {
      //   localMsg.isSend = true
      // }
      if (localMsg.fromAccount == this.data.patientId) {
        localMsg.isSend = false
      } else if (localMsg.fromAccount != 'administrator') {
        localMsg.isSend = true
      }
      wx.$TUIKit.setMessageRead({
        conversationID: this.data.conversation.conversationID
      }).then(() => {});
      this.data.messageList.push(localMsg)
      this.setData({
        messageList: this.data.messageList,
      })
      wx.nextTick(() => {
        this.setData({
          jumpAim: `${this.data.messageList[this.data.messageList.length - 1].ID}`,
        })
      })
    },
    // 获取消息ID
    handleLongPress(e) {
      let message = e.currentTarget.dataset.value
      let bol1 = message.type == "TIMTextElem"
      let bol2 = message.fromAccount == this.data.identifier
      this.setData({
        messageID: message.ID,
        selectedMessage: message,
        Show: bol1 || bol2
      })
    },
    // 撤回消息
    BacktrackingMessage() {
      recallMsg({
        roomId: this.data.conversation.conversationID.slice(5),
        msgSeqList: this.data.selectedMessage.seq
      }).then(res => {
        this.setData({
          Show: false,
        });
      })
    },
    // 复制消息
    copyMessage() {
      wx.setClipboardData({
        data: this.data.selectedMessage.content,
        success() {
          wx.getClipboardData({});
        },
      });
      this.setData({
        Show: false,
      });
    },
    viewImage() {
      wx.previewImage({
        current: this.data.selectedMessage.bigImage, // 当前显示图片的http链接
        urls: [this.data.selectedMessage.bigImage] // 需要预览的图片http链接列表
      })
    },
    // 关闭复制
    handleEditToggleAvatar() {
      this.setData({
        Show: false,
      });
    },
    // 更新 messagelist
    updateMessageByID(deleteMessageID) {
      const {
        messageList
      } = this.data;
      const deleteMessageArr = messageList.filter(item => item.ID === deleteMessageID);
      this.setData({
        messageList,
      });
      return deleteMessageArr;
    },
    // 滑动到最底部置跳转事件为false
    scrollHandler() {
      wx.nextTick(() => {
        this.setData({
          jumpAim: `${this.data.messageList[this.data.messageList.length - 1].ID}`,
          isScrollToBottom: true,
        });
      })
    },
    // 消息发送失败
    sendMessageError(event) {
      this.setData({
        errorMessage: event.detail.message,
        errorMessageID: event.detail.message.ID,
      });
      const errorCode = event.detail.showErrorImageFlag;
      this.handleErrorCode(errorCode);
    },
    // 消息发送失败后重新发送
    ResendMessage() {
      wx.showModal({
        content: '确认重发该消息？',
        success: (res) => {
          if (!res.confirm) {
            return;
          }
          wx.$TUIKit.resendMessage(this.data.errorMessage) // 传入需要重发的消息实例
            .then(() => {
              this.showToast(TOAST_TITLE_TEXT.RESEND_SUCCESS);
              this.setData({
                showMessageError: false,
              });
            })
            .catch((imError) => {
              this.handleErrorCode(imError.code);
            });
        },
      });
    },
    // 处理错误信息
    handleErrorCode(errorCode) {
      const {
        MESSAGE_ERROR_CODE,
        TOAST_TITLE_TEXT
      } = constant;
      switch (errorCode) {
        case MESSAGE_ERROR_CODE.DIRTY_WORDS:
          this.showToast(TOAST_TITLE_TEXT.DIRTY_WORDS);
          break;
        case MESSAGE_ERROR_CODE.UPLOAD_FAIL:
          this.showToast(TOAST_TITLE_TEXT.UPLOAD_FAIL);
          break;
        case MESSAGE_ERROR_CODE.REQUESTOR_TIME || MESSAGE_ERROR_CODE.DISCONNECT_NETWORK:
          this.showToast(TOAST_TITLE_TEXT.CONNECT_ERROR);
          break;
        case MESSAGE_ERROR_CODE.DIRTY_MEDIA:
          this.showToast(TOAST_TITLE_TEXT.DIRTY_MEDIA);
          break;
        case MESSAGE_ERROR_CODE.UNUPLOADED_PICTURE:
          this.showToast(TOAST_TITLE_TEXT.UNUPLOADED_PICTURE);
          break;
        case MESSAGE_ERROR_CODE.UNUPLOADED_MEDIA:
          this.showToast(TOAST_TITLE_TEXT.UNUPLOADED_MEDIA);
          break;
        case MESSAGE_ERROR_CODE.BLACKLIST_MEMBER:
          this.showToast(TOAST_TITLE_TEXT.BLACKLIST_MEMBER);
          break;
        case MESSAGE_ERROR_CODE.NOT_GROUP_MEMBER:
          this.showToast(TOAST_TITLE_TEXT.NOT_GROUP_MEMBER);
          break;
        default:
          break;
      }
    },
    showToast(toastTitle) {
      if (this.data.showMessageError) {
        wx.showToast({
          title: toastTitle,
          duration: 800,
          icon: 'none',
        });
      } else {
        this.setData({
          showMessageError: true,
        });
        wx.showToast({
          title: toastTitle,
          duration: 800,
          icon: 'none',
        });
      }
    },
    // 滚动时触发
    onScroll(event) {
      let isScrollToBottom = false;
      // 滚动条在底部
      const currentScorollPos = Math.round(event.detail.scrollTop + this.data.chatContainerHeight);
      if (event.detail.scrollHeight - currentScorollPos <= 0) {
        isScrollToBottom = true;
      }
      this.setData({
        isScrollToBottom
      })
    },
    sendTextMessage(e) {
      const message = wx.$TUIKit.createTextMessage({
        to: this.data.conversation.conversationID.replace(wx.$TUIKitTIM.TYPES.CONV_C2C, ''),
        conversationType: this.data.conversation.type,
        payload: {
          text: e.detail.text,
        },
      });
      wx.$TUIKit.sendMessage(message).then(() => {
        this.updateMessageList(message)
      })
    },
    // 格式化时间
    format(dateTime) {
      const year = dateTime.getFullYear(); // 2021
      const month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); // 01-12
      const day = dateTime.getDate().toString().padStart(2, '0'); // 01-31
      const hours = dateTime.getHours().toString().padStart(2, '0'); // 00-23
      const minutes = dateTime.getMinutes().toString().padStart(2, '0'); // 00-59
      const seconds = dateTime.getSeconds().toString().padStart(2, '0'); // 00-59
      // 构造最终结果
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    // 格式化即时通讯IM返回的消息列表
    formatWxMessageList(list) {
      let messageList = []
      let is_health_admin = this.data.paramA == null ? wx.getStorageSync('is_health_admin') : this.data.paramA
      // 格式化消息
      list.forEach(item => {
        let localMsg = {
          fromAccount: item.from,
          fromAccountNick: "",
          random: 0,
          seq: item.sequence,
          time: item.time,
          subType: 0,
          sessId: item.to,
          sessType: "Group",
          type: item.type,
          ID: `ID-${item.from}-${item.time}`,
          isRevoked: item.isRevoked
        }
        switch (item.type) {
          // 文本消息
          case "TIMTextElem":
            localMsg['content'] = item.payload.text
            break
            // 图片消息
          case "TIMImageElem":
            item.payload.imageInfoArray.forEach(imageItem => {
              if (imageItem.type == 3) {
                localMsg['smallImage'] = imageItem.imageUrl
              } else if (imageItem.type == 2) {
                localMsg['bigImage'] = imageItem.imageUrl
              } else {
                localMsg['oriImage'] = imageItem.imageUrl
              }
            })
            break
          case "TIMVideoFileElem":
            localMsg['videoUrl'] = item.payload.videoUrl
            break
            // 自定义消息
          case "TIMCustomElem":
            let desc = item.payload.description
            if (desc == 'TIMImageElem') {
              localMsg.type = 'TIMImageElem'
              localMsg.bigImage = JSON.parse(item.payload.data).imageUrl
            } else if (desc == 'TIMVideoFileElem') {
              localMsg.type = 'TIMVideoFileElem'
              localMsg.videoUrl = JSON.parse(item.payload.data).videoUrl
            } else {
              let contentobj = {}
              contentobj.desc = desc
              contentobj.ext = item.payload.extension
              contentobj.data = JSON.parse(item.payload.data)
              localMsg['content'] = contentobj
            }
            break
            // 语音消息
          case "TIMSoundElem":
            localMsg['content'] = item.payload
            localMsg['payload'] = item.payload
            break
          default:
            localMsg['type'] = 'TIMTextElem'
            localMsg['content'] = "未知消息类型"
            break
        }
        messageList.push(localMsg)
      })
      // 消息过滤，过滤出当前选中个管师或医生与患者的聊天记录
      messageList = messageList.filter(item => {
        // let bool = this.data.paramB.some(items => {
        //   return item.time >= items[0] && item.time <= items[1]
        // })
        let bool1 = true
        if (item.type == 'TIMCustomElem' && item.content.data.type == 4) {
          let j = item.content.data.text.indexOf("订单剩余")
          if (j > -1) bool1 = false
          // if (is_health_admin == 1) {
          //   let i = item.content.data.text.indexOf(this.data.selectName)
          //   if (i == -1) bool1 = false
          // } else {
          //   let i = item.content.data.text.indexOf(this.data.selectName)
          //   let j = item.content.data.text.indexOf("已结束")
          //   if (i == -1 && j == -1) bool1 = false
          // }
        }
        // if (bool && bool1) return true
        if (bool1) return true

        return false
      })
      // 为消息列表添加发送人姓名
      messageList.forEach(item => {
        let newArr = this.data.memberList.filter(items => {
          return item.fromAccount == items.extendUserId
        })
        if (newArr.length > 0) {
          item.name = newArr[0].userName
        } else {
          item.name = "小雅"
        }
      })
      // 自己发的消息显示在右边，其它人发的消息显示在左边
      let extendUserId = this.data.extendUserId || wx.getStorageSync('IMData').identifier
      messageList.forEach(item => {
        // if (item.fromAccount == extendUserId) {
        //   item.isSend = true
        // }
        if (item.fromAccount == this.data.patientId) {
          item.isSend = false
        } else if (item.fromAccount != 'administrator') {
          item.isSend = true
        }
      })
      console.log(messageList)
      return messageList
    },
    // 格式化视讯平台返回的消息列表
    formatHistoryMessageList(list) {
      let is_health_admin = this.data.paramA == null ? wx.getStorageSync('is_health_admin') : this.data.paramA
      let messageList = []
      list.forEach(item => {
        let localMsg = {
          fromAccount: item.from_account,
          fromAccountNick: "",
          random: 0,
          seq: item.msg_seq,
          time: new Date(item.msg_timestamp.replace(/-/g, "/")).getTime() / 1000,
          subType: 0,
          sessId: item.group_id,
          sessType: "Group",
          ID: `ID-${item.from_account}-${new Date(item.msg_timestamp.replace(/-/g, "/")).getTime() / 1000}`,
          isRevoked: item.c_id
        }
        item.chats_detail.forEach(elem => {
          switch (elem.msg_type) {
            case "TIMTextElem":
              localMsg['type'] = "TIMTextElem"
              localMsg['content'] = elem.chat_text
              break
            case "TIMImageElem":
              localMsg['type'] = "TIMImageElem"
              elem.image_list.forEach(imageItem => {
                if (imageItem.image_type == 3) {
                  localMsg['smallImage'] = imageItem.image_url
                } else if (imageItem.image_type == 2) {
                  localMsg['bigImage'] = imageItem.image_url
                } else {
                  localMsg['oriImage'] = imageItem.image_url; //原图
                }
              })
              break;
            case "TIMCustomElem":
              if (elem.location_desc == 'TIMImageElem') {
                localMsg['type'] = "TIMImageElem"
                localMsg['bigImage'] = JSON.parse(elem.look_data).imageUrl
              } else if (elem.location_desc == 'TIMVideoFileElem') {
                localMsg['type'] = "TIMVideoFileElem"
                localMsg['videoUrl'] = JSON.parse(elem.look_data).videoUrl
              } else {
                localMsg['type'] = "TIMCustomElem"
                var contentobj = {}
                contentobj.desc = elem.location_desc
                contentobj.ext = elem.define_ext
                if (typeof elem.look_data == 'string') {
                  try {
                    contentobj.data = JSON.parse(elem.look_data)
                    contentobj.data.text = JSON.parse(contentobj.data.text)
                  } catch (e) {}
                } else {
                  contentobj.data = elem.look_data
                }
                localMsg['content'] = contentobj
              }
              break;
            default:
              localMsg['type'] = 'TIMTextElem'
              let content = "消息已过期"
              localMsg['content'] = content
              break;
          }
        })
        messageList.push(localMsg)
      })
      // 过滤出需要展示的数据
      messageList = messageList.filter(item => {
        // let bool = this.data.paramB.some(items => {
        //   return item.time >= items[0] && item.time <= items[1]
        // })
        let bool1 = true
        if (item.type == 'TIMCustomElem' && item.content.data.type == 4) {
          let j = item.content.data.text.indexOf("订单剩余")
          if (j > -1) bool1 = false
          // if (is_health_admin == 1) {
          //   let i = item.content.data.text.indexOf(this.data.selectName)
          //   if (i == -1) bool1 = false
          // } else {
          //   let i = item.content.data.text.indexOf(this.data.selectName)
          //   let j = item.content.data.text.indexOf("已结束")
          //   if (i == -1 && j == -1) bool1 = false
          // }
        }
        // if (bool && bool1) return true
        if (bool1) return true
        return false
      })
      // 自己发的消息显示在右边，其它人发的消息显示在左边
      messageList.forEach(item => {
        let newArr = this.data.memberList.filter(items => {
          return item.fromAccount == items.extendUserId
        })
        if (newArr.length > 0) {
          item.name = newArr[0].userName
        } else {
          item.name = "小雅"
        }
      })
      // 自己发的消息显示在右边，其它人发的消息显示在左边
      let extendUserId = this.data.extendUserId || wx.getStorageSync('IMData').identifier
      messageList.forEach(item => {
        // if (item.fromAccount == extendUserId) {
        //   item.isSend = true
        // }
        if (item.fromAccount == this.data.patientId) {
          item.isSend = false
        } else if (item.fromAccount != 'administrator') {
          item.isSend = true
        }
      })
      return messageList
    },
    // 个案管理师结束咨询按钮显示
    getShowEnd() {
      let userId = this.data.isCurrentUserId == null ? wx.getStorageSync('userInfo').UserId : this.data.isCurrentUserId
      let is_health_admin = this.data.paramA == null ? wx.getStorageSync('is_health_admin') : this.data.paramA
      this.setData({
        // 当前是转诊状态，并且当前登入的是健管师，并且选中的医生是当前转诊的医生
        isShowEnd: this.data.referralStatus && wx.getStorageSync('is_health_admin') == 1 && userId == this.data.activationId && is_health_admin != 1
      })
    }
  }
});
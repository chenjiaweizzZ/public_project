import {
  historyQuery,
  recallMsg
} from "../../../../../../utils/api"

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
        // this.getGroupUserInfoList()
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
    groupUserInfoList: {
      type: Array,
      value: [],
      observer(val) {
        // console.log(val,111)
        if (val && val.length < 1) return
        this.setData({
          groupUserInfoList: val
        })
        // wx.showLoading({
        //   title: '加载中',
        // })
        this.getMessageList(this.data.conversation)
      }
    },
    // 咨询ID
    consultId: {
      type: String,
      value: '',
      observer(newVal) {
        // console.log(newVal)
        this.setData({
          consultId: newVal
        })
      }
    },
    // 是否转介
    isReferral: {
      type: Number,
      value: 0,
      observer(val) {
        this.setData({
          isReferral: val
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
  },
  /**
   * 组件的初始数据
   */
  data: {
    patientId: "",
    sourceId: "",
    isReferral: 0,
    consultId: "",
    type: "",
    conversation: {}, // 当前会话
    messageList: [],
    // 自己的 ID 用于区分历史消息中，哪部分是自己发出的
    scrollView: '',
    triggered: true,
    nextReqMessageID: '', // 下一条消息标志
    isCompleted: false, // 当前会话消息是否已经请求完毕
    jumpAim: '',
    // 是否在最底部
    isScrollToBottom: true,
    chatContainerHeight: 0,
    arr: [],
    extendUserId: "",
    head: "../../../../../../assets/images/head.png",
    isCeshi: false,
    currentpage: 1,
    enddate: "",
    groupUserInfoList: [],
    Show: false,
    selectedMessage: {},
    messageID: "",
    identifier: wx.getStorageSync('IMData').identifier
  },

  lifetimes: {
    // ready() {
    //   this.setData({
    //     identifier: wx.getStorageSync('IMData').identifier
    //   })
    //   wx.$TUIKit.on(wx.TencentCloudChat.EVENT.MESSAGE_RECEIVED, this.$onMessageReceived, this);
    //   wx.$TUIKit.on(wx.TencentCloudChat.EVENT.MESSAGE_REVOKED, this.$onMessageRevoked, this)
    //   wx.$TUIKit.on(wx.TencentCloudChat.TSignaling.NEW_INVITATION_RECEIVED, this.$onInvitationReceived, this)
    // },
    // detached() {
    //   // 一定要解除相关的事件绑定
    //   wx.$TUIKit.off(wx.TencentCloudChat.EVENT.MESSAGE_RECEIVED, this.$onMessageReceived);
    //   wx.$TUIKit.off(wx.TencentCloudChat.EVENT.MESSAGE_REVOKED, this.$onMessageRevoked, this)
    //   wx.$TUIKit.off(wx.TencentCloudChat.TSignaling.NEW_INVITATION_RECEIVED, this.$onInvitationReceived, this)
    // },
    ready() {
      this.getMessageList(this.data.conversation);
    }
  },

  methods: {
    $onInvitationReceived(e) {
      console.log(111)
    },
    // 跳转到患者详情页面
    getMemberProfile(e) {
      const fromAccount = e.currentTarget.dataset.value.fromAccount
      const arr = this.data.groupUserInfoList.filter(item => {
        return item.extendUserId == fromAccount
      })
      if (arr.length > 0 && arr[0].roleName == '患者') {
        wx.navigateTo({
          url: `/pages/patientInfo/PatientInfo?patientId=${this.data.patientId}&hospitalId=${this.data.sourceId}`,
        })
      }
    },
    closePlay() {
      const domInstance = this.selectAllComponents(".my-class")
      domInstance.forEach(item => {
        item.stop()
      })
    },
    // 获取群成员列表
    // getGroupUserInfoList() {
    //   selectPersonalGroupUserInfoList({
    //     roomId: this.data.conversation.groupProfile.groupID
    //   }).then(res => {
    //     if (res.retCode == 0) {
    //       this.setData({
    //         groupUserInfoList: res.retData
    //       })
    //       wx.showLoading({
    //         title: '加载中',
    //       })
    //       this.getMessageList(this.data.conversation)
    //     }
    //   })
    // },
    // 下拉刷新消息列表
    refresh() {
      wx.showLoading({
        title: '加载中',
      })
      if (this.data.isCompleted && this.data.isCeshi) {
        this.setData({
          isCompleted: true,
          isCeshi: true,
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
    // 获取消息列表
    getMessageList(conversation) {
      if (!this.data.isCompleted) {
        wx.$TUIKit.getMessageList({
          conversationID: conversation.conversationID,
          nextReqMessageID: this.data.nextReqMessageID,
          count: 15,
        }).then((res) => {
          let {
            messageList
          } = res.data; // 消息列表
          // console.log(messageList, 111)
          this.data.nextReqMessageID = res.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
          this.data.isCompleted = res.data.isCompleted; // 表示是否已经拉完所有消息。
          messageList = this.formatWxMessageList(messageList)
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
            if (this.data.isCompleted) {
              let list = [...this.data.arr, ...this.data.messageList]
              let time = list.length > 0 ? list[0].time : null
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
    // 获取消息列表
    getChatHistory(conversationID, enddate) {
      let that = this
      if (!this.data.isCeshi) {
        historyQuery({
          enddate: that.format(new Date()),
          pagesize: 15,
          currentpage: that.data.currentpage,
          roomId: conversationID.slice(5)
        }).then(async (res) => {
          let resObj = JSON.parse(res.retData)
          if (resObj.ErrorCode == 0) {
            let serviceMessageList = JSON.parse(resObj.Data)
            if (serviceMessageList.length < 15) {
              this.setData({
                isCeshi: true
              })
            }
            let messageList = this.formatHistoryMessageList(serviceMessageList)
            this.data.arr = [...messageList.reverse(), ...this.data.arr]
            if (this.data.arr.length >= 15 || this.data.isCeshi) {
              this.setData({
                messageList: [...this.data.arr, ...this.data.messageList],
                triggered: false,
              })
              // setTimeout(() => {
              //   wx.hideLoading()
              // }, 3000)
              wx.hideLoading()
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
      let that = this
      wx.$TUIKit.setMessageRead({
        conversationID: this.data.conversation.conversationID
      }).then(() => {});
      const list = [];
      let extendUserId = wx.getStorageSync('IMData').identifier
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
            }else if(desc == '转诊结束'){
              let contentobj = {}
              contentobj.desc = desc
              contentobj.ext = item.payload.extension
              contentobj.data = JSON.parse(item.payload.data)
              localMsg['content'] = contentobj
              that.triggerEvent("getConsultDetailsById")
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
        // 为消息添加姓名
        let newArr = this.data.groupUserInfoList.filter(items => {
          return localMsg.fromAccount == items.extendUserId
        })
        if (newArr.length > 0) {
          localMsg.name = newArr[0].userName
          localMsg.identity = newArr[0].roleName
        } else {
          localMsg.name = "小雅"
        }
        // 自己的消息，显示在右边，别人的消息显示在左边
        if (localMsg.fromAccount == extendUserId) {
          localMsg.isSend = true
        }
        list.push(localMsg);
      });
      this.data.messageList = this.data.messageList.concat(list);
      this.setData({
        messageList: this.data.messageList,
      });
      // console.log(this.data.isScrollToBottom, 111)
      if (this.data.isScrollToBottom) {
        // console.log(111)
        wx.nextTick(() => {
          this.setData({
            jumpAim: `${this.data.messageList[this.data.messageList.length - 1].ID}`
          })
        })
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
        ID: `ID-${message.from}-${message.time}`
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
      // 为消息添加姓名
      let newArr = this.data.groupUserInfoList.filter(items => {
        return localMsg.fromAccount == items.extendUserId
      })
      if (newArr.length > 0) {
        localMsg.name = newArr[0].userName
        localMsg.identity = newArr[0].roleName
      }
      let extendUserId = wx.getStorageSync('IMData').identifier
      if (localMsg.fromAccount == extendUserId) {
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
    // 滑动到最底部置跳转事件为false
    scrollHandler() {
      wx.nextTick(() => {
        this.setData({
          // jumpAim: `${this.data.messageList[this.data.messageList.length - 1].ID}`,
          isScrollToBottom: true,
        });
      })
    },
    // 滚动时触发事件
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
    // 消息发送
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
    // 格式化数据
    formatWxMessageList(list) {
      let messageList = []
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
      // 消息过滤，过滤出一些不必要展示的系统消息
      messageList = messageList.filter(item => {
        console.log(item, 11)
        if (item.content && item.content.data && item.content.data.type == 4) {
          let i = item.content.data.text.indexOf("房间剩余")
          if (i == -1) return true
          return false
        }
        return true
      })
      // 为消息列表添加发送人姓名
      messageList.forEach(item => {
        let newArr = this.data.groupUserInfoList.filter(items => {
          return item.fromAccount == items.extendUserId
        })
        if (newArr.length > 0) {
          item.name = newArr[0].userName
          item.identity = newArr[0].roleName
        } else {
          item.name = "小雅"
        }
      })
      // 自己发的消息显示在右边，其它人发的消息显示在左边
      let extendUserId = wx.getStorageSync('IMData').identifier
      messageList.forEach(item => {
        if (item.fromAccount == extendUserId) {
          item.isSend = true
        }
      })
      return messageList
    },
    formatHistoryMessageList(list) {
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
      // 消息过滤，过滤出一些不必要展示的系统消息
      messageList = messageList.filter(item => {
        if (item.type == 'TIMCustomElem' && item.content.data && item.content.data.type == 4 && typeof item.content.data.text == "String") {
          let i = item.content.data.text.indexOf("房间剩余")
          if (i > -1) return false
        }
        return true
      })
      // 为消息列表添加发送人姓名
      console.log(this.data.groupUserInfoList)
      messageList.forEach(item => {
        let newArr = this.data.groupUserInfoList.filter(items => {
          return item.fromAccount == items.extendUserId
        })
        if (newArr.length > 0) {
          item.name = newArr[0].userName
          item.identity = newArr[0].roleName
        } else {
          item.name = "小雅"
        }
      })
      // 自己发的消息显示在右边，其它人发的消息显示在左边
      let extendUserId = wx.getStorageSync('IMData').identifier
      messageList.forEach(item => {
        if (item.fromAccount == extendUserId) {
          item.isSend = true
        }
      })
      console.log(messageList)
      return messageList
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
    // 关闭复制
    handleEditToggleAvatar() {
      this.setData({
        Show: false,
      });
    },
    showMessage(message) {
      this.updateMessageList(message)
    }
  }
});
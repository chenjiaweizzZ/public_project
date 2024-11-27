import {
  historyQuery,
  selectGroupUserInfoList,
  selectConsultRecordTime,
  satisfaction
} from "../../../../utils/api"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    conversationID: {
      type: String,
      value: '',
      observer(conversationID) {
        if (!conversationID) return
        this.setData({
          currentConversationID: conversationID,
        });
        this.getGroupUserInfoList(conversationID)
      },
    },
    consultId: {
      type: String,
      value: '',
      observer(newVal) {
        if (!newVal) return
        this.setData({
          consultId: newVal
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
      observer(patientId) {
        this.setData({
          patientId
        })
      }
    },
    sourceId: {
      type: String,
      value: '',
      observer(sourceId) {
        this.setData({
          sourceId
        })
      }
    },
  },

  lifetimes: {
    attached() {
      let userId = wx.getStorageSync('userInfo').UserId
      this.setData({
        loginUserId: userId,
      })
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    groupMemberProfile: [], // 群成员
    conversationID: "",
    consultId: "",
    type: "",
    messageList: [], // 展示的消息列表
    messageListAll: [], // 显示的消息列表
    loginUserId: "",
    jumpAim: "",
    currentpage: 1,
    isLoadLastMessage: false,
    paramA: wx.getStorageSync('is_health_admin'),
    paramB: [],
    extendUserId: "",
    memberList: [],
    selectName: wx.getStorageSync('userInfo').userName,
    isEnd: false,
    arr: [],
    triggered: false,
    patientName:"",
    patientId: "",
    sourceId: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转到患者详情页面
    getMemberProfile(e) {
      const fromAccount = e.currentTarget.dataset.value.fromAccount
      console.log(e,this.data.groupUserInfoList)
      const arr = this.data.memberList.filter(item => {
        return item.extendUserId == fromAccount
      })
      console.log(arr)
      if (arr.length > 0 && arr[0].roleName == '患者') {
        wx.navigateTo({
          url: `/pages/patientInfo/PatientInfo?patientId=${this.data.patientId}&hospitalId=${this.data.sourceId}`,
        })
      }
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
    // 下拉刷新消息列表
    refresh() {
      wx.showLoading({
        title: '加载中',
      })
      // 表示聊天记录全部获取完毕
      if (this.data.isEnd) {
        this.setData({
          isEnd: true,
          triggered: false,
        });
        wx.hideLoading()
        return;
      }
      this.setData({
        currentpage: this.data.currentpage + 1
      })
      this.getChatHistory(this.data.conversationID)
    },
    // 获取群成员
    getGroupUserInfoList(id) {
      selectGroupUserInfoList({
        roomId: id.slice(5)
      }).then(res => {
        if (res.retCode == 0) {
          // 过滤掉患者数据
          let arr = res.retData.filter((item) => {
            return item.roleName != "患者"
          })
          let newArr = arr.filter(item => {
            return item.userId == this.data.loginUserId
          })
          this.setData({
            groupMemberProfile: arr.reverse(),
            extendUserId: newArr[0]?.extendUserId,
            memberList: res.retData
          })
          this.init()
        }
      })
    },
    // 获取时间区间
    init() {
      let that = this
      selectConsultRecordTime({
        consultId: that.data.consultId
      }).then(res => {
        wx.showLoading({
          title: '加载中',
        })
        // 获取当前登入用户的userId
        // let UserId = wx.getStorageSync('userInfo').UserId
        let arr = res.retData.filter(item => {
          return item.recordId
        })
        let timeArr = []
        arr.forEach(item => {
          let startTime = new Date(item.consultStartTime.replace(/-/g, "/")).getTime()
          let endTime = new Date(item.consultEndTime.replace(/-/g, "/")).getTime()
          timeArr.push([startTime / 1000, endTime / 1000])
        })
        that.setData({
          paramB: timeArr,
          messageList: []
        })
        this.getChatHistory(this.data.currentConversationID)
      })
    },
    /**
     * 获取历史消息记录
     * @param {string} conversationID 咨询ID
     */
    getChatHistory(conversationID) {
      let that = this
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
              isEnd: true
            })
          }
          let messageList = this.formatHistoryMessageList(serviceMessageList)
          this.data.arr = [...messageList.reverse(), ...this.data.arr]
          if (this.data.arr.length >= 15 || this.data.isEnd) {
            this.setData({
              messageList: [...this.data.arr, ...this.data.messageList],
              triggered: false
            })
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
            this.getChatHistory(conversationID)
          }
        }
      })
    },
    // 点击群成员数据过滤
    handleJumpPage(e) {
      let item = e.currentTarget.dataset.value;
      this.setData({
        messageList: [],
        loginUserId: item.userId,
        extendUserId: item.extendUserId,
        selectName: item.userName,
        paramA: item.roleName == "个案管理师" ? 1 : null,
        isEnd: false,
        currentpage: 1
      })
      selectConsultRecordTime({
        consultId: this.data.consultId
      }).then(res => {
        wx.showLoading({
          title: '加载中',
        })
        let timeArr = []
        let arr = res.retData.filter(items => {
          return items.recordId
        })
        arr.forEach(item => {
          let startTime = new Date(item.consultStartTime.replace(/-/g, "/")).getTime()
          let endTime = new Date(item.consultEndTime.replace(/-/g, "/")).getTime()
          timeArr.push([startTime / 1000, endTime / 1000])
        })
        this.setData({
          paramB: timeArr
        })
        this.getChatHistory(this.data.conversationID)
      })
    },
    // 返回上一级
    goBack() {
      wx.navigateBack()
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
            case "TIMVideoFileElem":
              localMsg['videoUrl'] = item.payload.videoUrl
              break
              // 自定义消息
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
      // 姓名显示
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
        if (item.fromAccount == extendUserId) {
          item.isSend = true
        }
      })
      return messageList
    },
  }
})
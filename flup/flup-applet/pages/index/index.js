import TencentCloudChat from '@tencentcloud/chat';
import TIMUploadPlugin from 'tim-upload-plugin';
import TIMProfanityFilterPlugin from 'tim-profanity-filter-plugin';
import SignalingModule from '@tencentcloud/chat/modules/signaling-module'
import {
  selectCompletedList,
  selectIncompleteList,
  getDoctorUserInfo,
  getPermissions,
  selectPersonalConsultList,
  readMessageCallback,
  personalReadMessageCallback,
  dictPoByDictCode,
  selectPersonalConsultCount,
  selectIncompleteCount,
  getIMData,
  sendMessageCallback
} from "../../utils/api"
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    serveList: [], // 服务完成列表
    selectIncompleteList: [], // 服务中列表
    consultationList: [], // 售前咨询列表
    triggered: false,
    tabs: [{
        label: "售前咨询",
        count: 0,
        index: 0
      },
      {
        label: "服务中",
        count: 0,
        index: 1,
      },
      {
        label: "服务完成",
        count: 0,
        index: 2,
      },
    ],
    currentTab: 0,
    isShowConversation: true,
    pageNo1: 1,
    pageNo2: 1,
    pageNo3: 1,
    is_health_admin: 0,
    display: false,
    currentDate: new Date().getTime(),
    minDate: "",
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
    },
    startTime: "",
    endTime: "",
    selectIndex: 1,
    show: false,
    remark: "",
    personalConsultCount: {},
    incompleteCount: {}
  },
  // 清空日期
  clearTime1() {
    this.setData({
      startTime: "",
      minDate: "",
      maxDate: this.data.endTime ? new Date(this.data.endTime).getTime() : new Date().getTime()
    })
    this.setData({
      pageNo1: 1
    })
    this.getServeList(true);
  },
  clearTime2() {
    this.setData({
      endTime: "",
      minDate: this.data.startTime ? new Date(this.data.startTime).getTime() : "",
      maxDate: new Date().getTime()
    })
    this.setData({
      pageNo1: 1
    })
    this.getServeList(true);
  },
  // 日期改变
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  // 取消选中日期
  onCancel() {
    this.setData({
      display: false
    })
  },
  // 确定选中日期
  onConfirm() {
    if (this.data.selectIndex == 1) {
      this.setData({
        startTime: this.formatTime(this.data.currentDate),
        display: false,
        minDate: this.data.currentDate,
        maxDate: new Date().getTime()
      })
    } else {
      this.setData({
        endTime: this.formatTime(this.data.currentDate),
        display: false,
        maxDate: this.data.currentDate,
        minDate: ""
      })
    }
    this.setData({
      pageNo1: 1
    })
    this.getServeList(true);
  },
  // 日期弹窗显示
  handleShow(event) {
    this.setData({
      display: true,
      selectIndex: event.currentTarget.dataset.value
    })
  },
  onLoad() {
    const token = wx.getStorageSync('token')
    if (token) {
      this.getUserInfo()
      this.getDictPoByDictCode()
    }
  },
  onShow() {
    if (typeof this.getTabBar == 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    const token = wx.getStorageSync('token')
    if (token) {
      this.getServeList(true, this.data.pageNo1 * 20);
      this.getSelectIncompleteList(true, this.data.pageNo2 * 20);
      this.getConsultationList(true, this.data.pageNo3 * 20)
      this.getSelectPersonalConsultCount()
      this.getSelectIncompleteCount()
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
            wx.$TUIKit.addSignalingListener(wx.TencentCloudChat.TSignaling.NEW_INVITATION_RECEIVED, this.onNewInvitationReceived)
          })
        })
      }
    }
  },
  onNewInvitationReceived(e) {
    let data = JSON.parse(e.data.data)
    if (app.globalData.isBusyLine) {
      console.log(e, 222)
      // 忙线
      let obj = {
        type: 1,
        message: "忙线中"
      }
      let promise = wx.$TUIKit.reject({
        inviteID: e.data.inviteID,
        data: JSON.stringify(obj),
      })
      this.sendTIMMessage("忙线中", "忙线中", data.consultId, data.roomId2)
      promise.then(function (imResponse) {
        console.log(111)
      }).catch(function (error) {
        console.log(error, 111)
      });
      return
    }
    app.globalData.isBusyLine = true
    wx.navigateTo({
      url: `../../Setting/pages/accept/accept?roomID=${data.roomId}&roomId2=${data.roomId2}&patientName=${data.userName}&inviteID=${e.data.inviteID}&consultId=${data.consultId}`,
    })
  },
  sendTIMMessage(to, from, consultId, roomId) {
    console.log(to, from, consultId, roomId)
    let userInfo = wx.getStorageSync('userInfo')
    const message = wx.$TUIKit.createCustomMessage({
      to: roomId,
      conversationType: "GROUP",
      payload: {
        desc: "TRTCElem",
        data: JSON.stringify({
          type: 13,
          to,
          from
        })
      },
    });
    wx.$TUIKit.sendMessage(message, {
      offlinePushInfo: {
        disablePush: true,
      },
    }).then(res => {
      let pages = getCurrentPages(); // 当前页面栈
      if (pages.length > 1) {
        let beforePage = pages[pages.length - 1] // 获取上一页面的实例对象
        if (beforePage && beforePage.refreshRoom) {
          beforePage.setData({
            message: message
          })
          beforePage.refreshRoom()
        }
      }
      // 回调接口
      let msg = '【视频通话】'
      sendMessageCallback({
        consultId,
        message: msg,
        sendUserId: userInfo.userId,
        sendUserName: userInfo.userName
      })
    })
  },
  // 获取身份信息
  getUserInfo() {
    // 获取账号身份健管师、医生
    getPermissions().then(res => {
      if (res.retCode == 0) {
        let featureList = res.retData.ret_data.featureList
        let bool = featureList.some(item => {
          return item.feature_id == 678180
        })
        let is_health_admin = !bool ? 0 : 1
        wx.setStorageSync('is_health_admin', is_health_admin)
        this.setData({
          is_health_admin: is_health_admin
        })
        getApp().eventBus.emit('rightChange', this.data.is_health_admin)
      }
    })
    // 获取用户详细信息
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      getDoctorUserInfo({
        getExt: 1
      }).then(res => {
        if (res.retCode == 0) {
          let obj = res.retData;
          wx.setStorageSync('userInfo', obj)
        }
      })
    }
  },
  // 获取已完成列表
  getServeList(refresh, size) {
    let that = this;
    selectCompletedList({
      pageNo: size ? 1 : that.data.pageNo1,
      pageSize: size || 20,
      patientName: that.data.value,
      startDate: that.data.startTime,
      endDate: that.data.endTime
    }).then((res) => {
      if (res.retCode == 0) {
        let list = res.retData.list;
        list.forEach(item => {
          item.serviceStartTime = this.convertTime(item.serviceStartTime)
          item.serviceEndTime = this.convertTime(item.serviceEndTime)
        })
        that.setData({
          serveList: !refresh ? [...that.data.serveList, ...list] : list,
          "tabs[2].count": res.retData.total,
        });
      }
    });
  },
  // 获取服务中列表
  getSelectIncompleteList(refresh, size) {
    let that = this;
    selectIncompleteList({
      pageNo: size ? 1 : that.data.pageNo2,
      pageSize: size || 20,
      patientName: that.data.value,
    }).then((res) => {
      if (res.retCode == 0) {
        let list = res.retData.list;
        list.forEach(item => {
          item.lastReplyTime = item.lastReplyTime && item.lastReplyTime != null ? this.timeago(item.lastReplyTime) : ""
          item.showTime = this.distanceOpenTime(item.expiresTime)
        })
        that.setData({
          selectIncompleteList: !refresh ? [...that.data.selectIncompleteList, ...list] : list,
          "tabs[1].count": res.retData.total,
        });
      }
    });
  },
  // 获取售前咨询列表
  getConsultationList(refresh, size) {
    let that = this;
    selectPersonalConsultList({
      pageNo: size ? 1 : that.data.pageNo3,
      pageSize: size || 20,
      patientName: that.data.value,
    }).then((res) => {
      if (res.retCode == 0) {
        let list = res.retData.list;
        list.forEach(item => {
          item.lastReplyTime = item.lastReplyTime && item.lastReplyTime != null ? this.timeago(item.lastReplyTime) : ""
        })
        that.setData({
          consultationList: !refresh ? [...that.data.consultationList, ...list] : list,
          "tabs[0].count": res.retData.total
        });
      }
    });
  },
  // 获取售前咨询未读消息个数
  getSelectPersonalConsultCount() {
    selectPersonalConsultCount({
      patientName: this.data.value
    }).then(res => {
      if (res.retCode == 0) {
        this.setData({
          personalConsultCount: res.retData
        });
      }
    })
  },
  // 服务中
  getSelectIncompleteCount() {
    selectIncompleteCount({
      patientName: this.data.value
    }).then(res => {
      if (res.retCode == 0) {
        this.setData({
          incompleteCount: res.retData
        });
      }
    })
  },
  // 搜索
  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
  onSearch() {
    this.setData({
      pageNo1: 1,
      pageNo2: 1,
      pageNo3: 1
    })
    this.getSelectIncompleteList(true);
    this.getServeList(true);
    this.getConsultationList(true)
  },
  // tab切换
  changeCurrentTab_(e) {
    let that = this;
    if (that.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,
      });
    }
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current,
    });
  },
  // 下拉刷新
  async onRefresh(event) {
    this.setData({
      triggered: true
    })
    let type = event.currentTarget.dataset.type
    switch (type) {
      // 售前咨询
      case '1':
        this.setData({
          pageNo3: 1
        })
        await this.getConsultationList(true)
        await this.getSelectPersonalConsultCount()
        wx.showToast({
          title: "刷新成功",
        });
        this.setData({
          triggered: false,
        });
        break;
        // 服务中
      case '2':
        this.setData({
          pageNo2: 1
        })
        await this.getSelectIncompleteList(true)
        await this.getSelectIncompleteCount()
        wx.showToast({
          title: "刷新成功",
        });
        this.setData({
          triggered: false,
        });
        break;
        // 服务完成
      case '3':
        this.setData({
          pageNo1: 1
        })
        await this.getServeList(true)
        wx.showToast({
          title: "刷新成功",
        });
        this.setData({
          triggered: false,
        });
        break;
      default:
        break;
    }
  },
  // 上拉加载
  loadMore(event) {
    let type = event.currentTarget.dataset.type
    switch (type) {
      // 售前咨询
      case '1':
        if (this.data.consultationList.length >= this.data.tabs[0].count) {
          wx.showToast({
            title: '没有更多数据了',
            icon: 'none'
          })
        } else {
          this.setData({
            pageNo3: this.data.pageNo3 + 1,
          });
          this.getConsultationList()
        }
        break;
        // 服务中
      case '2':
        if (this.data.selectIncompleteList.length >= this.data.tabs[1].count) {
          wx.showToast({
            title: '没有更多数据了',
            icon: 'none'
          })
        } else {
          this.setData({
            pageNo2: this.data.pageNo2 + 1,
          });
          this.getSelectIncompleteList();
        }
        break;
        // 服务完成
      case '3':
        if (this.data.serveList.length >= this.data.tabs[2].count) {
          wx.showToast({
            title: '没有更多数据了',
            icon: 'none'
          })
        } else {
          let pageNo = this.data.pageNo1 + 1;
          this.setData({
            pageNo1: pageNo,
          });
          this.getServeList();
        }
        break;
      default:
        break;
    }
  },
  // 房间跳转
  async handleRoute1(e) {
    console.log('mmmmmm', e)
    const roomId = e.currentTarget.dataset.item.roomId;
    const consultId = e.currentTarget.dataset.item.consultId
    const patientId = e.currentTarget.dataset.item.patientId
    const sourceId = e.currentTarget.dataset.item.sourceId
    const patientName = e.currentTarget.dataset.item.patientName
    const patientPhone = e.currentTarget.dataset.item.patientPhone
    const patientCardNo = e.currentTarget.dataset.item.patientCardNo
    const serialNo = e.currentTarget.dataset.item.serialNo
    const packageType = e.currentTarget.dataset.item.packageType
    console.log('patientCardNo', patientCardNo)
    await readMessageCallback({
      consultId: consultId
    })
    if (packageType == 1) {
      wx.navigateTo({
        url: `/Chat-Main/pages/graphic?currentConversationID=${roomId}&unreadCount=0&consultId=${consultId}&type=1&sourceId=${sourceId}&patientId=${patientId}&patientName=${patientName}&patientPhone=${patientPhone}&patientCardNo=${patientCardNo}&serialNo=${serialNo}`,
      })
    } else {
      wx.navigateTo({
        url: `/Chat-Main/pages/index?currentConversationID=${roomId}&unreadCount=0&consultId=${consultId}&type=1&sourceId=${sourceId}&patientId=${patientId}&patientName=${patientName}&patientPhone=${patientPhone}&patientCardNo=${patientCardNo}`,
      })
    }
    // console.log(`/Chat-Main/pages/index?currentConversationID=${roomId}&unreadCount=0&consultId=${consultId}&type=1&sourceId=${sourceId}&patientId=${patientId}`)


  },
  async handleRoute3(e) {
    const roomId = e.currentTarget.dataset.item.roomId;
    const consultId = e.currentTarget.dataset.item.id
    const patientId = e.currentTarget.dataset.item.userId
    const sourceId = e.currentTarget.dataset.item.hospitalId
    const patientName = e.currentTarget.dataset.item.patientName || "聊天室"
    const patientPhone = e.currentTarget.dataset.item.patientPhone
    const patientCardNo = e.currentTarget.dataset.item.patientCardNo
    await personalReadMessageCallback({
      personalConsultId: consultId
    })
    wx.navigateTo({
      url: `/Chat-Main/pages/presale?currentConversationID=${roomId}&type=3&consultId=${consultId}&sourceId=${sourceId}&patientId=${patientId}&patientName=${patientName}&patientPhone=${patientPhone}&patientCardNo=${patientCardNo}`,
    });
  },
  handleRoute2(e) {
    console.log(e)
    const roomId = e.currentTarget.dataset.item.roomId;
    const consultId = e.currentTarget.dataset.item.consultId
    const patientId = e.currentTarget.dataset.item.patientId
    const sourceId = e.currentTarget.dataset.item.sourceId
    const patientName = e.currentTarget.dataset.item.patientName
    const patientPhone = e.currentTarget.dataset.item.patientPhone
    const patientCardNo = e.currentTarget.dataset.item.patientCardNo
    const serialNo = e.currentTarget.dataset.item.serialNo
    const packageType = e.currentTarget.dataset.item.packageType
    // wx.navigateTo({
    //   url: `/Chat-Main/pages/graphic?currentConversationID=${roomId}&unreadCount=0&consultId=${consultId}&type=1&sourceId=${sourceId}&patientId=${patientId}&patientName=${patientName}&patientPhone=${patientPhone}&patientCardNo=${patientCardNo}&serialNo=${serialNo}`,
    // })
    if (packageType == 1){
      wx.navigateTo({
        url: `/Chat-Main/pages/graphicEnd?currentConversationID=${roomId}&unreadCount=0&consultId=${consultId}&type=1&sourceId=${sourceId}&patientId=${patientId}&patientName=${patientName}&patientPhone=${patientPhone}&patientCardNo=${patientCardNo}&serialNo=${serialNo}`,
      })
    }else {
      wx.navigateTo({
        url: `../../Chat-Main/pages/end?currentConversationID=${roomId}&unreadCount=0&consultId=${consultId}&type=2&sourceId=${sourceId}&patientId=${patientId}&patientName=${patientName}&patientPhone=${patientPhone}&patientCardNo=${patientCardNo}`,
      });
    }
    
    // 测试数据
    // wx.navigateTo({
    //   url: `../../Chat-Main/pages/end?currentConversationID=543907271924310016&unreadCount=0&consultId=PCT2024051014174768422h&type=1&sourceId=1118033010334208499&patientId=20231027090349777nw2`,
    // });
  },
  // 计算时间
  timeago(lastReplyTime) {
    let date = new Date(lastReplyTime.replace(/-/g, "/"));
    let dateTimeStamp = date.getTime()
    //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
    let result;
    let minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
    let hour = minute * 60;
    let day = hour * 24;
    let week = day * 7;
    let halfamonth = day * 15;
    let month = day * 30;
    let now = new Date().getTime(); //获取当前时间毫秒
    let diffValue = now - dateTimeStamp; //时间差
    if (diffValue < 0) {
      return;
    }
    let minC = diffValue / minute; //计算时间差的分，时，天，周，月
    let hourC = diffValue / hour;
    let dayC = diffValue / day;
    let weekC = diffValue / week;
    let monthC = diffValue / month;
    if (monthC >= 1 && monthC < 4) {
      result = " " + parseInt(monthC) + "月前";
    } else if (weekC >= 1 && weekC < 4) {
      result = " " + parseInt(weekC) + "周前";
    } else if (dayC >= 1 && dayC < 7) {
      result = " " + parseInt(dayC) + "天前";
    } else if (hourC >= 1 && hourC < 24) {
      result = " " + parseInt(hourC) + "小时前";
    } else if (minC >= 1 && minC < 60) {
      result = " " + parseInt(minC) + "分钟前";
    } else if (diffValue >= 0 && diffValue <= minute) {
      result = "刚刚";
    } else {
      let datetime = new Date();
      datetime.setTime(dateTimeStamp);
      let Nyear = datetime.getFullYear();
      let Nmonth =
        datetime.getMonth() + 1 < 10 ?
        "0" + (datetime.getMonth() + 1) :
        datetime.getMonth() + 1;
      let Ndate =
        datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
      let Nhour =
        datetime.getHours() < 10 ?
        "0" + datetime.getHours() :
        datetime.getHours();
      let Nminute =
        datetime.getMinutes() < 10 ?
        "0" + datetime.getMinutes() :
        datetime.getMinutes();
      let Nsecond =
        datetime.getSeconds() < 10 ?
        "0" + datetime.getSeconds() :
        datetime.getSeconds();
      result = Nyear + "-" + Nmonth + "-" + Ndate;
    }
    return result;
  },
  convertTime(timestamp) {
    var date = new Date(timestamp.replace(/-/g, "/"));
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return year + '年' + month + '月' + day + '日';
  },
  distanceOpenTime(showTime) {
    if (!showTime) return null
    const currentTime = new Date()
    const targetTime = new Date(showTime.replace(/-/g, "/"))
    // 计算时间差（以毫秒为单位）
    const timeDiff = targetTime.getTime() - currentTime.getTime()
    // 将时间差转换为小时、分钟和秒数
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(timeDiff / (1000 * 60 * 60) % 24)
    if (days > 0) return `${days} 天`
    if (hours == 0) return '不足1小时'
    return `${hours} 小时`
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
    const dateString = `${year}-${month}-${day}`;
    return dateString
  },
  getDictPoByDictCode: function () {
    dictPoByDictCode({
      dictCode: "AI_SWITCH"
    }).then(res => {
      if (res.retCode == 0) {
        app.globalData.description = res.retData.description
      } else {
        app.globalData.description = '1'
      }
    }).catch(err => {
      app.globalData.description = '1'
    })
  },
  seeRemark(e) {
    this.setData({
      show: true,
      remark: e.currentTarget.dataset.value.remark
    })
  }
});
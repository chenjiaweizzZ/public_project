// pages/patientInfo/PatientInfo.js
import {
  getPatientInfo,
  clinicReportList,
  consultRecord,
  consultOrder,
  consultDetailsById
} from "../../utils/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      label: "健康管理信息",
      index: 0
    }, {
      label: "医疗信息",
      index: 1
    }],
    currentTab: 1,
    activeKey: 0,
    activeTreatKey: 0,
    baseInfo: {
      // patientName:'',
      // sex:'',
      // age:'',
      // phone:'',
      // address:''
    },
    patientId: '',
    hospitalId: '',
    clinicList: [],
    consultList: [],
    orderList: [],
    consultId: "",
    roomId: "",
    roomType: "",
    height1: 0,
    height: 0
  },

  // tab切换
  changeCurrentTab_(e) {
    let that = this
    if (that.data.currentTab === e.currentTarget.dataset.current) {
      return false
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
      if (e.currentTarget.dataset.current == 1 && (!this.data.baseInfo.patientName)) {
        this.getBaseInfo()
      }
    }
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    if (e.currentTarget.dataset.current == 1 && (!this.data.baseInfo.patientName)) {
      this.getBaseInfo()
    }
  },
  onChange(event) {
    this.setData({
      activeKey: event.detail
    })
    if (this.data.activeKey == 2 && (this.data.consultList.length == 0)) {
      this.getConsultList()
    } else if (this.data.activeKey == 3 && this.data.orderList.length == 0) {
      this.getConsultOrderList()
    }
  },
  onTreatChange(event) {
    this.setData({
      activeTreatKey: event.detail
    })
    if (this.data.activeTreatKey == 0 && (!this.data.baseInfo.patientName)) {
      // this.getBaseInfo()
    } else if (this.data.activeTreatKey == 1 && this.data.clinicList.length == 0) {
      this.getClinicList()
    } else if (this.data.activeTreatKey == 2) {

    } else if (this.data.activeTreatKey == 3) {

    } else if (this.data.activeTreatKey == 4) {

    }
  },
  //基本资料
  getBaseInfo() {
    getPatientInfo({
      userId: this.data.patientId,
      hospitalId: this.data.hospitalId
    }).then(res => {
      if (res.retCode == 0) {
        this.setData({
          baseInfo: res.retData
        })
      } else {
        wx.showToast({
          title: res.retInfo,
          icon: 'none'
        })
      }
    })
  },
  //咨询记录
  getConsultList() {
    consultRecord({
      patientId: this.data.patientId,
    }).then(res => {
      if (res.retCode == 0) {
        this.setData({
          consultList: res.retData
        })
      } else {
        wx.showToast({
          title: res.retInfo,
          icon: 'none'
        })
      }
    })
  },
  //订单信息
  getConsultOrderList() {
    consultOrder({
      patientId: this.data.patientId,
    }).then(res => {
      if (res.retCode == 0) {
        res.retData.forEach((i) => {
          // i.hour = '';
          i.text = '';
          if (i.status == 1) {
            i.text = this.getText(i.serviceEndTime)
          }
        })
        this.setData({
          orderList: res.retData
        })
        wx.nextTick(() => {
          let that = this
          const obj = wx.createSelectorQuery();
          obj.selectAll('.clinicItem').boundingClientRect(function (rect) {
            if (rect.length == 0) return
            let height = 0
            let i = that.data.orderList.length - 1
            rect.forEach(item => {
              height += item.height
            })
            that.setData({
              height: height - rect[0].height / 2 - rect[i].height / 2,
              height1: rect[0].height / 2 + 10
            })
          })
          obj.exec();
        })
      } else {
        wx.showToast({
          title: res.retInfo,
          icon: 'none'
        })
      }
    })
  },
  getText(showTime) {
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
  //门诊记录
  getClinicList() {
    clinicReportList({
        userId: this.data.patientId,
        hospitalId: this.data.hospitalId
      })
      .then(res => {
        if (res.retCode == 0) {
          this.setData({
            clinicList: res.retData
          })
        } else {
          wx.showToast({
            title: res.retInfo,
            icon: 'none'
          })
        }
      })
  },
  //跳转聊天室
  toRoom(item) {
    let obj = item.currentTarget.dataset.value;
    consultDetailsById({
      consultId: obj.consultId
    }).then(res => {
      if (res.retCode == 0) {
        let data = res.retData
        if (data.serviceStatus == 1) {
          wx.navigateTo({
            url: `../../Chat-Main/pages/index?currentConversationID=${obj.roomId}&unreadCount=0&consultId=${obj.consultId}&patientId=${this.data.patientId}&hospitalId=${this.data.hospitalId}&type=2`,
          });
        } else {
          // console.log(2222)
          wx.navigateTo({
            url: `../../Chat-Main/pages/end?currentConversationID=${obj.roomId}&unreadCount=0&consultId=${obj.consultId}&patientId=${this.data.patientId}&hospitalId=${this.data.hospitalId}`,
          });
        }
      }
    })
  },
  //跳转门诊病历详情
  toClinicDetail(item) {
    let obj = item.currentTarget.dataset.value;
    wx.navigateTo({
      url: `/pages/clinicDetail/clinicDetail?serialNo=${obj.serialNo}&hospitalId=${this.data.hospitalId}`,
    });
  },
  goBack() {
    wx.navigateBack()
  },
  //添加临时任务（原添加计划）
  toAddDetail() {
    wx.navigateTo({
      // url: '/pages/planAdd/planAdd?' + navigator.encodeObj('webUrl', obj.flupAddress),
      url: `/pages/planAdd/planAdd?patientName=${this.data.baseInfo.patientName}&age=${this.data.baseInfo.age}&sex=${this.data.baseInfo.sex}&userId=${this.data.patientId}&hospitalId=${this.data.hospitalId}&consultId=${this.data.consultId}&roomType=${this.data.roomType}&roomId=${this.data.roomId}`,
    })
  },
  //加入计划
  toAddPlan() {
    wx.navigateTo({
      // url: '/pages/joinGroup/joinGroup?' + navigator.encodeObj('webUrl', obj.flupAddress),
      url: `/pages/joinGroup/joinGroup?patientName=${this.data.baseInfo.patientName}&age=${this.data.baseInfo.age}&sex=${this.data.baseInfo.sex}&userId=${this.data.patientId}&hospitalId=${this.data.hospitalId}&consultId=${this.data.consultId}&roomType=${this.data.roomType}&roomId=${this.data.roomId}`,
    })
  },
  seeEquity(e) {
    let obj = e.currentTarget.dataset.value
    wx.navigateTo({
      url: `/Setting/pages/writeOff/index?orderserialno=${obj.orderSerialNo}&consultPackageName=${obj.consultPackageName}&status=${obj.orderStatus}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.currentTab,options.activeTreatKey)
    this.setData({
      patientId: options.patientId || '202311231112150135dt',
      hospitalId: options.hospitalId || '1118033010334208499',
      consultId: options.consultId,
      roomType: options.roomType,
      roomId: options.roomId,
      currentTab: options.currentTab || 1,
      activeTreatKey: options.activeTreatKey || 0
    })
    this.getBaseInfo();
    this.getConsultList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // console.log(this.data.currentTab,this.data.activeKey)
    if (this.data.activeKey == 1 && this.data.currentTab == 0) {
      //刷新数据
      let planListComponent = this.selectComponent('#planList')
      planListComponent.getFuncsList()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
// pages/referralExamine/referralExamine.js
import {
  getTransferStatus,
  selectRecordList
} from "../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: "",
    currentTab: 0,
    tabs: [{
        label: "门诊转入",
        index: 0
      },
      {
        label: "住院转入",
        index: 1,
      },
    ],
    activeKeyMZ: 0,
    statusListMZ: [],
    statusMZ: "",
    listMZ: [],
    activeKeyZY: 0,
    statusListZY: [],
    statusZY: "",
    listZY: []
  },

  goBack() {
    wx.navigateBack()
  },
  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
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
  swiperTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  referralDetail(e) {
    let item = e.currentTarget.dataset.item
    console.log(item)
    if (item) {
      let review = false
      if (item.actionCodes && item.actionCodes.includes('REVIEW')) review = true
      let recordId = item.recordId
      wx.navigateTo({
        url: `/pages/referralDetail/referralDetail?recordId=${recordId}&review=${review}&currentTab=${this.data.currentTab}`,
      })
    }
  },
  getTransferList() {
    getTransferStatus().then(res => {
      if (res.retCode == 0) {
        let listMZ = res.retData.filter(i => i.statusType == '1' && i.transferType == 'MZ' && i.statusCode !== "DTJ" && i.statusCode !== "YQX" && i.statusCode !== "DKSSH")
        let listZY = res.retData.filter(i => i.statusType == '1' && i.transferType == 'ZY' && i.statusCode !== "DTJ" && i.statusCode !== "YQX")
        let statusMZ = this.data.statusMZ ? this.data.statusMZ : listMZ[0].statusCode
        let statusZY = this.data.statusZY ? this.data.statusZY : listZY[0].statusCode || ""
        this.setData({
          statusListMZ: listMZ,
          statusListZY: listZY,
          statusMZ: statusMZ,
          statusZY: statusZY
        })
        this.searchMZ()
        this.searchZY()
      }
    })
  },
  onSearch() {
    if (this.data.currentTab == 0) {
      this.searchMZ()
    } else if (this.data.currentTab == 1) {
      this.searchZY()
    }
  },
  searchMZ() {
    let params = {
      processStatus: this.data.statusMZ,
      pageNo: 1,
      pageSize: 999,
      applyEndDate: "",
      applyStartDate: "",
      enterPageType: 3,
      patientName: this.data.value
    }
    selectRecordList(params).then(res => {
      if (res.retCode == 0) {
        this.setData({
          listMZ: res.retData.list
        })
      }
    })
  },
  searchZY() {
    let params = {
      processStatus: this.data.statusZY,
      pageNo: 1,
      pageSize: 999,
      applyEndDate: "",
      applyStartDate: "",
      enterPageType: 4,
      patientName: this.data.value
    }
    selectRecordList(params).then(res => {
      if (res.retCode == 0) {
        this.setData({
          listZY: res.retData.list
        })
      }
    })
  },
  statusChange(event) {
    let index = event.detail
    if (this.data.currentTab == 0) {
      let status = this.data.statusListMZ[index].statusCode || ""
      this.setData({
        activeKeyMZ: index,
        statusMZ: status
      })
      this.searchMZ()
    } else if (this.data.currentTab == 1) {
      let status = this.data.statusListZY[index].statusCode || ""
      this.setData({
        activeKeyZY: index,
        statusZY: status
      })
      this.searchZY()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // let that = this
    // that.getTransferList()
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
    let is_health_admin = wx.getStorageSync('is_health_admin')
    let index = is_health_admin == 1 ? 2 : 1
    if (typeof this.getTabBar == 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: index
      })
    }
    this.getTransferList()
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
// pages/income/myIncome.js
import {
  listGroupSelfIncome
} from "../../utils/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: "",
    month: "",
    feeSum: 0,
    dateShow: false,
    date: "",
    myIncomeList: []
  },
  goBack() {
    wx.navigateBack()
  },
  dateOnConfirm(event) {
    this.timestampToDate(event.detail)
    this.setData({
      dateShow: false
    })
  },
  dateOnCancel() {
    this.setData({
      dateShow: false,
    })
  },
  timestampToDate(timestamp) {
    if (typeof timestamp !== 'number' || isNaN(timestamp)) {
      console.error('Invalid timestamp');
      return;
    }
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.error('Failed to create date from timestamp');
      return;
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    this.setData({
      year: year,
      month: month,
      date: new Date(year, month - 1).getTime(),
    })
    this.getIncomeList()
  },
  selecTime() {
    this.setData({
      dateShow: true
    })
  },
  getIncomeList() {
    let myIncomeList = []
    listGroupSelfIncome({
      year: this.data.year,
      month: this.data.month
    }).then(res => {
      myIncomeList = res.retData
      this.setData({
        myIncomeList: myIncomeList,
        feeSum: myIncomeList.reduce((total, obj) => total + (obj.effectiveOrderFee || 0), 0) ? myIncomeList.reduce((total, obj) => total + (obj.effectiveOrderFee || 0), 0) : 0
      })
    })
  },
  iniTime() {
    let currentDate = new Date();
    let previousYear = currentDate.getFullYear();
    let previousMonth = currentDate.getMonth() + 1;
    this.setData({
      year: previousYear,
      month: previousMonth,
      maxDate: new Date(previousYear, previousMonth - 1).getTime(),
      date: new Date(previousYear, previousMonth - 1).getTime()
    })
    this.getIncomeList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.iniTime()
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
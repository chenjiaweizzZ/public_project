// pages/customMessageDetail/index.js
// const navigator = require("../../utils/navigator")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webUrl: '',
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      webUrl: `${decodeURIComponent(options.webUrl)}&isHideSubmit=true`,
      title: options.title
      // webUrl: "https://premisd.zwjk.com/flup/web/h5/#/followUpTaskDetails?serialNo=20231229112406581h10&hospitalId=1118033010334208499"
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.setNavigationBarTitle({
      title: this.data.title,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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
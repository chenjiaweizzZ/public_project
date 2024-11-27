// pages/ncdReportDetail/ncdReportDetail.js
import {
  baseUrl,
} from "../../utils/netUtils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // funcsDetailid: "",
    // hospitalId: "",
    // riskType: ""
    ncdSrc: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.type == 'electronicRecord') {
      wx.nextTick(() => {
        this.setData({
          ncdSrc: decodeURIComponent(options.url)
        })
      })
    } else {
      url = `https://xiangya-zjhm.zwjk.com/flup/web/pc//#/thereportpreview?reportId=${options.funcsDetailid}&hospitalId=${options.hospitalId}&riskType=${options.riskType}&from=phone`;
      this.setData({
        ncdSrc: url
      })
    }
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
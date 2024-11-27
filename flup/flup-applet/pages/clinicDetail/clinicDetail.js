// pages/clinicDetail/clinicDetail.js
import {
  clinicRecordDetail
} from "../../utils/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'门诊详情',
    // patientId:'',
    hospitalId:'',
    serialNo:'',
    recordDetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      // patientId:options.patientId,
      hospitalId:options.hospitalId,
      serialNo:options.serialNo,
    })
    this.getReporterDetail()
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
  getReporterDetail(){
    let  _this = this;
    clinicRecordDetail({serialNo:_this.data.serialNo,hospitalId: _this.data.hospitalId,}).then(res => {
      if (res.retCode == 0) {
        this.setData({
          recordDetail: res.retData
        })
      } else {
        wx.showToast({
          title: res.retInfo,
          icon: 'none'
        })
      }
    }) 
  },
  goBack() {
    wx.navigateBack()
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
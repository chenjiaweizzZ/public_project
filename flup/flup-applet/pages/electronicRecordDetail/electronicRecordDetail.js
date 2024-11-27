// pages/electronicRecordDetail/electronicRecordDetail.js
import {
  labReportDetail
} from "../../utils/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    patientId: '',
    hospitalId: '',
    reportDetail: [],
    labSn: '',
    patientName: '',
    sex: '',
    age: '',
    imagingDiagnosis: '',
    imagingFindings: '',
    accessionNo: '',
    accessionSrc: '',
    patientId2: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options,'lllllllllllllll')
    this.setData({
      title: options.selectIndex == 2 ? '检验报告' : '检查报告',
      patientId: options.patientId,
      hospitalId: options.hospitalId, // 要改
      labSn: options.selectIndex == 2 ? options.labSn : '',
      patientName: options.patientName,
      sex: options.sex,
      age: options.age,
      patientId2: options.patientId2,
      imagingDiagnosis: options.selectIndex == 3 ? options.imagingDiagnosis : '',
      imagingFindings: options.selectIndex == 3 ? options.imagingFindings : '',
      accessionNo: options.selectIndex == 3 ? options.accessionNo : '',
      accessionSrc: options.selectIndex == 3 ? '​https://yxzxyjp.xiangya.com.cn/film/#/thirdParty/viewStudy?accessionNo=' + options.accessionNo + '&locationCode=121000004448850142' : ''
    })
    if (options.selectIndex == 2) {
      this.getReporterDetail()
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
  getReporterDetail() {
    let _this = this;
    labReportDetail({
      labSn: _this.data.labSn,
      patientId: _this.data.patientId2
    }).then(res => {
      if (res.retCode == 0) {
        this.setData({
          reportDetail: res.retData
        })
      } else {
        wx.showToast({
          title: res.retInfo,
          icon: 'none'
        })
      }
    })
  },
  readDetail() {
    let webUrl = `https://yxzxyjp.xiangya.com.cn/film/#/thirdParty/viewStudy?accessionNo=${this.data.accessionNo}&locationCode=121000004448850142`
    wx.navigateTo({
      url: `/pages/ncdReportDetail/ncdReportDetail?accessionNo=${this.data.accessionNo}&type=electronicRecord&url=${encodeURIComponent(webUrl)}`,
    })
  },
  goBack() {
    wx.navigateBack()
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
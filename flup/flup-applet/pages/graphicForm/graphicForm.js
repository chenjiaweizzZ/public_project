// pages/graphicForm/graphicForm.js
import {
  selectConsultGraphicDetail
} from "../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {},
    purposeList: [],
    imageList: []
  },
  goBack() {
    wx.navigateBack()
  },
  getGraphicDetail(orderSerialNo) {
    selectConsultGraphicDetail({
      orderSerialNo
    }).then(res => {
      if (res.retCode == 0) {
        let {
          retData
        } = res
        retData.hasOfflineClinic = [String(retData.hasOfflineClinic)]
        retData.hasOtherSymptom = [String(retData.hasOtherSymptom)]
        retData.durationOfSymptoms = [String(retData.durationOfSymptoms)]
        this.setData({
          form: retData,
          purposeList: retData.consultPurpose.split(",")
        })
        if (retData.platConsultGraphicFilesDtos.length) {
          this.setData({
            imageList: retData.platConsultGraphicFilesDtos.map(i => i.fileUrl),
          })
        }
      }
    })
  },
  previewImage(event) {
    let {
      src,
      imagelist
    } = event.currentTarget.dataset
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imagelist // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getGraphicDetail(options.orderSerialNo)
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
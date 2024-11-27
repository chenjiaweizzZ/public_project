import {
  queryEmrDischargeRecordDetail
} from "../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    queryEmrDischargeRecordDetail({
      serialNo: options.serialNo
    }).then(res => {
      this.setData({
        detail: res.retData
      })
    })
  },

  goBack() {
    wx.navigateBack()
  }
})
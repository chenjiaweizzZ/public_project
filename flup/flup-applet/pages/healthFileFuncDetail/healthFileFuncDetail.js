// pages/healthFileFuncDetail/healthFileFuncDetail.js
import {
  baseUrl,
} from "../../utils/netUtils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeName: ['用药指导', '运动方案', '饮食建议'],
    title: "",
    funcDetail: [],
    titieIndex: null,
    patientId: '',
    id: ''
  },

  /**
   * 获取数据
   */
  getDetail() {
    wx.request({
      url: `${baseUrl}/c/flup/patient/items/queryInfo?id=${this.data.id}&typeName=${this.data.title}`,
      method: "GET",
      success: (res) => {
        this.setData({
          funcDetail: res.data.retData
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    that.setData({
      titieIndex: options.index,
      title: that.data.typeName[options.index],
      id: options.id
      // patientId: options.patientId
    })
    that.getDetail()
  },

  goBack() {
    wx.navigateBack()
  },
})
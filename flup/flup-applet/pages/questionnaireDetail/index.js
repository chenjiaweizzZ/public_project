import {
  queryTemplateContent,
} from "../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottomSafeArea: "", // 底部安全距离
    questionnaireDatail: {}, // 问卷详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getQueryTemplateContent(options.id)
    let that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          bottomSafeArea: res.screenHeight - res.safeArea.bottom
        })
      }
    })
  },

  /**
   * 返回上一级
   */
  goBack() {
    wx.navigateBack()
  },

  /**
   * 获取历史问卷详情
   */
  getQueryTemplateContent(serialNo) {
    queryTemplateContent({
      serialNo,
      hospitalId: wx.getStorageSync('userInfo').UnitId || '1118033010334208499'
    }).then(res => {
      let result = JSON.parse(res.retData.result)
      this.setData({
        questionnaireDatail: result
      })
    })
  }
})
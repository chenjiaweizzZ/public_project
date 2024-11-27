import {
  queryFollowUpContent,
} from "../../utils/api.js"

const app = getApp()
Page({

  onSearch(event){
    let v = event.detail
    if(!v){
      this.setData({
        filterContentList: this.data.contentList
      })
    }else {
      let list = this.data.contentList.filter(
        item => item.questionnaireName.indexOf(v) != -1
      );
      this.setData({
        filterContentList: list
      })
    }
  },

  Cancel(){
    wx.navigateBack()
  },

  Confirm(){
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.setData({
      flupContentId: this.data.flupContentId,
      planContent: this.data.flupContent
    })
    wx.navigateBack()
  },

  radioChange(e) {
    // 模板 id
    let flupContentId = e.detail.value
    let flupContent = ""
    let flupContentItem = this.data.contentList.find((i) => {
      return i.serialNo == flupContentId
    })
    flupContent = flupContentItem.questionnaireName
    this.setData({
      flupContentId: flupContentId,
      flupContent: flupContent
    })
  },
  /**
   * 获取任务内容
   */
  getQueryFollowUpContent() {
    queryFollowUpContent({
        name: this.data.taskType,
        hospitalId: this.data.hospitalId,
      })
      .then(res => {
        if (res.retCode == 0) {
          this.setData({
            filterContentList: JSON.parse(JSON.stringify(res.retData)),
            contentList: res.retData
          })
        } else {
          wx.showToast({
            title: res.retInfo,
            icon: 'none'
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
   * 查看内容详情
   */
  goDetail(v) {
    let obj = v.currentTarget.dataset.value
    let token = wx.getStorageSync("token")
    let url = this.data.taskType == "健康宣教" ? `${app.globalData.webUrl}/jkxj?serialNo=${obj.serialNo}&hospitalId=${obj.hospital}&isWeChat=true&token=${token}` : `${app.globalData.webUrl}/dcwj?serialNo=${obj.serialNo}&hospitalId=${obj.hospital}&isWeChat=true&token=${token}`
    wx.navigateTo({
      url: `/pages/customMessageDetail/index?webUrl=${encodeURIComponent(url)}&title=${this.data.taskType}`,
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    taskType: "",
    hospitalId: "",
    contentList: [],
    bottomSafeArea: "", // 底部安全距离
    value: "",
    flupContent: "",
    flupContentId: "",
    filterContentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    that.setData({
      taskType: options.taskType,
      hospitalId: options.hospitalId
    })
    that.getQueryFollowUpContent()
    wx.getSystemInfo({
      success(res) {
        that.setData({
          bottomSafeArea: res.screenHeight - res.safeArea.bottom
        })
      }
    })
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
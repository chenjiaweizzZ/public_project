import {
  queryConsultHistoryQuestionnaire,
  queryLastConsultQuestionnaire,
  sendConsultTemplateRoom,
  sendMessageCallback
} from "../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      label: "最新问卷",
      index: 0
    }, {
      label: "历史问卷",
      index: 1
    }],
    currentTab: 0,
    questionnaireList: [],
    bottomSafeArea: "", // 底部安全距离
    pageNo: 1,
    total: 0,
    questionnaireDatail: {}, // 问卷详情
    consultId: "", // 咨询id
    patientId: "", // 患者id
    roomType: "", // 房间类型
    roomId: "", // 房间Id
    sourceId: "", // 医院ID
    triggered: false,
    userInfo: {}
  },

  /**
   * 返回上一级页面
   */
  goBack() {
    wx.navigateBack()
  },

  /**
   * tab 切换
   */
  changeCurrentTab_(e) {
    let that = this
    if (that.data.currentTab === e.currentTarget.dataset.current) {
      return false
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },

  /**
   * 滑块切换
   */
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    this.setData({
      consultId: options.consultId,
      patientId: options.patientId,
      roomType: options.roomType,
      roomId: options.roomId,
      sourceId: options.hospitalId,
      userInfo: wx.getStorageSync("userInfo")
    })
    that.getQueryConsultHistoryQuestionnaireList()
    that.getQueryLastConsultQuestionnaire()
    wx.getSystemInfo({
      success(res) {
        that.setData({
          bottomSafeArea: res.screenHeight - res.safeArea.bottom
        })
      }
    })
  },

  /**
   * 跳转到问卷详情
   */
  goDetail(event) {
    let id = event.currentTarget.dataset.value.serialNo
    wx.navigateTo({
      url: `/pages/questionnaireDetail/index?id=${id}`,
    })
  },

  /**
   * 获取历史记录
   */
  async getQueryConsultHistoryQuestionnaireList() {
    await queryConsultHistoryQuestionnaire({
      hospitalId: this.data.sourceId,
      targetUserId: this.data.patientId,
      pageNo: this.data.pageNo,
      pageSize: 20
    }).then(res => {
      if (res.retCode == 0) {
        this.setData({
          questionnaireList: [...res.retData.list, ...this.data.questionnaireList],
          total: res.retData.total
        })
      }
    })
  },

  /**
   * 获取最新问卷详情
   */
  getQueryLastConsultQuestionnaire() {
    queryLastConsultQuestionnaire({
      hospitalId: this.data.sourceId,
      targetUserId: this.data.patientId,
    }).then(res => {
      if (res.retCode == 0) {
        let result = JSON.parse(res.retData.result)
        this.setData({
          questionnaireDatail: result
        })
      }
    })
  },

  /**
   * 推送问卷
   */
  pushQuestionnaire() {
    sendConsultTemplateRoom({
      userId: this.data.patientId,
      hospitalId: this.data.sourceId,
      consultId: this.data.consultId
    }).then(res => {
      if (res.retCode == 0) {
        let { url, packageName } = res.retData
        // 创建消息
        const message = wx.$TUIKit.createCustomMessage({
          to: this.data.roomId,
          conversationType: this.data.roomType,
          payload: {
            description: "问卷",
            data: JSON.stringify({
              url,
              packageName,
              type: 3
            })
          },
        });
        wx.$TUIKit.sendMessage(message, {
          offlinePushInfo: {
            disablePush: true,
          },
        }).then(res => {
          wx.showToast({
            title: '推送成功'
          })
          let pages = getCurrentPages(); // 当前页面栈
          if (pages.length > 1) {
            let beforePage = pages[pages.length - 2] // 获取上一页面的实例对象
            beforePage.setData({
              message: message
            })
            beforePage.refreshRoom()
          }
          // 回调接口
          let msg = ''
          switch (message.type) {
            case 'TIMTextElem':
              msg = message.payload.text
              break;
            case 'TIMImageElem':
              msg = "你有一条新的图片消息"
              break;
            case 'TIMVideoFileElem':
              msg = "你有一条新的视频消息"
              break;
            case 'TIMSoundElem':
              msg = "你有一条新的语言消息"
              break;
            case 'TIMCustomElem':
              msg = "你有一条新的问卷消息"
              break;
            default:
              msg = "你有一条新的消息"
              break;
          }
          sendMessageCallback({
            consultId: this.data.consultId,
            message: msg,
            sendUserId: this.data.userInfo.userId,
            sendUserName: this.data.userInfo.userName
          })
        })
      }
    })
  },

  /**
   * 下拉刷新数据
   */
  async onRefresh() {
    this.setData({
      triggered: true,
      questionnaireList: []
    })
    await this.getQueryConsultHistoryQuestionnaireList()
    wx.showToast({
      title: "刷新成功",
    });
    this.setData({
      triggered: false,
    });
  },

  /**
   * 上拉加载更多
   */
  loadMore() {
    if (this.data.questionnaireList.length >= this.data.total) {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none'
      })
    } else {
      this.setData({
        pageNo: this.data.pageNo + 1,
      });
      this.getQueryConsultHistoryQuestionnaireList()
    }
  }
})
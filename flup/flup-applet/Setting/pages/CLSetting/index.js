import {
  commonPhrasesQuery,
  commonPhrasesDelete,
  commonPhrasesExchangeOrder,
  commonPhrasesSave
} from "../../../utils/api"
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      label: "基本内容",
      index: 0,
      count: 0,
    }, {
      label: "自定义内容",
      index: 1,
      count: 0
    }],
    currentTab: 0,
    triggered: false, // 自定义刷新显示
    basicContentList: [], // 基本内容列表
    customContentList: [], // 自定义内容列表
    bottomSafeArea: "", // 底部安全距离
    type: 1, // 1基本内容,2自定义内容
    pageNo1: 1,
    pageNo2: 1,
    total1: 0,
    total2: 0,
    show: false, // 新增编辑常用语弹窗
    value: "", // 新增常用语内容
    phrasesId: "" // 编辑必传
  },

  /**
   * 返回上一级
   */
  goBack() {
    wx.navigateBack()
  },

  /**
   * 取消编辑、新增
   */
  onClose() {
    this.setData({
      show: false,
      value: "",
      phrasesId: ""
    })
  },

  /**
   * 导航切换
   */
  changeCurrentTab_(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.current,
    });
  },

  /**
   * 滑动切换
   */
  swiperTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },

  /**
   * 获取通用常用语 
   */
  getCommonPhrasesQueryList1() {
    commonPhrasesQuery({
      pageNo: this.data.pageNo1,
      pageSize: 20,
      phrasesType: 1
    }).then(res => {
      if (res.retCode == 0) {
        this.setData({
          basicContentList: [...this.data.basicContentList, ...res.retData.list],
          total1: res.retData.total
        })
      }
    })
  },

  /**
   * 获取自定义常用语
   */
  getCommonPhrasesQueryList2() {
    commonPhrasesQuery({
      pageNo: this.data.pageNo2,
      pageSize: 20,
      phrasesType: 0
    }).then(res => {
      if (res.retCode == 0) {
        this.setData({
          customContentList: [...this.data.customContentList, ...res.retData.list],
          total2: res.retData.total
        })
      }
    })
  },

  /**
   * 新增常用语
   */
  Add() {
    this.setData({
      show: true
    })
  },

  /**
   * 保存常用语
   */
  Determine() {
    if (!this.data.value) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
    } else {
      commonPhrasesSave({
        contents: this.data.value.slice(0, 500),
        phrasesId: this.data.phrasesId
      }).then(res => {
        if (res.retCode == 0) {
          wx.showToast({
            title: '保存成功',
          })
          this.onClose()
          this.setData({
            customContentList: []
          })
          this.getCommonPhrasesQueryList2()
        }
      })
    }
  },

  /**
   * 向上
   */
  Up(event) {
    let obj = event.currentTarget.dataset.item
    commonPhrasesExchangeOrder({
      phrasesId: obj.phrasesId,
      changeNum: '-1'
    }).then(res => {
      if (res.retCode == 0) {
        this.setData({
          customContentList: []
        })
        this.getCommonPhrasesQueryList2()
      }
    })
  },

  /**
   * 向下
   */
  Down(event) {
    let obj = event.currentTarget.dataset.item
    commonPhrasesExchangeOrder({
      phrasesId: obj.phrasesId,
      changeNum: '1'
    }).then(res => {
      if (res.retCode == 0) {
        this.setData({
          customContentList: []
        })
        this.getCommonPhrasesQueryList2()
      }
    })
  },

  /**
   * 编辑
   */
  Edit(event) {
    let obj = event.currentTarget.dataset.item
    this.setData({
      show: true,
      value: obj.contents,
      phrasesId: obj.phrasesId
    })
  },
  /**
   * 删除
   */
  Delete(event) {
    let that = this
    let obj = event.currentTarget.dataset.item
    Dialog.confirm({
        context: this,
        message: '是否删除该常用语？',
        confirmButtonText: "是",
        cancelButtonText: "否"
      })
      .then(() => {
        commonPhrasesDelete({
          phrasesId: obj.phrasesId
        }).then(res => {
          if (res.retCode == 0) {
            wx.showToast({
              title: '删除成功',
            })
            that.setData({
              customContentList: []
            })
            that.getCommonPhrasesQueryList2()
          }
        })
      })
      .catch(() => {});
  },

  /**
   * 输入框内容改变
   */
  handleInput(event) {
    this.setData({
      value: event.detail.value
    })
  },

  /**
   * 下拉刷新
   */
  async onRefresh(event) {
    this.setData({
      triggered: true
    })
    let type = event.currentTarget.dataset.type
    switch (type) {
      // 基本内容
      case '1':
        this.setData({
          basicContentList: []
        })
        this.getCommonPhrasesQueryList1()
        break;
        // 自定义内容
      case '2':
        this.setData({
          customContentList: []
        })
        this.getCommonPhrasesQueryList2()
        break;
      default:
        break;
    }
    wx.showToast({
      title: "刷新成功",
    });
    this.setData({
      triggered: false,
    });
  },

  /**
   * 上拉加载
   */
  loadMore(event) {
    let type = event.currentTarget.dataset.type
    switch (type) {
      // 基本内容
      case '1':
        if (this.data.basicContentList.length >= this.data.total1) {
          wx.showToast({
            title: '没有更多数据了',
            icon: 'none'
          })
        } else {
          this.setData({
            pageNo1: this.data.pageNo1 + 1,
          });
          this.getCommonPhrasesQueryList1()
        }
        break;
        // 自定义内容
      case '2':
        if (this.data.customContentList.length >= this.data.total2) {
          wx.showToast({
            title: '没有更多数据了',
            icon: 'none'
          })
        } else {
          this.setData({
            pageNo2: this.data.pageNo2 + 1,
          });
          this.getCommonPhrasesQueryList2()
        }
        break;
      default:
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    that.getCommonPhrasesQueryList1()
    that.getCommonPhrasesQueryList2()
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
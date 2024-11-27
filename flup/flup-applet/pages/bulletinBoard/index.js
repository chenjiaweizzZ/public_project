import {
  getToDoFlupTask,
  deleteFuFlupPatientPlan,
  savePhoneFlupRecord
} from "../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    checked: false,
    show: false,
    date: "",
    currentDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    show1: false,
    list: [],
    detail: {}
  },
  getAgencyWork(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    getToDoFlupTask({
      day: day,
      month: month,
      year: year.toString(),
      flupType: ["消息提醒"],
      toDoFlag: this.data.checked ? 1 : 2
    }).then(res => {
      this.setData({
        list: res.retData
      })
    })
  },

  goDetail(e) {
    let obj = e.currentTarget.dataset.value
    obj.flupContent = obj.flupContent.replace(/<br>/g, '\n')
    this.setData({
      detail: obj,
      show1: true
    })
  },

  onComplete() {
    savePhoneFlupRecord({
      serialNo: this.data.detail.serialNo,
      flupState: 1,
      bToken: wx.getStorageSync("token")
    }).then(res => {
      if (res.retCode == 0) {
        wx.showToast({
          title: '操作成功',
        })
        this.onClose1()
        this.getAgencyWork(new Date(this.data.date).getTime())
      } else {
        wx.showToast({
          title: '操作失败',
          icon: 'error'
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '操作失败',
        icon: 'error'
      })
    })
  },

  onVoid() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定要将该随访任务作废吗?',
      success(res) {
        if (res.confirm) {
          deleteFuFlupPatientPlan({
            serialNo: that.data.detail.serialNo
          }).then(res => {
            if (res.retCode == 0) {
              wx.showToast({
                title: '操作成功',
              })
              that.onClose1()
              that.getAgencyWork(new Date(that.data.date).getTime())
            } else {
              wx.showToast({
                title: '操作失败',
                icon: 'error'
              })
            }
          }).catch(err => {
            wx.showToast({
              title: '操作失败',
              icon: 'error'
            })
          })
        }
      }
    })
  },

  /**
   * 选择日期
   */
  selectDate() {
    this.setData({
      show: true,
      currentDate: this.data.date ? new Date(this.data.date).getTime() : new Date().getTime()
    });
  },

  /**
   * 格式化日期
   */
  timestampToDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  onChange(event) {
    // 需要手动对 checked 状态进行更新
    this.setData({
      checked: event.detail
    });
    this.getAgencyWork(new Date(this.data.date).getTime())
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  onClose1() {
    this.setData({
      show1: false
    });
  },

  onCancel() {
    this.setData({
      show: false,
      currentDate: this.data.value ? this.data.value : new Date().getTime()
    });
  },

  onConfirm() {
    this.setData({
      date: this.timestampToDate(this.data.currentDate)
    })
    this.onCancel()
    this.getAgencyWork(new Date(this.data.date).getTime())
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      date: this.timestampToDate(new Date().getTime())
    })
    this.getAgencyWork(new Date(this.data.date).getTime())
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar == 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  }
})
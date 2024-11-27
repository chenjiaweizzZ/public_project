// TUIKit/components/TUIChat/components/MessagePrivate/Referral/referral.js
// import Toast from '@vant/weapp/toast/toast';
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    display: {
      type: Boolean,
      value: '',
      observer(newVal) {
        this.setData({
          displayTag: newVal,
        });
      },
    },
    columns: {
      type: Array,
      value: [],
      observer(newVal) {
        this.setData({
          columns: newVal,
          userId: newVal && newVal.length > 0 ? newVal[0].userId : ''
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    displayTag: false,
    columns: [],
    userId: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClose() {
      this.triggerEvent('close', {
        key: '0',
      });
    },
    onChange(event) {
      this.setData({
        userId: event.detail.value.userId
      })
    },
    onReferral() {
      if (!this.data.userId) {
        wx.showToast({
          title: '请选择转诊人员',
          icon: 'none'
        })
      } else {
        this.triggerEvent("Referral", {
          userId: this.data.userId,
          userName: this.getUserName(this.data.userId)
        })
      }

    },
    getUserName(userId) {
      let arr = this.data.columns.filter(item => {
        return item.userId == userId
      })
      return arr[0].userName
    }
  }
})
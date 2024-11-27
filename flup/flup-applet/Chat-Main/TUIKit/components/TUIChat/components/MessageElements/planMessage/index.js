Component({

  /**
   * 组件的属性列表
   */
  properties: {
    message: {
      type: Object,
      value: {},
      observer(newVal) {
        this.setData({
          message: newVal
        });
      },
    },
    isMine: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    message: {},
    isMine: false
  },
  methods: {
    goDetail() {
      if (this.data.message.content.data.taskType == '消息提醒') return
      let url = this.data.message.content.data.url
      wx.navigateTo({
        url: `/pages/customMessageDetail/index?webUrl=${encodeURIComponent(url)}&title=${this.data.message.content.data.taskType}`,
      })
    }
  }
})
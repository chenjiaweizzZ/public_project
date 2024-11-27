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
    message: {}
  },
  methods: {
    goDetail() {
      let url = this.data.message.content.data.url
      console.log(url)
      wx.navigateTo({
        url: `/pages/customMessageDetail/index?webUrl=${encodeURIComponent(url)}&title=问卷`,
      })
    }
  }
})
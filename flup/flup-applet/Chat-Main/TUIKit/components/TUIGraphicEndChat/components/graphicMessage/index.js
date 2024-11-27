Component({

  /**
   * 组件的属性列表
   */
  properties: {
    message: {
      type: Object,
      value: {},
      observer(newVal) {
        if (!newVal) return
        if (newVal?.content?.data?.text) {
          console.log(newVal?.content?.data?.text)
          let message = JSON.parse(newVal?.content?.data?.text)
          this.setData({
            message: message
          });
        }
      },
    },
  },
  data: {
    message: {},
  },
  methods: {
    goDetail() {
      wx.navigateTo({
        url: `/pages/graphicForm/graphicForm?orderSerialNo=${this.data.message.orderSerialNo}`,
      })
    }
  }
})
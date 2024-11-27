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
      wx.downloadFile({
        url: this.data.message.content.data.url,
        timeout: 0,
        success: result => {
          if (result.tempFilePath) {
            wx.openDocument({
              filePath: result.tempFilePath,
              fileType: this.data.message.content.data.suffix.slice(1),
              showMenu: true,
              success: res => {

              },
              fail: err => {
                console.log(err)
                wx.showToast({
                  title: '文件打开失败',
                  icon: 'none'
                })
              }
            })
          }
        },
        fail: err => {
          console.log(err)
          wx.showToast({
            title: '文件打开失败',
            icon: 'none'
          })
        }
      })
    }
  }
})
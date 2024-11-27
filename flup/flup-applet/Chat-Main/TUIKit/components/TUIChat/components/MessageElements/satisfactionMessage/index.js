Component({

  /**
   * 组件的属性列表
   */
  properties: {
    message: {
      type: Object,
      value: {},
      observer(newVal) {
        if(!newVal) return
        try{
          const ext = JSON.parse(newVal.content.ext)
          newVal.content.ext = ext
        }catch(err){
        }
        this.setData({
          message: newVal
        });
      },
    }
  },
  data: {
    message: {},
    Show: false
  },
  methods: {
    goDetail() {
      if (this.data.message.content.data.type == 11) {
        let recordId = this.data.message.content.ext.recordId
        this.triggerEvent("seeSatisfactionDetail", recordId)
      } else {
        wx.downloadFile({
          url: this.data.message.content.data.url,
          timeout: 0,
          success: result => {
            console.log(111)
            if (result.tempFilePath) {
              wx.openDocument({
                filePath: result.tempFilePath,
                fileType: this.data.message.content.data.suffix.slice(1),
                showMenu: true,
                success: res => {

                },
                fail: err => {
                  wx.showToast({
                    title: '文件打开失败',
                    icon: 'none'
                  })
                }
              })
            }
          },
          fail: err => {
            wx.showToast({
              title: '文件打开失败',
              icon: 'none'
            })
          }
        })
      }
    }
  }
})
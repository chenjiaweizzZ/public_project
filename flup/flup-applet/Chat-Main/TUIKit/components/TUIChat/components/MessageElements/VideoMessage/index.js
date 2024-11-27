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
          message: newVal,
        });
      },
    },
    isMine: {
      type: Boolean,
      value: true,
    },
    messageList: {
      type: Array,
      value: [],
      observer(newVal) {
        if (newVal.length < 1) return
        this.getImgList(newVal)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    message: {},
    showSaveFlag: Number,
    imgList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showVideoFullScreenChange(event) {
      if (event.detail.fullScreen) {
        this.setData({
          showSaveFlag: 1,
        });
      } else {
        this.setData({
          showSaveFlag: 2,
        });
      }
    },
    // 1代表当前状态处于全屏，2代表当前状态不处于全屏。
    handleLongPress(e) {
      if (this.data.showSaveFlag === 1) {
        wx.showModal({
          content: '确认保存该视频？',
          success: (res) => {
            if (res.confirm) {
              wx.downloadFile({
                url: this.data.message.payload.videoUrl || this.data.message.payload.remoteVideoUrl,
                success(res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                  if (res.statusCode === 200) {
                    wx.saveVideoToPhotosAlbum({
                      filePath: res.tempFilePath,
                      success() {
                        wx.showToast({
                          title: '保存成功!',
                          duration: 800,
                          icon: 'none',
                        });
                      },
                    });
                  }
                },
                fail(error) {
                  wx.showToast({
                    title: '保存失败!',
                    duration: 800,
                    icon: 'none',
                  });
                },
              });
            }
          },
        });
      }
    },
    previewImage() {
      let index = this.data.imgList.findIndex(item=>{
        return item.url == this.data.message.videoUrl
      })
      console.log(index,this.data.imgList)
      wx.previewMedia({
        current: index, // 当前显示图片的http链接
        sources: this.data.imgList, // 图片链接必须是数组
        success: () => {
          this.setData({
            showSave: true,
          });
        },
        complete: () => {
          this.setData({
            showSave: false,
          });
        },
      });
    },
    getImgList(arr) {
      let newArr = arr.filter(item => {
        return (item.type == 'TIMImageElem' || item.type == 'TIMVideoFileElem') && !item.isRevoked
      }).map(item => {
        return {
          url: item.type == 'TIMImageElem' ?item.bigImage : item.videoUrl,
          type: item.type == 'TIMImageElem' ? 'image' : 'video'
        }
      })
      this.setData({
        imgList: newArr
      })
    }
  },
});

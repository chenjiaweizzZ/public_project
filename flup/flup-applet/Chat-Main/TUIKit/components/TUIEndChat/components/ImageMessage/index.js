Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrl: {
      type: String,
      value: "",
      observer(newVal) {
        this.setData({
          ImgUrl: newVal
        });
      },
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
    ImgUrl: "",
    showSave: false,
    isLoadingSuccess: true,
    imgList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    previewImage() {
      let index = this.data.imgList.findIndex(item=>{
        return item.url == this.data.ImgUrl
      })
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
    ImageError(err) {
      this.setData({
        isLoadingSuccess: false
      })
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
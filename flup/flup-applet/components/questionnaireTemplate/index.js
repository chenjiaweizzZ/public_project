Component({

  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 1,
      observer(newVal) {
        this.setData({
          type: newVal
        })
      }
    },
    questionnaireDatail: {
      type: Object,
      value: {},
      observer(newVal) {
        if (!newVal) return
        this.setData({
          description: newVal.description,
          questionList: newVal.questionList
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    questionList: [],
    description: "",
    title: "CL测试问卷1123",
    flupStartTime: null,
    state: 1,
    total: 4,
    type: 1,
    showSave: false,
    imageSrc: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 图片预览
    previewImage(event) {
      const {
        src,
        imagelist
      } = event.currentTarget.dataset
      this.setData({
        imageSrc: src
      })
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: imagelist, // 图片链接必须是数组
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
    }
  }
})
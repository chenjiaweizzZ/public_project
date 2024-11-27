// Chat-Main/TUIKit/components/TUIChat/components/MessageElements/PackageRecommendations/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    message: {
      type: Object,
      observer(newVal){
        console.log(newVal)
        this.setData({
          packageItem: newVal
        })
      }
    },
    isMine: {
      type: Boolean,
      value: true,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isMine: false,
    packageItem: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(){
      let webUrl = this.data.packageItem.content.data.url1
      wx.navigateTo({
        url: `../../../../../../../Setting/pages/packageDetail/index?webUrl=${encodeURIComponent(webUrl)}`,
      })
    }
  }
})
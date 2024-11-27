// pages/patientInfo/components/healthFileFuncList/healthFileFuncList.js
import {
  baseUrl,
} from "../../../../utils/netUtils"
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    selectIndex: {
      type: Number,
    },
    patientId:{
      type:String
    },
    hospitalId:{
      type:String
    }
  },
  observers: {
    'selectIndex': function (val) {
      this.setData({
        titleIndex: val
      })
      this.getFuncsList()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    funcsList: [], // 列表
    typeName: ['用药指导', '运动方案', '饮食建议'],
    titleIndex: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getFuncsList() {
      // 就诊人ID
      // let patientId = this.patientId || JSON.parse(sessionStorage.getItem('userInfo')).userId;
      // 医院ID
      // let hospitalId = '';
      // 根据就诊人id、医院ID 拿数据
      let name = this.data.typeName[this.data.titleIndex]
      wx.request({
        url: `${baseUrl}/c/flup/patient/items/queryHistory?patientId=`+this.data.patientId+`&typeName=${name}&hospitalId=`,
        method: "GET",
        success: (res) => {
          this.setData({
            funcsList: res.data.retData
          })
        }
      })
    },

    getTime(time) {
      return time.slice(0, 10)
    },

    goToDetail(item) {
      let obj = item.currentTarget.dataset.value;
      wx.navigateTo({
        url: `/pages/healthFileFuncDetail/healthFileFuncDetail?id=${obj.id}&index=${this.data.titleIndex}`,
      })
    },
  }
})
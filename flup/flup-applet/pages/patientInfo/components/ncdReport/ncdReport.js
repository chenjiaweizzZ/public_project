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
      wx.request({
        url: `${baseUrl}/c/chronic/report/list?userId=`+this.data.patientId,//要改
        method: "GET",
        success: (res) => {
          this.setData({
            funcsList: res.data.retData
          })
        }
      })
    },

    goToDetail(item) {
      let obj = item.currentTarget.dataset.value
      wx.navigateTo({
        url: `/pages/ncdReportDetail/ncdReportDetail?funcsDetailid=${obj.riskFormId}&hospitalId=${obj.hospitalId}&riskType=${obj.riskType}&type=1`,
      })
    },
  }
})
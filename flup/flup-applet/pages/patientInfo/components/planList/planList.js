// pages/patientInfo/components/planList/planList.js
import {
  getFlupPlanPatientList,
  getFlupPlanListByCurrent
} from "../../../../utils/api.js"
const navigator = require("../../../../utils/navigator")
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    selectIndex: {
      type: Number,
    },
    patientId: {
      type: String
    },
    hospitalId: {
      type: String
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
      // getFlupPlanPatientList({
      //   "flupPlanId":"20231122154431906mv1",
      //   "searchKey":"userId",
      //   "searchVal":"202310270903199748wr",
      //   "searchTimeKey":"admissionDatetime",
      //   "searchTimeVal":null,
      //   "smartFlupMethodId":"",
      //   "flupStateId":"All",
      //   "flupType":"",
      //   "patientTypeCode":"OUT_PATIENT",
      //   "userId":"",
      //   "sort.prop":"dischargeDatetime",
      //   "sort.order":"ascending",
      //   "recordSerialNo":"1717708522843672576",
      //   "hospitalId":"1118033010334208499",
      //   "pageNo":1,
      //   "pageSize":1000,
      //   "type":1  
      // }).then(res => {
      //   if (res.retCode == 0) {
      //     this.setData({
      //       funcsList: res.retData.sortedList
      //     })
      //   } else {
      //     wx.showToast({
      //       title: res.retInfo,
      //       icon: 'none'
      //     })
      //   }
      // }) 
      getFlupPlanListByCurrent({
          patientId: this.data.patientId,
          hospitalId: this.data.hospitalId
        })
        .then(res => {
          if (res.retCode == 0) {
            this.setData({
              funcsList: res.retData
            })
          } else {
            wx.showToast({
              title: res.retInfo,
              icon: 'none'
            })
          }
        })
    },
    goToEvaluationResults() {},
    goToDetail(item) {
      let obj = item.currentTarget.dataset.value
      // if (obj.flupType == "专科随访") {
      //   wx.navigateTo({
      //     url: `/pages/planDetail/planDetail?title=${obj.flupContent}&flupStartTime=${obj.flupStartTime.slice(0, 10)}&flupAddress=${obj.flupAddress}`,
      //   })
      //   return;
      // }
      wx.navigateTo({
        url: '/pages/planDetail/planDetail?' + navigator.encodeObj('webUrl', obj.flupAddress),
      })
    },

  }
})
// pages/patientInfo/components/planList/planList.js
import {
  labReportList,
  examReportList,
  queryEmrDischargeRecordList
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
    patientId2: {
      type: String
    },
    hospitalId: {
      type: String
    },
    patientName: {
      type: String
    },
    sex: {
      type: String
    },
    birthday: {
      type: String
    },
  },
  observers: {
    'selectIndex': function (val) {
      // this.setData({
      //   titleIndex: val
      // })
      this.getFuncsList()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    funcsList: [], // 列表
    age: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getFuncsList() {
      let quety = {
        userId: this.data.patientId,
        hospitalId: this.data.hospitalId,
      }
      if (this.data.selectIndex == 2) {
        labReportList(quety).then(res => {
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
      } else if (this.data.selectIndex == 3) {
        examReportList({
          ...quety,
          isHis: 0
        }).then(res => {
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
      } else if (this.data.selectIndex == 4) {
        queryEmrDischargeRecordList(quety).then(res => {
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
      }
    },

    goToDetail(item) {
      let _this = this;
      let obj = item.currentTarget.dataset.value
      this.setData({
        age: _this.data.selectIndex == 2 ? navigator.caculateAge(this.data.birthday, obj.testDatetime || obj.reportingDatetime || obj.applyingDatetime) : navigator.caculateAge(this.data.birthday, obj.examDatetime || obj.reportedDatetime)
      })
      var url = ''
      if (_this.data.selectIndex == 2) {
        url = '/pages/electronicRecordDetail/electronicRecordDetail?selectIndex=' + _this.data.selectIndex + '&hospitalId=' + _this.data.hospitalId + '&patientId=' + _this.data.patientId + '&patientName=' + _this.data.patientName + '&sex=' + _this.data.sex + '&age=' + _this.data.age + '&labSn=' + obj.labSn + "&patientId2=" + this.data.patientId2
      } else if (_this.data.selectIndex == 3) {
        url = '/pages/electronicRecordDetail/electronicRecordDetail?selectIndex=' + _this.data.selectIndex + '&hospitalId=' + _this.data.hospitalId + '&patientId=' + _this.data.patientId + '&patientName=' + _this.data.patientName + '&sex=' + _this.data.sex + '&age=' + _this.data.age + '&imagingDiagnosis=' + obj.imagingDiagnosis + '&imagingFindings=' + obj.imagingFindings + '&accessionNo=' + obj.accessionNo + "&patientId2=" + this.data.patientId2
      } else {
        url = '/pages/summaryDischargeDetail/index?hospitalId=' + _this.data.hospitalId + '&patientId=' + _this.data.patientId + '&patientName=' + _this.data.patientName + '&serialNo=' + obj.serialNo
      }
      wx.navigateTo({
        url: url,
      })
    },

    Refresh() {
      let quety = {
        userId: this.data.patientId,
        hospitalId: this.data.hospitalId,
        isHis: 1
      }
      examReportList(quety).then(res => {
        if (res.retCode == 0) {
          this.setData({
            funcsList: res.retData
          })
          wx.showToast({
            title: "检查报告已获取至最新！",
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: "获取最新报告失败！",
            icon: 'none'
          })
        }
      }).catch(err => {
        wx.showToast({
          title: "获取最新报告失败！",
          icon: 'none'
        })
      })
    }
  }
})
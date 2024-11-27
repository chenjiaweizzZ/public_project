// pages/patientInfo/components/healthMonitoring/healthMonitoring.js
import {
  queryFlupConfigList,
  queryTelemonitorDataByUserId
} from "../../../../utils/api.js"
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
    patientName: {
      type: String
    },
    sex: {
      type: String
    },
    age: {
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
      this.getTelemonitorData()

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    funcsList: [], // 列表
    Weight: '',
    BloodPressure: '',
    BloodSugar: '',
    BloodSpo2: '',
    WaistLine: '',
    Height: '',
    BoneDensity: '',
    BMI: '',
    BodyTemperature: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getFuncsList() {
      queryFlupConfigList({
          moduleCode: 'mobileViewMonitor',
          hospitalId: this.data.hospitalId
        })
        .then(res => {
          if (res.retCode == 0) {
            res.retData.splice(4, 0, {
              componentDescription: "心率",
              componentKey: "heartRate",
            })
            res.retData.forEach((element) => {
              switch (element.componentKey) {
                case "Height":
                  element.unit = 'cm'
                  element.icon = '../../../../assets/images/Height.png'
                  element.componentValue = this.data.Height;
                  break
                case "Weight":
                  element.unit = 'kg'
                  element.icon = '../../../../assets/images/Weight.png'
                  element.componentValue = this.data.Weight;
                  break
                case "BodyTemperature":
                  element.unit = '℃'
                  element.icon = '../../../../assets/images/BodyTemperature.png'
                  element.componentValue = this.data.BodyTemperature;
                  break
                case "BloodPressure":
                  element.unit = 'mmHg'
                  element.icon = '../../../../assets/images/BloodPressure.png'
                  element.componentValue = this.data.BloodPressure;
                  break
                case "heartRate":
                  element.unit = '次/分'
                  element.icon = '../../../../assets/images/heartRate.png'
                  element.componentValue = this.data.heartRate;
                  break
                case "BloodSugar":
                  element.unit = 'mmol/L'
                  element.icon = '../../../../assets/images/BloodSugar.png'
                  element.componentValue = this.data.BloodSugar;
                  break
                case "BloodSpo2":
                  element.unit = '%'
                  element.icon = '../../../../assets/images/BloodSpo2.png'
                  element.componentValue = this.data.BloodSpo2;
                  break
                case "BMI":
                  element.unit = ''
                  element.icon = '../../../../assets/images/BMI.png'
                  element.componentValue = this.data.BMI;
                  break
                case "WaistLine":
                  element.unit = 'cm'
                  element.icon = '../../../../assets/images/WaistLine.png'
                  element.componentValue = this.data.WaistLine;
                  break
                case "BoneDensity":
                  element.unit = ''
                  element.icon = '../../../../assets/images/BoneDensity.png'
                  element.componentValue = this.data.BoneDensity;
                  break
                default:
                  element.unit = ''
                  element.icon = '../../../../assets/images/diet.png'
                  element.componentValue = '';
                  break
              }
            })
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
    getTelemonitorData() {
      queryTelemonitorDataByUserId({
          userId: this.data.patientId, //'307767X',
          range: 'bloodPressure|heartRate|spo2|bloodSugar|temperature|weight|height|bmi|waistLine|boneDensity',
          scope: 0,
          number: 6
        })
        .then(res => {
          // console.log(res,'fffffffffffffff')
          if (res.retCode == 0) {
            this.setData({
              Height: res.retData.height.length > 0 ? res.retData.height[(res.retData.height.length) - 1].height || '' : '',
              Weight: res.retData.weight.length > 0 ? res.retData.weight[(res.retData.weight.length) - 1].weight || '' : '',
              BloodPressure: res.retData.bloodPressure.length > 0 ? (res.retData.bloodPressure[(res.retData.bloodPressure.length) - 1].bloodPressureH || '-') + '/' + (res.retData.bloodPressure[(res.retData.bloodPressure.length) - 1].bloodPressureL || '-') : '',
              BloodSugar: res.retData.bloodSugar.length > 0 ? (res.retData.bloodSugar[(res.retData.bloodSugar.length) - 1].bloodSugarBeforeMeal || '-') + '/' + (res.retData.bloodSugar[(res.retData.bloodSugar.length) - 1].bloodSugarAfterMeal || '-') + '/' + (res.retData.bloodSugar[(res.retData.bloodSugar.length) - 1].bloodSugar || '-') : '',
              BloodSpo2: res.retData.spo2.length > 0 ? res.retData.spo2[(res.retData.spo2.length) - 1].spo2 || '' : '',
              WaistLine: res.retData.waistLine.length > 0 ? res.retData.waistLine[(res.retData.waistLine.length) - 1].waistLine || '' : '',
              BoneDensity: res.retData.boneDensity.length > 0 ? res.retData.boneDensity[(res.retData.boneDensity.length) - 1].checkResult || '' : '',
              BMI: res.retData.bmi.length > 0 ? res.retData.bmi[(res.retData.bmi.length) - 1].bmi || '' : '',
              BodyTemperature: res.retData.temperature.length > 0 ? res.retData.temperature[(res.retData.temperature.length) - 1].bodyTemperature || '' : '',
              heartRate: res.retData.heartRate.length > 0 ? (res.retData.heartRate[(res.retData.heartRate.length) - 1].heartRate || '') : '',
            })
            this.getFuncsList()
          } else {
            wx.showToast({
              title: res.retInfo,
              icon: 'none'
            })

          }
        })
    },
    goToDetail(item) {
      let obj = item.currentTarget.dataset.value;
      wx.navigateTo({
        url: `/pages/healthMonitoringDetail/healthMonitoringDetail?hospitalId=${this.data.hospitalId}&patientId=${this.data.patientId}&index=${this.data.titleIndex}&patientName=${this.data.patientName}&age=${this.data.age}&sex=${this.data.sex}`,
      })
    },
  }
})
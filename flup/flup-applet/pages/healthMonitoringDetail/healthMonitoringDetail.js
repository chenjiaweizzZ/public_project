// pages/healthMonitoringDetail/healthMonitoringDetail.js
import {
  queryFlupConfigList,
  queryTelemonitorDataByUserId
} from "../../utils/api.js"
let Charts = require('../../utils/wxcharts')
var app = getApp();
var lineChart = null;
var lineChart1 = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    currentTab: 0,
    hospitalId: '',
    paraVisible: {
      Weight: 1,
      BloodPressure: 1,
      BloodSugar: 1,
      BloodSpo2: 1,
      WaistLine: 1,
      Height: 1,
      BoneDensity: 1,
      BMI: 1,
      BodyTemperature: 1,
    },
    Weight: '',
    BloodPressure: '',
    BloodSugar: '',
    BloodSpo2: '',
    WaistLine: '',
    Height: '',
    BoneDensity: '',
    BMI: '',
    BodyTemperature: '',
    patientName: '',
    sex: '',
    age: '',
    userId: '',
    bloodPressureList: [],
    bloodSugarList: [],
    bmiList: [],
    boneDensityList: [],
    heartRateList: [],
    heightList: [],
    spo2List: [],
    temperatureList: [],
    waistLineList: [],
    weightList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      hospitalId: options.hospitalId,
      patientName: options.patientName,
      sex: options.sex,
      age: options.age,
      userId: options.patientId
    })
    this.getTelemonitorData();
    // this.getFlupConfigList();
  },
  getFlupConfigList() {
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
            // this.data.paraVisible[element.componentKey] = parseInt(
            //   element.componentValue
            // )

            switch (element.componentKey) {
              case "Height":
                element.unit = 'cm'
                element.componentValue = this.data.Height;
                break
              case "Weight":
                element.unit = 'kg'
                element.componentValue = this.data.Weight;
                break
              case "BodyTemperature":
                element.unit = '℃'
                element.componentValue = this.data.BodyTemperature;
                break
              case "BloodPressure":
                element.unit = 'mmHg'
                element.componentValue = this.data.BloodPressure;
                break
              case "heartRate":
                element.unit = '次/分'
                element.componentValue = this.data.heartRate;
                break
              case "BloodSugar":
                element.unit = 'mmol/L'
                element.componentValue = this.data.BloodSugar;
                break
              case "BloodSpo2":
                element.unit = '%'
                element.componentValue = this.data.BloodSpo2;
                break
              case "BMI":
                element.unit = ''
                element.componentValue = this.data.BMI;
                break
              case "WaistLine":
                element.unit = 'cm'
                element.componentValue = this.data.WaistLine;
                break
              case "BoneDensity":
                element.unit = ''
                element.componentValue = this.data.BoneDensity;
                break
              default:
                element.unit = ''
                element.componentValue = '';
                break
            }
          })
          this.setData({
            tabs: res.retData
          })
          this.canvasPainting(this.getPaintData())
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
        userId: this.data.userId, //'307767X',
        range: 'bloodPressure|heartRate|spo2|bloodSugar|temperature|weight|height|bmi|waistLine|boneDensity',
        scope: 0,
        number: 6
      })
      .then(res => {
        if (res.retCode == 0) {
          this.setData({
            bloodPressureList: res.retData.bloodPressure,
            bloodSugarList: res.retData.bloodSugar,
            bmiList: res.retData.bmi,
            boneDensityList: res.retData.boneDensity,
            heartRateList: res.retData.heartRate,
            heightList: res.retData.height,
            spo2List: res.retData.spo2,
            temperatureList: res.retData.temperature,
            waistLineList: res.retData.waistLine,
            weightList: res.retData.weight,
            heartRateList: res.retData.heartRate,
            Height: res.retData.height.length > 0 ? res.retData.height[(res.retData.height.length) - 1].height || '' : '',
            Weight: res.retData.weight.length > 0 ? res.retData.weight[(res.retData.weight.length) - 1].weight || '' : '',
            BloodPressure: res.retData.bloodPressure.length > 0 ? (res.retData.bloodPressure[(res.retData.bloodPressure.length) - 1].bloodPressureH || '') + '/' + (res.retData.bloodPressure[(res.retData.bloodPressure.length) - 1].bloodPressureL || '') : '',
            heartRate: res.retData.heartRate.length > 0 ? (res.retData.heartRate[(res.retData.heartRate.length) - 1].heartRate || '') : '',
            BloodSugar: res.retData.bloodSugar.length > 0 ? (res.retData.bloodSugar[(res.retData.bloodSugar.length) - 1].bloodSugarBeforeMeal || '-') + '/' + (res.retData.bloodSugar[(res.retData.bloodSugar.length) - 1].bloodSugarAfterMeal || '-') + '/' + (res.retData.bloodSugar[(res.retData.bloodSugar.length) - 1].bloodSugar || '') : '',
            BloodSpo2: res.retData.spo2.length > 0 ? res.retData.spo2[(res.retData.spo2.length) - 1].spo2 || '' : '',
            WaistLine: res.retData.waistLine.length > 0 ? res.retData.waistLine[(res.retData.waistLine.length) - 1].waistLine || '' : '',
            BoneDensity: res.retData.boneDensity.length > 0 ? res.retData.boneDensity[(res.retData.boneDensity.length) - 1].checkResult || '' : '',
            BMI: res.retData.bmi.length > 0 ? res.retData.bmi[(res.retData.bmi.length) - 1].bmi || '' : '',
            BodyTemperature: res.retData.temperature.length > 0 ? res.retData.temperature[(res.retData.temperature.length) - 1].bodyTemperature || '' : '',
          })
          this.getFlupConfigList();
        } else {
          wx.showToast({
            title: res.retInfo,
            icon: 'none'
          })

        }
      })
  },
  // tab切换
  changeCurrentTab_(e) {
    let that = this
    if (that.data.currentTab === e.currentTarget.dataset.current) {
      return false
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
      // that.getPaintData()
      that.canvasPainting(that.getPaintData())
    }
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.canvasPainting(that.getPaintData())
  },
  getPaintData() {
    let paintData = [];
    if (this.data.tabs[this.data.currentTab].componentKey == "Height") {
      paintData = this.data.heightList
    } else if (this.data.tabs[this.data.currentTab].componentKey == "Weight") {
      paintData = this.data.weightList
    } else if (this.data.tabs[this.data.currentTab].componentKey == "BodyTemperature") {
      paintData = this.data.temperatureList
    } else if (this.data.tabs[this.data.currentTab].componentKey == "BloodPressure") {
      paintData = this.data.bloodPressureList
    } else if (this.data.tabs[this.data.currentTab].componentKey == "heartRate") {
      paintData = this.data.heartRateList
    } else if (this.data.tabs[this.data.currentTab].componentKey == "BloodSugar") {
      paintData = this.data.bloodSugarList
    } else if (this.data.tabs[this.data.currentTab].componentKey == "BloodSpo2") {
      paintData = this.data.spo2List
    } else if (this.data.tabs[this.data.currentTab].componentKey == "BMI") {
      paintData = this.data.bmiList
    } else if (this.data.tabs[this.data.currentTab].componentKey == "WaistLine") {
      paintData = this.data.waistLineList
    } else if (this.data.tabs[this.data.currentTab].componentKey == "BoneDensity") {
      paintData = this.data.boneDensityList
    }
    if (paintData.length > 0) {
      paintData.forEach((i) => {
        i.name = this.data.tabs[this.data.currentTab].componentDescription + this.data.tabs[this.data.currentTab].unit
        switch (this.data.tabs[this.data.currentTab].componentKey) {
          case "Height":
            i.value = i.height
            break
          case "Weight":
            i.value = i.weight
            break
          case "BodyTemperature":
            i.value = i.bodyTemperature
            break
          case "BloodPressure":
            i.value = i.bloodPressureL
            i.value2 = i.bloodPressureH
            break
          case "heartRate":
            i.value = i.heartRate
            break
          case "BloodSugar":
            i.value = i.bloodSugarAfterMeal
            i.value2 = i.bloodSugarBeforeMeal
            i.value3 = i.bloodSugar
            break
          case "BloodSpo2":
            i.value = i.spo2
            break
          case "BMI":
            i.value = i.bmi
            break
          case "WaistLine":
            i.value = i.waistLine
            break
          case "BoneDensity":
            i.value = i.checkResult
            break
          default:
            i.value = ""
            break
        }
        // if (this.data.tabs[this.data.currentTab].componentKey == "BloodPressure" || this.data.tabs[this.data.currentTab].componentKey == "BloodSugar") {
        //   i.value2 = i.bloodPressureL || i.bloodSugarBeforeMeal || '';
        // }
        // if (this.data.tabs[this.data.currentTab].componentKey == "BloodSugar") {
        //   i.value3 = i.bloodSugar
        // }
      })
    }
    return paintData;
  },
  canvasPainting(paintData) {
    if (paintData.length == 0) {
      return
    }
    let that = this
    let categories = [];
    let seriesData = [];
    let oneLineData = [];
    let otherData = [];
    let randomData = []
    let heartRate = []
    paintData.forEach((i) => {
      categories.push(i.checkDatetime)
      // heartRate.push(i.heartRate)
      // if (i.value) {
      oneLineData.push(i.value)
      // }
      // if (i.value2) {
      otherData.push(i.value2)
      // }
      // if (i.bloodSugar) {
      randomData.push(i.value3)
      // }
    })
    if (that.data.tabs[that.data.currentTab].componentKey == "BloodSugar" || that.data.tabs[that.data.currentTab].componentKey == "BloodPressure") {
      seriesData = [{
          name: that.data.tabs[that.data.currentTab].componentKey == "BloodPressure" ? '收缩压' : that.data.tabs[that.data.currentTab].componentKey == "BloodSugar" ? '餐后血糖' : that.data.tabs[that.data.currentTab].componentDescription + that.data.tabs[that.data.currentTab].unit,
          data: oneLineData
        },
        {
          name: that.data.tabs[that.data.currentTab].componentKey == "BloodPressure" ? '舒张压' : '餐前血糖',
          data: otherData
        }
      ]
      if (that.data.tabs[that.data.currentTab].componentKey == "BloodSugar") {
        seriesData.push({
          name: '随机血糖',
          data: randomData
        })
      }
    } else {
      seriesData = [{
        name: that.data.tabs[that.data.currentTab].componentDescription + that.data.tabs[that.data.currentTab].unit,
        data: oneLineData,
      }]
    }
    // 折线图
    var windowWidth = '',
      windowHeight = ''; //定义宽高
    try {
      var res = wx.getSystemInfoSync(); //试图获取屏幕宽高数据
      windowWidth = res.windowWidth / 750 * 700 //以设计图750为主进行比例算换
      windowHeight = res.windowWidth / 750 * 500 //以设计图750为主进行比例算换
    } catch (e) {
      console.error('getSystemInfoSync failed!'); //如果获取失败
    }
    lineChart = new Charts({
      canvasId: 'lineCanvas' + that.data.currentTab,
      type: 'line',
      animation: true, //是否开启动画
      categories: categories,
      series: seriesData,
      xAxis: { //是否隐藏x轴分割线
        disableGrid: true,
      },
      yAxis: {
        title: that.data.tabs[that.data.currentTab].componentDescription + that.data.tabs[that.data.currentTab].unit,
        //  format: function (val) {
        //    return val.toFixed(2);
        //  },
      },
      width: windowWidth, //图表展示内容宽度
      height: windowHeight, //图表展示内容高度
      dataLabel: true, //是否在图表上直接显示数据
      dataPointShape: true, //是否在图标上显示数据点标志
      extra: {
        lineStyle: 'curve' //曲线
      },
    });
    // if (that.data.tabs[that.data.currentTab].componentKey == "BloodPressure") {
    //   lineChart1 = new Charts({
    //     canvasId: 'lineCanvas2' + that.data.currentTab,
    //     type: 'line',
    //     animation: true, //是否开启动画
    //     categories: categories,
    //     series: [{
    //       name: "心率",
    //       data: heartRate
    //     }],
    //     xAxis: { //是否隐藏x轴分割线
    //       disableGrid: true,
    //     },
    //     yAxis: {
    //       title: `心率次/分`,
    //     },
    //     width: windowWidth, //图表展示内容宽度
    //     height: windowHeight, //图表展示内容高度
    //     dataLabel: true, //是否在图表上直接显示数据
    //     dataPointShape: true, //是否在图标上显示数据点标志
    //     extra: {
    //       lineStyle: 'curve' //曲线
    //     },
    //   });
    // }

  },
  /**
   * 点击数据点显示对应的数据
   */
  touchHandler: function (e) {
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
    // if (this.data.tabs[this.data.currentTab].componentKey == "BloodPressure") {
    //   lineChart1.showToolTip(e, {
    //     format: function (item, category) {
    //       return category + ' ' + item.name + ':' + item.data
    //     }
    //   });
    // }
  },
  goBack() {
    wx.navigateBack()
  }
})
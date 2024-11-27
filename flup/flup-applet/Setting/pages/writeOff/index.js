import {
  GetDictItems,
  onePackageVerifyList,
  verifyOrderEquity,
  updateOrInsertOrderEquity,
  delayEquityDate,
} from "../../../utils/api"
import Dialog from '@vant/weapp/dialog/dialog';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    height1: 0,
    show: false,
    show2: false,
    show3: false,
    time: new Date().toISOString().split('T')[0],
    minDate: "",
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}`;
      }
      if (type === 'month') {
        return `${value}`;
      }
      if (type === 'day') {
        return `${value}`;
      }
    },
    display: false,
    currentDate: "",
    display2: false,
    dictList: [],
    selectId: "",
    selectName: "",
    selectIndex: "",
    orderserialno: "",
    platOrderVerifyLogsList: [],
    platOrderVerifyItemsList: [],
    form: {},
    consultPackageName: "",
    status: 1,
    defaultIndex: 0,
    tipMessage: "个案管理师向医护团队转介完成后，系统将会自动核销一次权益。如遇医生没有回答但是系统自动核销的情况，个管师可以手动增加一次权益。",
    delayList:[
      {
      logId:'12456',
      operateClass:'123456',
      operatedRecordId:'FD12456',
      operateName:'延长过期时间',
      operateContents:'延期10天',
      operatorUserId:'123456',
      operatorUserName:'张三',
      operateTime:'2024-01-15',
      },
    ],
    isDelay:false,
    delayDays:1
  },


  /**
   * 返回上一页 
   */
  goBack() {
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      orderserialno: options.orderserialno,
      consultPackageName: options.consultPackageName,
      status: options.status
    })
    this.getOnePackageVerifyList()
  },
  getOnePackageVerifyList() {
    onePackageVerifyList({
      orderId: this.data.orderserialno
    }).then(res => {
      this.setData({
        platOrderVerifyItemsList: res.retData.platOrderVerifyItemsList,
        platOrderVerifyLogsList: res.retData.platOrderVerifyLogsList,
        delayList:res.retData.platCommonLogsList,
      })
      wx.nextTick(() => {
        let that = this
        const obj = wx.createSelectorQuery();
        obj.selectAll('.items').boundingClientRect(function (rect) {
          if (rect.length == 0) return
          let height = 0
          let i = that.data.platOrderVerifyLogsList.length - 1
          rect.forEach(item => {
            height += item.height
          })
          that.setData({
            height: height - rect[0].height / 2 - rect[i].height / 2,
            height1: rect[0].height / 2
          })
        })
        obj.exec();
      })
    })
  },
  getDictList() {
    GetDictItems({
      parentId: "20240418000000000001"
    }).then(res => {
      this.setData({
        dictList: res.retData
      })
      this.Change()
    })
  },
  Change() {
    let list = this.data.dictList
    console.log(list)
    list.forEach(item1 => {
      let result = this.data.form.platOrderVerifyItemsList.some(item2 => {
        return item1.dict_code == item2.verifyItemCode;
      });
      if (result) {
        item1.disabled = true;
        return;
      }
      item1.disabled = false;
    });
    this.setData({
      dictList: list
    })
  },
  reduce(e) {
    // let obj = e.currentTarget.dataset.value
    if (this.data.form.times <= 1) return
    this.setData({
      "form.times": this.data.form.times - 1
    })
  },
  Add(e) {
    let obj = e.currentTarget.dataset.value
    const max = obj.totalTimes - obj.verifiedTimes
    if (this.data.form.times >= max) return
    this.setData({
      "form.times": this.data.form.times + 1
    })
  },
  Delete(e) {
    if (this.data.form.platOrderVerifyItemsList.length == 1) {
      this.setData({
        ["form.platOrderVerifyItemsList[0].times"]: 0,
        ["form.platOrderVerifyItemsList[0].verifyItemCode"]: "",
        ["form.platOrderVerifyItemsList[0].verifyItemName"]: "",
      })
      this.Change()
    } else {
      let index = e.currentTarget.dataset.index
      this.data.form.platOrderVerifyItemsList.splice(index, 1)
      this.setData({
        "form.platOrderVerifyItemsList": this.data.form.platOrderVerifyItemsList
      })
    }

  },
  reduce2(e) {
    let index = e.currentTarget.dataset.index
    let totalTimes = this.data.form.platOrderVerifyItemsList[index].totalTimes
    let verifiedTimes = this.data.form.platOrderVerifyItemsList[index].verifiedTimes
    let times = this.data.form.platOrderVerifyItemsList[index].times
    let isEdit = this.data.form.platOrderVerifyItemsList[index].isEdit
    if (isEdit && times <= 1) return
    if (!isEdit && times <= verifiedTimes - totalTimes) return
    const _times = `form.platOrderVerifyItemsList[${index}].times`
    this.setData({
      [_times]: times - 1
    })
  },
  Add2(e) {
    let index = e.currentTarget.dataset.index
    let times = this.data.form.platOrderVerifyItemsList[index].times
    const _times = `form.platOrderVerifyItemsList[${index}].times`
    this.setData({
      [_times]: times + 1
    })
  },
  onBlur(e) {
    let obj = e.currentTarget.dataset.value
    let backup = this.data.form.times
    const max = obj.totalTimes - obj.verifiedTimes
    let value = e.detail.value
    if (Number.isInteger(e.detail.value * 1)) {
      if (value <= 0 && value) {
        this.setData({
          "form.times": 1
        })
      } else if (value > max && value) {
        this.setData({
          "form.times": max
        })
      } else {
        this.setData({
          "form.times": value * 1
        })
      }
    } else {
      this.setData({
        "form.times": backup
      })
    }
  },
  onBlur2(e) {
    let index = e.currentTarget.dataset.index
    let backup = this.data.form.platOrderVerifyItemsList[index].times
    const _times = `form.platOrderVerifyItemsList[${index}].times`
    let obj = e.currentTarget.dataset.value
    if (Number.isInteger(e.detail.value * 1)) {
      let min = obj.verifiedTimes - obj.totalTimes
      let number = e.detail.value * 1
      if (number < min) {
        this.setData({
          [_times]: min
        })
      } else {
        this.setData({
          [_times]: number
        })
      }
    } else {
      this.setData({
        [_times]: backup
      })
    }
  },
  getTime() {
    return new Date().toISOString().split('T')[0];
  },
  selectTime() {
    this.setData({
      display: true,
      currentDate: new Date(this.data.time).getTime()
    })
  },
  // 日期改变
  onInput3(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  // 取消选中日期
  onCancel() {
    this.setData({
      display: false
    })
  },
  // 确定选中日期
  onConfirm() {
    this.setData({
      "form.time": new Date(this.data.currentDate).toISOString().slice(0, 10),
      display: false,
    })
  },
  formatTime(time) {
    // 创建一个Date对象
    const date = new Date(time);
    // 获取年份
    const year = date.getFullYear();
    // 获取月份（注意月份是从0开始计数的，所以需要加1）
    const month = date.getMonth() + 1;
    // 获取日期
    const day = date.getDate();
    // 将结果拼接成年月日的格式
    const dateString = `${year}-${month}-${day}`;
    return dateString
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  Determine() {
    if (this.data.form.times == 0) {
      wx.showToast({
        title: '请输入核销次数',
        icon: "none"
      })
      return
    }
    verifyOrderEquity({
      remark: this.data.form.remark,
      verifyDate: this.data.form.time,
      times: this.data.form.times,
      verifyItemId: this.data.form.platOrderVerifyItemsList[0].verifyItemId
    }).then(res => {
      this.onClose()
      this.getOnePackageVerifyList()
    })
  },
  onClose2() {
    this.setData({
      show2: false
    })
  },
  Determine2() {
    let bol = this.data.form.platOrderVerifyItemsList.some(item => {
      return item.verifyItemCode
    })
    if (!bol) {
      wx.showToast({
        title: '请选择项目',
        icon: "none"
      })
      return
    }
    let data1 = {
      remark: this.data.form.remark,
      payOrderId: this.data.orderserialno
    }
    let data2 = this.data.form.platOrderVerifyItemsList.filter(item => {
      return item.verifyItemCode
    }).map(item => {
      return {
        times: item.times,
        verifyItemCode: item.verifyItemCode,
        verifyItemId: item.verifyItemId,
        verifyItemName: item.verifyItemName
      }
    })
    updateOrInsertOrderEquity(data1, data2).then(res => {
      this.onClose2()
      this.getOnePackageVerifyList()
    })
  },
  AddLine() {
    if (this.data.form.platOrderVerifyItemsList.length >= this.data.dictList.length) {
      wx.showToast({
        title: '没有更多项目了',
        icon: "none"
      })
      return
    }
    this.setData({
      "form.platOrderVerifyItemsList": [...this.data.form.platOrderVerifyItemsList, {
        verifyItemId: "",
        verifyItemName: "",
        verifyItemCode: "",
        totalTimes: 0,
        verifiedTimes: 0,
        times: 0,
        isEdit: true
      }]
    })
  },
  handleClose() {
    this.setData({
      display2: false,
      selectId: "",
      selectName: ""
    })
  },
  onChange(event) {
    let obj = event.detail.value
    this.setData({
      selectId: obj.dict_code,
      selectName: obj.dict_name
    })
  },
  onReferral() {
    if (!this.data.selectId) {
      wx.showToast({
        title: '请选择项目',
        icon: "none"
      })
    } else {
      let _verifyItemName = `form.platOrderVerifyItemsList[${this.data.selectIndex}].verifyItemName`
      let _verifyItemCode = `form.platOrderVerifyItemsList[${this.data.selectIndex}].verifyItemCode`
      this.setData({
        [_verifyItemName]: this.data.selectName,
        [_verifyItemCode]: this.data.selectId,
        display2: false
      })
      this.Change()
    }
  },
  onSelect(e) {
    let index = e.currentTarget.dataset.index
    let code = this.data.form.platOrderVerifyItemsList[index].verifyItemCode
    if (code) {
      let index2 = this.data.dictList.findIndex(item => {
        return item.dict_code == code
      })
      if (index2 < 0) return
      this.setData({
        defaultIndex: index2,
        selectId: this.data.dictList[index2].dict_code,
        selectName: this.data.dictList[index2].dict_name,
      })
    } else {
      let index2 = this.data.dictList.findIndex(item => {
        return item.disabled != true
      })
      if (index2 < 0) return
      this.setData({
        defaultIndex: index2,
        selectId: this.data.dictList[index2].dict_code,
        selectName: this.data.dictList[index2].dict_name,
      })
    }
    this.setData({
      display2: true,
      selectIndex: index
    })
  },
  Edit() {
    this.getDictList()
    let obj = {}
    if (this.data.platOrderVerifyItemsList && this.data.platOrderVerifyItemsList.length > 0) {
      obj = {
        remark: "",
        platOrderVerifyItemsList: this.data.platOrderVerifyItemsList.map(item => {
          return {
            ...item,
            times: 0
          }
        })
      }
    } else {
      obj = {
        remark: "",
        platOrderVerifyItemsList: [{
          verifyItemId: "",
          verifyItemName: "",
          verifyItemCode: "",
          totalTimes: 0,
          verifiedTimes: 0,
          times: 0,
          isEdit: true
        }]
      }
    }

    this.setData({
      form: obj,
      show2: true
    })
  },
  writeOff(e) {
    let index = e.currentTarget.dataset.index
    let obj = {
      time: new Date().toISOString().split('T')[0],
      remark: "",
      times: 1,
      platOrderVerifyItemsList: [this.data.platOrderVerifyItemsList[index]]
    }
    this.setData({
      form: obj,
      show: true
    })
  },
  onInput4(e) {
    this.setData({
      "form.remark": e.detail.value
    })
  },
  seeTip(){
    this.setData({
      show3: true
    })
    // Dialog.alert({
    //   message: '个案管理师向医护团队转介完成后，系统将会自动核销一次权益。如遇医生没有回答但是系统自动核销的情况，个管师可以手动增加一次权益。',
    // })
  },
  toDelay(){
    this.setData({
      isDelay: true
    })
  },
  delayDayReduce(){
    if(this.data.delayDays>0){
      this.setData({
        "delayDays":this.data.delayDays - 1,
      })
    }

    // if (this.data.form.times <= 1) return
    // this.setData({
    //   "form.times": this.data.form.times - 1
    // })
  },
  delayDayAdd(){
    this.setData({
      "delayDays":this.data.delayDays + 1,
    })
  },
  delayCancel(){
    this.setData({
      isDelay: false,
      delayDays:1,
    })
  },
  delaySubmit(){
    delayEquityDate({
      payOrderId: this.data.orderserialno,
      days:this.data.delayDays
    }).then(res => {
      this.getOnePackageVerifyList()
      this.delayCancel();
    })
   
  }
})
// pages/joinGroup/joinGroup.js
import {
  queryPlanByPatient,
  queryFollowUpContent,
  addTemporaryFollowUpTask,
  sendMessageCallback,
  clinicRecordTotalList
} from "../../utils/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    patientName: '',
    sex: '',
    age: '',
    hospitalId: '',
    userId: '',
    addDate: '',
    taskType: '',
    planContent: '',
    flupContentId: '',
    planName: '',
   
    validDays: 0,
    dateDisplay: false,
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
    },
    typeDisplay:false,
    recordDisplay:false,
    serverDisplay:false,
    daysDisplay:false,
    planDisplay: false,
    taskDisplay: false,
    contentDisplay: false,
    typeList:['门诊','住院'],
    recordList:[],
    serverList:['人员1','人员2','人员3','人员4'],
    daysList:['90天','180天','270天','360天',],
    planList: [],
    planListData: [],
    taskList: ['健康宣教', '调查问卷', '消息提醒'],
    contentList: [],
    contentListData: [],
    consultId: "",
    roomId: "",
    roomType: "",
    userInfo: {},
    typeName:'',
    recordName:'',
    serverName:'',
    days:'',
  },
  onShow(options){
    console.log(options)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options, 'options')
    this.setData({
      hospitalId: options.hospitalId,
      patientName: options.patientName,
      sex: options.sex,
      age: options.age,
      userId: options.userId,
      consultId: options.consultId,
      roomType: options.roomType,
      roomId: options.roomId,
      userInfo: wx.getStorageSync("userInfo")
    })
    this.getPatientPlan();
  },
  getPatientPlan() {
    queryPlanByPatient({
        userId: this.data.userId,
      })
      .then(res => {
        if (res.retCode == 0) {
          let planData = [];
          res.retData.forEach((i) => {
            planData.push(i.planName)
          })
          this.setData({
            planListData: res.retData,
            planList: planData
          })
        } else {
          wx.showToast({
            title: res.retInfo,
            icon: 'none'
          })
        }
      })
  },
  getClinicRecordTotalList(){
    clinicRecordTotalList({
      userId: this.data.userId,
      hospitalId:this.data.hospitalId,
    })
    .then(res => {
      if (res.retCode == 0) {
        let recordData = [];
        res.retData.forEach((i) => {
          recordData.push(i.medicalDept + ' '+i.clinicDate)
        })
        this.setData({
          // planListData: res.retData,
          recordList: recordData
        })
      } else {
        wx.showToast({
          title: res.retInfo,
          icon: 'none'
        })
      }
    })    
  },
  chooseType(){
    this.setData({
      typeDisplay: true,
    })
  },
  chooseRecord(){
    if(this.data.recordList.length==0){
      this.getClinicRecordTotalList();
    }
   
    this.setData({
      recordDisplay: true,
    })
  },
  chooseServer(){
    this.setData({
      serverDisplay: true,
    })
  },
  chooseDays(){
    this.setData({
      daysDisplay: true,
    })
  },
  choosePlan() {
    this.setData({
      planDisplay: true,
    })
  },
  // chooseType() {
  //   this.setData({
  //     taskDisplay: true,
  //   })
  // },
  onTypeChange() {


  },
  chooseContent() {
    if (this.data.taskType) {
      wx.navigateTo({
        url: `/pages/planContent/index?taskType=${this.data.taskType}&hospitalId=${this.data.hospitalId}`,
      })
      // this.setData({
      //   contentDisplay: true,
      // })
    } else {
      wx.showToast({
        title: '请选择任务类型',
        icon: 'none'
      })
    }

  },
  decrease() {
    if (this.data.validDays > 0) {
      this.setData({
        validDays: this.data.validDays - 1,
      })
    } else {
      return
    }

  },
  // 日期改变
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  // 取消选中
  onCancel() {
    this.setData({
      planDisplay: false,
      dateDisplay: false,
      taskDisplay: false,
      contentDisplay: false,
      typeDisplay:false,
      recordDisplay:false,
      serverDisplay:false,
      daysDisplay:'false',
    })
  },
  //确定选中类型
  onConfirmType(event){
    this.setData({
      typeName: event.detail.value,
      typeDisplay: false
    })
  },
    //确定选中记录
    onConfirmRecord(event){
      this.setData({
        recordName: event.detail.value,
        recordDisplay: false
      })
    },
      //确定选中人员
  onConfirmServer(event){
    this.setData({
      serverName: event.detail.value,
      serverDisplay: false
    })
  },
    //确定选中天数
    onConfirmDays(event){
      this.setData({
        days: event.detail.value,
        daysDisplay: false
      })
    },
  // 确定选中日期
  onConfirm() {
    this.setData({
      addDate: this.formatTime(this.data.currentDate),
      dateDisplay: false,
      minDate: this.data.currentDate,
    })
  },
  // 日期弹窗显示
  chooseDate(event) {
    this.setData({
      dateDisplay: true,
      // selectIndex: event.currentTarget.dataset.value
    })
  },
  onConfirmPlan(event) {
    console.log(event, 'tasktask')
    this.setData({
      planName: event.detail.value,
      planDisplay: false
    })
  },
  onConfirmTask(event) {
    // console.log(event,'tasktask')
    this.setData({
      taskType: event.detail.value,
      taskDisplay: false,
      planContent: '',
      contentList: []
    })
    if (this.data.taskType != '消息提醒') {
      queryFollowUpContent({
          name: this.data.taskType,
          hospitalId: this.data.hospitalId,
        })
        .then(res => {
          if (res.retCode == 0) {
            let contentData = [];
            res.retData.forEach((i) => {
              contentData.push(i.questionnaireName)
            })
            this.setData({
              contentListData: res.retData,
              contentList: contentData
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
  onConfirmContent(event) {
    console.log(event, 'tasktask')
    this.setData({
      planContent: event.detail.value,
      contentDisplay: false
    })
  },
  addDays() {
    this.setData({
      validDays: this.data.validDays + 1,
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
    const dateString = `${year}-${month<10?'0'+month:month}-${day<10?'0'+day:day}`;
    return dateString
  },
  bindinput(event) {
    this.setData({
      planContent: event.detail.value,
    })
  },
  addPlanSubmit() {
    if (!this.data.planName || !this.data.addDate || !this.data.taskType || !this.data.planContent) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }
    let planItem = this.data.planListData.find((i) => {
      return i.planName == this.data.planName
    })
    addTemporaryFollowUpTask(
      {
      flupContent: this.data.planContent,
      flupContentId: this.data.flupContentId,
      flupPlan: this.data.planName,
      flupPlanId: planItem.serialNo||'',
      flupRuleId: planItem.fuRuleId,
      flupStartTime: this.data.addDate,
      flupType: this.data.taskType,
      followupPathWay: "微信",
      followupPathWayId: "Wechat",
      hospitalId: this.data.hospitalId,
      oldTaskSerialNo: planItem.oldTaskSerialNo,
      userId: this.data.userId,
      validDate: this.data.validDays,
    }
    )
    .then(async(res) => {
      if (res.retCode == 0) {
        let sendUrlList = res.retData.sendUrlList
        let url = sendUrlList && sendUrlList.length > 0 ? sendUrlList[0] : ""
        await this.sendMessage(url)
        wx.showToast({
          title: '添加成功',
          icon: 'none'
        })
        this.goBack();
      } else {
        wx.showToast({
          title: res.retInfo,
          icon: 'none'
        })
      }
    })
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  getTypeData(){},
  /**
   * 聊天室发送消息
   */
  sendMessage(url) {
    // 获取当前日期
    let time = this.formatTime(Date.now())
    if (this.data.addDate != time) return
    // 创建消息
    const message = wx.$TUIKit.createCustomMessage({
      to: this.data.roomId,
      conversationType: this.data.roomType,
      payload: {
        description: "计划",
        data: JSON.stringify({
          url,
          taskType: this.data.taskType,
          planContent: this.data.planContent,
          type: 2
        })
      },
    });
    wx.$TUIKit.sendMessage(message, {
      offlinePushInfo: {
        disablePush: true,
      },
    }).then(res => {
      let pages = getCurrentPages(); // 当前页面栈
      if (pages.length > 1) {
        let beforePage = pages[pages.length - 2] // 获取上上一页面的实例对象
        beforePage.setData({
          message: message
        })
        beforePage.refreshRoom()
      }
      // 回调接口
      let msg = ''
      switch (message.type) {
        case 'TIMTextElem':
          msg = message.payload.text
          break;
        case 'TIMImageElem':
          msg = "你有一条新的图片消息"
          break;
        case 'TIMVideoFileElem':
          msg = "你有一条新的视频消息"
          break;
        case 'TIMSoundElem':
          msg = "你有一条新的语言消息"
          break;
        case 'TIMCustomElem':
          msg = `你有一条新的${this.data.taskType}消息`
          break;
        default:
          msg = "你有一条新的消息"
          break;
      }
      // 回调接口
      sendMessageCallback({
        consultId: this.data.consultId,
        message: msg,
        sendUserId: this.data.userInfo.userId,
        sendUserName: this.data.userInfo.userName
      })
    })
  }
})
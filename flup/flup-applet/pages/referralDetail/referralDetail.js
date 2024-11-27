// pages/referralDetail/referralDetail.js
import {
  TUIChatService
} from '@tencentcloud/chat-uikit-engine';
import Dialog from '@vant/weapp/dialog/dialog';
import {
  selectReferralApply,
  reviewRecord,
  admConditionInfo
} from "../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: null,
    show: false,
    diseaseConditionShow: false,
    writeDateShow: false,
    recordDateShow: false,
    value: "",
    fileInfoVoList: [],
    recordJsonListVo: {},
    recordTextListVo: {},
    referralRecordVo: {},
    review: false,
    DKSSH: false,
    DYQZBSH: false,
    recordId: "",
    admissionForm: {
      doctorName: "",
      prepayment: "",
      diseaseCondition: "",
      diseaseConditionCode: "",
      writeDate: "",
      writeDateCode: new Date().getTime(),
      beforeRecorderName: "",
      beforeRecorderNo: "",
      remark: "",
      recordDate: "",
      recordDateCode: new Date().getTime(),
    },
    diseaseConditionList: [],
  },
  goBack() {
    wx.navigateBack()
  },
  onClickDiseaseCondition() {
    if(this.data.DYQZBSH) return
    this.setData({
      diseaseConditionShow: true
    })
  },
  onClickWriteDate() {
    if(this.data.DYQZBSH) return
    this.setData({
      writeDateShow: true
    })
  },
  onClickRecordDate() {
    if(this.data.DYQZBSH) return
    this.setData({
      recordDateShow: true
    })
  },
  allPropertiesHaveValues(obj) {
    // return Object.values(obj).every(value => value !== undefined && value !== null && value !== "");
    let values = Object.entries(obj)  
        .filter(([key, value]) => key !== 'remark')  
        .map(([key, value]) => value);  
    return values.every(value => value !== undefined && value !== null && value !== "");
  },
  refuse() {
    if (this.data.DKSSH && !this.allPropertiesHaveValues(this.data.admissionForm)) {
      wx.showToast({
        title: '请填写审核信息',
        icon: 'error'
      })
      return
    }
    if (this.data.DKSSH && this.data.admissionForm.prepayment < 1000) {
      wx.showToast({
        title: '预交金必须大于1000元',
        icon: 'none'
      })
      return
    }
    this.setData({
      show: true
    })
  },
  handleInput(e) {
    this.setData({
      value: e.detail.value
    })
  },
  refuseConfirm() {
    let payload = {}
    if (this.data.DKSSH) {
      payload = {
        doctorName: this.data.admissionForm.doctorName,
        prepayment: this.data.admissionForm.prepayment,
        diseaseCondition: this.data.admissionForm.diseaseConditionCode,
        writeDate: this.data.admissionForm.writeDate,
        beforeRecorderName: this.data.admissionForm.beforeRecorderName,
        beforeRecorderNo: this.data.admissionForm.beforeRecorderNo,
        remark: this.data.admissionForm.remark,
        recordDate: this.data.admissionForm.recordDate,
      }
    }
    reviewRecord({
      params: {
        recordId: this.data.recordId,
        action: "BACKWARD",
        remark: this.data.value
      },
      payload
    }).then(res => {
      if (res.retCode == 0) {
        this.setData({
          show: false
        })
        wx.showToast({
          title: '操作成功',
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      } else {
        wx.showToast({
          title: res.retInfo,
        })
      }
    })
  },
  agree() {
    if (this.data.DKSSH && !this.allPropertiesHaveValues(this.data.admissionForm)) {
      wx.showToast({
        title: '请填写审核信息',
        icon: 'error'
      })
      return
    }
    if (this.data.DKSSH && this.data.admissionForm.prepayment < 1000) {
      wx.showToast({
        title: '预交金必须大于1000元',
        icon: 'none'
      })
      return
    }
    Dialog.confirm({
        message: '是否同意转入申请',
      })
      .then(() => {
        let payload = {}
        if (this.data.DKSSH) {
          payload = {
            doctorName: this.data.admissionForm.doctorName,
            prepayment: this.data.admissionForm.prepayment,
            diseaseCondition: this.data.admissionForm.diseaseConditionCode,
            writeDate: this.data.admissionForm.writeDate,
            beforeRecorderName: this.data.admissionForm.beforeRecorderName,
            beforeRecorderNo: this.data.admissionForm.beforeRecorderNo,
            remark: this.data.admissionForm.remark,
            recordDate: this.data.admissionForm.recordDate,
          }
        }
        reviewRecord({
          params: {
            recordId: this.data.recordId,
            action: "AGREE",
          },
          payload
        }).then(res => {
          if (res.retCode == 0) {
            wx.showToast({
              title: '操作成功',
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 1000)
          } else {
            wx.showToast({
              title: res.retInfo,
            })
          }
        })
      })
      .catch(() => {
        // on cancel
      });
  },
  onClose() {
    this.setData({
      show: false,
      value: ""
    })
  },
  getDetail(recordId) {
    selectReferralApply({
      recordId: recordId
    }).then(res => {
      if (res.retCode == 0) {
        let detail = res.retData
        let DKSSH = false
        let DYQZBSH = false
        if (detail.referralRecordVo.currentProcessStatus == 'DKSSH') DKSSH = true
        if (detail.referralRecordVo.currentProcessStatus == 'DYQZBSH' || detail.referralRecordVo.currentProcessStatus == 'TY' || detail.referralRecordVo.currentProcessStatus == 'YJJ') {
          DYQZBSH = true
        }
        this.setData({
          admissionForm: detail.admissionForm || {
            doctorName: "",
            prepayment: "",
            diseaseCondition: "",
            diseaseConditionCode: "",
            writeDate: "",
            writeDateCode: new Date().getTime(),
            beforeRecorderName: "",
            beforeRecorderNo: "",
            remark: detail.referralRecordVo.otherRemark || "",
            recordDate: "",
            recordDateCode: new Date().getTime(),
          },
          fileInfoVoList: detail.fileInfoVoList,
          recordJsonListVo: detail.recordJsonListVo,
          recordTextListVo: detail.recordTextListVo,
          referralRecordVo: detail.referralRecordVo,
          recordId: recordId,
          DKSSH: DKSSH,
          DYQZBSH: DYQZBSH
        })
        this.getAdmConditionInfo()
      }
    })
  },
  previewImage(e) {
    let current = e.currentTarget.dataset.item.fileUrl
    let urls = []
    this.data.fileInfoVoList.forEach(i => {
      urls.push(i.fileUrl)
    })
    wx.previewImage({
      current: current,
      urls: urls
    })
  },
  setReview(review) {
    this.setData({
      review: review == "true" ? true : false

    })
  },
  getAdmConditionInfo() {
    admConditionInfo().then(res => {
      let {
        retData
      } = res
      let arr = []
      if (retData && retData.length > 0) {
        retData.forEach(i => {
          arr.push({
            text: i.name,
            code: i.code
          })
        })
        if(this.data.DYQZBSH) {
          let diseaseCondition = ""
          let code = this.data.admissionForm.diseaseCondition
          let item = arr.find(i => i.code == code)
          diseaseCondition = item ? item.text : ""
          let admissionForm = this.data.admissionForm
          admissionForm.diseaseCondition = diseaseCondition
          this.setData({
            admissionForm: admissionForm
          })
        }
        this.setData({
          diseaseConditionList: arr
        })
      }
    })
  },
  diseaseConditiOnCancel() {
    const picker = this.selectComponent(".diseaseConditiPicker")
    let i = 0
    this.data.diseaseConditionList.forEach((value, index) => {
      if (this.data.admissionForm.diseaseCondition == value.text) {
        console.log(value, index)
        i = index
      }
    })
    picker.setIndexes([i])
    this.setData({
      diseaseConditionShow: false
    })
  },
  writeDateOnCancel() {
    let admissionForm = this.data.admissionForm
    admissionForm.writeDateCode = admissionForm.writeDate ? new Date(admissionForm.writeDate).getTime() : new Date().getTime()
    this.setData({
      writeDateShow: false,
      admissionForm: admissionForm
    })
  },
  recordDateOnCancel() {
    let admissionForm = this.data.admissionForm
    admissionForm.recordDateCode = admissionForm.recordDate ? new Date(admissionForm.recordDate).getTime() : new Date().getTime()
    this.setData({
      recordDateShow: false,
      admissionForm: admissionForm
    })
  },
  diseaseConditiOnConfirm(event) {
    let {
      code,
      text
    } = event.detail.value
    let admissionForm = this.data.admissionForm
    admissionForm.diseaseCondition = text
    admissionForm.diseaseConditionCode = code
    this.setData({
      admissionForm: admissionForm,
      diseaseConditionShow: false
    })
  },
  writeDateOnConfirm(event) {
    let admissionForm = this.data.admissionForm
    admissionForm.writeDate = this.timestampToDate(event.detail)
    this.setData({
      admissionForm: admissionForm,
      writeDateShow: false
    })
  },
  recordDateOnConfirm(event) {
    let admissionForm = this.data.admissionForm
    admissionForm.recordDate = this.timestampToDate(event.detail)
    this.setData({
      admissionForm: admissionForm,
      recordDateShow: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  timestampToDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  onChange1(event) {
    let admissionForm = this.data.admissionForm
    admissionForm.doctorName = event.detail
    this.setData({
      admissionForm: admissionForm
    })
  },
  onChange2(event) {
    let value = event.detail.replace(/^\D./g, '')
    let admissionForm = this.data.admissionForm
    admissionForm.prepayment = value
    this.setData({
      admissionForm: admissionForm
    })
  },
  onChange3(event) {
    let admissionForm = this.data.admissionForm
    admissionForm.beforeRecorderName = event.detail
    this.setData({
      admissionForm: admissionForm
    })
  },
  onChange4(event) {
    let admissionForm = this.data.admissionForm
    admissionForm.beforeRecorderNo = event.detail
    this.setData({
      admissionForm: admissionForm
    })
  },
  onChange5(event) {
    let admissionForm = this.data.admissionForm
    admissionForm.remark = event.detail
    this.setData({
      admissionForm: admissionForm
    })
  },
  onLoad(options) {
    this.getDetail(options.recordId)
    this.setReview(options.review)
    this.setData({
      currentTab: options.currentTab
    })
    // this.getAdmConditionInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
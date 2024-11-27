const app = getApp()
import {
  patientRemark,
  patientRemarkLog,
  editPatientRemark,
  deletePatientRemark,
  insertPatientRemark,
  topOrCancelTopPatientRemark
} from "../../../../utils/api"
import Toast from '@vant/weapp/toast/toast';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    baseInfo: {
      type: Object,
      value: {},
      observer(val) {
        if (!val.userId) return
        this.getPatientRemark()
      }
    }
  },

  lifetimes: {
    detached() {
      this.myaudio && this.myaudio.destroy()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    show2: false,
    title: "备注",
    show3: false,
    remarkList: [],
    logList: [],
    value: "",
    remarkInfo: {},
    play: false,
    selectIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getPatientRemark() {
      patientRemark({
        userId: this.data.baseInfo.userId
      }).then(res => {
        this.setData({
          remarkList: res.retData
        })
      })
    },
    addRemark() {
      this.setData({
        title: "备注",
        value: "",
        show: true,
        remarkInfo: {}
      })
    },
    onClose() {
      this.setData({
        show: false
      })
    },
    seeRecord() {
      patientRemarkLog({
        userId: this.data.baseInfo.userId
      }).then(res => {
        if (res.retCode == 0) {
          this.setData({
            show2: true,
            logList: res.retData
          })
        } else {
          wx.showToast({
            title: res.retInfo || "操作失败",
            icon: "none"
          })
        }
      })

    },
    onClose2() {
      this.setData({
        show2: false
      })
    },
    Edit(e) {
      let obj = e.currentTarget.dataset.value
      this.setData({
        title: "编辑",
        show: true,
        value: obj.remarkContent,
        remarkInfo: obj
      })
    },
    Delete(e) {
      let obj = e.currentTarget.dataset.value
      this.setData({
        show3: true,
        remarkInfo: obj
      })
    },
    See(e) {
      let obj = e.currentTarget.dataset.value
      if (obj.remarkType == 4) {
        wx.downloadFile({
          url: obj.remarkUrl,
          timeout: 0,
          success: result => {
            if (result.tempFilePath) {
              wx.openDocument({
                filePath: result.tempFilePath,
                fileType: obj.remarkFormat,
                showMenu: true,
                success: res => {

                },
                fail: err => {
                  wx.showToast({
                    title: '文件打开失败',
                    icon: 'none'
                  })
                }
              })
            }
          },
          fail: err => {
            wx.showToast({
              title: '文件打开失败',
              icon: 'none'
            })
          }
        })
      } else if (obj.remarkType == 3) {
        wx.previewImage({
          current: obj.remarkUrl, // 当前显示图片的http链接
          urls: [obj.remarkUrl], // 图片链接必须是数组
        });
      } else {

      }
    },
    onCancel() {
      this.setData({
        show3: false
      })
    },
    onConfirm() {
      deletePatientRemark({
        remarkId: this.data.remarkInfo.remarkId,
      }).then(res => {
        if (res.retCode == 0) {
          this.getPatientRemark()
          this.onCancel()
        } else {
          wx.showToast({
            title: res.retInfo || "操作失败",
            icon: "none"
          })
        }
      })
    },
    Confirm() {
      if (!this.data.value) {
        wx.showToast({
          title: '内容不能为空',
          icon: "none"
        })
        return
      }
      if (this.data.remarkInfo.remarkId) {
        editPatientRemark({
          remarkId: this.data.remarkInfo.remarkId,
          remarkContent: this.data.value
        }).then(res => {
          if (res.retCode == 0) {
            this.getPatientRemark()
            this.onClose()
          } else {
            wx.showToast({
              title: res.retInfo || "操作失败",
              icon: "none"
            })
          }
        })
      } else {
        insertPatientRemark({
          remarkContent: this.data.value,
          remarkType: 1,
          userId: this.data.baseInfo.userId
        }).then(res => {
          if (res.retCode == 0) {
            this.getPatientRemark()
            this.onClose()
          } else {
            wx.showToast({
              title: res.retInfo || "操作失败",
              icon: "none"
            })
          }
        })
      }

    },
    onInput(e) {
      this.setData({
        value: e.detail.value
      })
    },
    uploadFile() {
      let that = this
      wx.chooseMessageFile({
        count: 1,
        success: res => {
          const mediaInfoList = res.tempFiles;
          mediaInfoList.forEach((file) => {
            let index = file.name.lastIndexOf(".")
            let suffix = that.convertUpperCaseToLowercase(file.name.slice(index + 1))
            if (suffix == 'doc' || suffix == 'docx' || suffix == 'xls' || suffix == 'pdf' || suffix == 'xlsx' || suffix == 'mp3' || suffix == 'wav' || suffix == 'jpg' || suffix == 'jpeg' || suffix == 'png') {
              wx.uploadFile({
                url: `${app.globalData.baseUrl}/file/upload`,
                filePath: file.path,
                name: 'file',
                success(res) {
                  const data = JSON.parse(res.data)
                  if (data.retCode == 0) {
                    let url
                    let remarkType
                    switch (suffix) {
                      case 'mp3':
                        remarkType = 2
                        url = data.retData.id
                        break;
                      case 'wav':
                        remarkType = 2
                        url = data.retData.id
                        break;
                      case 'doc':
                        remarkType = 4
                        url = data.retData.id
                        break;
                      case 'docx':
                        remarkType = 4
                        url = data.retData.id
                        break;
                      case 'xls':
                        remarkType = 4
                        url = data.retData.id
                        break;
                      case 'xlsx':
                        remarkType = 4
                        url = data.retData.id
                        break;
                      case 'pdf':
                        remarkType = 4
                        url = data.retData.id
                        break;
                      default:
                        remarkType = 3
                        url = data.retData.id
                        break
                    }
                    insertPatientRemark({
                      remarkType: remarkType,
                      remark_url: url,
                      remarkContent: file.name,
                      userId: that.data.baseInfo.userId,
                      remarkFormat: suffix
                    }).then(res => {
                      if (res.retCode == 0) {
                        that.getPatientRemark()
                      } else {
                        wx.showToast({
                          title: res.retInfo || "操作失败",
                          icon: "none"
                        })
                      }
                    })
                  } else {
                    wx.hideLoading()
                    wx.showToast({
                      title: '上传失败',
                      icon: 'error'
                    })
                  }
                },
                fail(err) {
                  wx.hideLoading()
                  wx.showToast({
                    title: '上传失败',
                    icon: 'error'
                  })
                }
              })
            } else {
              Toast({
                message: '请上传正确的文件类型(.mp3 .wav .jpeg .jpg .png .pdf .docx .doc .xlsx .xls)',
                context: this
              });
            }
          });
        },
        fail: err => {
          wx.showToast({
            title: '取消上传',
            icon: "none"
          })
        }
      })
    },
    convertUpperCaseToLowercase(str) {
      let newStr = '';
      for (let i = 0; i < str.length; i++) {
        if (str[i] >= 'A' && str[i] <= 'Z') {
          newStr += String.fromCharCode(str.charCodeAt(i) + 32);
        } else {
          newStr += str[i];
        }
      }
      return newStr;
    },
    audioPlay(e) {
      this.myaudio = wx.createInnerAudioContext();
      this.setData({
        selectIndex: e.currentTarget.dataset.index,
        play: true
      })
      // myaudio.src = e.currentTarget.dataset.value.remarkUrl
      this.myaudio.autoplay = true;
      // this.myaudio.src = "https://cos.ap-shanghai.myqcloud.com/79ae-shanghai-007-sharedv4-03-1303031839/2a7b-1400183993/141c-202310251441294368s7/cc2d9fd8c58511307c1d1734bb1ce73f-618915.wav"
      this.myaudio.audioPlay = e.currentTarget.dataset.value.remarkUrl
      this.myaudio.play()
      this.myaudio.onPlay(() => {
        console.log("开始播放")
      })
      this.myaudio.onEnded(() => {
        console.log("播放结束")
        this.myaudio.destroy()
        this.setData({
          play: false,
        });
      });
      this.myaudio.onError(err => {
        console.log(err)
      })
    },
    audioPause() {
      this.setData({
        play: false
      });
      this.myaudio.destroy()
    },
    Topping(e) {
      const obj = e.currentTarget.dataset.value
      topOrCancelTopPatientRemark({
        remarkId: obj.remarkId,
        isTop: obj.isTop == 1 ? 0 : 1
      }).then(res => {
        this.getPatientRemark()
      })
    }
  }
})
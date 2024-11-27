import constant from '../../../../utils/constant';
import {
  sendGraphicMessageCallback,
  personalSwitchManager,
  selectManagerListByDept,
  backToCustomerService,
  selectConsultGraphicDetail,
  changePreAiStatus,
  endGraphicConsultation,
  doctorIncreaseConsultTime
} from "../../../../../../utils/api"
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 房间详细信息
    conversation: {
      type: Object,
      value: {},
      observer(newVal) {
        this.setData({
          conversation: newVal,
        });
      },
    },
    // 房间类型
    type: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          type: newVal
        })
      }
    },
    // 咨询ID
    consultId: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          consultId: newVal
        })
      }
    },
    // 群成员列表
    groupUserInfoList: {
      type: Array,
      value: [],
      observer(val) {
        if (val && val.length < 1) return
        // console.log(val)
        this.setData({
          groupUserInfoList: val
        })
        // 获取个案管理师
        this.getPersonalManagerList()
      }
    },
    // 是否转介
    isReferral: {
      type: Number,
      value: 0,
      observer(val) {
        this.setData({
          isReferral: val
        })
      }
    },
    // 是否打开 AI
    isOpenAi: {
      type: Boolean,
      value: false,
      observer(newVal) {
        this.setData({
          isOpenAi: newVal
        })
      }
    },
    // 患者ID
    patientId: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          patientId: newVal
        })
      }
    },
    // 医院ID
    sourceId: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          sourceId: newVal
        })
      }
    },
    serialNo: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          serialNo: newVal
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    patientId: "",
    serialNo: "",
    sourceId: "",
    isOpenAi: false,
    isShows: true,
    isReferral: null,
    groupUserInfoList: [],
    PersonalManagerList: [],
    displayAddManager: false,
    consultId: "",
    conversation: {}, // 房间详细信息
    type: "", // 1服务中、2服务完成、3售前咨询
    message: '',
    sendMessageBtn: false,
    displayFlag: '',
    isAudio: false,
    startPoint: 0,
    popupToggle: false,
    isRecording: false,
    canSend: true,
    text: '按住说话',
    title: ' ',
    notShow: false,
    isShow: true,
    commonFunction: [{
      name: '常用语',
      key: '0'
    }],
    displayCommonWords: false,
    displayAiAssistant: false,
    isFirstSendTyping: true,
    time: 0,
    focus: false,
    focus1: false,
    isEmoji: false,
    fileList: [],
    textareaHeight: 0,
    description: "1",
    addTimeShow: false,
    time: 1
  },

  lifetimes: {
    attached() {
      // 加载声音录制管理器
      this.recorderManager = wx.getRecorderManager();
      this.recorderManager.onStop((res) => {
        wx.hideLoading();
        if (this.data.canSend) {
          if (res.duration < 1000) {
            wx.showToast({
              title: '录音时间太短',
              icon: 'none',
            });
          } else {
            const message = wx.$TUIKit.createAudioMessage({
              to: this.getToAccount(),
              conversationType: this.data.conversation.type,
              payload: {
                file: res,
              },
            });
            this.$sendTIMMessage(message);
          }
        }
        this.setData({
          startPoint: 0,
          popupToggle: false,
          isRecording: false,
          canSend: true,
          title: ' ',
          text: '按住说话',
        });
      });
      this.setData({
        userInfo: wx.getStorageSync("userInfo"),
        description: app.globalData.description
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    $openAI(e) {
      changePreAiStatus({
        preConsultId: this.data.consultId
      }).then(res => {
        if (res.retCode == 0) {
          wx.showToast({
            title: '操作成功',
            duration: 800
          });
          // 关闭弹窗
          this.selectComponent("#aiAssistant").handleClose()
          // 重新房间详细信息
          this.triggerEvent("getConsultDetailsById")
        } else {
          wx.showToast({
            title: "操作失败",
            icon: "error",
            duration: 800
          });
        }
      }).catch(err => {
        wx.showToast({
          title: "操作失败",
          icon: "error",
          duration: 800
        });
      })
    },
    /**
     * 查看患者信息
     */
    viewProfile() {
      wx.navigateTo({
        url: `/pages/patientInfo/PatientInfo?patientId=${this.data.patientId}&hospitalId=${this.data.sourceId}&consultId=${this.data.consultId}&roomType=${this.data.conversation.type}&roomId=${this.getToAccount()}`,
      })
    },
    /**
     * 个案转回客服
     */
    endConsultation() {
      let that = this
      selectConsultGraphicDetail({orderSerialNo: this.data.serialNo}).then(res => {
        console.log(res)
        Dialog.confirm({
        message: `本次问诊剩余对话次数为${res.retData.consultationTimes}次,\n确定要结束本次问诊吗?`,
        context: this
      })
        .then(() => {
          endGraphicConsultation({consultId: this.data.consultId}).then(res => {
            that.triggerEvent("getConsultDetailsById")
          })
        })
        .catch(() => {
          // on cancel
        });
      })
    },
    // 获取个案管理师
    getPersonalManagerList() {
      if (this.data.isReferral == 1) return
      selectManagerListByDept({
        hospitalId: "1118033010334208499"
      }).then(res => {
        if (res.retCode == 0) {
          let arr = [];
          const keys = Object.keys(res.retData);
          keys.forEach((item) => {
            res.retData[item].forEach(items => {
              arr.push({
                userId: items.UserId,
                userName: items.name
              })
            })
          });
          // let newArr = arr.filter(item => {
          //   return this.data.groupUserInfoList.every(items => {
          //     return item.userId !== items.userId
          //   })
          // })
          // console.log(newArr, 1111)
          this.setData({
            PersonalManagerList: arr
          })
        }
      })
    },
    // 切换个案管理师
    handleCheckManager() {
      this.setData({
        displayAddManager: true
      })
    },
    // AI 助手
    openAiAssistant() {
      this.setData({
        displayAiAssistant: true
      })
    },

    $handleCloseCards(e) {
      switch (e.detail.key) {
        case '0':
          this.setData({
            displayReferral: false,
          });
          break;
        case '1':
          this.setData({
            displayAddDoctor: false,
          });
          break;
        case '2':
          this.setData({
            displayCommonWords: false,
          });
          break;
        case '3':
          this.setData({
            displayAddManager: false,
          });
          break;
        case '4':
          this.setData({
            displayAiAssistant: false,
          });
          break;
        default:
          break;
      }
    },

    // 添加个案管理师
    $addManager(e) {
      let manageId = e.detail.userId
      let manageName = e.detail.userName
      personalSwitchManager({
        personalConsultId: this.data.consultId,
        roomId: this.data.conversation.groupProfile.groupID,
        manageId: manageId,
        manageName: manageName
      }).then(res => {
        if (res.retCode == 0) {
          wx.showToast({
            title: '操作成功',
            duration: 800
          });
          // 取消弹窗
          this.selectComponent("#addManager").handleClose()
          // 重新获取房间信息
          // this.triggerEvent("getConsultDetailsById")
          // 隐藏输入框
          this.triggerEvent("hideInput")
        } else {
          wx.showToast({
            title: "添加失败",
            icon: "error",
            duration: 800
          });
        }
      }).catch((err) => {
        wx.showToast({
          title: '添加失败',
          duration: 800
        });
      })
    },

    // 套餐推荐
    handleRecommendedPackage() {
      wx.navigateTo({
        url: `../../../../../../Setting/pages/RecommendedPackage/RecommendedPackage?consultId=${this.data.consultId}&roomType=${this.data.conversation.type}&roomId=${this.getToAccount()}&sendUserId=${this.data.userInfo.userId}&sendUserName=${this.data.userInfo.userName}&type=1`,
      })
    },

    // 打开录音开关
    switchAudio() {
      this.setData({
        isAudio: !this.data.isAudio,
        isEmoji: false,
        text: '按住说话',
        focus: false,
      });
    },

    // 录音触摸动作开始
    handleTouchStart(e) {
      wx.getSetting({
        success: async (res) => {
          const isRecord = res.authSetting['scope.record'];
          // 首次获取权限时, isRecord === undefine， 需使用 this.recorderManager 内置调用权限功能
          // 当 isRecord === false 时，表示首次未授权，不会触发 this.recorderManager 内置调用权限功能
          // 此时需要走 wx.authorize 授权，失败指引用户自己在设置中开启
          if (isRecord === false) {
            const title = '麦克风权限授权';
            const content = '发送语音消息，需要在设置中对麦克风进行授权允许';
            this.recorderManager.stop();
            wx.authorize({
              scope: 'scope.record',
              success: () => {
                wx.hideLoading();
                this.setData({
                  text: '按住说话',
                  isRecording: false,
                });
              },
              fail: () => {
                this.handleShowModal(title, content);
                wx.hideLoading();
                this.setData({
                  text: '按住说话',
                  isRecording: false,
                });
              }
            });
          } else if (isRecord === true) {
            this.recorderStart(e);
          } else {
            this.setData({
              isTape: true,
            });
            wx.authorize({
              scope: "scope.record",
              success: () => {
                wx.hideLoading();
                this.setData({
                  text: "按住说话",
                  isRecording: false,
                  isTape: false,
                });
              },
              fail: () => {
                this.handleShowModal(title, content);
                wx.hideLoading();
                this.setData({
                  text: "按住说话",
                  isRecording: false,
                  isTape: false,
                });
              },
            });
          }
        },
      });
    },

    // 录音相关配置
    recorderStart(e) {
      // this.recorderManager.start({
      //   duration: 60000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
      //   sampleRate: 44100, // 采样率
      //   numberOfChannels: 1, // 录音通道数
      //   encodeBitRate: 192000, // 编码码率
      //   format: 'aac', // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和Web）互通
      // });
      this.setData({
        startPoint: e.touches[0],
        title: '正在录音',
        notShow: true,
        isShow: false,
        isRecording: true,
        popupToggle: true,
      });
      this.recorderManager.start({
        duration: 60000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
        sampleRate: 44100, // 采样率
        numberOfChannels: 1, // 录音通道数
        encodeBitRate: 192000, // 编码码率
        format: 'aac', // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和Web）互通
      });
    },

    // 长按显示正在录音
    // handleLongPress(e) {
    //   this.setData({
    //     startPoint: e.touches[0],
    //     title: '正在录音',
    //     notShow: true,
    //     isShow: false,
    //     isRecording: true,
    //     popupToggle: true,
    //   });
    // },

    // 录音时的手势上划移动距离对应文案变化
    handleTouchMove(e) {
      if (this.data.isRecording) {
        if (this.data.startPoint.clientY - e.touches[e.touches.length - 1].clientY > 100) {
          this.setData({
            text: '抬起停止',
            title: '松开手指，取消发送',
            canSend: false,
          });
        } else if (this.data.startPoint.clientY - e.touches[e.touches.length - 1].clientY > 20) {
          this.setData({
            text: '抬起停止',
            title: '上划可取消',
            canSend: true,
          });
        } else {
          this.setData({
            text: '抬起停止',
            title: '正在录音',
            canSend: true,
          });
        }
      } else {

      }
    },

    // 手指离开页面滑动
    handleTouchEnd() {
      this.setData({
        isRecording: false,
        popupToggle: false,
      });
      wx.hideLoading();
      this.recorderManager.stop();
    },

    // 选中表情消息
    handleEmoji() {
      let targetFlag = 'emoji';
      if (this.data.displayFlag === 'emoji') {
        targetFlag = '';
      }
      this.setData({
        isAudio: false,
        isEmoji: true,
        displayFlag: targetFlag,
        focus: false,
      });
    },

    // 选自定义消息
    handleExtensions() {
      let targetFlag = 'extension';
      if (this.data.displayFlag === 'extension') {
        targetFlag = '';
      }
      this.triggerEvent('inputHeightChange', {});
      this.setData({
        displayFlag: targetFlag,
      });
    },

    // 拍摄
    handleSendPicture() {
      this.sendMediaMessage('camera', 'image');
    },

    // 相册
    handleSendImage() {
      this.sendMediaMessage('album', 'image');
    },

    handleShootVideo() {
      this.sendMediaMessage('camera', 'video');
    },

    handleSendVideo() {
      this.sendMediaMessage('album', 'video');
    },

    handleAddTimes() {
      this.setData({
        addTimeShow: true
      })
    },

    addTimeConfirm() {
      let params = {
        orderSerialNo: this.data.serialNo,
        time: this.data.time
      }
      doctorIncreaseConsultTime(params).then(res => {
        wx.showToast({
          title: '增加成功',
          icon: 'success',
        });
        this.setData({
          time: 1
        })
      })
    },

    addTimeCancal() {
      this.setData({
        addTimeShow: false,
        time: 1
      })
    },

    timeChange(event) {
        this.setData({
          time: event.detail
        })
    },

    // 发送图片或视频消息
    sendMediaMessage(type, mediaType) {
      const {
        fileList
      } = this.data;
      wx.chooseMedia({
        count: 9,
        sourceType: [type],
        mediaType: [mediaType],
        success: (res) => {
          const mediaInfoList = res.tempFiles;
          mediaInfoList.forEach((mediaInfo) => {
            fileList.push({
              type: res.type,
              tempFiles: [{
                tempFilePath: mediaInfo.tempFilePath
              }]
            });
          });
          fileList.forEach((file) => {
            if (file.type === 'image') {
              wx.showLoading({
                title: '发送中',
                mask: true
              })
              this.handleSendImageMessage(file);
            }
            if (file.type === 'video') {
              this.handleSendVideoMessage(file);
            }
          });
          this.data.fileList = [];
        },
      });
    },

    // 发送图片消息
    handleSendImageMessage(file) {
      let that = this
      wx.uploadFile({
        url: `${app.globalData.baseUrl}/file/upload`,
        filePath: file.tempFiles[0].tempFilePath,
        name: 'file',
        success(res) {
          const data = JSON.parse(res.data)
          if (data.retCode == 0) {
            let imageUrl = `${app.globalData.baseUrl}/file/image/${data.retData.id}`
            const message = wx.$TUIKit.createCustomMessage({
              to: that.getToAccount(),
              conversationType: that.data.conversation.type,
              payload: {
                description: "TIMImageElem",
                data: JSON.stringify({
                  imageUrl,
                  type: 5
                })
              },
            });
            that.$sendTIMMessage(message)
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '发送图片失败',
              icon: 'error'
            })
          }
        },
        fail(err) {
          wx.hideLoading()
          wx.showToast({
            title: '发送图片失败',
            icon: 'error'
          })
        }
      })
    },

    // 发送视频消息
    handleSendVideoMessage(file) {
      let that = this
      wx.uploadFile({
        url: `${app.globalData.baseUrl}/file/upload`,
        filePath: file.tempFiles[0].tempFilePath,
        name: 'file',
        success(res) {
          const data = JSON.parse(res.data)
          if (data.retCode == 0) {
            let videoUrl = `${app.globalData.baseUrl}/file/video/${data.retData.id}`
            const message = wx.$TUIKit.createCustomMessage({
              to: that.getToAccount(),
              conversationType: that.data.conversation.type,
              payload: {
                description: "TIMVideoFileElem",
                data: JSON.stringify({
                  videoUrl,
                  type: 9
                })
              },
            });
            that.$sendTIMMessage(message)
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '发送视频失败',
              icon: 'error'
            })
          }
        },
        fail(err) {
          wx.hideLoading()
          wx.showToast({
            title: '发送视频失败',
            icon: 'error'
          })
        }
      })
    },

    // 快捷发送（常用语）
    handleCommonFunctions(e) {
      this.setData({
        displayCommonWords: true,
      });
    },

    // 发送表情
    appendMessage(e) {
      this.setData({
        message: this.data.message + e.detail.message,
        sendMessageBtn: true,
      });
    },

    // 获取roomId
    getToAccount() {
      if (!this.data.conversation || !this.data.conversation.conversationID) {
        return '';
      }
      switch (this.data.conversation.type) {
        case wx.TencentCloudChat.TYPES.CONV_C2C:
          return this.data.conversation.conversationID.replace(wx.TencentCloudChat.TYPES.CONV_C2C, '');
        case wx.TencentCloudChat.TYPES.CONV_GROUP:
          return this.data.conversation.conversationID.replace(wx.TencentCloudChat.TYPES.CONV_GROUP, '');
        default:
          return this.data.conversation.conversationID;
      }
    },

    // 设置录音权限
    handleShowModal(title, content) {
      wx.showModal({
        title,
        content,
        confirmText: '去设置',
        success: (res) => {
          if (res.confirm) {
            wx.openSetting();
          }
        },
      });
    },

    sendTextMessage(msg, flag) {
      const to = this.getToAccount();
      const text = flag ? msg : this.data.message;
      const {
        FEAT_NATIVE_CODE
      } = constant;
      const message = wx.$TUIKit.createTextMessage({
        to,
        conversationType: this.data.conversation.type,
        payload: {
          text,
        },
        cloudCustomData: JSON.stringify({
          messageFeature: {
            needTyping: FEAT_NATIVE_CODE.FEAT_TYPING,
            version: FEAT_NATIVE_CODE.NATIVE_VERSION,
          },
        }),
      });
      this.setData({
        message: '',
        sendMessageBtn: false,
      });
      this.$sendTIMMessage(message);
    },

    // 监听输入框value值变化
    onInputValueChange(event) {
      const query = wx.createSelectorQuery().in(this);
      query.select('#textarea').boundingClientRect();
      query.exec((res) => {
        // 获取 textarea 组件的实际高度
        const height = res[0].height;
        if (this.data.textareaHeight !== height) {
          this.triggerEvent('inputHeightChange', {});
          this.setData({
            textareaHeight: height,
          })
        }
      });
      if (event.detail.message || event.detail.value) {
        this.setData({
          message: event.detail.message || event.detail.value,
          sendMessageBtn: true,
        });
      } else {
        this.setData({
          sendMessageBtn: false,
        });
      }
    },

    // 监听是否获取焦点，有焦点则向父级传值，动态改变input组件的高度。
    inputBindFocus(event) {
      this.setData({
        focus: true,
      });
      // 监听键盘，获取焦点时将输入框推到键盘上方
      this.triggerEvent('pullKeysBoards', {
        event,
      });
      // 有焦点则关闭除键盘之外的操作界面，例如表情组件。
      this.handleClose();
    },

    // 监听是否失去焦点
    inputBindBlur(event) {
      this.setData({
        isFirstSendTyping: true,
        focus1: false,
      });
      clearTimeout(this.data.time);
      // 失去焦点,收起键盘
      this.triggerEvent('downKeysBoards', {
        event,
      });
    },

    // 常用语
    $handleSendTextMessage(event) {
      this.setData({
        isAudio: false,
        message: event.detail.message,
        focus1: true,
        sendMessageBtn: true,
        displayCommonWords: false,
      })
    },

    // 发送消息
    $sendTIMMessage(message) {
      wx.$TUIKit.sendMessage(message, {
        offlinePushInfo: {
          disablePush: true,
        },
      }).then(res => {
        wx.hideLoading()
        // 将自己的消息写进消息列表
        this.triggerEvent('sendMessage', {
          message,
        });
        // 回调接口
        let msg = ''
        switch (message.type) {
          case 'TIMTextElem':
            msg = message.payload.text.slice(0, 30)
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
          default:
            if (message.payload.description == 'TIMImageElem') {
              msg = "你有一条新的图片消息"
            } else if (message.payload.description == 'TIMVideoFileElem') {
              msg = "你有一条新的视频消息"
            } else {
              msg = "你有一条新的消息"
            }
            break;
        }
        sendGraphicMessageCallback({
          consultId: this.data.consultId,
          message: msg,
          sendUserId: this.data.userInfo.userId,
          sendUserName: this.data.userInfo.userName
        })
      })

      this.setData({
        displayFlag: '',
      });
    },

    handleClose() {
      this.setData({
        displayFlag: '',
      });
    },
    uploadFile() {
      let that = this
      wx.chooseMessageFile({
        count: 1,
        type: "file",
        success: res => {
          const mediaInfoList = res.tempFiles;
          mediaInfoList.forEach((file) => {
            console.log(file)
            let index = file.name.lastIndexOf(".")
            let suffix = this.convertUpperCaseToLowercase(file.name.slice(index + 1))
            if (suffix == 'doc' || suffix == 'docx' || suffix == 'xls' || suffix == 'pdf' || suffix == 'xlsx') {
              wx.uploadFile({
                url: `${app.globalData.baseUrl}/file/upload`,
                filePath: file.path,
                name: 'file',
                success(res) {
                  const data = JSON.parse(res.data)
                  if (data.retCode == 0) {
                    let url = `${app.globalData.baseUrl}/file/other/${data.retData.id}`
                    console.log(data.retData)
                    const message = wx.$TUIKit.createCustomMessage({
                      to: that.getToAccount(),
                      conversationType: that.data.conversation.type,
                      payload: {
                        description: "TIMotherFileElem",
                        data: JSON.stringify({
                          url,
                          type: 12,
                          name: file.name,
                          suffix: data.retData.suffix
                        })
                      },
                    });
                    that.$sendTIMMessage(message)
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
              wx.showToast({
                title: '请上传正确的文件类型(.doc .docx .xls .xlsx .pdf)',
                icon: 'none'
              })
            }
          });
        },
        fail: err => {
          console.log(111)
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
    }
  },
});
import logger from '../../../../utils/logger';
import constant from '../../../../utils/constant';
import {
  referral,
  imEndConsultation,
  addDoctor,
  sendMessageCallback,
  switchManager,
  changeAiStatus,
  endConsultationAndReferral,
  createOrder
} from "../../../../../../utils/api"
import {
  randomRoomID
} from '../../../../../../utils/common'
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
    // 群成员列表
    groupMemberList: {
      type: Array,
      value: [],
      observer(newVal) {
        this.setData({
          groupMemberList: newVal
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
    // 是否显示结束咨询
    isShowConsult: {
      type: Boolean,
      value: '',
      observer(isShowConsult) {
        this.setData({
          isShowConsult
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
    // 患者身份证号
    patientCardNo: {
      type: String,
      value: '',
    },
    // 患者电话
    patientPhone: {
      type: String,
      value: '',
    },
    patientName: {
      type: String,
      value: '',
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
    // 个管师列表
    PersonalManagerList: {
      type: Array,
      value: [],
      observer(newVal) {
        if (wx.getStorageSync('is_health_admin') == 1) {
          let userId = wx.getStorageSync('userInfo').UserId
          let newArr = newVal.filter(item => {
            return item.userId !== userId
          })
          this.setData({
            PersonalManagerLists: newArr
          })
        } else {
          this.setData({
            PersonalManagerLists: newVal
          })
        }
      }
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
    // 是否打开 AI
    isOpenAi: {
      type: Boolean,
      value: false,
      observer(newVal) {
        this.setData({
          isOpenAi: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isOpenAi: false,
    PersonalManagerLists: [], // 个管师列表
    conversation: {}, // 房间详细信息
    isShowConsult: false, // 是否显示结束咨询
    groupMemberList: [], // 群成员列表
    consultId: "", // 咨询ID
    patientId: "", // 患者ID
    sourceId: "", // 医院ID
    is_health_admin: 0, // 当前登入用户身份 （健管师、医生）
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
    displayServiceEvaluation: false,
    displayReferral: false,
    displayAddDoctor: false,
    displayAddManager: false,
    displayAiAssistant: false,
    showErrorImageFlag: 0,
    isFirstSendTyping: true,
    time: 0,
    focus: false,
    focus1: false,
    isEmoji: false,
    fileList: [],
    textareaHeight: 0,
    userInfo: {},
    description: "1",
    roomID: "",
    signallingType: null
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
        is_health_admin: wx.getStorageSync('is_health_admin'),
        userInfo: wx.getStorageSync("userInfo"),
        description: app.globalData.description
      })
      wx.$TUIKit.addSignalingListener(wx.TencentCloudChat.TSignaling.INVITEE_REJECTED, this.onInviteeRejected);
    },
    detached() {
      wx.$TUIKit.removeSignalingListener(wx.TencentCloudChat.TSignaling.INVITEE_REJECTED, this.onInviteeRejected);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInviteeRejected(e) {
      let that = this
      console.log(e, "忙线中")
      let obj = JSON.parse(e.data.data)
      console.log(obj.type)
      app.globalData.signallingType = obj.type
      console.log(obj.type)
    },
    async videoCall() {
      let that = this
      // 呼叫
      const roomID = randomRoomID()
      let promise = wx.$TUIKit.invite({
        // userID: options.patientId,ythj_1418101510402281911,hlwgly1423070613594443216
        // userID: "ythj_1418101510402281911",
        userID: that.data.patientId,
        data: JSON.stringify({
          roomID: roomID,
          roomId2: that.getToAccount(),
          userName: that.data.userInfo.userName,
          consultId: that.data.consultId,
          type: 1
        }),
        timeout: 60,
        offlinePushInfo: {
          disablePush: false,
        }
      })
      await promise.then(function (imResponse) {
        setTimeout(() => {
          console.log(app.globalData.signallingType, "忙线中")
          if (app.globalData.signallingType != 1) {
            that.setData({
              inviteID: imResponse.inviteID,
              roomID: roomID
            }, () => {
              app.globalData.signallingType = 0
              wx.navigateTo({
                url: `../../../../../../Setting/pages/room/room?inviteID=${that.data.inviteID}&patientId=${that.data.patientId}&consultId=${that.data.consultId}&roomID=${that.data.roomID}&roomId2=${that.getToAccount()}&patientName=${that.data.patientName}`,
              })
            })
          } else {
            wx.showToast({
              title: '对方忙线中...',
              icon: 'none'
            })
            app.globalData.signallingType = 0
          }
        }, 500)
      }).catch(function (imError) {
        console.warn('invite error:', imError);
      });
      // 判断对方是否忙线

    },
    // 套餐推荐
    handleRecommendedPackage() {
      wx.navigateTo({
        url: `../../../../../../Setting/pages/RecommendedPackage/RecommendedPackage?consultId=${this.data.consultId}&roomType=${this.data.conversation.type}&roomId=${this.getToAccount()}&sendUserId=${this.data.userInfo.userId}&sendUserName=${this.data.userInfo.userName}&type=2`,
      })
    },
    // 一键开方
    prescribe() {
      console.log("prescribe",this.data.consultId,wx.getStorageSync('userInfo').workId,)
      let that = this;
      let doctorInfo = wx.getStorageSync('userInfo')
      wx.showLoading({
        title: '加载中',
      })
      createOrder({
        cardNo:that.data.patientCardNo,
        patientName:that.data.patientName,
        // doctorWorkNo:doctorInfo.userId,
        phone:that.data.patientPhone,
        consultId: that.data.consultId
      }).then(res => {
        wx.hideLoading();
        if(res.retCode == 0) {
          wx.navigateToMiniProgram({
            appId:'wxcf1d74536017e8b5',
            path:'/pages/imgText/enterChatRoom?consultId='+res.retData+'&type=1',
            envVersion:'trial',
            extraData:{
              from:'healthyManage',
              consultId:res.retData
            },
          })
          console.log(res)
        }
      })
      console.log('waibu xiaochengxu',that.data)
    
    },

    $openAI(e) {
      changeAiStatus({
        consultId: this.data.consultId
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

    // 医生转诊
    $Referral(e) {
      let doctorId = e.detail.userId
      let doctorName = e.detail.userName
      if (this.data.is_health_admin) {
        referral({
          consultId: this.data.consultId,
          doctorId: doctorId,
          doctorName: doctorName
        }).then(res => {
          console.log(res)
          if (res.retCode == 0) {
            wx.showToast({
              title: '转诊成功',
              duration: 800
            });
            // 关闭弹窗
            this.selectComponent("#Referral").handleClose()
            // 重新房间详细信息
            this.triggerEvent("getConsultDetailsById")
          } else {
            wx.showToast({
              title: "转诊失败",
              icon: "error",
              duration: 800
            });
          }
        })
      } else {
        const endUserId = wx.getStorageSync('userInfo').UserId
        endConsultationAndReferral({
          consultId: this.data.consultId,
          targetDoctorId: doctorId,
          targetDoctorName: doctorName
        }).then(res => {
          console.log(res)
          if (res.retCode == 0) {
            wx.showToast({
              title: '转诊成功',
              duration: 800
            });
            // 关闭弹窗
            this.selectComponent("#Referral").handleClose()
            // 重新房间详细信息
            this.triggerEvent("getConsultDetailsById")
          } else {
            wx.showToast({
              title: "转诊失败",
              icon: "error",
              duration: 800
            });
          }
        })
      }
    },

    // 医生结束咨询
    endConsultation() {
      let that = this
      wx.showModal({
        content: '是否结束咨询？结束咨询后患者将自动被转接至个案管理师管理。',
        confirmColor: '#00982D',
        cancelColor: '#666666',
        success(res) {
          if (res.confirm) {
            imEndConsultation({
              consultId: that.data.consultId
            }).then(res => {
              if (res.retCode == 0) {
                wx.showToast({
                  title: '操作成功',
                })
                // 重新房间详细信息
                that.triggerEvent("getConsultDetailsById")
              } else {
                wx.showToast({
                  title: '操作失败',
                  icon: "error"
                })
              }
            })
          } else if (res.cancel) {}
        }
      })

    },

    // 添加个案管理师
    $addManager(e) {
      let manageId = e.detail.userId
      let manageName = e.detail.userName
      switchManager({
        consultId: this.data.consultId,
        roomId: this.data.conversation.groupProfile.groupID,
        manageId: manageId,
        manageName: manageName
      }).then(res => {
        if (res.retCode == 0) {
          wx.showToast({
            title: '添加成功',
            duration: 800
          });
          this.selectComponent("#addManager").handleClose()
          this.triggerEvent("getGroupUserInfoList")
          this.triggerEvent("getConsultDetailsById")
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

    // 添加群组成员
    $selectDoctorList(e) {
      const selectDoctorList = e.detail.selectDoctorList
      // 添加成员
      addDoctor({
        doctorIds: selectDoctorList.join(),
        consultId: this.data.consultId,
        roomId: this.data.conversation.groupProfile.groupID
      }).then(res => {
        if (res.retCode == 0) {
          wx.showToast({
            title: '添加成功',
            duration: 800
          });
          // 重新获取成员列表
          this.triggerEvent("getGroupUserInfoList")
          // 数据刷新
          this.selectComponent("#addDoctor").getGroupUserInfoList(this.data.conversation.groupProfile.groupID)
          // 关闭弹窗
          this.selectComponent("#addDoctor").handleClose()
        } else {
          wx.showToast({
            title: "添加失败",
            icon: "error",
            duration: 800
          });
        }
      })
    },
    goInspect() {
      wx.navigateTo({
        url: `/pages/patientInfo/PatientInfo?currentTab=1&activeTreatKey=3&patientId=${this.data.patientId}&hospitalId=${this.data.sourceId}&consultId=${this.data.consultId}&roomType=${this.data.conversation.type}&roomId=${this.getToAccount()}`,
      })
    },
    goTest() {
      wx.navigateTo({
        url: `/pages/patientInfo/PatientInfo?currentTab=1&activeTreatKey=2&patientId=${this.data.patientId}&hospitalId=${this.data.sourceId}&consultId=${this.data.consultId}&roomType=${this.data.conversation.type}&roomId=${this.getToAccount()}`,
      })
    },
    // 查看患者信息
    viewProfile() {
      wx.navigateTo({
        url: `/pages/patientInfo/PatientInfo?patientId=${this.data.patientId}&hospitalId=${this.data.sourceId}&consultId=${this.data.consultId}&roomType=${this.data.conversation.type}&roomId=${this.getToAccount()}`,
      })
    },

    // 问卷
    goQuestionnaire() {
      wx.navigateTo({
        url: `/pages/questionnaire/questionnaire?patientId=${this.data.patientId}&hospitalId=${this.data.sourceId}&consultId=${this.data.consultId}&roomType=${this.data.conversation.type}&roomId=${this.getToAccount()}`,
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
    handleLongPress(e) {
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

    // 发送图片消息
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
              wx.showLoading({
                title: '发送中',
                mask: true
              })
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
          console.log(res)
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
          console.log(err)
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
    // 转诊
    handleCheckReferral() {
      this.setData({
        displayReferral: true
      })
    },
    // 添加医生
    handleAddDoctor() {
      this.setData({
        displayAddDoctor: true
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
      // this.sendTextMessage(event.detail.message, true);
      // 赋值
      this.setData({
        isAudio: false,
        message: event.detail.message,
        focus1: true,
        sendMessageBtn: true,
        displayCommonWords: false,
      })
    },

    // 常用语
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
            } else if (message.payload.description == 'TIMotherFileElem') {
              msg = "文件"
            } else {
              msg = "你有一条新的消息"
            }
            break;
        }
        sendMessageCallback({
          consultId: this.data.consultId,
          message: msg,
          sendUserId: this.data.userInfo.userId,
          sendUserName: this.data.userInfo.userName
        })
      }).catch((error) => {
        logger.log(`| TUI-chat | message-input | sendMessageError: ${error.code} `);
        // 图片发送失败
        this.triggerEvent('showMessageErrorImage', {
          showErrorImageFlag: error.code,
          message,
        });
      });

      this.setData({
        displayFlag: '',
      });
    },

    handleClose() {
      this.setData({
        displayFlag: '',
      });
    },

    handleServiceEvaluation() {
      this.setData({
        displayServiceEvaluation: true,
      });
    },

    // 发送问卷
    sendQuestionnaire() {
      let that = this
      wx.showModal({
        title: '确认向患者发送满意度问卷？',
        content: '在每次咨询后，系统都会自动将满意度问卷推送至患者，同时医护人员也可以在这里手动推送。',
        success(res) {
          if (res.confirm) {
            const message = wx.$TUIKit.createCustomMessage({
              to: that.getToAccount(),
              conversationType: that.data.conversation.type,
              payload: {
                description: "satisfactionQuestionnaireMessage",
                data: JSON.stringify({
                  id: 0,
                  type: 7
                })
              },
            });
            that.$sendTIMMessage(message)
          }
        }
      })
    },

    // 
    uploadFile() {
      let that = this
      wx.chooseMessageFile({
        count: 1,
        type: "file",
        success: res => {
          const mediaInfoList = res.tempFiles;
          mediaInfoList.forEach((file) => {
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
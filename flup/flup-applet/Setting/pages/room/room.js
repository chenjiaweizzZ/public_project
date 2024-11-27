import TRTC from '../../../static/trtc-wx'
import {
  sendMessageCallback
} from "../../../utils/api"

Page({
  data: {
    _rtcConfig: {
      sdkAppID: '', // 必要参数 开通实时音视频服务创建应用后分配的 sdkAppID
      userID: '', // 必要参数 用户 ID 可以由您的帐号系统指定
      userSig: '', // 必要参数 身份签名，相当于登录密码的作用
    },
    pusher: null,
    playerList: [],
    inviteID: "",
    patientId: "",
    patientName: "",
    isAnswer: false,
    isCancel: false,
    isAgree: false,
    startTime: 0,
    talkTime: "",
    roomId2: "",
    consultId: "",
    patientId: "",
    userInfo: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({
      inviteID: options.inviteID,
      roomID: options.roomID,
      patientName: options.patientName,
      roomId2: options.roomId2,
      consultId: options.consultId,
      patientId: options.patientId,
      userInfo: wx.getStorageSync('userInfo')
    })
    const IMData = await wx.getStorageSync('IMData')
    wx.setKeepScreenOn({
      keepScreenOn: true,
    })
    this.TRTC = new TRTC(this)
    this.init({
      roomID: options.roomID,
      sdkAppID: IMData.appid,
      userID: IMData.identifier,
      userSig: IMData.userSig,
    })
    this.bindTRTCRoomEvent()
    this.enterRoom({
      roomID: options.roomID
    })
    // 被邀请人接受邀请
    wx.$TUIKit.addSignalingListener(wx.TencentCloudChat.TSignaling.INVITEE_ACCEPTED, this.onInviteeAccepted);
    // 被邀请人拒绝邀请
    wx.$TUIKit.addSignalingListener(wx.TencentCloudChat.TSignaling.INVITEE_REJECTED, this.onInviteeRejected);
    // 邀请超时
    wx.$TUIKit.addSignalingListener(wx.TencentCloudChat.TSignaling.INVITATION_TIMEOUT, this.onInvitationTimeout);
  },
  onInviteeAccepted(e) {
    console.log(e, "同意邀请", 111)
    this.setData({
      isAgree: true
    })
    setTimeout(() => {
      this.setData({
        isAnswer: true,
        startTime: new Date().getTime()
      })
      this.timer = setInterval(() => {
        this.endCall()
      }, 1000)
    }, 1000)
  },
  onInviteeRejected(e) {
    console.log(e, "拒绝邀请", 111)
    this.setData({
      isCancel: true
    })

    this._hangUp()
  },
  endCall() {
    const endTime = new Date().getTime(); // 记录结束时间
    const callDuration = endTime - this.data.startTime; // 计算通话时间
    // 将时间转换为 HH:MM:SS 格式
    const hours = Math.floor(callDuration / 3600000);
    const minutes = Math.floor((callDuration % 3600000) / 60000);
    const seconds = Math.floor(((callDuration % 3600000) % 60000) / 1000);
    let callDurationFormatted = ''
    if (hours > 0) {
      callDurationFormatted = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
    } else {
      callDurationFormatted = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
    }
    this.setData({
      talkTime: callDurationFormatted
    })
  },
  onInvitationTimeout(e) {
    // 提示对方不在线，并返回上一级页面
    const message = wx.$TUIKit.createCustomMessage({
      to: this.data.roomId2,
      conversationType: "GROUP",
      payload: {
        description: "TRTCElem",
        data: JSON.stringify({
          type: 13,
          to: "未应答",
          from: "对方无应答"
        })
      },
    });
    wx.$TUIKit.sendMessage(message, {
      offlinePushInfo: {
        disablePush: true,
      },
    }).then(res => {
      console.log("发送成功，111")
      let pages = getCurrentPages(); // 当前页面栈
      console.log(pages)
      if (pages.length > 1) {
        let beforePage = pages[pages.length - 2] // 获取上一页面的实例对象
        if (beforePage && beforePage.refreshRoom) {
          beforePage.setData({
            message: message
          })
          beforePage.refreshRoom()
        }
      }
      // 回调接口
      let msg = '【视频通话】'
      sendMessageCallback({
        consultId: this.data.consultId,
        message: msg,
        sendUserId: this.data.userInfo.userId,
        sendUserName: this.data.userInfo.userName
      })
      this.exitRoom()
      wx.navigateBack()
    })

  },
  onReady() {
    console.log('room ready')
  },
  onUnload() {
    wx.$TUIKit.removeSignalingListener(wx.TencentCloudChat.TSignaling.INVITEE_ACCEPTED, this.onInviteeAccepted);
    wx.$TUIKit.removeSignalingListener(wx.TencentCloudChat.TSignaling.INVITEE_REJECTED, this.onInviteeRejected);
    wx.$TUIKit.removeSignalingListener(wx.TencentCloudChat.TSignaling.INVITATION_TIMEOUT, this.onInvitationTimeout);
  },
  init(options) {
    console.log(options, 1111)
    // pusher 初始化参数
    const pusherConfig = {
      beautyLevel: 9
    }
    const pusher = this.TRTC.createPusher(pusherConfig)
    this.setData({
      _rtcConfig: {
        userID: options.userID,
        sdkAppID: options.sdkAppID,
        userSig: options.userSig,
      },
      pusher: pusher.pusherAttributes
    })
  },

  enterRoom(options) {
    const roomID = options.roomID
    const config = Object.assign(this.data._rtcConfig, {
      roomID
    })
    this.setData({
      pusher: this.TRTC.enterRoom(config),
    }, () => {
      this.TRTC.getPusherInstance().start() // 开始推流（autoPush的模式下不需要）
    })
  },

  exitRoom() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    const result = this.TRTC.exitRoom()
    this.setData({
      pusher: result.pusher,
      playerList: result.playerList,
    })
  },

  // 设置 pusher 属性
  setPusherAttributesHandler(options) {
    this.setData({
      pusher: this.TRTC.setPusherAttributes(options),
    })
  },

  // 设置某个 player 属性
  setPlayerAttributesHandler(player, options) {
    this.setData({
      playerList: this.TRTC.setPlayerAttributes(player.streamID, options),
    })
  },

  // 事件监听
  bindTRTCRoomEvent() {
    const TRTC_EVENT = this.TRTC.EVENT
    // 初始化事件订阅
    this.TRTC.on(TRTC_EVENT.LOCAL_JOIN, (event) => {
      getApp().aegisReportEvent('inVideoCallRoom', 'inVideoCallRoom-success')
      // 进房成功，触发该事件后可以对本地视频和音频进行设置
      this.setPusherAttributesHandler({
        enableCamera: true
      })
      this.setPusherAttributesHandler({
        enableMic: true
      })
    })
    this.TRTC.on(TRTC_EVENT.LOCAL_LEAVE, (event) => {
      console.log('* room LOCAL_LEAVE', event)
    })
    this.TRTC.on(TRTC_EVENT.ERROR, (event) => {
      console.log('* room ERROR', event)
    })
    // 远端用户退出
    this.TRTC.on(TRTC_EVENT.REMOTE_USER_LEAVE, (event) => {
      const {
        playerList
      } = event.data
      this.setData({
        playerList: playerList
      })
      console.log('远端用户退出', event)
      setTimeout(() => {
        this.exitRoom()
        wx.navigateBack()
      }, 1000)
    })
    // 远端用户推送视频
    this.TRTC.on(TRTC_EVENT.REMOTE_VIDEO_ADD, (event) => {
      console.log("远程用户开始推送视频")
      const {
        player
      } = event.data
      // 开始播放远端的视频流，默认是不播放的
      this.setPlayerAttributesHandler(player, {
        muteVideo: false
      })
    })
    // 远端用户取消推送视频
    this.TRTC.on(TRTC_EVENT.REMOTE_VIDEO_REMOVE, (event) => {
      console.log('远端用户取消推送视频', event)
      const {
        player
      } = event.data
      this.setPlayerAttributesHandler(player, {
        muteVideo: true
      })
    })
    // 远端用户推送音频
    this.TRTC.on(TRTC_EVENT.REMOTE_AUDIO_ADD, (event) => {
      console.log('远端用户推送音频', event)
      const {
        player
      } = event.data
      this.setPlayerAttributesHandler(player, {
        muteAudio: false
      })
    })
    // 远端用户取消推送音频
    this.TRTC.on(TRTC_EVENT.REMOTE_AUDIO_REMOVE, (event) => {
      console.log('远端用户取消推送音频', event)
      const {
        player
      } = event.data
      this.setPlayerAttributesHandler(player, {
        muteAudio: true
      })
    })
  },

  // 是否订阅某一个player Audio
  _mutePlayerAudio(event) {
    const player = event.currentTarget.dataset.value
    if (player.hasAudio && player.muteAudio) {
      this.setPlayerAttributesHandler(player, {
        muteAudio: false
      })
      return
    }
    if (player.hasAudio && !player.muteAudio) {
      this.setPlayerAttributesHandler(player, {
        muteAudio: true
      })
      return
    }
  },

  // 订阅 / 取消订阅某一个player Video
  _mutePlayerVideo(event) {
    const player = event.currentTarget.dataset.value
    if (player.hasVideo && player.muteVideo) {
      this.setPlayerAttributesHandler(player, {
        muteVideo: false
      })
      return
    }
    if (player.hasVideo && !player.muteVideo) {
      this.setPlayerAttributesHandler(player, {
        muteVideo: true
      })
      return
    }
  },

  // 挂断退出房间
  _hangUp() {
    let that = this
    if (that.data.isAnswer) {
      setTimeout(() => {
        that.exitRoom()
        wx.navigateBack()
      }, 1000)
    } else {
      let promise = wx.$TUIKit.cancel({
        inviteID: that.data.inviteID,
        data: '',
      })
      promise.then(function (imResponse) {
        setTimeout(() => {
          that.exitRoom()
          wx.navigateBack()
        }, 1000)
      }).catch(function (error) {
        setTimeout(() => {
          that.exitRoom()
          wx.navigateBack()
        }, 1000)
      });
    }

    if (!that.data.isCancel) {
      that.sendTIMMessage()
    }
  },
  sendTIMMessage() {
    const message = wx.$TUIKit.createCustomMessage({
      to: this.data.roomId2,
      conversationType: "GROUP",
      payload: {
        description: "TRTCElem",
        data: JSON.stringify({
          type: 13,
          to: this.data.isAnswer ? `通话时长 ${this.data.talkTime}` : "对方已取消",
          from: this.data.isAnswer ? `通话时长 ${this.data.talkTime}` : "已取消"
        })
      },
    });
    wx.$TUIKit.sendMessage(message, {
      offlinePushInfo: {
        disablePush: true,
      },
    }).then(res => {
      console.log("发送成功")
      let pages = getCurrentPages(); // 当前页面栈
      if (pages.length > 1) {
        let beforePage = pages[pages.length - 2] // 获取上一页面的实例对象
        if (beforePage && beforePage.refreshRoom) {
          beforePage.setData({
            message: message
          })
          beforePage.refreshRoom()
        }
      }
      // 回调接口
      let msg = '【视频通话】'
      sendMessageCallback({
        consultId: this.data.consultId,
        message: msg,
        sendUserId: this.data.userInfo.userId,
        sendUserName: this.data.userInfo.userName
      })
    })
  },
  // 发布 / 取消发布 Audio
  _pusherAudioHandler() {
    if (this.data.pusher.enableMic) {
      this.setPusherAttributesHandler({
        enableMic: false
      })
    } else {
      this.setPusherAttributesHandler({
        enableMic: true
      })
    }
  },

  _pusherEnableHandler() {
    if (this.data.pusher.enableCamera) {
      this.setPusherAttributesHandler({
        enableCamera: false
      })
    } else {
      this.setPusherAttributesHandler({
        enableCamera: true
      })
    }
  },

  _pusherSpeakerHandler() {
    if (this.data.pusher.enableSpeaker) {
      this.setPusherAttributesHandler({
        enableSpeaker: false
      })
    } else {
      this.setPusherAttributesHandler({
        enableSpeaker: true
      })
    }
  },

  // 翻转摄像头
  _pusherSwitchCamera() {
    const frontCamera = this.data.pusher.frontCamera === 'front' ? 'back' : 'front'
    this.TRTC.getPusherInstance().switchCamera(frontCamera)
  },

  _setPlayerSoundMode() {
    if (this.data.playerList.length === 0) {
      return
    }
    const player = this.TRTC.getPlayerList()
    const soundMode = player[0].soundMode === 'speaker' ? 'ear' : 'speaker'
    this.setPlayerAttributesHandler(player[0], {
      soundMode
    })
  },
  // 请保持跟 wxml 中绑定的事件名称一致
  _pusherStateChangeHandler(event) {
    this.TRTC.pusherEventHandler(event)
  },
  _pusherNetStatusHandler(event) {
    this.TRTC.pusherNetStatusHandler(event)
  },
  _pusherErrorHandler(event) {
    this.TRTC.pusherErrorHandler(event)
  },
  _pusherBGMStartHandler(event) {
    this.TRTC.pusherBGMStartHandler(event)
  },
  _pusherBGMProgressHandler(event) {
    this.TRTC.pusherBGMProgressHandler(event)
  },
  _pusherBGMCompleteHandler(event) {
    this.TRTC.pusherBGMCompleteHandler(event)
  },
  _pusherAudioVolumeNotify(event) {
    this.TRTC.pusherAudioVolumeNotify(event)
  },
  _playerStateChange(event) {
    this.TRTC.playerEventHandler(event)
  },
  _playerFullscreenChange(event) {
    this.TRTC.playerFullscreenChange(event)
  },
  _playerNetStatus(event) {
    this.TRTC.playerNetStatus(event)
  },
  _playerAudioVolumeNotify(event) {
    this.TRTC.playerAudioVolumeNotify(event)
  },
})
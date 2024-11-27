import TRTC from '../../../static/trtc-wx'
import { sendMessageCallback } from "../../../utils/api"

const app = getApp()

Page({
  data: {
    _rtcConfig: {
      sdkAppID: '',
      userID: '',
      userSig: '',
    },
    pusher: null,
    playerList: [],
    roomID: "",
    inviteID: "",
    isAnswer: false,
    patientName: "",
    startTime: 0,
    talkTime: "",
    isAgree: false,
    isCancel: false,
    content: "邀请你视频通话",
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
      roomID: options.roomID,
      inviteID: options.inviteID,
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
      userSig: IMData.userSig
    })
    this.bindTRTCRoomEvent()
    this.enterRoom({
      roomID: options.roomID
    })
    wx.$TUIKit.addSignalingListener(wx.TencentCloudChat.TSignaling.INVITATION_CANCELLED, this.onInvitationCancelled);
    wx.$TUIKit.addSignalingListener(wx.TencentCloudChat.TSignaling.INVITATION_TIMEOUT, this.onInvitationTimeout);
  },

  onInvitationTimeout(e) {
    this.exitRoom()
    wx.navigateBack()
  },
  onInvitationCancelled(e) {
    this.setData({
      content: "对方已取消"
    })
    setTimeout(() => {
      this.exitRoom()
      wx.navigateBack()
    }, 1000)
  },

  endCall() {
    const endTime = new Date().getTime();
    const callDuration = endTime - this.data.startTime;
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

  _answer() {
    let that = this
    let promise = wx.$TUIKit.accept({
      inviteID: that.data.inviteID
    })
    this.setData({
      isAgree: true
    })
    promise.then(function (imResponse) {
      setTimeout(() => {
        that.setData({
          isAnswer: true,
          startTime: new Date().getTime()
        })
        that.timer = setInterval(() => {
          that.endCall()
        }, 1000)
      }, 1000)
    }).catch(function (error) {
      console.warn('accept failed:', error);
    });
  },

  onUnload() {
    wx.$TUIKit.removeSignalingListener(wx.TencentCloudChat.TSignaling.INVITATION_CANCELLED, this.onInvitationCancelled);
    wx.$TUIKit.removeSignalingListener(wx.TencentCloudChat.TSignaling.INVITATION_TIMEOUT, this.onInvitationTimeout);
    this.exitRoom()
  },

  init(options) {
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
      pusher: this.TRTC.enterRoom(config)
    }, () => {
      console.log(this.data.pusher, 1112)
      this.TRTC.getPusherInstance().start()
    })
  },

  exitRoom() {
    app.globalData.isBusyLine = false
    const result = this.TRTC.exitRoom()
    this.setData({
      content: "邀请你视频通话",
      pusher: result.pusher,
      playerList: result.playerList,
    })
  },

  setPusherAttributesHandler(options) {
    this.setData({
      pusher: this.TRTC.setPusherAttributes(options),
    })
  },

  setPlayerAttributesHandler(player, options) {
    this.setData({
      playerList: this.TRTC.setPlayerAttributes(player.streamID, options),
    })
  },

  bindTRTCRoomEvent() {
    const TRTC_EVENT = this.TRTC.EVENT
    this.TRTC.on(TRTC_EVENT.LOCAL_JOIN, (event) => {
      console.log('* room LOCAL_JOIN', event)
      getApp().aegisReportEvent('inVideoCallRoom', 'inVideoCallRoom-success')
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
    this.TRTC.on(TRTC_EVENT.REMOTE_USER_LEAVE, (event) => {
      const {
        playerList
      } = event.data
      this.setData({
        playerList: playerList
      })
      console.log('* room REMOTE_USER_LEAVE', event)
      wx.showToast({
        title: '对方已离开房间',
        icon: 'none'
      })
      setTimeout(() => {
        this.exitRoom()
        wx.navigateBack()
      }, 1000)
    })
    this.TRTC.on(TRTC_EVENT.REMOTE_VIDEO_ADD, (event) => {
      console.log('* room REMOTE_VIDEO_ADD', event)
      const {
        player
      } = event.data
      this.setPlayerAttributesHandler(player, {
        muteVideo: false
      })
    })
    this.TRTC.on(TRTC_EVENT.REMOTE_VIDEO_REMOVE, (event) => {
      console.log('* room REMOTE_VIDEO_REMOVE', event)
      const {
        player
      } = event.data
      this.setPlayerAttributesHandler(player, {
        muteVideo: true
      })
    })
    this.TRTC.on(TRTC_EVENT.REMOTE_AUDIO_ADD, (event) => {
      console.log('* room REMOTE_AUDIO_ADD', event)
      const {
        player
      } = event.data
      this.setPlayerAttributesHandler(player, {
        muteAudio: false
      })
    })
    this.TRTC.on(TRTC_EVENT.REMOTE_AUDIO_REMOVE, (event) => {
      console.log('* room REMOTE_AUDIO_REMOVE', event)
      const {
        player
      } = event.data
      this.setPlayerAttributesHandler(player, {
        muteAudio: true
      })
    })
  },

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

  _hangUp() {
    let that = this
    if (!that.data.isAnswer) {
      let promise = wx.$TUIKit.reject({
        inviteID: this.data.inviteID,
        data: JSON.stringify({
          type: 2,
          message: "对方已挂断"
        }),
      })
      promise.then(function (imResponse) {
        that.exitRoom()
        wx.navigateBack()
      }).catch(function (error) {
        console.warn('reject failed:', error);
        that.exitRoom()
        wx.navigateBack()
      });
      that.sendTIMMessage("对方已拒绝", "已拒绝")
    } else {
      that.exitRoom()
      wx.navigateBack()
      that.sendTIMMessage(`通话时长 ${this.data.talkTime}`, `通话时长 ${this.data.talkTime}`)
    }
  },

  sendTIMMessage(to, from) {
    const message = wx.$TUIKit.createCustomMessage({
      to: this.data.roomId2,
      conversationType: "GROUP",
      payload: {
        desc: "TRTCElem",
        data: JSON.stringify({
          type: 13,
          to,
          from
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
        let beforePage = pages[pages.length - 1] // 获取上一页面的实例对象
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
  }
})
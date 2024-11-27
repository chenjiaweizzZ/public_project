<template>
  <div class="message-input-toolbar-h5">
    <div class="item-wrap" @click="getImage('camera')">
      <div class="item">
        <img src="../assets/icon/camera-uni.png" alt="" />
      </div>
      <span>拍照</span>
    </div>
    <div class="item-wrap" @click="getImage('album')">
      <div class="item">
        <img src="../assets/icon/image-uni.png" alt="" />
      </div>
      <span>照片</span>
    </div>
    <div class="item-wrap" v-if="managerId !== 'graphic'">
      <div class="item input-image-container">
        <form action="" id="myVideoForm">
          <input title="视频" type="file" data-type="video" accept="video/*" @change="sendVideoInWeb" ref="inputRef" />
        </form>
        <img src="../assets/icon/video-file.png" alt="" />
      </div>
      <span>视频上传</span>
    </div>
    <div class="item-wrap" v-if="managerId !== 'graphic'">
      <div class="item input-image-container">
        <form action="" id="myFileForm">
          <input title="视频" type="file" data-type="doc" accept=".doc,.docx,.pdf" @change="sendFileInWeb" ref="inputRef" />
        </form>
        <img src="../assets/icon/file-uni.png" alt="" />
      </div>
      <span>文件上传</span>
    </div>
    <div class="item-wrap" @click="call()" v-if="showCall && managerId !== 'graphic'">
      <div class="item">
        <img src="../assets/icon/video-uni.png" alt="" />
      </div>
      <span>视频通话</span>
    </div>
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import { mapState, mapMutations } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      roomId: "",
      consultId: "",
      fileTypes: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
      showCall: true,
    };
  },
  props: {
    preSales: {
      default: 0,
    },
  },
  computed: {
    ...mapState("chat", [
      "trtcRoomId",
      "trtcRoomId2",
      "inviteID",
      "inviteShow",
      "groupUserInfoList",
      "consultId",
      "managerId",
    ]),
  },
  mounted() {
    this.init();
    this.roomId = this.$route.query.roomId;
    this.consultId = this.$route.query.consultId;
    if (this.$route.query.preSales == 1) {
      this.showCall = false;
    }
  },
  methods: {
    ...mapMutations("chat", [
      "putMessage",
      "setRoomId",
      "setRoomId2",
      "setInviteId",
      "setInviteShow",
      "setInviteShowType",
      "setConsultId",
    ]),
    async init() {
      let res = await this.$apis.getWxConfigParam({
        url: window.location.href.split("#")[0],
      });
      let info = res.retData;
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: info.appId, // 必填，公众号的唯一标识
        timestamp: info.timestamp, // 必填，生成签名的时间戳
        nonceStr: info.nonceStr, // 必填，生成签名的随机串
        signature: info.signature, // 必填，签名
        jsApiList: ["chooseImage", "getLocalImgData"], // 必填，需要使用的JS接口列表
      });
    },
    async getImage(sourceType) {
      let that = this;
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: [sourceType], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          let localIds = res.localIds[0];
          that.$toast.loading({
            duration: 0,
          });
          wx.getLocalImgData({
            localId: localIds.toString(), //图片的本地ID
            success: function (info) {
              var localData = info.localData;
              if (localData.indexOf("data:image") != 0) {
                //判断是否有这样的头部
                localData = "data:image/jpeg;base64," + localData;
              }
              localData = localData
                .replace(/\r|\n/g, "")
                .replace("data:image/jgp", "data:image/jpeg");
              let file = that.base64toFile(localData);
              let formData = new FormData();
              formData.append("file", file);
              axios({
                method: "post",
                url: that.$baseURL.ICDMApiUrl + "/file/upload",
                headers: {
                  openId:
                    localStorage.getItem("openId") ||
                    (localStorage.getItem("userInfo") &&
                      JSON.parse(localStorage.getItem("userInfo")).openId),
                  "content-type": "multipart/form-data",
                },
                data: formData,
              }).then((res) => {
                let imageUrl =
                  that.$baseURL.ICDMApiUrl +
                  "/file/image/" +
                  res.data.retData.id;
                that.sendMessage(imageUrl);
                that.$toast.clear();
              });
            },
          });
        },
      });
    },

    sendMessage(res) {
      let that = this;
      // let message = that.$chat.createImageMessage({
      //   to: that.roomId,
      //   conversationType: that.$TencentCloudChat.TYPES.CONV_GROUP,
      //   payload: { file: res },
      //   onProgress: function(event) { console.log('file uploading:', event) }
      // });
      let message = that.$chat.createCustomMessage({
        to: that.roomId,
        conversationType: that.$TencentCloudChat.TYPES.CONV_GROUP,
        payload: {
          description: "TIMImageElem",
          data: JSON.stringify({
            type: 5,
            imageUrl: res,
          }),
          // file: res
        },
        onProgress: function (event) {
          console.log("file uploading:", event);
        },
      });
      that.putMessage(message);
      that.$parent.bottomScroll();
      // 3. 发送图片
      let promise = that.$chat.sendMessage(message);
      promise
        .then(async function (imResponse) {
          // 发送成功
          if (that.$route.query.preSales == 1) {
            await that.$apis.personalSendMessageCallback({
              consultId: that.consultId,
              message: "图片",
              sendUserId: that.$route.query.patientId,
              sendUserName: that.$route.query.patientName,
            });
          } else {
            if (that.$route.query.packageType == 1) {
              await that.$apis.sendGraphicMessageCallback({
                consultId: that.consultId,
                message: "图片",
                sendUserId: that.$route.query.patientId,
                sendUserName: that.$route.query.patientName,
              });
            } else {
              await that.$apis.sendMessageCallback({
                consultId: that.consultId,
                message: "图片",
                sendUserId: that.$route.query.patientId,
                sendUserName: that.$route.query.patientName,
              });
            }
          }
        })
        .catch(function (imError) {
          // 发送失败
          console.warn("sendMessage error:", imError);
        })
        .finally(() => {});
    },
    sendVideo(res) {
      let that = this;
      let message = that.$chat.createCustomMessage({
        to: that.roomId,
        conversationType: that.$TencentCloudChat.TYPES.CONV_GROUP,
        payload: {
          description: "TIMVideoFileElem",
          data: JSON.stringify({
            type: 9,
            videoUrl: res,
          }),
          // file: res
        },
        onProgress: function (event) {
          console.log("file uploading:", event);
        },
      });
      that.putMessage(message);
      let promise = that.$chat.sendMessage(message);
      promise
        .then(async function (imResponse) {
          // 发送成功
          if (that.$route.query.preSales == 1) {
            await that.$apis.personalSendMessageCallback({
              consultId: that.consultId,
              message: "视频",
              sendUserId: that.$route.query.patientId,
              sendUserName: that.$route.query.patientName,
            });
          } else {
            await that.$apis.sendMessageCallback({
              consultId: that.consultId,
              message: "视频",
              sendUserId: that.$route.query.patientId,
              sendUserName: that.$route.query.patientName,
            });
          }
          that.$parent.bottomScroll();
          that.$emit("iptBlur");
        })
        .catch(function (imError) {
          // 发送失败
          console.warn("sendMessage error:", imError);
        })
        .finally(() => {});
    },
    sendOther(url, name, suffix) {
      let that = this;
      let message = that.$chat.createCustomMessage({
        to: that.roomId,
        conversationType: that.$TencentCloudChat.TYPES.CONV_GROUP,
        payload: {
          description: "TIMOtherFileElem",
          data: JSON.stringify({
            type: 12,
            url,
            name,
            suffix,
          }),
          // file: res
        },
        onProgress: function (event) {
          console.log("file uploading:", event);
        },
      });
      that.putMessage(message);
      let promise = that.$chat.sendMessage(message);
      promise
        .then(async function (imResponse) {
          // 发送成功
          if (that.$route.query.preSales == 1) {
            await that.$apis.personalSendMessageCallback({
              consultId: that.consultId,
              message: "文件",
              sendUserId: that.$route.query.patientId,
              sendUserName: that.$route.query.patientName,
            });
          } else {
            await that.$apis.sendMessageCallback({
              consultId: that.consultId,
              message: "文件",
              sendUserId: that.$route.query.patientId,
              sendUserName: that.$route.query.patientName,
            });
          }
          that.$emit("iptBlur");
          that.$parent.bottomScroll();
        })
        .catch(function (imError) {
          // 发送失败
          console.warn("sendMessage error:", imError);
        })
        .finally(() => {});
    },
    base64toFile(dataurl, filename = "file") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime,
      });
    },
    sendVideoInWeb(video) {
      let that = this;
      this.$toast.loading({
        duration: 0,
        message: "发送视频中",
        forbidClick: true,
      });
      let file = video.target.files[0];
      if (file.size > 100000000) {
        this.$toast.clear();
        this.$toast("视频文件过大");
        return;
      }
      let formData = new FormData();
      formData.append("file", file);
      axios({
        method: "post",
        url: that.$baseURL.ICDMApiUrl + "/file/upload",
        headers: {
          openId:
            localStorage.getItem("openId") ||
            (localStorage.getItem("userInfo") &&
              JSON.parse(localStorage.getItem("userInfo")).openId),
          "content-type": "multipart/form-data",
        },
        data: formData,
      })
        .then((res) => {
          console.log(res);
          let url =
            this.$baseURL.ICDMApiUrl + "/file/video/" + res.data.retData.id;
          document.getElementById("myVideoForm").reset();
          that.sendVideo(url);
          this.$toast.clear();
          this.$toast("视频发送成功");
        })
        .catch((error) => {
          console.log("error", error);
          this.$toast.clear();
          this.$toast("视频发送失败");
        });
    },
    sendFileInWeb(file) {
      let that = this;
      let f1le = file.target.files[0];
      console.log(f1le.type);
      if (this.fileTypes.includes(f1le.type)) {
        let formData = new FormData();
        formData.append("file", f1le);
        axios({
          method: "post",
          url: that.$baseURL.ICDMApiUrl + "/file/upload",
          headers: {
            openId:
              localStorage.getItem("openId") ||
              (localStorage.getItem("userInfo") &&
                JSON.parse(localStorage.getItem("userInfo")).openId),
            "content-type": "multipart/form-data",
          },
          data: formData,
        }).then((res) => {
          let url =
            this.$baseURL.ICDMApiUrl + "/file/other/" + res.data.retData.id;
          document.getElementById("myFileForm").reset();
          that.sendOther(
            url,
            res.data.retData.originalFilename,
            res.data.retData.suffix
          );
        });
      } else {
        this.$toast("请上传正确的文件类型\n(.doc .docx .xls .xlsx .pdf)");
        document.getElementById("myFileForm").reset();
      }
    },
    call() {
      if (this.preSales) {
        this.getPreSig();
      } else {
        this.getDocSig();
      }
    },
    getDocSig() {
      this.$apis
        .getConsultDetailsById({ consultId: this.$route.query.consultId })
        .then((res) => {
          let { activationId } = res.retData;
          let userId = "";
          // this.$apis.getIMData().then(res => {
          //   console.log(`https://premisd.zwjk.com/flup/web/h5/#/call?userId=201419112011315876410&roomId=123&&userSig=${JSON.parse(res.retData).sig}`)
          // })
          this.groupUserInfoList.forEach((i) => {
            if (i.userId == activationId) {
              userId = i.extendUserId;
            }
          });
          this.toCall(userId);
        });
    },
    getPreSig() {
      this.$apis
        .getPersonalConsultDetailsById({
          consultId: this.$route.query.consultId,
        })
        .then((res) => {
          let { activationId } = res.retData;
          let userId = "";
          this.groupUserInfoList.forEach((i) => {
            if (i.userId == activationId) {
              userId = i.extendUserId;
            }
          });
          this.toCall(userId);
        });
    },
    async toCall(callUserID) {
      let that = this;
      let roomId = parseInt(Math.random() * 100000000, 10);
      let obj = {
        roomId,
        roomId2: this.$route.query.roomId,
        consultId: this.$route.query.consultId,
        userName: JSON.parse(localStorage.getItem("userInfo")).patientName,
        avator: "",
        type: 1,
      };
      this.setRoomId2(this.$route.query.roomId);
      this.setConsultId(this.$route.query.consultId);
      let accept = function (event) {
        that.$router.push({
          path: "/call",
          query: {
            userId: localStorage.getItem("userId"),
            userSig: localStorage.getItem("userSig"),
            roomId: that.trtcRoomId,
            roomId2: that.trtcRoomId2,
            consultId: that.consultId,
          },
        });
        that.setInviteShow(false);
      };
      let reject = function (event) {
        console.log(event);
        let obj = JSON.parse(event.data.data);
        that.setInviteShow(false);
        that.setInviteId("");
        that.$toast(obj.message);
      };
      this.$chat.addSignalingListener(
        this.$TencentCloudChat.TSignaling.INVITEE_ACCEPTED,
        accept
      );
      this.$chat.addSignalingListener(
        this.$TencentCloudChat.TSignaling.INVITEE_REJECTED,
        reject
      );
      let promise = this.$chat.invite({
        userID: callUserID,
        // userID: "1424042315383675938",
        data: JSON.stringify(obj),
        timeout: 30, // 设置 30s 超时
        offlinePushInfo: {
          disablePush: false, // 如果接收方不在线，则进行离线推送
          disableVoipPush: false, // 开启 voip 推送需要同时开启离线推送
          title: "", // 离线推送标题
          description: "", // 离线推送内容
          androidOPPOChannelID: "", // 离线推送设置 OPPO 手机 8.0 系统及以上的渠道 ID
        },
      });
      promise
        .then(function (imResponse) {
          // 发送邀请信令成功
          console.warn("invite success:", imResponse);
          // let { data } = imResponse
          console.log(imResponse.inviteID);
          that.setInviteId(imResponse.inviteID);
          that.setRoomId(roomId);
          that.setInviteShowType("call");
          that.setInviteShow(true);
        })
        .catch(function (imError) {
          console.warn("invite error:", imError);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.message-input-toolbar-h5 {
  display: flex;
  flex-wrap: wrap;
  padding: 16px 14px;
  background-color: #fff;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 1px;
    background-color: #f6f6f6;
  }

  .item-wrap {
    text-align: center;
    font-size: 12px;
    line-height: 14px;
    color: #8f959d;
    margin-left: 24px;
    margin-bottom: 5px;
    .item {
      & > img {
        width: 32px;
      }

      border-radius: 4px;
      width: 60px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 0.5px solid #e2e2e2;
      margin-bottom: 4px;
    }

    .input-image-container {
      position: relative;

      input {
        opacity: 0;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    }
  }
}
</style>
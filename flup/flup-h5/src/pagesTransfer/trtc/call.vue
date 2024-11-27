<template>
  <div class="home">
    <!-- <div class="waiting">
        <div class="waiting-icon"><i class="el-icon-loading"></i></div>
        <div class="waiting-text">等待医生接听</div>
      </div> -->
    <div class="time">{{ time }}</div>
    <div class="btnGroup">
      <!-- <comp-device-select deviceType="microphone" @change="handleValueChange($event, 'microphoneId')" @call="toCall"></comp-device-select> -->
      <div class="option" @click="miconoff">
        <img :src=miconUrlIcon alt />
        <span class="option-text">{{isMutedAudio ? '麦克风已关' : '麦克风已开' }}</span>
      </div>
      <div class="option" @click="finish">
        <img :src=hangupUrlIcon alt />
        <span class="option-text">挂断</span>
      </div>
      <comp-device-select deviceType="camera" @change="handleValueChange($event, 'cameraId')" @call="toCall"></comp-device-select>
      <!-- <div class="option" @click="camoff">
        <img :src=camUrlIcon alt />
        <span class="option-text">{{isMutedVideo ? '摄像头已关' : '摄像头已开' }}</span>
      </div> -->
    </div>
    <comp-room :sdkAppId="Number(SDKAppID)" :userSig="userSig" :userId="userId" :roomId="roomId" :cameraId="cameraId" :microphoneId="microphoneId" ref="compR00m" @change="handleValueChange($event, 'isMutedAudio')" @change2="handleValueChange($event, 'isMutedVideo')">
    </comp-room>
  </div>
</template>
  
  <script>
import { mapState } from "vuex";
import * as LibGenerateTestUserSig from "@/utils/lib-generate-test-usersig.min.js";
import rtc from "@/components/mixins/rtc.js";
import shareRtc from "@/components/mixins/share-rtc.js";
import compRoom from "@/components/comp-room.vue";
import compDeviceSelect from "@/components/comp-device-select.vue";
import { Select, Icon } from "element-ui";
import hangupUrl from "@/assets/images/call/hangup.png";
import miconUrl from "@/assets/images/call/micon.png";
import micoffUrl from "@/assets/images/call/micoff.png";
import camonUrl from "@/assets/images/call/camon.png";
import camoffUrl from "@/assets/images/call/camoff.png";
export default {
  name: "HomeView",
  mixins: [rtc, shareRtc],
  components: {
    compRoom,
    compDeviceSelect,
    [Select.name]: Select,
    [Icon.name]: Icon,
  },
  data() {
    return {
      secretKey: "",
      userId: "",
      roomId: 0,
      userSig: "",
      inviteLink: "",
      cameraId: "",
      microphoneId: "",
      isCalling: false,
      isReceived: false,
      isMutedVideo: false,
      isMutedAudio: false,
      minutes: 0,
      seconds: 0,
      timerId: null,
      clickBack: false,
    };
  },
  computed: {
    ...mapState("chat", ["SDKAppID"]),
    hangupUrlIcon() {
      return hangupUrl;
    },
    miconUrlIcon() {
      if (!this.isMutedAudio) {
        return miconUrl;
      } else {
        return micoffUrl;
      }
    },
    camUrlIcon() {
      if (!this.isMutedVideo) {
        return camonUrl;
      } else {
        return camoffUrl;
      }
    },
    time() {
      return `${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
    },
  },
  created() {
    // this.$toast.loading({
    //   duration: 0,
    //   forbidClick: true,
    //   message: '等待医生接听',
    // });
    let { userId, userSig, roomId } = this.$route.query;
    this.userId = userId;
    this.userSig = userSig;
    this.roomId = roomId;
  },
  mounted() {
    this.timerId = setInterval(this.increment, 1000);
  },
  beforeDestroy() {
    console.log("back");
    if (!this.clickBack) {
      this.finish();
    }
    clearInterval(this.timerId);
  },
  methods: {
    toCall() {
      if (!this.isCalling) {
        this.call();
        this.isCalling = true;
      }
    },
    increment() {
      this.seconds++;
      if (this.seconds >= 60) {
        this.minutes++;
        this.seconds = 0;
      }
    },
    handleValueChange(value, key) {
      console.log(key, value);
      this[key] = value;
    },
    async start() {
      const userSigGenerator = new LibGenerateTestUserSig(
        this.sdkAppId,
        this.secretKey,
        604800
      );
      this.userSig = userSigGenerator.genTestUserSig(this.userId);
      await this.initClient();
      await this.join();
      await this.initLocalStream();
      await this.playLocalStream();
      await this.publish();
      this.generateInviteLink();
    },
    addSuccessLog(log) {
      console.log("addSuccessLog", log);
    },
    addFailedLog(log) {
      console.log("addFailLog", log);
    },
    reportSuccessEvent(name) {
      this.$aegis.reportEvent({
        name,
        ext1: `${name}-success`,
        ext2: "webrtcQuickDemoVue2",
        ext3: this.sdkAppId,
      });
    },
    generateInviteLink() {
      const { sdkAppId, secretKey, roomId } = this;
      const inviteUserId = `user_${parseInt(Math.random() * 100000000, 10)}`;
      const userSigGenerator = new LibGenerateTestUserSig(
        sdkAppId,
        secretKey,
        604800
      );
      const inviteUserSig = userSigGenerator.genTestUserSig(inviteUserId);
      this.inviteLink = encodeURI(
        `${location.origin}${location.pathname}invite?sdkAppId=${sdkAppId}&userSig=${inviteUserSig}&roomId=${roomId}&userId=${inviteUserId}`
      );
    },
    call() {
      this.$refs.compR00m.handleJoinRoom();
    },
    finish() {
      clearInterval(this.timerId);
      let that = this;
      this.clickBack = true;
      let data = JSON.stringify({
        type: 13,
        to: "通话时长"+this.time,
        from: "通话时长"+this.time,
      });
      console.log(123131, this.$route.query);
      let message = this.$chat.createCustomMessage({
        to: this.$route.query.roomId2,
        conversationType: that.$TencentCloudChat.TYPES.CONV_GROUP,
        payload: {
          description: "TRTCElem",
          data,
        },
        onProgress: function (event) {
          console.log("trtc start", event);
        },
      });
      let promise = that.$chat.sendMessage(message);
      promise
        .then(async function (imResponse) {
          await that.$apis.sendMessageCallback({
              consultId: that.$route.query.consultId,
              message: "通话时长"+that.time,
              sendUserId: JSON.parse(localStorage.getItem('userInfo')).userId,
              sendUserName: JSON.parse(localStorage.getItem('userInfo')).patientName,
          });
          that.$refs.compR00m.handleLeave();
        })
        .catch(function (imError) {
          // 发送失败
          console.warn("sendMessage error:", imError);
        })
        .finally(() => {});
    },
    miconoff() {
      if (this.isMutedAudio) {
        this.$refs.compR00m.unmuteAudio();
      } else {
        this.$refs.compR00m.muteAudio();
      }
    },
    camoff() {
      if (this.isMutedVideo) {
        this.$refs.compR00m.unmuteVideo();
      } else {
        this.$refs.compR00m.muteVideo();
      }
    },
  },
};
</script>
  
  <style scoped lang="scss">
.home {
  background-image: linear-gradient(to bottom, #c8c9cc, #82848a);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .btnGroup {
    z-index: 2;
    position: fixed;
    bottom: 5vw;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    .option {
      // height: 18vw;
      // width: 18vw;
      border-radius: 50%;
      // background: #111111;
      transition: background-color 0.3s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      // &:active {
      //   background: #111111;
      // }
      img {
        width: 15vw;
        height: 15vw;
      }
      &-text {
        margin-top: 10px;
        color: #fff;
      }
    }
    img {
      height: 18vw;
      width: 18vw;
    }
  }
  .time {
    z-index: 2;
    position: fixed;
    bottom: 37vw;
    text-align: center;
    left: 0;
    right: 0;
    color: #fff;
  }
  .waiting {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    &-icon {
      font-size: 50px;
      text-align: center;
    }
    &-text {
      font-size: 20px;
    }
  }
}
</style>
  
  
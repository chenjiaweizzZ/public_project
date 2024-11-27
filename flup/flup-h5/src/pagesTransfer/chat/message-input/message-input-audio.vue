<template>
  <div class="message-input-audio" :class="[isAudioMainShow && 'message-input-audio-open']">
    <div @click="switchAudio">
      <Icon class="audio-message-icon" :file="getAudioIcon()"></Icon>
    </div>
    <div v-if="isAudioMainShow" class="TUI-message-input-main" @touchstart="touchstart" @touchmove="handleTouchMove" @touchend="handleTouchEnd" @touchcancel="handleTouchcancel">
      <span>{{ textValue }}</span>
      <div class="record-modal" v-if="popupToggle" @touchstart="touchstart" @touchmove="handleTouchMove" @touchend="handleTouchEnd" @touchcancel="handleTouchcancel">
        <div class="wrapper">
          <div class="modal-loading"></div>
        </div>
        <div class="modal-title">{{ title }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import Icon from "../common/Icon.vue";
import audio from "../assets/icon/audio.svg";
import Recorder from "js-audio-recorder";
import { mapMutations, mapState } from "vuex";
export default {
  components: {
    Icon,
  },
  props: {
    isAudioMainShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      roomId: "",
      consultId: "",
      showAudioMain: false,
      popupToggle: false,
      title: "",
      isRecording: false,
      textValue: "按住说话",
      startRange: 0,
      recorder: null,
      startTs: 0, //记录开始时间
      isStatus: false, //是否可以录制
      time: null,
    };
  },
  computed: {
    ...mapState("chat", ["isEmpower"]),
  },
  beforeDestroy() {
    if (this.recorder) {
      this.recorder.destroy();
    }
  },
  mounted() {
    this.consultId = this.$route.query.consultId;
    this.roomId = this.$route.query.roomId;
  },
  methods: {
    ...mapMutations("chat", ["putMessage", "setIsEmpower"]),
    getAudioIcon() {
      return audio;
    },
    switchAudio() {
      this.showAudioMain = !this.showAudioMain;
      this.$emit("switchAudio", this.showAudioMain);
    },
    async touchstart(e) {
      this.time = setTimeout(() => {
        if (this.isEmpower) {
          this.recorder = new Recorder({
            sampleBits: 16,
            sampleRate: 16000,
            numChannels: 1,
          });
          this.recorder
            .start()
            .then(() => {
              this.popupToggle = true;
              this.title = "正在录音";
              this.isRecording = true;
              this.startRange = e.changedTouches[0].clientY;

              this.startTs = Date.now();
              this.recorder.start(); // 开始录音
              this.isStatus = true;
            })
            .catch((err) => {});
        } else {
          Recorder.getPermission().then(
            () => {
              this.setIsEmpower(true);
            },
            (error) => {
              this.isStatus = false;
              this.setIsEmpower(false);
              this.$toast.fail("请先允许该网页使用麦克风");
              console.log(112, error);
            }
          );
        }
      }, 200);
    },
    handleTouchMove(e) {
      if (this.isRecording) {
        console.log("----------", this.startRange, e.changedTouches);
        if (
          this.startRange -
            e.changedTouches[e.changedTouches.length - 1].clientY >
          80
        ) {
          this.textValue = "抬起停止";
          this.title = "松开手指，取消发送";
          this.isStatus = false;
        } else if (
          this.startRange -
            e.changedTouches[e.changedTouches.length - 1].clientY >
          20
        ) {
          this.textValue = "抬起停止";
          this.title = "上划可取消";
          this.isStatus = true;
        } else {
          this.textValue = "抬起停止";
          this.title = "正在录音";
          this.isStatus = true;
        }
      }
      e.preventDefault();
    },
    handleTouchEnd() {
      this.isRecording = false;
      this.popupToggle = false;
      this.textValue = "按住说话";
      if (this.time) {
        clearTimeout(this.time);
        this.time = null;
      }
      if (!this.recorder) {
        return false;
      }
      this.handFinish();
    },
    handFinish() {
      let that = this;
      this.recorder.stop();
      let duration = Date.now() - this.startTs;
      if (!this.isStatus) {
        this.stoprecorder();
        return false;
      }
      if (duration < 1000) {
        this.$toast.fail("说话时间太短");
        this.stoprecorder();
        return false;
      }
      let wavBlob = this.recorder.getWAVBlob();
      let audioFile = new File([wavBlob], "语音.wav", { type: "wav" });
      audioFile.duration = duration;
      that.$toast.loading({
        duration: 0,
      });
      let message = that.$chat.createAudioMessage({
        to: that.roomId,
        conversationType: this.$TencentCloudChat.TYPES.CONV_GROUP,
        payload: {
          file: audioFile,
        },
      });
      that.putMessage(message);
      that.$parent.$parent.bottomScroll();
      let promise = that.$chat.sendMessage(message);
      promise
        .then(async function (imResponse) {
          if (that.$route.query.preSales == 1) {
            await that.$apis.personalSendMessageCallback({
              consultId: that.consultId,
              sendUserId: that.$route.query.patientId,
              sendUserName: that.$route.query.patientName,
              message: "语音消息",
            });
          } else {
            if (that.$route.query.packageType == 1) {
              await that.$apis.sendGraphicMessageCallback({
                consultId: that.consultId,
                sendUserId: that.$route.query.patientId,
                sendUserName: that.$route.query.patientName,
                message: "语音消息",
              });
            } else {
              await that.$apis.sendMessageCallback({
                consultId: that.consultId,
                sendUserId: that.$route.query.patientId,
                sendUserName: that.$route.query.patientName,
                message: "语音消息",
              });
            }
          }
          that.stoprecorder();
          console.log("语音发送成功", message, that.recorder);
        })
        .catch(function (imError) {
          console.warn("语音 error:", imError);
        })
        .finally(() => {
          that.$toast.clear();
        });
    },
    stoprecorder() {
      this.recorder.destroy().then(() => {
        this.recorder = null;
        console.log("语音销毁", this.recorder);
      });
    },
    handleTouchcancel() {
      console.log("异常");
      this.handleTouchEnd();
    },
  },
};
</script>
<style lang="scss" scoped>
@import url("../assets/styles/common2.scss");
.message-input-audio {
  display: flex;
  flex-direction: row;
  align-items: center;
  .audio-message-icon {
    width: 23px;
    height: 23px;
    justify-items: center;
  }
  .audio-contain {
    display: flex;
    justify-content: center;
    font-size: 32px;
    font-family: PingFangSC-Regular;
  }

  .TUI-message-input-main {
    flex: 1;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #f6f6f6;
    height: 100%;
    margin-left: 5px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    .record-modal {
      height: 150px;
      width: 60vw;
      background-color: #000;
      opacity: 0.8;
      position: fixed;
      top: 20%;
      z-index: 9999;
      left: 20vw;
      border-radius: 24px;
      display: flex;
      flex-direction: column;
    }

    .record-modal .wrapper {
      display: flex;
      height: 100px;
      box-sizing: border-box;
      padding: 10vw;
    }

    .record-modal .wrapper .modal-loading {
      opacity: 1;
      width: 40px;
      height: 16px;
      border-radius: 4px;
      background-color: #006fff;
      animation: loading 2s cubic-bezier(0.17, 0.37, 0.43, 0.67) infinite;
    }

    @keyframes loading {
      0% {
        transform: translate(0, 0);
      }

      50% {
        transform: translate(30vw, 0);
        background-color: #f5634a;
        width: 40px;
      }

      100% {
        transform: translate(0, 0);
      }
    }

    .modal-title {
      text-align: center;
      color: #fff;
    }
  }

  &-open {
    flex: 1;
  }
}
</style>
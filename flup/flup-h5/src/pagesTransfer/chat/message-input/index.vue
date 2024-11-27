<template>
  <div :class="['message-input','message-input-h5']">
    <div class="flex-row">
      <MessageInputAudio :class="[
          'message-input-audio',
          'message-input-wx-audio',
          isFunctionShow('audio') && 'message-input-wx-audio-open',
        ]" :isAudioMainShow="isFunctionShow('audio')" @switchAudio="switchAudio"></MessageInputAudio>
      <MessageInputEditor v-show="!isFunctionShow('audio')" class="message-input-editor" ref="editor" :placeholder="placeholder" :isMuted="isMuted" :muteText="muteText" :enableInput="enableInput" :enableAt="enableAt" :enableTyping="enableTyping" :isGroup="isGroup" @onTyping="onTyping" @onAt="onAt" @onFocus="onFocus" @onEmpty="onEmpty"></MessageInputEditor>
      <!-- <MessageInputAt
        v-if="enableAt"
        ref="messageInputAtRef"
        @insertAt="insertAt"
        @onAtListOpen="onAtListOpen"
      ></MessageInputAt> -->
      <div class="message-input-emoji" @click="switchEmojiAndFeature('emoji')">
        <Icon :file="getfaceIcon()" class="icon icon-face"></Icon>
      </div>
      <transition name="fade">
        <div class="message-input-send" v-show="!!isEmpty">
          <van-button type="primary" size="normal" @click="send">发送</van-button>
        </div>
      </transition>
      <transition name="fade">
        <div class="message-input-more" @click="switchEmojiAndFeature('more')" v-show="!isEmpty">
          <Icon :file="getmoreIcon()" class="icon icon-more"></Icon>
        </div>
      </transition>
    </div>
    <div>
      <MessageQuote :style="{minWidth: 0}" :currentFunction="currentFunction" />
      <div class="message-input-emoji-picker" v-show="isFunctionShow('emoji')">
        <EmojiPickerDialog @insertEmoji="insertEmoji" @sendMessage="sendMessage"></EmojiPickerDialog>
      </div>
    </div>
    <div class="message-btn" @click.stop="endConsultation" v-if="referralStatus">
      <img class="img" src="@/assets/images/icon/finish.png" />
      <span>结束咨询</span>
    </div>
    <van-popup v-model="isPointOut" class="endConsultation" :close-on-click-overlay="false">
      <div class="endConsultation-info">
        <div class="info-title">是否结束咨询？结束咨询后患者将自动被转接至个案管理师管理。</div>
        <div class="info-btns">
          <div class="info-btns__btn info-btns__line" @click="isPointOut = false">取消</div>
          <div class="info-btns__btn" @click="confirmEnd">确认</div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="isPointOut2" class="endConsultation" :close-on-click-overlay="false">
      <div class="endConsultation-info">
        <div class="info-title">我的疑问已知晓,结束本次咨询</div>
        <div class="info-btns">
          <div class="info-btns__btn info-btns__line" @click="isPointOut2 = false">取消</div>
          <div class="info-btns__btn" @click="imageTextConfirmEnd">确认</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import MessageInputEditor from "./message-input-editor.vue";
import MessageInputAudio from "./message-input-audio.vue";
import Icon from "../common/Icon.vue";
import faceIcon from "../assets/icon/face-uni.png";
import moreIcon from "../assets/icon/more-uni.png";
import MessageQuote from "./message-input-quote/index.vue";
import EmojiPickerDialog from "../message-input-toolbar/emoji-picker/emoji-picker-dialog.vue";
export default {
  props: {
    placeholder: {
      type: String,
      default: "this is placeholder",
    },
    isMuted: {
      type: Boolean,
      default: true,
    },
    muteText: {
      type: String,
      default: "",
    },
    enableInput: {
      type: Boolean,
      default: true,
    },
    enableAt: {
      type: Boolean,
      default: true,
    },
    enableDragUpload: {
      type: Boolean,
      default: true,
    },
    enableTyping: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    MessageInputEditor,
    Icon,
    MessageQuote,
    EmojiPickerDialog,
    MessageInputAudio,
  },
  data() {
    return {
      isGroup: false,
      currentFunction: "",
      isPointOut: false,
      isPointOut2: false,
      isEmpty: "",
    };
  },
  computed: {
    ...mapState("chat", ["referralStatus", "managerId"]),
  },
  methods: {
    ...mapMutations("chat", ["setIsDisabled"]),
    getmoreIcon() {
      return moreIcon;
    },
    getfaceIcon() {
      return faceIcon;
    },
    sendMessage() {
      this.$refs.editor && this.$refs.editor.handleSendMessage();
    },
    onAtListOpen(e) {
      console.log(e);
    },
    insertEmoji(emoji) {
      this.$refs.editor.addEmoji && this.$refs.editor.addEmoji(emoji);
    },
    onTyping(e) {
      console.log("e", e);
    },
    onAt(show) {
      this.$refs.messageInputAtRef.toggleAtList(show);
    },
    onFocus(keyboardHeight) {
      this.switchEmojiAndFeature("");
      this.$nextTick(() => {
        this.$parent.bottomScroll();
      });
    },
    onEmpty(isEmpty) {
      this.isEmpty = isEmpty;
    },
    isFunctionShow(funcName) {
      if (this.currentFunction === funcName) {
        return true;
      }
      return false;
    },
    switchEmojiAndFeature(funcName) {
      if (this.currentFunction === "emoji") {
        if (funcName === "emoji") {
          this.currentFunction = "";
        } else {
          this.currentFunction = funcName;
        }
        if (funcName === "more") {
          this.$nextTick(() => {
            this.$emit("handleToolbarListShow", "");
          });
        }
      } else if (this.currentFunction === "more") {
        this.$emit("handleToolbarListShow", false);
        if (funcName === "more") {
          this.currentFunction = "";
        } else {
          this.$nextTick(() => {
            this.currentFunction = funcName;
          });
        }
      } else {
        this.currentFunction = funcName;
        if (funcName === "more") {
          this.$emit("handleToolbarListShow", "");
        }
      }

      if (this.currentFunction == "" && funcName == "") {
        try {
          if (document.activeElement.tagName === "INPUT") {
            // 安卓下可能有延迟
            setTimeout(() => {
              document.activeElement.scrollIntoViewIfNeeded(true);
            }, 100);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    //发起结束咨询
    endConsultation() {
      if (this.managerId == "graphic") {
        this.switchEmojiAndFeature("");
        this.isPointOut2 = true;
      } else {
        this.switchEmojiAndFeature("");
        this.isPointOut = true;
      }
    },
    //确认结束图文咨询
    async imageTextConfirmEnd() {
      await this.$apis.endGraphicConsultation({
        consultId: this.$route.query.consultId,
      });
      this.isPointOut2 = false;
      this.setIsDisabled(true);
      setTimeout(() => {
        this.$parent.bottomScroll();
      }, 200);
    },
    //确认结束咨询
    async confirmEnd() {
      await this.$apis.endConsultation({
        consultId: this.$route.query.consultId,
      });
      this.isPointOut = false;
      setTimeout(() => {
        this.$parent.bottomScroll();
      }, 200);
    },
    switchAudio(isAudioShow) {
      if (isAudioShow) {
        this.switchEmojiAndFeature("audio");
      } else {
        this.switchEmojiAndFeature("");
      }
    },
    send() {
      this.$refs.editor.handleSendMessage();
    },
  },
};
</script>
<style scoped lang="scss">
@import url("../assets/styles/common2.scss");
.message-input {
  position: relative;
  display: flex;
  flex-direction: column;
  border: none;
  height: 100%;
  width: 100%;
  max-height: 100%;
  max-width: 100%;
  // overflow: hidden;
  background: #fff;
  &-editor {
    flex: 1;
    display: flex;
  }
  &-button {
    width: fit-content;
  }
  &-send {
    display: flex;
    align-items: center;
  }
  .icon {
    width: 23px;
    height: 23px;
    &-face {
      margin: 7px;
    }
    &-more {
      margin: 7px 0px;
    }
  }
  &-wx {
    &-audio {
      &-open {
        flex: 1;
      }
    }
  }
  &-emoji-picker {
    padding-top: 10px;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
.message-input-h5 {
  display: flex;
  flex-direction: column;
  height: calc(100% - 20px);
  width: 100%;
  max-height: 100%;
  padding: 10px;
  // overflow: hidden;
}

.flex-row {
  display: flex;
  flex-direction: row;
}
.message-btn {
  position: absolute;
  left: 10px;
  top: -50px;
  z-index: 100;
  width: 86px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 1px solid #646464;
  border-radius: 13px;
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 0.2px;
  color: #111111;
  background: #f6f6f6;
  opacity: 0.3;
  .img {
    width: 12px;
    margin-right: 4px;
  }
  &:active {
    opacity: 0.7;
  }
}
.endConsultation {
  border-radius: 8px;
  &-info {
    width: 290px;
    .info-title {
      width: 100%;
      padding: 28px 20px 22px;
      font-family: "苹方-简";
      font-size: 16px;
      font-weight: 600;
      line-height: 19px;
      text-align: center;
      letter-spacing: 0.2px;
      color: #111111;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 2;
        width: 100%;
        height: 1px;
        background: rgba(255, 255, 255, 0.01);
        box-shadow: inset 0px 0.5px 0px 0px #e2e2e2;
      }
    }
    .info-btns {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      &__btn {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "苹方-简";
        font-size: 17px;
        font-weight: normal;
        letter-spacing: 0.2px;
        color: #00982d;
        &:active {
          opacity: 0.7;
        }
      }
      &__line {
        position: relative;
        color: #666666;
        &::before {
          content: "";
          position: absolute;
          right: 0px;
          top: 0px;
          z-index: 1;
          width: 1px;
          height: 100%;
          background: #e2e2e2;
        }
      }
    }
  }
}
</style>

<template>
  <div :class="['message-input-container', 'message-input-container-h5']">
    <div class="message-input-mute" v-if="isMuted">
      {{ muteText }}
    </div>
    <div @click.stop="getFouce" class="item">
      <input
        :adjust-position="true"
        v-model.trim="inputText"
        cursor-spacing="20"
        enterkeyhint="send"
        :confirm-hold="true"
        maxlength="140"
        type="text"
        placeholder-class="input-placeholder"
        id="editor"
        class="message-input-area"
        :placeholder="placeholder"
        auto-blur
        @keydown="handkeydown"
        @keyup.enter="handleSendMessage"
        @blur="onBlur"
        @focus="onFocus"
        ref="inputRef"
      />
    </div>
  </div>
</template>
<script>
import { TUIGlobal } from "@tencentcloud/chat-uikit-engine";
import {mapMutations} from "vuex";
export default {
  props: {
    placeholder: {
      type: String,
      default: "this is placeholder",
    },
    replayOrReferenceMessage: {
      type: Object,
      default: () => ({}),
      required: false,
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
    enableTyping: {
      type: Boolean,
      default: true,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputText: "",
      inputRef: {},
      inputBlur: true,
      inputContentEmpty: true,
      allInsertedAtInfo: new Map(),
      roomId:'',
      consultId:'',
    };
  },
  computed: {
    inputState() {
      return [this.inputContentEmpty, this.inputBlur];
    },
  },
  watch: {
    inputState: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.$emit("onTyping", this.inputContentEmpty, this.inputBlur);
        }
      },
      deep: true,
      immediate: true,
    },
    inputText: {
      handler(newVal) {
        this.$emit("onEmpty", newVal);
      },
      deep: true,
      immediate: true,
    }
  },
  mounted() {
    this.roomId = this.$route.query.roomId;
    this.consultId = this.$route.query.consultId;
  },
  methods: {
    ...mapMutations('chat',['putMessage']),
    getFouce(){
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
      })
    },
    handkeydown(event){
      console.log('按下keyCode',event.keyCode);
      if (event.keyCode == 13) {
        // 判断是否为华为手机自带浏览器或UC浏览器
        if (navigator.userAgent.indexOf('UCBrowser') > -1 || navigator.userAgent.indexOf('HuaweiBrowser') > -1) {
          // 将换行键替换为发送键
          event.keyCode = 4;
        }
      }
    },
    handleSendMessage() {
      let that = this;
      if(!that.inputText){
        return false;
      }
      let text = that.inputText;
      let message = this.$chat.createTextMessage({
        to: that.roomId,
        conversationType: that.$TencentCloudChat.TYPES.CONV_GROUP,
        payload: {
          text: that.inputText,
        },
        needReadReceipt: true,
      });
      that.putMessage(message);
      that.$parent.$parent.bottomScroll();
      // 2. 发送消息
      let promise = this.$chat.sendMessage(message);
      promise
        .then(async function (imResponse) {
          console.log('发送成功');
          
          // that.$emit("sendMessage");
          if(that.$route.query.preSales == 1){
            await that.$apis.personalSendMessageCallback({
              consultId:that.consultId,
              message:text,
              sendUserId:that.$route.query.patientId,
              sendUserName:that.$route.query.patientName,
            })
          }else{
            if(that.$route.query.packageType == 1) {
              await that.$apis.sendGraphicMessageCallback({
              consultId:that.consultId,
              message:text,
              sendUserId:that.$route.query.patientId,
              sendUserName:that.$route.query.patientName,
            })
            }else {
              await that.$apis.sendMessageCallback({
              consultId:that.consultId,
              message:text,
              sendUserId:that.$route.query.patientId,
              sendUserName:that.$route.query.patientName,
            })
            }
            
          }
        })
        .catch(function (imError) {
          console.warn("sendMessage error:", imError);
        });
        that.$nextTick(() => {
          that.inputText = '';
        })
    },
    addEmoji(emoji) {
      this.$nextTick(() => {
        this.inputText += emoji.name;
      });
    },
    insertAt(atInfo) {
      if (!this.allInsertedAtInfo.has(atInfo.id)) {
        this.allInsertedAtInfo.set(atInfo.id, atInfo.label);
      }
      this.inputText += atInfo.label;
    },
    getEditorContent() {
      const text = this.inputText;
      const atUserList = [];
      this.allInsertedAtInfo.forEach((value, key) => {
        if (text.includes("@" + value)) {
          atUserList.push(key);
        }
      });
      const payload = {
        text,
      };
      if (atUserList.length) {
        payload.atUserList = atUserList;
      }
      return [
        {
          type: "text",
          payload,
        },
      ];
    },
    resetEditor() {
      this.inputText = "";
      this.inputContentEmpty = true;
      this.allInsertedAtInfo.clear();
    },
    setEditorContent(content) {
      this.inputText = content;
    },
    onBlur() {
      this.inputBlur = true;
    },

    onFocus(e) {
      this.inputBlur = false;
      this.$emit("onFocus", e.detail.height);
    },

    isEditorContentEmpty() {
      this.inputContentEmpty = this.inputText.length ? false : true;
    },
    onInput(e) {
      // uniapp 识别 @ 消息
      const text = e.target.value;
      this.isEditorContentEmpty();
      if (this.isGroup && (text.endsWith("@") || text.endsWith("@\n"))) {
        TUIGlobal.global.hideKeyboard();
        this.$emit("onAt", true);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import url("../assets/styles/common2.scss");
.message-input {
  &-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    // height: calc(100% - 13px);
    width: calc(100% - 20px);
    padding: 3px 10px 10px 10px;
    overflow: hidden;
  }
  &-area {
    flex: 1;
    display: flex;
    overflow-y: scroll;
    min-height: 20px;
  }
  &-mute {
    flex: 1;
    display: flex;
    color: #999999;
    font-size: 14px;
    justify-content: center;
    align-items: center;
  }
}
.message-input-container-h5 {
  flex: 1;
  height: auto;
  background: #F6F6F6;
  border-radius: 4px;
  padding: 0px 0px 0px 0px;
  font-size: 16px !important;
  max-height: 86px;
  margin-left:5px;
  .item{
    width: 100%;
    height: 100%;
  }
}
.ql-container {
  ::v-deep .ql-blank:before {
    font-style: initial;
  }
}
.message-input-area {
  border: none;
  width: 100%;
  height: 100%;
  background-color: #f6f6f6;
  padding: 0 15px;
  font-size: 14px;
}
</style>

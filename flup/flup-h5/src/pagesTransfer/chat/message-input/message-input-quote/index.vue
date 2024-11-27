<template>
  <div
    v-if="quoteMessage && currentFunction !== 'audio'"
    :class="[
      'input-quote-container',
      'input-quote-container-h5',
      isUniFrameWork && 'input-quote-container-uni',
    ]"
  >
    <div class="input-quote-content">
      <div class="max-one-line">
        {{ quoteMessage.nick || quoteMessage.from }}: {{ quoteContentText }}
      </div>
      <Icon
        class="input-quote-close-icon"
        :file="getcloseIcon()"
        width="11px"
        height="11px"
        @click="cancelQuote"
      />
    </div>
  </div>
</template>
<script>
import TUIChatEngine from "@tencentcloud/chat-uikit-engine";
import closeIcon from "../../assets/icon/icon-close.svg";
import Icon from "../../common/Icon.vue";
export default {
  components:{
    Icon
  },
  props: {
    currentFunction: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      TYPES: TUIChatEngine.TYPES,
      quoteMessage: null,//引用
    };
  },
  computed: {
    quoteContentText() {
      let _quoteContentText;
      switch (this.quoteMessage.type) {
        case this.TYPES.MSG_TEXT:
          _quoteContentText = this.quoteMessage.payload.text;
          break;
        case this.TYPES.MSG_IMAGE:
          _quoteContentText = '图片';
          break;
        case this.TYPES.MSG_AUDIO:
          _quoteContentText = '语音';
          break;
        case this.TYPES.MSG_VIDEO:
          _quoteContentText = '视频'
          break;
        case this.TYPES.MSG_FILE:
          _quoteContentText = '文件'
          break;
        case this.TYPES.MSG_CUSTOM:
          _quoteContentText = '自定义'
          break;
        default:
          _quoteContentText = '消息'
          break;
      }
      return _quoteContentText;
    },
    isUniFrameWork(){
      return TUIChatEngine.TUIGlobal.global.window ? false : true;
    }
  },
  methods: {
    //清空引用
    cancelQuote() {
      this.quoteMessage = null;
    },
    getcloseIcon(){
      return closeIcon;
    }
  },
};
</script>
<style lang="scss" scoped>
.input-quote-container {
  margin: 5px 100px 5px 8px;
  display: flex;
  flex: 0 1 auto;

  .input-quote-content {
    display: flex;
    flex: 0 1 auto;
    background-color: #fafafa;
    border-radius: 8px;
    padding: 12px;
    font-size: 12px;
    align-items: center;
    line-height: 16px;
    max-width: 100%;
    box-sizing: border-box;
    min-width: 0;

    .max-one-line {
      flex: 0 1 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .input-quote-close-icon {
    margin-left: 5px;
    padding: 5px;
  }
}

.input-quote-container-h5 {
  @extend .input-quote-container;
  margin: 5px 0 0;
}

.input-quote-container-uni {
  @extend .input-quote-container;
  margin: 5px 60px 0 30px;
}
</style>
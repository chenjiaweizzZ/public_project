<template>
  <div class="expressionMessage">
    <div :class="isMine ? 'my-text text-message' : 'text-message'">
      <div
        class="message-body-span"
        v-for="(item, index) in renderDom"
        :key="index"
      >
        <span class="message-body-span-text" v-if="item.name === 'span'">{{
          item.text
        }}</span>
        <img v-if="item.name === 'img'" class="emoji-icon" :src="item.src" />
      </div>
      <img
        v-if="isMine"
        class="bubbles-right"
        src="../../../assets/images/mr.png"
        mode=""
      />
      <img
        v-if="!isMine"
        class="bubbles-left"
        src="../../../assets/images/ml.png"
        mode=""
      />
    </div>
  </div>
</template>
<script>
import { emojiMap, emojiUrl } from "../../../utils/emojiMap.js";
export default {
  props: {
    message: {
      type: String,
      value: ""
    },
    isMine: {
      type: Boolean,
      value: true
    }
  },
  watch: {
    message: {
      handler(newVal, oldVal) {
        this.renderDom = this.parseText(newVal);
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      renderDom: []
    };
  },
  methods: {
    parseText(text) {
      const renderDom = [];
      let temp = text;
      let left = -1;
      let right = -1;
      while (temp !== "") {
        left = temp.indexOf("[");
        right = temp.indexOf("]");
        switch (left) {
          case 0:
            if (right === -1) {
              renderDom.push({
                name: "span",
                text: temp
              });
              temp = "";
            } else {
              const _emoji = temp.slice(0, right + 1);
              if (emojiMap[_emoji]) {
                renderDom.push({
                  name: "img",
                  src: emojiUrl + emojiMap[_emoji]
                });
                temp = temp.substring(right + 1);
              } else {
                renderDom.push({
                  name: "span",
                  text: "["
                });
                temp = temp.slice(1);
              }
            }
            break;
          case -1:
            renderDom.push({
              name: "span",
              text: temp
            });
            temp = "";
            break;
          default:
            renderDom.push({
              name: "span",
              text: temp.slice(0, left)
            });
            temp = temp.substring(left);
            break;
        }
      }
      return renderDom;
    }
  }
};
</script>
<style lang="scss">
.expressionMessage {
  .text-message {
    position: relative;
    margin-top: 6px;
    max-width: 60vw;
    line-height: 26px;
    padding: 8px 11px 11px 11px;
    background: #303132;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    white-space: pre-wrap;
    align-items: center;
    border-radius: 8px;
    color: #FFFFFF;
  }

  .my-text {
    border: 1px solid rgba(0, 110, 255, 0.3);
    background: #32ae57;
  }

  .my-text .message-body-span .message-body-span-text {
    color: #ffffff;
    width: 100%;
    flex-wrap: wrap;
    white-space: pre-wrap;
  }

  .message-body-span {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    outline: none;
    font-size: 14px;
    color: #333333;
    position: relative;
    max-width: 60vw;
  }

  .message-body-span-text {
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #ffffff;
    letter-spacing: 0;
    line-height: 20px;
    font-size: 14px;
    line-break: anywhere;
  }

  .message-body-span-image {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin: 0 2px;
  }

  .emoji-icon {
    width: 20px;
    height: 20px;
  }

  .text-message .bubbles-right {
    position: absolute;
    top: 12px;
    right: -6px;
    width: 6px;
    height: 12px;
  }

  .text-message .bubbles-left {
    position: absolute;
    top: 12px;
    left: -6px;
    width: 6px;
    height: 12px;
  }
}
</style>

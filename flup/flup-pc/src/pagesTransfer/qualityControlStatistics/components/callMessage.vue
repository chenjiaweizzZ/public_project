<template>
  <div class="call-message">
    <div :class="isMine ? 'my-text text-message' : 'text-message'">
      <div class="message-body-span">
        <span class="message-body-span-text">{{
          isMine ? message.content.data.from : message.content.data.to
        }}</span>
        <img
          style="margin-right: 5px;transform: rotate(180deg);"
          v-if="!isMine"
          src="../../../assets/images/video-call2.svg"
          mode=""
        />
        <img
          style="margin-left: 5px;"
          v-else
          src="../../../assets/images/video-call2.svg"
          mode=""
        />
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
export default {
  props: {
    message: {
      type: Object,
      value: ""
    },
    isMine: {
      type: Boolean,
      value: true
    }
  }
};
</script>
<style lang="scss" scoped>
.call-message {
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
    color: #ffffff;
  }

  .my-text {
    border: 1px solid rgba(0, 110, 255, 0.3);
    background: #32ae57;
  }

  .my-text .message-body-span {
    flex-direction: row;
    .message-body-span-text {
      color: #ffffff;
      width: 100%;
      flex-wrap: wrap;
      white-space: pre-wrap;
    }
  }

  .message-body-span {
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    font-size: 14px;
    color: #333333;
    position: relative;
    max-width: 60vw;
    flex-direction: row-reverse;
    img {
      width: 20px;
      height: 20px;
    }
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

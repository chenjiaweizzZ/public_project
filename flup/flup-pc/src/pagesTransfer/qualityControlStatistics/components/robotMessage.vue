<template>
  <div class="root-message">
    <div class="text-message my-text">
      <div class="message-body-span">
        <span class="message-body-span-text">{{
          message.content.data.text
        }}</span>
      </div>
      <img class="bubbles-right" src="../../../assets/images/mr.png" mode="" />
    </div>
    <div class="tips">
      以上内容由AI提供，仅供参考，如需专业建议，可咨询个管师或医护团队。
    </div>
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: Object,
      value: {}
    }
  }
};
</script>
<style lang="scss" scoped>
.root-message {
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-bottom: 21px;
  .text-message {
    position: relative;
    margin-top: 4px;
    max-width: 60vw;
    line-height: 26px;
    padding: 8px 11px 11px 11px;
    background: #ffffff;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    white-space: pre-wrap;
    border-radius: 8px;
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
    color: #000000;
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
    top: 4px;
    right: -8px;
    width: 12px;
    height: 8px;
  }

  .text-message .bubbles-left {
    position: absolute;
    top: 4px;
    left: -8px;
    width: 12px;
    height: 8px;
  }
  .tips {
    position: absolute;
    width: 100%;
    left: 0px;
    bottom: 0px;
    text-align: center;
    color: #999999;
    font-size: 10px;
  }
}
</style>

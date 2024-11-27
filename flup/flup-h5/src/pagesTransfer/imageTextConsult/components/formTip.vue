<template>
  <div class="formTip">
    <div class="formTip-container">
      <div class="formTip-container-title">
        <div class="formTip-container-title-content">{{ myConsultTitle }}</div>
        <van-icon name="cross" class="formTip-container-title-close" size="20" @click="close" />
      </div>
      <div class="formTip-content">{{myConsultContent}}</div>
      <div class="formTip-check">
        <van-checkbox v-model="checked" shape="square" :disabled="time > 0" checked-color="#32AE57"></van-checkbox>
        <div class="formTip-check-text">我已阅读并同意图文问诊须知</div>
        <div class="formTip-check-time" v-if="time > 0">({{ time }}s)</div>
      </div>
      <div class="formTip-btn">
        <van-button round type="info" color="#32AE57" :disabled="checked == false" @click="agree()">确&nbsp;定</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { consultTitle, consultContent } from "../hooks/agreemenText.js";
export default {
  data() {
    return {
      checked: false,
      time: 5,
      timer: null,
      myConsultTitle: consultTitle,
      myConsultContent: consultContent,
    };
  },
  created() {
    this.startTimer();
  },
  filters: {
    filterBr(value) {
      return value.replace(/\n/g, "<br/>");
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        if (this.time > 0) {
          this.time--;
        } else {
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000);
    },
    agree() {
      this.$emit("agree");
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped lang="scss">
.formTip {
  &-container {
    border-radius: 8px;
    position: fixed;
    background: #fff;
    top: 15vh;
    left: 10vw;
    right: 10vw;
    padding: 20px;
    &-title {
      position: relative;
      height: 22px;
      &-content {
        font-size: 18px;
        font-weight: 500;
        text-align: center;
        letter-spacing: 0.2px;
        color: #111111;
      }
      &-close {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        right: 0;
      }
    }
  }
  &-content {
    text-indent: 0em;
    white-space: pre-wrap;
    margin-top: 19px;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0.2px;
    line-height: 20px;
    color: #333333;
  }
  &-check {
    display: flex;
    align-items: center;
    margin-top: 10px;
    &-text {
      margin: 0px 5px;
    }
    &-text {
      font-size: 14px;
      font-weight: normal;
      letter-spacing: 0.19px;
      color: #333333;
    }
    &-time {
      font-size: 14px;
      font-weight: normal;
      letter-spacing: 0.19px;
      color: #999999;
    }
  }
  &-btn {
    margin-top: 10px;
  }
}
</style>

<style lang="scss">
.formTip {
  &-btn {
    .van-button {
      width: 100%;
    }
  }
}
</style>
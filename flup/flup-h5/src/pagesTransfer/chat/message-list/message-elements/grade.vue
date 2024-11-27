<template>
  <div class="chat-grade">
    <div class="chat-grade-line">
      <div class="chat-grade-line-left">总体满意度</div>
      <div class="chat-grade-line-right"><van-rate v-model="sumValue" :size="25" color="#ffd21e" void-icon="star" void-color="#eee" :readonly="readonly" /></div>
      <div class="chat-grade-line-rate">{{ sumValue | getRate }}</div>
    </div>
    <div class="chat-grade-line">
      <div class="chat-grade-line-left">流程满意度</div>
      <div class="chat-grade-line-right"><van-rate v-model="procedureValue" :size="25" color="#ffd21e" void-icon="star" void-color="#eee" :readonly="readonly" /></div>
      <div class="chat-grade-line-rate">{{ procedureValue | getRate }}</div>
    </div>
    <div class="chat-grade-line">
      <div class="chat-grade-line-left">服务满意度</div>
      <div class="chat-grade-line-right"><van-rate v-model="serviceValue" :size="25" color="#ffd21e" void-icon="star" void-color="#eee" :readonly="readonly" /></div>
      <div class="chat-grade-line-rate">{{ serviceValue | getRate }}</div>
    </div>
    <div class="texT">
      <van-field v-model="advice" rows="2" autosize label="" type="textarea" maxlength="200" placeholder="请输入您的建议" show-word-limit class="ffeid" :readonly="readonly" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sumValue: 0,
      procedureValue: 0,
      serviceValue: 0,
      advice: "",
      readonly: false,
    };
  },
  filters: {
    getRate(rate) {
      switch (rate) {
        case 1:
          return "非常不满意";
        case 2:
          return "不满意";
        case 3:
          return "一般";
        case 4:
          return "满意";
        case 5:
          return "非常满意";
        default:
          return "";
      }
    },
  },
  methods: {
    init(
      sumValue = 0,
      procedureValue = 0,
      serviceValue = 0,
      advice = "",
      readonly = false
    ) {
      (this.sumValue = sumValue),
        (this.procedureValue = procedureValue),
        (this.serviceValue = serviceValue),
        (this.advice = advice);
      this.readonly = readonly;
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-grade {
  border-top: 1px dashed #e2e2e2;
  margin: 20px 10px;
  &-line {
    display: flex;
    margin: 20px 0 0;
    &-left {
      flex: 3;
      display: flex;
      justify-content: end;
      align-items: center;
    }
    &-right {
      flex: 5;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-rate {
        font-size: 12px;
        font-weight: normal;
        line-height: 25px;
        letter-spacing: 0px;
        color: #CCCCCC;
    }
  }
  .texT {
    padding: 20px 20px 0px;
  }
}
</style>

<style lang="scss">
.chat-grade {
  .ffeid {
    border: 1px solid #cdcdcd;
    border-radius: 4px;
  }
  .van-field__word-limit {
    bottom: 0px;
    top: auto;
  }
}
</style>
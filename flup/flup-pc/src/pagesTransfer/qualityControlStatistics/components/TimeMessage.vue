<template>
  <div class="message-timestamp" v-if="timestampShowFlag">
    {{ timestampShowContent }}
  </div>
</template>
<script>
import { TUITranslateService } from "@tencentcloud/chat-uikit-engine";
export default {
  props: {
    currTime: {
      type: Number,
      default: 0
    },
    prevTime: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      timestampShowFlag: false,
      timestampShowContent: ""
    };
  },
  computed: {
    timeList() {
      let { currTime, prevTime } = this;
      return [currTime, prevTime];
    }
  },
  watch: {
    timeList: {
      handler(newVal, oldVal) {
        if ((newVal && newVal.toString()) === (oldVal && oldVal.toString())) {
          return;
        } else {
          this.timestampShowContent = this.handleItemTime(
            this.currTime,
            this.prevTime
          );
        }
      },
      immediate: true
    }
  },
  methods: {
    handleItemTime(currTime, prevTime) {
      this.timestampShowFlag = false;
      if (currTime <= 0) {
        return "";
      } else if (!prevTime || prevTime <= 0) {
        this.timestampShowFlag = true;
        return this.calculateTimestamp(currTime * 1000);
      } else {
        const minDiffToShow = 10 * 60; //10min 10*60s
        const diff = currTime - prevTime; //s
        if (diff >= minDiffToShow) {
          this.timestampShowFlag = true;
          return this.calculateTimestamp(currTime * 1000);
        }
      }
      return "";
    },
    calculateTimestamp(timestamp) {
      const todayZero = new Date().setHours(0, 0, 0, 0);
      const thisYear = new Date(
        new Date().getFullYear(),
        0,
        1,
        0,
        0,
        0,
        0
      ).getTime();
      const target = new Date(timestamp);

      const oneDay = 24 * 60 * 60 * 1000;
      const oneWeek = 7 * oneDay;
      const oneYear = 365 * oneDay;

      const diff = todayZero - target.getTime();

      function formatNum(num) {
        return num < 10 ? "0" + num : num.toString();
      }

      if (diff <= 0) {
        // today, only display hour:minute
        return `${formatNum(target.getHours())}:${formatNum(
          target.getMinutes()
        )}`;
      } else if (diff <= oneDay) {
        // yesterday, display yesterday:hour:minute
        return `${TUITranslateService.t("time.昨天")} ${formatNum(
          target.getHours()
        )}:${formatNum(target.getMinutes())}`;
      } else if (diff <= oneWeek - oneDay) {
        // Within a week, display weekday hour:minute
        const weekdays = [
          "星期日",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六"
        ];
        const weekday = weekdays[target.getDay()];
        return `${TUITranslateService.t("time." + weekday)} ${formatNum(
          target.getHours()
        )}:${formatNum(target.getMinutes())}`;
      } else if (target.getTime() >= thisYear) {
        // Over a week, within this year, display mouth/day hour:minute
        return `${target.getMonth() + 1}/${target.getDate()} ${formatNum(
          target.getHours()
        )}:${formatNum(target.getMinutes())}`;
      } else {
        // Not within this year, display year/mouth/day hour:minute
        return `${target.getFullYear()}/${target.getMonth() +
          1}/${target.getDate()} ${formatNum(target.getHours())}:${formatNum(
          target.getMinutes()
        )}`;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.message-timestamp {
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  letter-spacing: 0.2px;
  padding: 14rpx 0;
  color: #999999;
}
</style>

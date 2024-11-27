import {
  TUITranslateService
} from "@tencentcloud/chat-uikit-engine";
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    currTime: {
      type: String,
      default: "",
      // observer(newVal) {
      //   console.log(newVal + "哈哈哈1")
      //   this.setData({
      //     currTime: newVal
      //   })
      // }
    },
    prevTime: {
      type: String,
      default: "",
      // observer(newVal) {
      //   console.log(newVal + "哈哈哈2")
      //   this.setData({
      //     prevTime: newVal
      //   })
      // }
    },
  },

  observers: {
    'currTime, prevTime': function (currTime, prevTime) {
      let timestampShowContent = this.handleItemTime(
        currTime,
        prevTime
      );
      this.setData({
        timestampShowContent
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currTime: "",
    prevTime: "",
    timestampShowFlag: false,
    timestampShowContent: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTime(currTime, prevTime) {
      this.setData({
        timestampShowFlag: false
      })
      if (currTime <= 0) {
        return "";
      } else if (!prevTime || prevTime <= 0) {
        this.setData({
          timestampShowFlag: true
        })
        return this.calculateTimestamp(currTime * 1000);
      } else {
        const minDiffToShow = 10 * 60; //10min 10*60s
        const diff = currTime - prevTime; //s
        if (diff >= minDiffToShow) {
          this.setData({
            timestampShowFlag: true
          })
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
          "星期六",
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
        if (
          isNaN(target.getFullYear()) ||
          isNaN(target.getMonth()) ||
          isNaN(target.getDate()) ||
          isNaN(formatNum(target.getHours())) ||
          isNaN(formatNum(target.getMinutes()))
        ) {
          return "";
        } else {
          return `${target.getFullYear()}/${
            target.getMonth() + 1
          }/${target.getDate()} ${formatNum(target.getHours())}:${formatNum(
            target.getMinutes()
          )}`;
        }
      }
    },
  }
})
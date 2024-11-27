<template>
  <section ref="section" class="evalReportLi">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      报告记录
    </div>-->
    <!-- <div class="chooseType" @click="chooseType">
      <span class="type">{{ planType.planName }}</span>
    </div>-->
    <div class="allListChoose">
      <p>{{ this.examType == "exam" ? "检查报告" :examType == "lab" ?"检验报告" :'体检报告'}}</p>
      <div class="chooseDate">
        <span @click="chooseTime('startDate')">{{ startDate }}</span>～
        <span @click="chooseTime">{{ endDate }}</span>
      </div>
      <van-popup v-model="showPicker" position="bottom">
        <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :formatter="formatter" :max-date="maxDate" @cancel="showPicker = false" @confirm="confirmPicker" />
      </van-popup>
    </div>
    <div class="noData" v-if="!funcsList.length"></div>
    <div class="reportList">
      <div class="reportLi" v-for="(item, index) in funcsList" :key="index" @click="goToUrl(item)">
        <p>{{ item.examName }}</p>
        <div class="reportChoose">
          {{ item.examDateTime.substr(0,10) }}
          <span>{{ item.doctor }}</span>
        </div>
      </div>
    </div>
    <!-- <div v-else class="reportList">
      <a class="reportLi" v-for="(item, index) in funcsList" :key="index" :href="item.reportUrl">
        <p>{{ item.examName }}</p>
        <div class="reportChoose">
          {{ item.examDateTime }}
          <span>{{ item.doctor }}</span>
        </div>
      </a>
    </div>-->
    <van-popup v-model="show" position="bottom">
      <van-picker title="随访任务" show-toolbar :columns="typeList" value-key="planName" @cancel="show = false" @confirm="onConfirm" />
    </van-popup>
  </section>
  <!-- <section v-else class="evalReportLi">
    <img :href="pdfUrl" width="200" :class="pdfUrl" />
  </section>-->
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      active: 0,
      isOpen: true,
      showPicker: false,
      hospitalList: [],
      currentDate: new Date(),
      maxDate: new Date(),
      startDate: '',
      endDate: '',
      funcsList: [],
      typeList: [],
      show: false,
      type: '',
      flupPlanId: '',
      planType: '',
      examType: '',
      pdfUrl: '',
    };
  },
  async created() {
    this.startDate = this.dateAdd(-30);
    this.endDate = new Date().toISOString().slice(0, 10);
    this.examType = this.$route.query.type;
    // if (this.examType != 'healthCheck') {
    //   this.getExamList();
    // } else {
    //   this.getHealthReport();
    // }
    this.getExamList();
  },
  methods: {
    dateAdd(days) {
      var date = new Date();
      date.setDate(date.getDate() + days);
      var time = date.toISOString().slice(0, 10);
      return time;
    },
    getExamList() {
      this.$apis
        .getExamList({
          type: this.examType,
          userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
          startDate: this.startDate,
          endDate: this.endDate,
        })
        .then((res) => {
          // if (this.examType != 'healthCheck') {
          //   this.funcsList = res.retData;
          // } else {
          //   console.log(res);
          //   this.pdfUrl = res.reportUrl;
          // }
          this.funcsList = res.retData;
        });
    },
    chooseTime(type) {
      this.type = type;
      this.showPicker = true;
      if (type == 'startDate') {
        this.currentDate = this.startDate ? new Date(this.startDate.slice(0, 4), this.startDate.slice(5, 7) - 1, this.startDate.slice(8, 10)) : new Date();
      } else {
        this.currentDate = this.endDate ? new Date(this.endDate.slice(0, 4), this.endDate.slice(5, 7) - 1, this.endDate.slice(8, 10)) : new Date();
      }
    },
    confirmPicker(val) {
      let year = val.getFullYear();
      let month = val.getMonth() + 1;
      let day = val.getDate();
      if (month >= 1 && month <= 9) {
        month = `0${month}`;
      }
      if (day >= 1 && day <= 9) {
        day = `0${day}`;
      }
      if (this.type == 'startDate') {
        this.startDate = `${year}-${month}-${day}`;
      } else {
        this.endDate = `${year}-${month}-${day}`;
      }

      let startDate = this.startDate.replace(/-/g, '');
      let endDate = this.endDate.replace(/-/g, '');
      if (startDate > endDate) {
        this.$toast('起始时间不可大于结束时间,已自动为您置换时间顺序');
        let startDateCopy = this.startDate;
        this.startDate = this.endDate;
        this.endDate = startDateCopy;
      }

      this.showPicker = false;
      this.getExamList();
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      } else if (type === 'hour') {
        return `${value}时`;
      } else if (type === 'minute') {
        return `${value}分`;
      } else if (type === 'second') {
        return `${value}秒`;
      }
      return value;
    },
    goToUrl(item) {
      // if (this.examType != 'healthCheck') {
      this.$router.push({
        path: '/evalReportLiDetail',
        query: {
          openId: this.$route.query.openId,
          type: this.examType,
          examId: item.examId,

          pdfUrl: this.examType == 'healthCheck' ? item.reportUrl : '',
        },
      });
      // } else {
      //   // window.location.href = item.reportUrl;
      //   window.open('/static/pdf/web/viewer.html?file=' + item.reportUrl); //http://nlpemrdemo.zwjk.com/health.pdf
      //   //  window.open('/static/pdf/web/viewer.html?file=https://nlpemrdemo.zwjk.com/health.pdf');
      // }
    },
    chooseType() {
      this.show = true;
    },
    onConfirm(value) {
      this.planType = value;
      this.show = false;
      this.getExamList();
    },
  },
};
</script>
<style lang="scss" scoped>
p {
  margin: 0;
}
.fff {
  background: #fff;
}
.evalReportLi {
  position: relative;
  width: 100%;
  height: 100%;
  &::before {
    content: '';
    display: table;
  }
  .noData {
    height: 60%;
    background: url('../assets/images/noData.png') no-repeat center 40%;
    background-size: 42%;
  }
  .topMenu {
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 18px;
    color: #111111;
    letter-spacing: 0.2px;
    text-align: center;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
    u {
      position: absolute;
      left: 3.75%;
      top: 50%;
      transform: translate(0, -50%);
      display: block;
      width: 22px;
      height: 22px;
      background: #fff url('../assets/images/back.png') no-repeat;
      background-size: contain;
    }
  }
  .chooseType {
    // margin-top: 44px;
    padding: 10px 20px;
    text-align: center;
    background: #fff;
    span {
      padding-right: 15px;
      font-size: 16px;
      color: #333;
      background: url('../assets/images/downArrowB.png') no-repeat right;
      background-size: 12px;
    }
  }
  .allListChoose {
    position: relative;
    // margin-top: 44px;
    padding: 10px 3.75%;
    font-size: 15px;
    color: #ffffff;
    letter-spacing: 0.18px;
    line-height: 21px;
    background: #1c97fc;
    p span {
      font-size: 24px;
      color: #ffd675;
      letter-spacing: 0.28px;
      line-height: 33px;
    }
    span {
      font-size: 14px;
    }
  }
  .chooseDate {
    position: absolute;
    right: 3.75%;
    top: 50%;
    transform: translate(0, -50%);
    padding-right: 18px;
    line-height: 28px;
    background: url('../assets/images/downArroww.png') no-repeat right;
    background-size: 12px;
  }
  .reportList {
    background: #fff;
    padding-left: 3.75%;
    .reportLi {
      padding: 12px 0;
      border-bottom: 1px solid #e2e2e2;
      background: url('../assets/images/enter.png') no-repeat 92%;
      background-size: 16px;
      &:last-child {
        border: none;
      }
      p {
        margin-bottom: 2px;
        width: 90%;
        line-height: 22px;
        font-size: 16px;
        color: #111111;
        letter-spacing: 0.2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .reportChoose {
        position: relative;
        line-height: 20px;
        font-size: 14px;
        color: #999999;
        letter-spacing: 0.2px;
        span {
          position: absolute;
          right: 15%;
          top: 0;
        }
      }
    }
  }
}
</style>

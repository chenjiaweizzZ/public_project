// 我的随访计划
<template>
  <div class="medicalcarebox6">
    <div v-for="(item, index) in PlanList" :key="index" class="planbox">
      <div class="content">
        <h3>{{item.planName}}</h3>
        <p class="time"><span>{{item.startDate}}至{{item.endDate}}</span></p>
        <p class="flow">
          <span>待随访</span>
          <span>{{item.unfinishedCount }}</span>
        </p>
        <p class="flow">
          <span>已完成</span>
         <span>{{item.finishedCount }}</span>
        </p>
        <p class="flow">
          <span>已过期</span>
          <span>{{item.flupOverdueCount }}</span>
        </p>
        <p class="flow">
          <span>随访组</span>
          <span>{{item.fuGroup}}</span>
        </p>
      </div>
      <div class="menubox">
        <!-- <a style="border-right: 1px solid #E2E2E2;color:#aaa">查看我的患者</a> -->

        <router-link
          style="border-right: 1px solid #E2E2E2"
          :to="{name: 'patientList', query: { serialNo: item.serialNo, planName:item.planName,Private:true}}"
        >查看我的患者</router-link>
        <router-link
          :to="{name: 'patientList', query: { serialNo: item.serialNo, planName:item.planName}}"
        >查看全部患者</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startDate: null,
      endDate: null,
      PlanList: [],
    }
  },
  watch: {},
  mounted() {
    var myDate = new Date()
    var oneTime = 1000 * 24 * 60 * 60
    var beforeTime = new Date(myDate - oneTime * 7)
    this.startDate = this.getNowFormatDay(beforeTime)
    this.endDate = this.getNowFormatDay()
    this.$apis
      .getFlupPlanList({
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .then((res) => {
        this.PlanList = res.retData
      })
  },
  methods: {
    tz() {
      console.log(this.$route)
    },
    getNowFormatDay(nowDate) {
      var char = '-'
      if (nowDate == null) {
        nowDate = new Date()
      }
      var day = nowDate.getDate()
      var month = nowDate.getMonth() + 1 //注意月份需要+1
      var year = nowDate.getFullYear()
      //补全0，并拼接
      return (
        year + char + this.completeDate(month) + char + this.completeDate(day)
      )
    },
    completeDate(value) {
      return value < 10 ? '0' + value : value
    },
    sendAMessage(item) {
      // return (
      //   'Doctor-sendAMessage?patientName=' +
      //   item.patientName +
      //   '&age=' +
      //   item.age +
      //   '&sex=' +
      //   item.sex +
      //   '&phone=' +
      //   item.phone +
      //   '&userId=' +
      //   item.userId +
      //   '&flupId=' +
      //   this.value +
      //   '&flupName=' +
      //   this.name
      // )
    },
  },
}
</script>

<style lang="scss" >
.medicalcarebox6 {
  width: 100%;
  height: 100%;
  padding: 3.7%;
  // background-color: #f2f2f2;
  background-color: #F6F6F6;

  .planbox {
    width: 100%;
    // height: 225px;
    margin-bottom: 10px;
    border-radius: 6px;
    background-color: #FFF;
    .content {
      width: 100%;
      // height: 184px;
      padding: 2.1% 3.7%;
      // border: 1px solid #e2e2e2;
      h3 {
        margin-block-start: 5px;
        margin-block-end: 5px;
        margin-inline-start: 0px;
        margin-inline-end: 20px;
        font-size: 16px;
        color: #111111;
        letter-spacing: 0.2px;
      }
      .time {
        font-size: 12px;
        color: #666666;
        letter-spacing: 0.15px;
      }
      .flow {
        line-height: 30px;
        font-size: 15px;
        color: #111;
        letter-spacing: 0.2px;
        span:first-child {
          width: 100px;
          display: inline-block;
          color: #666666;
          letter-spacing: 0.19px;
          margin-right: 20px;
        }
        span:nth-child(2) {
          margin-left: -54px;
          
        }
      }
    }
    .menubox {
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      a {
        width: 50%;
        display: block;
        text-align: center;
        font-size: 14px;
        color: #0081ea;
        letter-spacing: 0.2px;
      }
    }
  }
}
</style>



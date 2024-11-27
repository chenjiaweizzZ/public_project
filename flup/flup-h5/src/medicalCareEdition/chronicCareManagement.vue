//我的慢病管理
<template>
  <div class="medicalcarebox3">
    <div v-for="(item, index) in IcdmList" :key="index" class="planbox">
      <div class="content">
        <h3>{{item.planName}}</h3>
        <!-- <p class="flow">
          <span>随访方式</span>
          {{item.unfinishedCount }}
        </p>-->
        <p class="flow">
          <span>随访组</span>
          {{item.fuGroup }}
        </p>
        <p class="flow">
          <span>执行科室</span>
          {{item.executiveDept }}
        </p>
      </div>
      <div class="menubox">
        <!-- <a style="border-right: 1px solid #E2E2E2;color:#aaa">查看我的患者</a> -->
        <!-- <router-link  style="border-right: 1px solid #E2E2E2" to="Doctor-patientList">查看我的患者</router-link> -->
        <router-link
          style="border-right: 1px solid #E2E2E2"
          :to="'Doctor-chronicDiseasePatient?serialNo='+item.serialNo + '&planName='+item.planName +'&Private=true'"
        >查看我的患者</router-link>
        <router-link
          :to="'Doctor-chronicDiseasePatient?serialNo='+item.serialNo + '&planName='+item.planName"
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
      IcdmList: [],
    }
  },
  watch: {},
  mounted() {
    var myDate = new Date()
    var oneTime = 1000 * 24 * 60 * 60
    var beforeTime = new Date(myDate - oneTime * 7)
    this.startDate = this.getNowFormatDay(beforeTime)
    this.endDate = this.getNowFormatDay()
    this.$apis.getIcdmListByDoctor().then((res) => {
      this.IcdmList = res.retData
    })
  },
  methods: {
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
  },
}
</script>

<style lang="scss" >
.medicalcarebox3 {
  width: 100%;
  height: 100%;
  padding: 3.7%;
  background-color: #f2f2f2;
  .planbox {
    width: 100%;
    // height: 150px;
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 6px;
    .content {
      width: 100%;
      // height: 110px;
      padding: 2.1% 3.7%;
      border: 1px solid #f2f2f2;
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
        span {
          width: 100px;
          display: inline-block;
          color: #666666;
          letter-spacing: 0.19px;
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



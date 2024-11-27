//我的待审核
<template>
  <div class="medicalcarebox11">
    <div v-for="(item, index) in CurrentUnAuditList" :key="index" class="auditlist">
      <router-link :to="'Doctor-auditList?flupType='+item.flupType">
        <div>
          <h3>{{item.flupType}}</h3>
          <span>待审核({{item.count}})</span>
        </div>
        <div>
          <p>{{item.startDate}}至{{item.endDate}}</p>
          <van-icon name="arrow" color="#999" size="18" />
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startDate: null,
      endDate: null,
      CurrentUnAuditList: [],
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
      .getCurrentUnAuditList({
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .then((res) => {
        this.CurrentUnAuditList = res.retData
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
.medicalcarebox11 {
  width: 100%;
  padding-left: 3.7%;
  .auditlist {
    width: 100%;
    height: 80px;
    padding: 3.7% 3.7% 3.7% 0;
    border-bottom: 1px solid #e2e2e2;
    div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      h3 {
        font-size: 17px;
        color: #111111;
        letter-spacing: 0.2px;
        margin-block-start: 0;
        margin-block-end: 10px;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
      }
      span {
        font-size: 15px;
        color: #4185f3;
        letter-spacing: 0.2px;
      }
      p {
        font-size: 14px;
        color: #666666;
        letter-spacing: 0.2px;
        line-height: 20px;
      }
    }
  }
}
</style>
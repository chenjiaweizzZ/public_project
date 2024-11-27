//审核列表
<template>
  <div class="medicalcarebox1">
    <div class="conditioncardbox">
      <van-dropdown-menu>
        <div class="chooseDate">
          <span @click="chooseTime('startDate')">{{ startDate }}</span>～
          <span @click="chooseTime">{{ endDate }}</span>
        </div>
      </van-dropdown-menu>
      <van-popup v-model="showPicker" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          :formatter="formatter"
          @cancel="showPicker = false"
          @confirm="confirmPicker"
        />
      </van-popup>
    </div>
    <div class="Auditlistbox">
      <div v-for="(item, index) in AuditList" :key="index" class="Auditlist">
        <router-link :to="listSkip(item)">
          <div>
            <h4>
              {{item.patientName}}
              <span>{{item.age}}岁 {{item.sex}}</span>
            </h4>
            <p v-if="item.status == 10 ">待审核</p>
            <P style="color: #B2B2B2;" v-else>已审核</P>
          </div>
          <p>{{item.content}}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flupStateId: null,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      startDate: null,
      endDate: null,
      showPicker: false,
      flupType: this.$route.query.flupType,
      AuditList: [],
    }
  },
  watch: {},
  mounted() {
    var myDate = new Date()
    var oneTime = 1000 * 24 * 60 * 60
    var beforeTime = new Date(myDate - oneTime * 7)
    this.startDate = this.getNowFormatDay(beforeTime)
    this.endDate = this.getNowFormatDay()
    this.getlist()
  },
  methods: {
    listSkip(item) {
      return (
        (this.flupType == '慢病评估报告'
          ? 'Doctor-chronicDiseaseAudit?patientName='
          : 'Doctor-ReviewTheDetails?patientName=') +
        item.patientName +
        '&age=' +
        item.age +
        '&sex=' +
        item.sex +
        '&phone=' +
        item.phone +
        '&userId=' +
        item.userId +
        '&serialNo=' +
        item.serialNo +
        '&dateOfBirth=' +
        item.dateOfBirth +
        '&executeDate=' +
        item.executeDate +
        '&content=' +
        item.content +
        '&flupType=' +
        this.flupType +
        '&status=' +
        item.status +
        '&realDate=' +
        item.realDate
      )
    },
    getlist() {
      this.$apis
        .getAuditListByFlupType({
          startDate: this.startDate,
          endDate: this.endDate,
          flupType: this.flupType,
        })
        .then((res) => {
          this.AuditList = res.retData
        })
    },
    chooseTime(type) {
      this.type = type
      this.showPicker = true
      if (type == 'startDate') {
        this.currentDate = this.startDate
          ? new Date(
              this.startDate.slice(0, 4),
              this.startDate.slice(5, 7) - 1,
              this.startDate.slice(8, 10)
            )
          : new Date()
      } else {
        this.currentDate = this.endDate
          ? new Date(
              this.endDate.slice(0, 4),
              this.endDate.slice(5, 7) - 1,
              this.endDate.slice(8, 10)
            )
          : new Date()
      }
    },
    confirmPicker(val) {
      let year = val.getFullYear()
      let month = val.getMonth() + 1
      let day = val.getDate()
      if (month >= 1 && month <= 9) {
        month = `0${month}`
      }
      if (day >= 1 && day <= 9) {
        day = `0${day}`
      }
      if (this.type == 'startDate') {
        this.startDate = `${year}-${month}-${day}`
      } else {
        this.endDate = `${year}-${month}-${day}`
      }

      let startDate = this.startDate.replace(/-/g, '')
      let endDate = this.endDate.replace(/-/g, '')
      if (startDate > endDate) {
        this.$toast('起始时间不可大于结束时间,已自动为您置换时间顺序')
        let startDateCopy = this.startDate
        this.startDate = this.endDate
        this.endDate = startDateCopy
      }

      this.showPicker = false
      this.getlist()
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      } else if (type === 'day') {
        return `${value}日`
      } else if (type === 'hour') {
        return `${value}时`
      } else if (type === 'minute') {
        return `${value}分`
      } else if (type === 'second') {
        return `${value}秒`
      }
      return value
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
  },
}
</script>

<style lang="scss" >
.medicalcarebox1 {
  .conditioncardbox {
    width: 100%;
    height: 45px;
    background-color: #1c97fc;
    .van-dropdown-menu {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .van-dropdown-menu__bar {
      background-color: #1c97fc;
    }
    .van-dropdown-menu__title {
      color: #fff;
    }
    .chooseDate {
      width: 200px;
      padding-right: 18px;
      background: url('../assets/images/downArroww.png') no-repeat right;
      background-size: 12px;
      color: #fff;
    }
  }
  .Auditlistbox {
    width: 100%;
    background-color: #f2f2f2;
    .Auditlist {
      width: 100%;
      padding: 0 3.7%;
      margin-bottom: 10px;
      background-color: #fff;
      p {
        font-size: 15px;
        color: #111111;
        letter-spacing: 0.2px;
        line-height: 45px;
      }
      div {
        width: 100%;
        height: 46px;
        border-bottom: 1px solid #e2e2e2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        h4 {
          font-size: 16px;
          color: #111111;
          letter-spacing: 0.2px;
          span {
            margin: 0 10px;
            font-size: 14px;
            font-weight: 500;
            color: #333333;
            letter-spacing: 0.17px;
          }
        }
        p {
          font-size: 15px;
          color: #4185f3;
          letter-spacing: 0.2px;
        }
      }
    }
  }
}
</style>
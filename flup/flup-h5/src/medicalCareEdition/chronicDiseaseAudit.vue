//慢病审核
<template>
  <div class="medicalcarebox4">
    <van-notice-bar wrapable :scrollable="false" :text="patientName + ' ' + age+' 岁 '  + sex +' '+ phone" />
    <section ref="section" class="ncdReport">
      <iframe
        style="height: calc(100vh - 100px); margin-bottom: 60px;"
        :src="urlx+'/#/thereportpreview?reportId='+funcsDetail.id+'&hospitalId='+hospitalId +'&riskType='+funcsDetail.riskType"
        width="100%"
        frameborder="0"
      ></iframe>
    </section>
    <div v-if="status==10" class="butbox">
      <div style="width:48%">
        <van-button type="default" size="large" @click="cancellation">作废</van-button>
      </div>
      <div style="width:48%">
        <van-button color="#1C97FC" type="primary" size="large" @click="pass">通过</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    this.chartSettings = {
      labelMap: {
        bloodPressureL: '舒张压',
        bloodPressureH: '收缩压',
      },
    }
    return {
      patientName: this.$route.query.patientName,
      age: this.$route.query.age,
      sex: this.$route.query.sex,
      phone: this.$route.query.phone,
      userId: this.$route.query.userId,
      flupType: this.$route.query.flupType,
      recordSerialNo: this.$route.query.recordSerialNo,
      realDate: this.$route.query.realDate,
      executeDate: this.$route.query.executeDate,
      content: this.$route.query.content,
      status: this.$route.query.status,
      reportId: this.$route.query.serialNo,
      active: 0,
      isOpen: true,
      showPicker: false,
      hospitalList: [],
      currentDate: new Date(),
      startDate: '',
      endDate: '',
      type: '',
      hospitalId: '',
      funcsDetail: {},
      funcsList: [],
      funcsOneDetail: {},
      isShow: false,
      chartData: {
        columns: ['checkDatetime', 'bloodPressureL', 'bloodPressureH'],
        rows: [],
      },
      urlx: '',
    }
  },
  watch: {},
  mounted() {
    if (location.pathname) {
      this.urlx = location.origin + location.pathname.replace(/h5/, 'pc')
    } else {
      this.urlx = location.origin + '/pc'
    }
    this.startDate = this.dateAdd(-30)
    this.endDate = new Date().toISOString().slice(0, 10)
    this.$apis
      .getReportAudit({
        reportId: this.reportId,
      })
      .then((res) => {
        this.$nextTick(() => {
          console.log(res);
          
          this.funcsDetail = res.retData
          this.chartData.rows = this.funcsDetail
        })
      })
  },
  methods: {
    dateAdd(days) {
      var date = new Date()
      date.setDate(date.getDate() + days)
      var time = date.toISOString().slice(0, 10)
      return time
    },
    raContral() {
      this.isOpen = !this.isOpen
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
      this.getReportList()
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
    pass() {
      this.$apis
        .saveAudit({
          flupType: this.flupType,
          userId: this.userId,
          serialNo: this.reportId,
        })
        .then((res) => {
          if (res.retData) {
            this.$toast.success('审核通过')
            let _this = this
            setTimeout(function () {
              _this.$router.go(-1)
              // _this.$router.push({
              //   path: '/Doctor-auditList?flupType=' + _this.flupType
              // })
            }, 1000)
          }
        })
    },
    cancellation() {
      this.$apis
        .cancelAudit({
          flupType: this.flupType,
          userId: this.userId,
          serialNo: this.reportId,
        })
        .then((res) => {
          if (res.retData) {
            this.$toast.success('作废成功')
            let _this = this
            setTimeout(function () {
              _this.$router.go(-1)
            }, 1000)
          }
        })
    },
  },
}
</script>

<style lang="scss" >
.medicalcarebox4 {
  .van-notice-bar--wrapable .van-notice-bar__content {
    margin: 0 auto;
  }
  p {
    margin: 0;
  }
  .fff {
    background: #fff;
  }
  .ncdReport {
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
    .reportResult {
      margin: 0 3.75%;
      margin-bottom: 12px;
      margin-top: 10px;
      padding: 20px;
      border-radius: 8px;
      background: url('../assets/images/reportResultBg.png') no-repeat;
      background-size: cover;
      box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.08);
      p {
        margin-bottom: 2px;
        line-height: 28px;
        font-size: 17px;
        color: #ffffff;
        letter-spacing: 0.2px;
        span {
          display: inline-block;
          margin-left: 10px;
          padding: 0 14px;
          line-height: 28px;
          font-size: 15px;
          color: #f15f00;
          background: #ffffff;
          border-radius: 14px;
        }
      }
      span {
        line-height: 17px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        letter-spacing: 0.17px;
      }
    }
    .reportTitle {
      margin: 0 3.75%;
      margin-bottom: 12px;
      line-height: 21px;
      font-size: 15px;
      color: #111111;
    }
    .reportArea {
      margin: 0 3.75%;
      padding: 14px 3.75%;
      line-height: 20px;
      font-size: 14px;
      color: #333333;
      background: #f3f6fb;
      p {
        position: relative;
        margin-bottom: 8px;
        padding-left: 14px;
        letter-spacing: 0.16px;
        &::before {
          content: '';
          display: block;
          width: 6px;
          height: 6px;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translate(0, -50%);
          border-radius: 6px;
          background: #f96a0e;
        }
      }
      span {
        display: block;
        margin-bottom: 16px;
      }
    }
    .close {
      span {
        display: none;
      }
    }
    .raContral {
      height: 30px;
      margin-bottom: 8px;
      background: url('../assets/images/downArrowB.png') no-repeat center;
      background-size: 16px;
    }
    .itemTitle {
      position: relative;
      height: 46px;
      font-size: 17px;
      color: #333;
      background-color: #fff;
      padding-left: 25px;
      line-height: 46px;
      &::before {
        position: absolute;
        left: 14px;
        top: 15px;
        bottom: 15px;
        width: 4px;
        background-color: #1c97fc;
        border-radius: 1.5px;
        content: '';
      }
    }
    .infoList {
      margin-bottom: 30px;
      .infoLi {
        position: relative;
        padding: 0 3.75%;
        padding-bottom: 8px;
        line-height: 30px;
        font-size: 16px;
        color: #111111;
        letter-spacing: 0.2px;
        label {
          position: absolute;
          left: 3.75%;
          top: 0;
          color: #666;
        }
        p {
          margin-left: 25%;
          text-align: right;
        }
      }
    }
    .allListChoose {
      position: relative;
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
          line-height: 22px;
          font-size: 16px;
          color: #111111;
          letter-spacing: 0.2px;
        }
        .reportChoose {
          line-height: 20px;
          font-size: 14px;
          color: #999999;
          letter-spacing: 0.2px;
        }
      }
    }
    .detailFunc {
      z-index: 9;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
  .butbox {
    width: 100%;
    height: 62px;
    padding: 3.7%;

    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
  }
}
</style>
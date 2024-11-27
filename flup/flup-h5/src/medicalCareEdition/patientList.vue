//随访患者列表
<template>
  <div class="medicalcarebox12">
    <div class="conditioncardbox">
      <van-dropdown-menu>
        <van-dropdown-item v-model="flupStateId" :options="option" @change="getlistX" />
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
    <div class="patientlistbox">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div v-for="(item, index) in list" :key="index" class="patientlist">
          <div class="patient">
            <H3>{{item.patientName}}</H3>
            <p>{{item.age}}岁</p>
            <p>{{item.sex}}</p>
            <p>{{item.phone}}</p>
            <van-button
              v-if="item.isAttention == 0"
              style="min-width:55px;"
              round
              plain
              type="info"
              size="mini"
              @click="attention(item)"
            >+ 关注</van-button>
            <van-button
              v-else
              style="min-width:55px;"
              round
              plain
              type="default"
              size="mini"
              @click="cancel(item)"
            >已关注</van-button>
          </div>
          <div class="content">
            <p>
              <span>随访医生</span>
              {{item.doctorName}}
            </p>
            <p>
              <span>随访类型</span>
              {{item.flupType}}
            </p>
            <p>
              <span>随访状态</span>
              {{item.flupState}}
            </p>
            <p>
              <span>任务生成时间</span>
              {{item.createTime}}
            </p>
            <p>
              <span>随访执行时间</span>
              {{item.flupTimeReal}}
            </p>
          </div>
          <div class="menubox">
            <router-link :to="patientPlan(item)">随访计划</router-link>
            <!-- <van-button
              v-if="(item.flupType == '调查问卷'||item.flupType == '健康宣教') &&
              item.smartFlupMethodId == 'Wechat' && item.flupStateId !='NoSent'"
              :disabled="item.flupStateId=='Finished'||item.flupStateId=='SentButNoReply' || resendDisabled(item.sendTimes) "
              style="color:#1c97fc; background-color:#f8f9fc;border:0px"
              @click="send(item)"
            >重发({{item.sendTimes?item.sendTimes:0}})次</van-button>-->
            <router-link :to="sendAMessage(item)">发送消息</router-link>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flupStateId: 'All',
      value2: 'a',
      option: [],
      loading: false,
      finished: false,
      startDate: null,
      endDate: null,
      showPicker: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      pageNo: 1,
      pageSize: 5,
      list: [],
      total: 0,
      execute: true,
      maxTimes: -1,
    }
  },
  created() {
    this.$apis
      .queryDictByCode({
        grandParentDictCode: 'Flup',
        parentDictCode: 'SmartFlupStatus',
      })
      .then((res) => {
        res.retData.forEach((element) => {
          let obj = {
            text: element.dictName,
            value: element.dictCode,
          }
          this.option.push(obj)
        })
      })
    this.$apis
      .getFlupConfigList({
        hospitalId: sessionStorage.getItem('hospitalId'),
        moduleCode: 'followUpSetting',
      })
      .then((res) => {
        if (res.retCode == 0) {
          if (
            res.retData.find((x) => x.componentKey == 'resendWay')
              .componentValue == '1'
          ) {
            let time = res.retData.find(
              (x) => x.componentKey == 'resendTimes'
            ).componentValue
            this.maxTimes = parseInt(time)
          }
        }
      })
  },
  watch: {},
  filters: {
    enumerate: function (value, option) {
      let a
      option.forEach((res) => {
        if (res.value == value) {
          a = res.text
        }
      })
      return a
    },
  },
  mounted() {
    document.title = this.$route.query.planName
    var myDate = new Date()
    var oneTime = 1000 * 24 * 60 * 60
    var beforeTime = new Date(myDate - oneTime * 7)
    this.startDate = this.getNowFormatDay(beforeTime)
    this.endDate = this.getNowFormatDay()
    if (this.$route.query.Private) {
      this.getPrivatelist()
    } else {
      this.getlist()
    }
  },
  methods: {
    getPrivatelist() {
      this.$apis
        .getMyPatientPlanList({
          serialNo: this.$route.query.serialNo,
          flupStateId: this.flupStateId,
          startDate: this.startDate,
          endDate: this.endDate,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.list = res.retData.list
          this.total = res.retData.total
          this.execute = true
          this.finished = false
        })
    },
    getlistX() {
      this.pageNo = 1
      if (this.$route.query.Private) {
        this.getPrivatelist()
      } else {
        this.getlist()
      }
    },
    patientPlan(item) {
      return (
        'Doctor-patientPlan?patientName=' +
        item.patientName +
        '&age=' +
        item.age +
        '&sex=' +
        item.sex +
        '&phone=' +
        item.phone +
        '&userId=' +
        item.userId +
        '&flupId=' +
        this.$route.query.serialNo +
        '&flupName=' +
        this.$route.query.planName +
        '&flupType=' +
        item.flupType
      )
    },
    sendAMessage(item) {
      return (
        'Doctor-sendAMessage?patientName=' +
        item.patientName +
        '&age=' +
        item.age +
        '&sex=' +
        item.sex +
        '&phone=' +
        item.phone +
        '&userId=' +
        item.userId +
        '&flupId=' +
        this.$route.query.serialNo +
        '&flupName=' +
        this.$route.query.planName
      )
    },
    send(item) {
      this.$apis
        .reSendFlupPlanTask({
          serialNo: item.serialNo,
        })
        .then((res) => {
          if (res.retData) {
            if (item.sendTimes) {
              item.sendTimes = Number(item.sendTimes) + 1
            } else {
              item.sendTimes = 1
            }
            this.$toast.success('发送成功')
          } else {
            this.$toast.fail('发送失败')
          }
        })
    },
    attention(item) {
      this.$apis
        .attentionPatientPlan({
          userId: item.userId,
          planId: item.flupPlanId,
        })
        .then((res) => {
          if (res.retData) {
            this.pageNo = 1
            if (this.$route.query.Private) {
              this.getPrivatelist()
            } else {
              this.getlist()
            }
          }
        })
    },
    cancel(item) {
      this.$apis
        .unAttentionPatientPlan({
          userId: item.userId,
          planId: item.flupPlanId,
        })
        .then((res) => {
          this.pageNo = 1
          if (res.retData) {
            if (this.$route.query.Private) {
              this.getPrivatelist()
            } else {
              this.getlist()
            }
          }
        })
    },
    getlist() {
      this.$apis
        .getAllPatientPlanList({
          serialNo: this.$route.query.serialNo,
          flupStateId: this.flupStateId,
          startDate: this.startDate,
          endDate: this.endDate,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.list = res.retData.list
          this.total = res.retData.total
          this.execute = true
          this.finished = false
        })
    },
    onLoad() {
      if (this.execute) {
        this.execute = !this.execute
        if (this.list.length == this.total) {
          this.loading = false
          this.finished = true
        } else {
          this.pageNo = this.pageNo + 1
          if (this.$route.query.Private) {
            this.$apis
              .getMyPatientPlanList({
                serialNo: this.$route.query.serialNo,
                flupStateId: this.flupStateId,
                startDate: this.startDate,
                endDate: this.endDate,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
              })
              .then((res) => {
                if (res.retData.list.length != 0) {
                  this.list.push(...res.retData.list)
                  this.total = res.retData.total
                  this.loading = false
                } else {
                  this.finished = true
                }
                this.execute = true
              })
          } else {
            this.$apis
              .getAllPatientPlanList({
                serialNo: this.$route.query.serialNo,
                flupStateId: this.flupStateId,
                startDate: this.startDate,
                endDate: this.endDate,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
              })
              .then((res) => {
                if (res.retData.list.length != 0) {
                  this.list.push(...res.retData.list)
                  this.total = res.retData.total
                  this.loading = false
                } else {
                  this.finished = true
                }
                this.execute = true
              })
          }
        }
      }
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
      if (this.$route.query.Private) {
        this.getPrivatelist()
      } else {
        this.getlist()
      }
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
    resendDisabled(sendTimes) {
      if (this.maxTimes > -1) {
        return sendTimes >= this.maxTimes
      }
      return false
    },
  },
}
</script>

<style lang="scss" >
.medicalcarebox12 {
  width: 100%;
  .conditioncardbox {
    width: 100%;
    height: 100px;
    padding-top: 15px;
    background-color: #1c97fc;
    border-radius: 0 0 16px 16px;
    .van-dropdown-menu {
      display: flex;
      align-items: center;
      justify-content: space-around;
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
  .patientlistbox {
    width: 100%;
    padding: 3.7% 3.7% 0 3.7%;
    position: relative;
    top: -50px;
    left: 0;
    .patientlist {
      width: 100%;
      // height: 245px;
      margin-bottom: 20px;
      border-radius: 8px;
      border: 1px solid #f2f2f2;
      border-bottom: 3px solid #f2f2f2;
      overflow: hidden;
      .patient {
        width: 100%;
        height: 46px;
        padding: 0 3.7%;
        background-color: #f3faff;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .content {
        width: 100%;
        // height: 155px;
        padding: 0 3.7%;
        border-bottom: 1px solid #e2e2e2;
        p {
          font-size: 15px;
          color: #111;
          letter-spacing: 0.2px;
          line-height: 30px;
          span {
            width: 100px;
            display: inline-block;
            color: #666666;
          }
        }
      }
    }
    .menubox {
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      a {
        display: block;
        text-align: center;
        font-size: 14px;
        color: #0081ea;
        letter-spacing: 0.2px;
      }
      p {
        font-size: 14px;
        color: #0081ea;
      }
    }
    .van-list__error-text,
    .van-list__finished-text,
    .van-list__loading {
      color: #bbb;
    }
  }
}
</style>



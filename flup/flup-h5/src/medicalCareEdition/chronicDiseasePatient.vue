//慢病患者列表
<template>
  <div class="medicalcarebox5">
    <div class="patientlistbox">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div v-for="(item, index) in list" :key="index" class="patientlist">
          <div class="patient">
            <H3>{{ item.patientName }}</H3>
            <p>{{ item.age }}岁</p>
            <p>{{ item.sex }}</p>
            <p>{{ item.phone }}</p>
            <van-button
              v-if="item.isAttention == 0"
              style="min-width: 55px; margin-left: 15%"
              round
              plain
              type="info"
              size="mini"
              @click="attention(item)"
            >+ 关注</van-button>
            <van-button
              v-else
              style="min-width: 55px; margin-left: 15%"
              round
              plain
              type="default"
              size="mini"
              @click="cancel(item)"
            >已关注</van-button>
          </div>
          <div class="content">
            <p>
              <span>病人类型</span>
              {{ item.patientTypeName }}
            </p>
            <p>
              <span>门诊号/住院号</span>
              {{ item.inpNo }}
            </p>
            <!-- <p>
              <span>监测情况</span>
              {{item.flupState}}
            </p>-->
          </div>
          <div class="menubox">
            <router-link :to="patientPlan(item)">随访计划</router-link>
            <router-link :to="healthMonitoring(item)">健康监测</router-link>
            <router-link :to="patientTelemonitor(item)">个人档案</router-link>
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
      flupStateId: null,
      loading: false,
      finished: false,
      startDate: null,
      endDate: null,
      showPicker: false,
      pageNo: 1,
      pageSize: 5,
      list: [],
      total: 0,
      execute: true,
      isAll: 0,
    }
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
    if (this.$route.query.Private) {
      this.isAll = 0
    } else {
      this.isAll = 1
    }
    this.getlist()
  },
  methods: {
    healthMonitoring(item) {
      return (
        'Doctor-healthMonitoring?patientName=' +
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
        item.flupType +
        '&serialNo=' +
        item.serialNo
      )
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
    patientTelemonitor(item) {
      return 'Doctor-patientTelemonitor?userId=' + item.userId
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
              this.isAll = 0
            } else {
              this.isAll = 1
            }
            this.getlist()
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
          if (res.retData) {
            this.pageNo = 1
            if (this.$route.query.Private) {
              this.isAll = 0
            } else {
              this.isAll = 1
            }
            this.getlist()
          }
        })
    },
    getlist() {
      this.$apis
        .getAllPatientIcdmList({
          serialNo: this.$route.query.serialNo,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          isAll: this.isAll,
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
            this.isAll = 0
          } else {
            this.isAll = 1
          }
          this.$apis
            .getAllPatientIcdmList({
              serialNo: this.$route.query.serialNo,
              pageNo: this.pageNo,
              pageSize: this.pageSize,
              isAll: this.isAll,
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
    },
  },
}
</script>

<style lang="scss" scope>
.medicalcarebox5 {
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
        padding: 0 3.7% 10px;
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



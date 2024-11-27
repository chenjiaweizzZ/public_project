// 我的消息
<template>
  <div class="medicalcarebox9">
    <van-dropdown-menu active-color="#fff">
      <van-dropdown-item v-model="value" :options="FlupPlanList" @change="getAttention" />
    </van-dropdown-menu>
    <div v-for="(item, index) in attentionList" :key="index" class="messagelist">
      <div class="patientbox">
        <div class="top">
          <div class="patient">
            <h3>{{item.patientName}}</h3>
            <p>{{item.age}}岁 &ensp; {{item.sex}} &ensp; {{item.phone}}</p>
          </div>
          <!-- <van-button style="min-width:55px" round plain type="info" size="mini">已关注</van-button> -->
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
          <!-- <van-button style="min-width:55px" round plain type="default" size="mini">已关注</van-button> -->
        </div>
      </div>
      <div class="tz">
        <router-link style="border-right: 1px solid #E2E2E2" :to="patientPlan(item)">随访计划</router-link>
        <router-link :to="healthMonitoring(item)">健康监测</router-link>
        <router-link :to="patientTelemonitor(item)">个人档案</router-link>
        <router-link :to="sendAMessage(item)">发送消息</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import 'vant/lib/icon/local.css'
export default {
  data() {
    return {
      FlupPlanList: [],
      patientInfolist: [],
      value: null,
      name: null,
      attentionList: [],
    }
  },
  watch: {},
  mounted() {
    this.$apis.getAllFlupPlanList().then((res) => {
      this.value = res.retData[0].serialNo
      this.name = res.retData[0].planName
      this.FlupPlanList = res.retData
      this.FlupPlanList.forEach((res) => {
        res.text = res.planName
        res.value = res.serialNo
      })
      this.getAttention()
    })
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
    patientTelemonitor(item)
    {
      return ('Doctor-patientTelemonitor?userId=' +
        item.userId
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
            this.getAttention()
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
            this.getAttention()
          }
        })
    },
    getAttention() {
      this.FlupPlanList.forEach((res) => {
        if (res.serialNo == this.value) {
          this.name = res.planName
        }
      })
      this.$apis.getAttentionList({ serialNo: this.value }).then((res) => {
        this.attentionList = res.retData
      })
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
        this.value +
        '&flupName=' +
        this.name
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
  },
}
</script>

<style lang="scss" >
.medicalcarebox9 {
  .van-dropdown-menu__bar {
    background-color: #1c97fc;
    .van-dropdown-menu__title {
      color: #fff;
    }
  }
  .messagelist {
    width: 100%;
    height: 101px;
    border-bottom: 12px solid #f5f5f5;
    .patientbox {
      width: 100%;
      // height: 50px;
      padding: 2.4% 3.7% 1.5%;
      border-bottom: 1px solid #e2e2e2;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .patient {
          display: flex;
          align-items: center;
          justify-content: space-between;
          h3 {
            margin-block-start: 5px;
            margin-block-end: 10px;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
            font-size: 16px;
            color: #111111;
            letter-spacing: 0.2px;
          }
          p {
            margin-left: 10px;
            font-size: 14px;
            color: #333333;
            letter-spacing: 0.17px;
          }
        }
      }
      p {
        text-align: left;
        line-height: 20px;
        font-size: 15px;
        color: #666666;
        letter-spacing: 0.2px;
        span {
          margin-left: 20px;
          color: #111111;
        }
      }
    }
    .tz {
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



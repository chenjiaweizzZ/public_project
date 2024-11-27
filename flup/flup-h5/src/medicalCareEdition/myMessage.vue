// 我的消息
<template>
  <div class="medicalcarebox10">
    <div v-for="(item, index) in patientInfolist" :key="index" class="messagelist">
      <div class="patientbox">
        <div class="top">
          <div class="patient">
            <h3>{{item.patientInfo.patientName}}</h3>
            <p>{{item.patientInfo.age}}岁 &ensp; {{item.patientInfo.sex}} &ensp; {{item.patientInfo.phone}}</p>
          </div>
          <!-- <van-button style="min-width:55px" round plain type="info" size="mini">已关注</van-button> -->
          <!-- <van-button style="min-width:55px" round plain type="default" size="mini">已关注</van-button> -->
          <!-- <van-button
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
          >已关注</van-button>-->
        </div>
        <p>
          随访计划
          <span>{{item.flupName}}</span>
        </p>
      </div>
      <router-link :to="sendAMessage(item)">发送消息</router-link>
    </div>
  </div>
</template>

<script>
import 'vant/lib/icon/local.css'
export default {
  data() {
    return {
      patientInfolist: [],
    }
  },
  watch: {},
  mounted() {
    this.$apis
      .chatqueryByDoctor(sessionStorage.getItem('ucUserId'))
      .then((res) => {
        this.patientInfolist = res.retData
      })
  },
  methods: {
    sendAMessage(item) {
      return (
        'Doctor-sendAMessage?patientName=' +
        item.patientInfo.patientName +
        '&age=' +
        item.patientInfo.age +
        '&sex=' +
        item.patientInfo.sex +
        '&phone=' +
        item.patientInfo.phone +
        '&userId=' +
        item.patientInfo.userId +
        '&flupId=' +
        (item.flupId ? item.flupId : '') +
        '&flupName=' +
        (item.flupName ? item.flupName : '')
      )
    },
    // attention(item) {
    //   this.$apis
    //     .attentionPatientPlan({
    //       userId: item.userId,
    //       planId: item.flupPlanId
    //     })
    //     .then(res => {
    //       if (res.retData) {
    //         item.isAttention = 1
    //       }
    //     })
    // },
    // cancel(item) {
    //   this.$apis
    //     .unAttentionPatientPlan({
    //       userId: item.userId,
    //       planId: item.flupPlanId
    //     })
    //     .then(res => {
    //       if (res.retData) {
    //         item.isAttention = 0
    //       }
    //     })
    // }
  },
}
</script>

<style lang="scss" >
.medicalcarebox10 {
  .messagelist {
    width: 100%;
    height: 132px;
    border-bottom: 12px solid #f5f5f5;
    .patientbox {
      width: 100%;
      height: 81px;
      padding: 2.4% 3.7% 1.5%;
      border-bottom: 1px solid #e2e2e2;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .patient {
          display: flex;
          align-items: center;
          h3 {
            margin-block-start: 5px;
            margin-block-end: 10px;
            margin-inline-start: 0px;
            margin-inline-end: 20px;
            font-size: 16px;
            color: #111111;
            letter-spacing: 0.2px;
          }
          p {
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
    a {
      display: block;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      color: #0081ea;
      letter-spacing: 0.2px;
    }
  }
}
</style>



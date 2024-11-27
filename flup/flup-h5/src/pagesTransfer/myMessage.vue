// 我的消息
<template>
  <div class="medicalcarebox">
    <div v-if="patientInfolist.length !=0">
      <router-link
        v-for="(item, index) in patientInfolist"
        :key="index"
        :to="'sendAMessage?doctorId='+item.doctorInfo.serialNo+'&flupName='+item.flupName+'&realName='+item.doctorInfo.realName"
      >
        <div class="doctorlist">
          <img src="../assets/images/ystp.png" alt="医生图片" />
          <div class="doctor">
            <p class="doctorname">
              {{item.doctorInfo.realName}}
              <!-- <span>{{item.doctorInfo.deptName}}</span> -->
            </p>
            <p>{{item.flupName}}</p>
          </div>
          <div v-if="item.newMessage" class="dot"></div>
        </div>
      </router-link>
    </div>
    <div v-else class="noDatabox">
      <img src="../assets/images/zwsj.png" />
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
  created() {
    if (this.$route.query.openId) {
      sessionStorage.setItem('openId', this.$route.query.openId)
    }
  },

  mounted() {
    this.$apis
      .chatqueryByPatient(JSON.parse(sessionStorage.getItem('userInfo')).userId)
      .then((res) => {
        this.patientInfolist = res.retData
        console.log(this.patientInfolist)
      })
  },
  methods: {},
}
</script>

<style lang="scss" scope>
.medicalcarebox {
  padding-left: 3.7%;
  .doctorlist {
    width: 100%;
    height: 72px;
    padding: 2.1% 3.7% 2.1% 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e2e2e2;
    img {
      width: 24px;
      height: 24px;
      margin-right: 20px;
    }
    .doctor {
      width: 80%;
      .doctorname {
        font-size: 16px;
        color: #111111;
        letter-spacing: 0.2px;
        span {
          font-size: 14px;
          color: #333333;
          letter-spacing: 0.17px;
        }
      }
      p {
        font-size: 14px;
        color: #666666;
        letter-spacing: 0.2px;
      }
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 6px;
      background: #f6424b;
    }
  }
}
</style>



// 医生主页
<template>
  <div class="medicalcarebox8">
    <div class="bluebackground">
      <div class="businesscard">
        <div class="doctor">
          <img
            src="https://usercenter-1251304050.cossh.myqcloud.com/UploadFile/User/Avatar/YHPTCSF20180625091028763020.png"
            alt="医生图片"
          />
          <div class="doctor-name">
            <h3>{{doctorInformation.realName}}</h3>
            <p>{{doctorInformation.deptName}}</p>
          </div>
          <van-button
            style="min-width:65px"
            round
            plain
            type="info"
            size="mini"
            to="Doctor-binding?changebound=true"
          >重新绑定</van-button>
        </div>
        <div class="label">
          <div :class="flexiblex?'tagbox':''">
            <span>随访/慢病组：</span>
            <van-tag
              v-for="(item, index) in grouplist"
              :key="index"
              color="#DDEEFF"
              text-color="#0880E3"
            >{{item}}</van-tag>
          </div>
          <p style="text-align: center;" @click="flexible">
            <van-icon v-if="flexiblex" style="ta" name="arrow-down" color="#0880E3" size="16" />
            <van-icon v-else style="ta" name="arrow-up" color="#0880E3" size="16" />
          </p>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="menu">
        <router-link v-if="paraVisible.FlupPlan" to="Doctor-FollowUpPlan">
          <div>
            <img src="@/assets/images/Doctor/sfjh.png" />
            <p>随访计划</p>
          </div>
        </router-link>
        <router-link v-if="paraVisible.ICDM" to="Doctor-chronicCareManagement">
          <div>
            <img src="@/assets/images/Doctor/mbgl.png" />
            <p>慢病管理</p>
          </div>
        </router-link>
        <router-link v-if="paraVisible.PendingAudit" to="Doctor-myToAudit">
          <div>
            <img src="@/assets/images/Doctor/dsh.png" />
            <p>待审核</p>
          </div>
        </router-link>
        <router-link v-if="paraVisible.DoctorMyMessage" to="Doctor-myMessage">
          <div>
            <img src="@/assets/images/Doctor/wdxx.png" />
            <p>我的消息</p>
          </div>
        </router-link>
        <router-link v-if="paraVisible.WatchPatient" to="Doctor-myAttention">
          <div>
            <img src="@/assets/images/Doctor/gzhz.png" />
            <p>关注患者</p>
          </div>
        </router-link>
      </div>
    </div>
    <div v-if="paraVisible.FlupPendingProcess" class="content">
      <h3>当前随访待处理</h3>
      <div v-for="(item, index) in disposelist" :key="index" class="missioncard">
        <div class="mission">
          <h3>{{item.planName}}</h3>
          <p>{{item.startDate}}至{{item.endDate}}</p>
        </div>
        <div class="amount">
          <div class="left">
            <p>已过期随访任务数</p>
            <h3>{{item.outDateCount}}</h3>
          </div>
          <div class="right">
            <p>异常问卷数</p>
            <h3>{{item.exceptionCount}}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'vant/lib/icon/local.css'
export default {
  data() {
    return {
      flexiblex: true,
      doctorInformation: {},
      grouplist: [],
      disposelist: [],
      paraVisible: {
        FlupPlan: 1,
        ICDM: 1,
        PendingAudit: 1,
        DoctorMyMessage: 1,
        WatchPatient: 1,
        FlupPendingProcess: 1,
      },
    }
  },
  watch: {},
  created() {
    if (!sessionStorage.getItem('openId') && this.$route.query.openId) {
      sessionStorage.setItem('openId', this.$route.query.openId)
    }
    this.$apis.DoctorgetDoctorInfo().then((res) => {
      this.doctorInformation = res.retData
      if (res.retData.groupName) {
        this.grouplist = res.retData.groupName.split(',')
      }
      sessionStorage.setItem('hospitalId', this.doctorInformation.hospitalId)
      sessionStorage.setItem('ucUserId', res.retData.serialNo)
      this.queryFlupConfigList()
    })
    //获取pc端配置项
  },
  mounted() {
    this.$apis.getUnFollowupList().then((res) => {
      this.disposelist = res.retData
    })
  },
  methods: {
    queryFlupConfigList() {
      this.$apis
        .getFlupConfigList({
          hospitalId: this.doctorInformation.hospitalId,
          moduleCode: 'mobileViewDoctor',
        })
        .then((res) => {
          res.retData.forEach((element) => {
            this.paraVisible[element.componentKey] = parseInt(
              element.componentValue
            )
          })
        })
    },
    flexible() {
      this.flexiblex = !this.flexiblex
    },
  },
}
</script>

<style lang="scss" >
.medicalcarebox8 {
  h3 {
    font-weight: 500;
    color: #111;
  }
  .bluebackground {
    width: 100%;
    min-height: 140px;
    background-color: #1c97fc;
    position: relative;
    top: 0;
    left: 0;
    .businesscard {
      width: 92.5%;
      min-height: 148px;
      padding: 0% 4% 1%;
      border-radius: 5px;
      position: absolute;
      z-index: 999;
      top: 20%;
      left: 3.7%;
      background-color: #fff;
      border-bottom: 3px solid rgba($color: #333, $alpha: 0.05);
      .doctor {
        width: 100%;
        height: 96px;
        display: flex;
        padding-top: 5%;
        border-bottom: 1px solid #e5e5e5;
        img {
          width: 68px;
          height: 68px;
          border-radius: 5px;
          background-color: royalblue;
        }
        .doctor-name {
          font-weight: 500;
          width: 60%;
          h3 {
            margin-block-start: 0;
            margin-block-end: 10px;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
          }
          padding: 10px;
        }
      }
      .label {
        padding-top: 10px;
        .tagbox {
          height: 24px;
          overflow: hidden;
        }
        .van-tag {
          margin-right: 5px;
          margin-bottom: 5px;
        }
      }
    }
  }
  .main {
    width: 100%;
    padding: 3.7%;
    padding-top: 10%;
    border-bottom: 5px solid #f5f5f5;
    .menu {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      a {
        width: 33.3%;
        margin-top: 5%;
        display: block;
        color: #333;
        div {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        img {
          width: 40px;
          height: 40px;
        }
      }
    }
  }
  .content {
    padding: 0 3.7%;
    .missioncard {
      width: 100%;
      height: 155px;
      margin-bottom: 10px;
      border-bottom: 2px solid #f3f3f3;
      .mission {
        width: 100%;
        height: 66px;
        padding: 3.2%;
        background-color: #fff;
        background: #1c97fc;
        border-radius: 4px 4px 0 0;
        h3 {
          margin-block-start: 0;
          margin-block-end: 5px;
          color: #fff;
        }
        p {
          color: #fff;
          font-size: 12px;
        }
      }
      .amount {
        width: 100%;
        height: 83px;
        padding: 3.2%;
        display: flex;
        .left {
          border-right: 1px solid #e2e2e2;
        }
        div {
          width: 50%;
          text-align: center;
          h3 {
            color: #ff7b35;
          }
        }
      }
    }
  }
}
</style>



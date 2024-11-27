<template>
  <section class="healthFile">
    <div style="display:flex;justify-content:space-between;padding:0 14px">
      <div style="font-size:16px;color:#fff">{{ hospitalName }}</div>
      <div class="changeH" @click="goHospitalName">切换院区</div>
    </div>
    <div class="userInfo">
      <img src="../../assets/images/healthFile/userInfoBg.png" alt />
      <div class="uiContent">
        <div class="uiHead">
          <img src="../../assets/images/healthFile/uiHead.png" alt />
        </div>
        <p>{{ user.patientName }}</p>
        <span>{{ user.sex }} {{ user.age }}</span>
        <div v-if="conceal" class="uiBtn" @click="rebind">重新绑定</div>
        <div v-else class="uiBtn" @click="loginWith">切换就诊人</div>
      </div>
    </div>
    <div class="hfBtns">
      <div
        v-if="paraVisible.PersonalDocument"
        class="hrBtn"
        @click="goToHealthFileS"
      >
        <img src="../../assets/images/healthFile/grda.png" alt />
        <p>个人档案</p>
      </div>
      <div
        v-if="paraVisible.AssessmentReport"
        class="hrBtn"
        @click="goToNcdReport"
      >
        <img src="../../assets/images/healthFile/pgbg.png" alt />
        <p>评估报告</p>
      </div>
      <div v-if="paraVisible.FlupTask" class="hrBtn" @click="goToFollowUp">
        <img src="../../assets/images/healthFile/sfrw.png" alt />
        <p>随访任务</p>
      </div>
      <div
        v-if="paraVisible.Telemonitor"
        class="hrBtn"
        @click="goToHealthMonitorList"
      >
        <img src="../../assets/images/healthFile/jkjc.png" alt />
        <p>健康监测</p>
      </div>
      <div
        v-if="paraVisible.HealthEducation"
        class="hrBtn"
        @click="goToHealthTeach"
      >
        <img src="../../assets/images/healthFile/jkxj.png" alt />
        <p>健康宣教</p>
      </div>
      <div
        v-if="paraVisible.ReportHistory"
        class="hrBtn"
        @click="goToEvalReport"
      >
        <img src="../../assets/images/healthFile/bgjl.png" alt />
        <p>报告记录</p>
      </div>
      <div
        v-if="paraVisible.SignManage"
        class="hrBtn"
        @click="goToContractManagement"
      >
        <img src="../../assets/images/healthFile/qyxx.png" alt />
        <p>签约管理</p>
      </div>
      <div
        v-if="paraVisible.Subscription"
        class="hrBtn"
        @click="goToSubscriptionManagement"
      >
        <img src="../../assets/images/healthFile/qyxx.png" alt />
        <p>订阅管理</p>
      </div>
      <div v-if="paraVisible.ZjMall" class="hrBtn" @click="goMall">
        <img src="../../assets/images/healthFile/store.png" alt />
        <p>橄榄严选</p>
      </div>
    </div>
    <van-cell
      v-if="paraVisible.MedicalReport"
      is-link
      :to="'/report?index=0&openId=' + $route.query.openId"
    >
      <template #title>
        <img src="../../assets/images/healthFile/blbg.png" alt />
        <span class="custom-title">病历报告</span>
      </template>
    </van-cell>
    <van-cell
      v-if="paraVisible.MedicineGuid"
      is-link
      :to="'/healthFileFuncList?index=0&openId=' + $route.query.openId"
    >
      <template #title>
        <img src="../../assets/images/healthFile/yyzd.png" alt />
        <span class="custom-title">用药指导</span>
      </template>
    </van-cell>
    <van-cell
      v-if="paraVisible.SportsPlan"
      is-link
      :to="'/healthFileFuncList?index=1&openId=' + $route.query.openId"
    >
      <template #title>
        <img src="../../assets/images/healthFile/ydfa.png" alt />
        <span class="custom-title">运动方案</span>
      </template>
    </van-cell>
    <van-cell
      v-if="paraVisible.FoodAdvise"
      is-link
      :to="'/healthFileFuncList?index=2&openId=' + $route.query.openId"
    >
      <template #title>
        <img src="../../assets/images/healthFile/ysjy.png" alt />
        <span class="custom-title">饮食建议</span>
      </template>
    </van-cell>
    <van-cell
      v-if="paraVisible.MyMessage"
      is-link
      :to="'/myMessage?index=2&openId=' + $route.query.openId"
    >
      <template #title>
        <div style="display: flex; align-items: center">
          <van-icon size="22" name="chat-o" />
          <span style="margin-left: 5px" class="custom-title">我的消息</span>
        </div>
      </template>
    </van-cell>
  </section>
</template>
<script>
export default {
  data() {
    return {
      user: {},
      conceal: true,
      hospitalName: null,
      paraVisible: {
        PersonalDocument: 0,
        AssessmentReport: 0,
        FlupTask: 0,
        Telemonitor: 0,
        HealthEducation: 0,
        ReportHistory: 0,
        MedicalReport: 0,
        SportsPlan: 0,
        FoodAdvise: 0,
        MyMessage: 0,
        SignManage: 0,
        MedicineGuid: 0,
        Subscription: 0
      },
      hospitalId: null
    };
  },
  mounted() {
    this.conceal =
      this.$route.query.conceal == "undefined"
        ? true
        : !this.$route.query.conceal;
    this.user = JSON.parse(sessionStorage.getItem("userInfo"));
    this.hospitalId = this.user.hospitalId || this.$route.query.hospitalId;
    this.hospitalName =
      this.user.hospitalName || this.$route.query.hospitalName;

    if (!this.user.openId) {
      this.$apis
        .getPatientInfo({ openId: this.$route.query.openId })
        .then(res => {
          if (!this.conceal && !this.hospitalName) {
            this.$apis.getAllHospitals().then(res2 => {
              if (res2.retData.length != 0) {
                let hospital = res2.retData.filter(item => {
                  return item.serial_no == this.hospitalId;
                });
                this.hospitalName =
                  hospital.length != 0 ? hospital[0].hospital_name : "";
                let userInfo = Object.assign({}, this.user, res.retData, {
                  hospitalId: this.hospitalId,
                  hospitalName: this.hospitalName
                });
                sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
                this.user = userInfo;
              } else {
                let userInfo = Object.assign({}, this.user, res.retData, {
                  hospitalId: this.hospitalId
                });
                sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
                this.user = userInfo;
              }
            });
          } else {
            {
              let userInfo = Object.assign({}, this.user, res.retData);
              sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
              this.user = userInfo;
            }
          }
        });
    } else if (!this.conceal && !this.hospitalName) {
      this.$apis.getAllHospitals().then(res => {
        if (res.retData.length != 0) {
          let hospital = res.retData.filter(item => {
            return item.serial_no == this.hospitalId;
          });
          this.hospitalName =
            hospital.length != 0 ? hospital[0].hospital_name : "";
          let userInfo = Object.assign({}, this.user, {
            hospitalId: this.hospitalId,
            hospitalName: this.hospitalName
          });
          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
          this.user = userInfo;
        }
      });
    }

    this.$apis
      .getFlupConfigList({
        hospitalId: this.hospitalId,
        moduleCode: "mobileViewPatient"
      })
      .then(res => {
        res.retData.forEach(element => {
          this.paraVisible[element.componentKey] = parseInt(
            element.componentValue
          );
        });
      });
    this.goRebind();
  },
  methods: {
    loginWith() {
      this.$apis
        .loginWithOpenId4C({
          openId: this.$route.query.openId,
          toMode: "choose",
          type: 1
        })
        .then(res => {
          if (res) {
            // window.location.href = res.retData.unipUrl
            wx.miniProgram.navigateTo({
              // appId: 'wx76e93ca8ba6d7130',
              url:
                "/pages/other/moduleWebView?option=" +
                encodeURIComponent(
                  JSON.stringify({
                    url: res.retData.unipUrl,
                    callback: "zhinengdaozhen"
                  })
                )
            });
          }
        });
    },
    rebind() {
      this.$router.push({
        path: "personalInformationS",
        query: {
          pathMatch: "bind",
          openId: this.$route.query.openId,
          hospitalId: this.hospitalId
        }
      });
    },
    goToHealthFileS() {
      this.$router
        .push({
          path: "personalFiles",
          query: {
            openId: this.$route.query.openId
          }
        })
        .catch(err => {
          err;
        });
    },
    goToNcdReport() {
      this.$router
        .push({
          path: "ncdReport",
          query: {
            openId: this.$route.query.openId
          }
        })
        .catch(err => {
          err;
        });
    },
    goToEvalReport() {
      this.$router
        .push({
          path: "evalReport",
          query: {
            openId: this.$route.query.openId
          }
        })
        .catch(err => {
          err;
        });
    },
    goToContractManagement() {
      this.$router
        .push({
          path: "contractManagement",
          query: {
            openId: this.$route.query.openId
          }
        })
        .catch(err => {
          err;
        });
    },
    goToSubscriptionManagement() {
      this.$router
        .push({
          path: "SubscriptionManagement",
          query: {
            openId: this.$route.query.openId,
            manager: true
          }
        })
        .catch(err => {
          err;
        });
    },
    goToFollowUp() {
      sessionStorage.setItem("defaultClientNew", true);
      this.$router
        .push({
          path: "FollowUp",
          query: {
            openId: this.$route.query.openId,
            hospitalId: this.$route.query.hospitalId
          }
        })
        .catch(err => {
          err;
        });
    },
    goToHealthMonitorList() {
      this.$router
        .push({
          path: "healthMonitorList",
          query: {
            openId: this.$route.query.openId
          }
        })
        .catch(err => {
          err;
        });
    },
    goToHealthTeach() {
      this.$router
        .push({
          path: "healthTeach",
          query: {
            openId: this.$route.query.openId
          }
        })
        .catch(err => {
          err;
        });
    },
    goHospitalName() {
      this.$router.replace(
        this.$route.query.redirect ||
          `/hospitalName?openId=${this.$route.query.openId ||
            this.openId}&conceal=${this.$route.query.conceal}`
      );
    },
    goRebind() {
      if (!this.user.patientName) {
        this.rebind();
      }
    },
    goMall() {
      zjhmdemoapi;
      window.location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcb6d838317dbc869&redirect_uri=https%3A%2F%2Fpremisd.zwjk.com%2Fflup%2Fweb%2Fh5%2F%23%2Ftransport%3Furl%3Dhttps%3A%2F%2Fzjhmmalldemo.zwjk.com&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect";
    }
  }
};
</script>
<style lang="scss">
.healthFile {
  .van-cell .van-cell__title {
    color: #333;
    img {
      width: 22px;
      vertical-align: middle;
    }
  }
}
</style>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.healthFile {
  min-height: 200px;
  background: url(../../assets/images/healthFile/healthFileBg.png) no-repeat;
  background-size: contain;
  .changeH {
    padding: 0 10px;
    background: #5f9cff;
    border-radius: 12px;
    font-size: 12px;
    color: #fff;
    letter-spacing: 0.2px;
    line-height: 24px;
  }
  .userInfo {
    position: relative;
    font-size: 0;
    img {
      width: 100%;
    }
    .uiContent {
      position: absolute;
      left: 3.75%;
      top: 50%;
      transform: translate(0, -50%);
      width: 92.5%;
      min-height: 60px;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0.13px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .uiHead {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translate(0, -50%);
        width: 60px;
        height: 60px;
        border-radius: 50px;
        img {
          object-fit: cover;
        }
      }
      p {
        margin: 0 85px;
        margin-bottom: 6px;
        line-height: 24px;
        font-size: 18px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      span {
        display: block;
        opacity: 0.6;
        margin: 0 85px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .uiBtn {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
        padding: 0 10px;
        background: #5f9cff;
        border-radius: 12px;
        font-size: 12px;
        color: #ffffff;
        letter-spacing: 0.2px;
        line-height: 24px;
      }
    }
  }
  .hfBtns {
    width: 92.5%;
    margin-left: 3.75%;
    padding-bottom: 14px;
    margin-bottom: 10px;
    background: #ffffff;
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    overflow: hidden;
    .hrBtn {
      float: left;
      width: 25%;
      padding-top: 14px;
      text-align: center;
      font-size: 0;
      img {
        width: 30px;
        height: 30px;
        object-fit: cover;
        margin-bottom: 6px;
      }
      p {
        padding: 0 10px;
        line-height: 21px;
        font-size: 15px;
        color: #111111;
        letter-spacing: 0.21px;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>

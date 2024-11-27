<template>
  <div class="followUpTaskDetails">
    <div class="taskDetail" v-if="obj.flupType == '消息提醒'">
      <div class="taskTop">
        <p>{{ obj.flupType }}</p>
        <span>{{ obj.flupStartTime }}</span>
      </div>
      <div class="taskContent">
        <div class="taskTitle">
          <p>内容</p>
        </div>
        <div class="taskInfo">{{ list[0][0] }}</div>
      </div>
    </div>
    <div class="taskDetail" v-else-if="obj.flupType == '定期复诊'">
      <div class="taskTop">
        <p>{{ obj.flupType }}</p>
        <span>{{ obj.flupStartTime }}</span>
      </div>
      <div class="taskContent">
        <div class="taskTitle">
          <p>内容</p>
        </div>
        <div class="taskInfo">
          <span style="margin-left: 20px;white-space: pre-line">{{
            obj.flupContent.split("|")[0]
            }}</span>
          {{ list[0].length > 0 ? list[0][1] : "" }}
          <div v-if="businessLinkage">
            <van-button type="primary" block @click="goXCX">{{
              businessLinkage.businessName
            }}</van-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="title">
        <p>{{ obj.flupType }}</p>
        <p>{{ obj.flupStartTime }}</p>
      </div>
      <div class="main">
        <div v-if="obj.flupType == '定期检查'" class="listbox">
          <div>
            <p>检查内容</p>
            <p>检查部位</p>
            <p>检查项目</p>
            <p v-if="patientSource">预约科室</p>
            <p v-if="patientSource">预约时间</p>
            <p v-if="patientSource">预约状态</p>
          </div>
          <p v-for="(item, index) in list" :key="index">
            <span v-if="!patientSource">{{ item[0] }}</span>
            <span v-if="!patientSource">{{ item[2] }}</span>
            <span v-if="!patientSource">{{ item[4] }}</span>
            <span v-if="patientSource">{{ item.typeName }}</span>
            <span v-if="patientSource">{{ item.bodyName }}</span>
            <span v-if="patientSource">{{ item.itemName }}</span>
            <span v-if="patientSource">{{ item.deptName }}</span>
            <span v-if="patientSource">{{ item.appointmentDatetime }}</span>
            <span v-if="patientSource">{{
              formatAppointStatus(item.isAppointment)
            }}</span>
          </p>
          <div></div>
          <van-button
            style="margin:10px ; float:right"
            plain
            type="primary"
            v-if="patientSource && singal"
            @click="orderExam"
            >前往预约</van-button
          >
        </div>
        <div v-else-if="obj.flupType == '定期检验'" class="listbox">
          <div>
            <p style="width: 45%">检查名称</p>
            <p style="width: 45%">样本类型</p>
          </div>
          <p v-for="(item, index) in list" :key="index">
            <span style="width: 45%">{{ item[0] }}</span>
            <span style="width: 45%">{{ item[2] }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      obj: {},
      list: [],
      patientSource: false,
      singal: false,
      code: sessionStorage.getItem("code"),
      user: JSON.parse(sessionStorage.getItem("userInfo")),
      appointmentHos: "",
      businessLinkage: null,
      businessLinkageList: []
    };
  },
  filters: {
        filterBr(value) {
            return value.replace(/\n/g, '<br>')
        }
    },
  async created() {
    if (this.code) {
      this.singal = true;
    }
    await this.$apis
      .selectParameterByKeyNoCache({
        parameterKey: "businessLinkage",
        hospitalId: this.user
          ? this.user.hospitalId
          : this.$route.query.hospitalId
      })
      .then(res => {
        if (res.retData.enabled == "1") {
          this.businessLinkageList = JSON.parse(res.retData.parameterValue);
        }
      });
    await this.$apis
      .getPatientPlanDetail({
        serialNo: this.$route.query.serialNo
      })
      .then(res => {
        this.obj = res.retData;
        // console.log(res.retData)
        // this.obj.flupContent = res.retData.flupContent.replace(/\n/g, '<br/>')
        console.log(this.obj)
        if (!this.obj.flupPlan) {
          this.obj.flupPlan = "异常处理";
        }
        this.list = res.retData.flupContent.split(",");
        for (let i in this.list) {
          this.list[i] = this.list[i].split("|");
        }
        if (
          res.retData.flupType == "定期复诊" &&
          this.businessLinkageList.length != 0 &&
          this.list[0].length == 3
        ) {
          this.businessLinkageList.forEach(element => {
            if (this.list[0][2] == element.businessCode) {
              this.businessLinkage = element;
            }
          });
        }
        if (res.retData.flupType == "定期检查") {
          this.$apis
            .queryFlupConfigOne({
              hospitalId: this.user
                ? this.user.hospitalId
                : this.$route.query.hospitalId,
              moduleCode: "followUpSetting",
              componentKey: "AppointmentLimitItem"
            })
            .then(res => {
              // this.patientSource = res.componentValue == '1' ? true : false
              if (res.retData.componentValue == "1") {
                //获取是否配置一体化预约
                this.$apis
                  .getParametersByParameterTypeId({
                    parameterTypeId: "2017112415565747492b",
                    searchVal: "患者端就诊人"
                    // hospitalId: this.user.hospitalId,
                  })
                  .then(res => {
                    if (res.retData.length > 0) {
                      this.patientSource =
                        res.retData[0].parameterValue == "UNIP" ? true : false;
                      if (this.patientSource) {
                        this.$apis
                          .getPatientCheckItemList({
                            serialNo: this.$route.query.serialNo
                          })
                          .then(res => {
                            this.list = res.retData;
                          });
                        this.$apis
                          .getParametersByParameterTypeId({
                            parameterTypeId: "20170920111428720de3",
                            searchVal: "一体化服务配置信息"
                            // hospitalId: this.user.hospitalId,
                          })
                          .then(res => {
                            if (res.retData.length > 0) {
                              let data = JSON.parse(
                                res.retData[0].parameterValue
                              );
                              this.appointmentHos = data.hospitalID;
                            }
                          });
                      }
                    }
                  });
              }
            });
        }
      });
  },
  methods: {
    //跳转小程序
    goXCX() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
        wx.miniProgram.getEnv(res => {
          if (res.miniprogram) {
            wx.miniProgram.navigateTo({
              appId: "wx8852b2f4d8cdbd5c",
              url: this.businessLinkage.url
            });
          } else {
            window.open(this.businessLinkage.url, "_self");
          }
        });
      } else {
        window.open(this.businessLinkage.url, "_self");
      }
    },
    orderExam() {
      //查看预约申请状态
      this.$apis
        .getAppointmentApplyStatus({ serialNo: this.$route.query.serialNo })
        .then(res => {
          if (res.retData) {
            this.goYTHYY();
          } else {
            this.$apis
              .sendAppointmentApply({ serialNo: this.$route.query.serialNo })
              .then(res => {
                if (res.retData) {
                  this.goYTHYY();
                } else {
                  this.$dialog.alert({
                    message: "申请一体化预约失败！"
                  });
                }
              });
          }
        });
    },
    goYTHYY() {
      this.$apis.loginWithOpenId4C({ openId: this.user.openId }).then(res => {
        let route =
          this.$baseURL.YTHYY +
          "/?code=" +
          this.code +
          "#/medical_apply_list?hospitalId=" +
          // user.hospitalId +
          this.appointmentHos +
          "&unionId=&token=" +
          res.retData.token +
          "&source=0&systemid=suifang";
        window.location.href = route;
      });
    },
    formatAppointStatus(val) {
      switch (val) {
        case 0:
          return "未预约";
        case 1:
          return "已预约";
        case -1:
          return "已取消";
        default:
          return "";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.followUpTaskDetails {
  .taskDetail {
    position: relative;
    .taskTop {
      padding: 0 20px;
      padding-bottom: 80px;
      background: url("../assets/images/taskTopBg.png") no-repeat;
      background-size: cover;
      overflow: hidden;
      p {
        margin: 24px 0 12px;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.25px;
        color: #ffffff;
      }
      span {
        font-size: 14px;
        line-height: 17px;
        letter-spacing: 0.17px;
        color: #ffffff;
      }
    }
    .taskContent {
      margin-top: -43px;
      padding-top: 23px;
      padding-bottom: 50px;
      border-radius: 24px 24px 0px 0px;
      background: #ffffff;
      .taskTitle {
        padding-bottom: 10px;
        border-bottom: 1px solid #c6c9ce;
        p {
          position: relative;
          padding: 0 28px;
          font-size: 14px;
          line-height: 17px;
          letter-spacing: 0.2px;
          color: #333333;
          &::before {
            content: "";
            display: block;
            width: 3px;
            height: 16px;
            border-radius: 1.5px;
            background: #32ae57;
            position: absolute;
            top: 1px;
            left: 14px;
          }
        }
      }
      .taskInfo {
        margin-bottom: 8px;
        padding: 17px 3.75%;
        font-size: 14px;
        line-height: 24px;
        letter-spacing: 0.2px;
        color: #111111;
        white-space: pre-line
      }
    }
  }
  .title {
    width: 100%;
    height: 48px;
    padding: 14px;
    background-color: #1c97fc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    font-size: 15px;
  }
  .title1 {
    width: 100%;
    height: 30px;
    padding: 0px 14px 14px;
    background-color: #1c97fc;
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 15px;
  }
  .listbox {
    > div {
      padding: 12px 14px 11px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e2e2e2;
      p {
        width: 30%;
        font-size: 15px;
        color: #666666;
      }
    }
    > p {
      padding: 12px 14px 11px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      span {
        width: 30%;
        display: inline-block;
        font-size: 16px;
        color: #333333;
      }
    }
    > div {
    }
  }
}
</style>

<template>
  <div class="homeStuChart">
    <div class="userInfoTraining" v-if="userInfo">
      <img src="../../../../assets/images/index-bg2.png" class="bgImg" />
      <div class="indexPie" ref="main" @click="toCircle"></div>
      <div class="pieBg">
        <div class="pieBgContent"></div>
      </div>
      <div class="info">
        <div class="lineTop">
          <div class="headBox">
            <img :src="imageurl" />
            <span class="headState2">
              <van-tag type="primary">{{
                isAdvancedStu ? "在修" : "在培"
              }}</van-tag>
            </span>
          </div>
          <div class="headTitle">
            <div class="infoName">{{ name }}</div>
            <div class="infoPlan">
              <span @click="circleDetail">个人轮转计划</span>
              <span class="arrow-right"></span>
            </div>
          </div>
        </div>
        <div class="UserInfo">
          <div class="infoItem">
            <span class="itemTitle">轮转科室:&nbsp;&nbsp;</span>
            <span class="itemContent">{{ userInfo.deptName }}</span>
          </div>
          <div class="infoItem">
            <span class="itemTitle">轮转时间:&nbsp;&nbsp;</span>
            <span v-if="isAdvancedStu" class="itemContent">
              {{
                userInfo.planBeginTime
                  ? userInfo.planBeginTime + " 至 " + userInfo.planEndTime
                  : "-"
              }}
            </span>
            <span v-if="!isAdvancedStu" class="itemContent"
              >{{ userInfo.planBeginTime }}-{{ userInfo.planEndTime }}</span
            >
          </div>
          <div class="infoItem">
            <span class="itemTitle">带教老师:&nbsp;&nbsp;</span>
            <span class="itemContent">{{ userInfo.teachName }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="userInfoStudent" v-show="noUserInfo">
      <img src="../../../../assets/images/index-bg4.png" class="bgImg" />
    </div>
  </div>
</template>


<script>
import echarts from "echarts";
import methods from "@/methods";
export default {
  name: "homeStuChart",
  data() {
    return {
      userInfo: {},
      noUserInfo: false,
      circleData: [],
      circleTitle: [],
      circleColor: [],
      optionPie: {},
      imageurl: ""
    };
  },
  mounted() {
    this.echartsInit();
    this.getMyCirlce();
    this.show_my();
  },
  methods: {
    ...methods,
    echartsInit() {
      let self = this;
      let pie = echarts.init(this.$refs.main);
      this.optionPie = {
        tooltip: {
          trigger: "item",
          show: false,
        },
        title: this.circleTitle,
        legend: {
          top: "5%",
          left: "center",
        },
        color: self.circleColor,
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["45%", "70%"],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            label: {},
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            labelLine: {
              normal: {
                position: "inner",
                show: false,
              },
            },
            // data: [ { value: 735 },{ value: 1500 }]
            // data: [{ value: 0 }]
            data: this.circleData,
          },
        ],
      };
      pie.setOption(this.optionPie);
    },
    toCircle() {
      if (this.isAdvancedStu) {
        location.href = "/advancedapp/trainingRotation/rotation";
      } else {
        location.href =
          "/pages/futuredoctorapp/index.html#/rt/rotation_doctor?token=" +
          $.cookie("token");
      }
    },
    circleDetail(item) {
      let self = this;
      $.cookie('doctor_from',0);
      if (this.isAdvancedStu) {
        location.href = "/advancedapp/trainingRotation/rotation";
      } else {
        this.$router.push({
          name: "fdRotation_doctor_plan",
          query: {
            type: 0
          }
        });
      }
    },
    show_my: function() {
      var self = this;
      var data = {
        command: "user/queryuserdetail", //接口地址
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid")
      };
      self.post("/user/queryuserdetail", data).done(function(res) {
        if (res.users[0].imageurl) {
            self.name = res.users[0].name;
          self.imageurl = res.users[0].imageurl;
        }
      });
    },
    getMyCirlce() {
      let self = this;
      self
        .post("/turn/myTurnDoctor", {
          command: "turn/myTurnDoctor",
          loginid: $.cookie("uid"),
        })
        .done((res) => {
          if (res.errcode == 0) {
            if (res.isGraduation) {
              self.userInfo = res;
              if (res.isGraduation == "0") {
                if (res.deptName) {
                  self.circleData = [
                    { value: res.turnRemainingDay },
                    { value: res.turnTotalDay - res.turnRemainingDay },
                  ];
                  self.circleTitle = [
                    {
                      text: "距离出科",
                      left: "center",
                      top: "35%",
                      textStyle: {
                        color: "#3D5166",
                        fontSize: 11,
                        fontWeight: "lighter",
                      },
                    },
                    {
                      left: "center",
                      top: "40%",
                      subtext: res.turnTotalDay + "天",
                      subtextStyle: {
                        color: "#2E445B",
                        fontSize: 18,
                        fontWeight: "700",
                      },
                    },
                  ];
                  self.circleColor = [
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: "#67B1FF" },
                      { offset: 1, color: "#056FE0" },
                    ]),
                    "#F5F5F5",
                  ];
                } else {
                  self.userInfo.deptName = "-";
                  self.userInfo.teachName = "-";
                  self.circleData = [{ value: 0 }];
                  self.circleTitle = [
                    {
                      text: "距离出科",
                      left: "center",
                      top: "35%",
                      textStyle: {
                        color: "#3D5166",
                        fontSize: 11,
                        fontWeight: "lighter",
                      },
                    },
                    {
                      left: "center",
                      top: "40%",
                      subtext: "-" + "天",
                      subtextStyle: {
                        color: "#2E445B",
                        fontSize: 18,
                        fontWeight: "700",
                      },
                    },
                  ];
                  self.circleColor = ["#F5F5F5"];
                }
                self.$nextTick(() => {
                  self.echartsInit();
                });
              } else {
                self.circleData = [{ value: 0 }];
                self.circleTitle = [
                  {
                    text: "暂无轮转",
                    left: "center",
                    top: "45%",
                    textStyle: {
                      color: "#3D5166",
                      fontSize: 14,
                      fontWeight: "lighter",
                    },
                  },
                ];
                self.circleColor = ["#F5F5F5"];
              }
            } else {
              self.noUserInfo = true;
            }
          }
        });
    },
  },
};
</script>

<style lang="scss">
.userInfoTraining {
  position: relative;
  height: 213px;
  background-color: #ffffff;
  .bgImg {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .indexPie {
    height: 150px;
    width: 150px;
    border-radius: 50%;
    left: calc(100% - 178px);
    z-index: 5;
    top: -10px;
  }
  .pieBg {
    height: 150px;
    width: 150px;
    border-radius: 50%;
    left: calc(100% - 178px);
    z-index: 5;
    top: -10px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: auto;
    .pieBgContent {
      background-color: #ffffff;
      height: 120px;
      width: 120px;
      border-radius: 50%;
    }
  }
  .info {
    background: #ffffff;
    border-radius: 12px;
    position: absolute;
    top: 24px;
    left: 14px;
    right: 14px;
    bottom: 26px;
    .lineTop {
      margin-top: 24px;
      margin-left: 16px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      .headBox {
        position: relative;
        width: 50px;
        height: 50px;
        img {
          width: 50px;
          height: 50px;
        }
        .headState {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 25px;
          height: 12px;
          background-image: linear-gradient(-54deg, #0076f5 1%, #67b1ff 100%);
          border-radius: 1.56px 0px 0px 0px;
          font-size: 1px;
          color: #ffffff;
          text-align: center;
          font-weight: 500;
        }
        .headState2 {
          position: absolute;
          right: 0;
          bottom: 0;
          height: 20px;
        }
      }
      .headTitle {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 50px;
        margin-left: 10px;
        .infoName {
          font-size: 18px;
          color: #111111;
          letter-spacing: 0.2px;
          font-weight: 500;
        }
        .infoPlan {
          font-size: 13px;
          color: #2f7dcd;
          letter-spacing: 0.15px;
          font-weight: 400;
          .arrow-right {
            height: 20px;
            width: 10px;
            display: inline-block;
            position: relative;
          }
          .arrow-right::after {
            content: "";
            height: 7px;
            width: 7px;
            top: 12px;
            border-width: 1px 1px 0 0;
            border-color: #2f7dcd;
            border-style: solid;
            transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            position: absolute;
          }
        }
      }
    }
    .UserInfo {
      height: 55px;
      margin-left: 16px;
      margin-bottom: 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .infoItem {
        display: flex;
        .itemTitle {
          font-size: 12px;
          color: #666666;
          letter-spacing: 0.15px;
          font-weight: 400;
        }
        .itemContent {
          font-size: 12px;
          color: #111111;
          letter-spacing: 0.15px;
          font-weight: 400;
        }
      }
    }
  }
}
.userInfoStudent {
      position: relative;
      height: 151px;
      background-color: #ffffff;
      .bgImg {
        position: absolute;
        height: 100%;
        width: 100%;
      }
    }
    
</style>
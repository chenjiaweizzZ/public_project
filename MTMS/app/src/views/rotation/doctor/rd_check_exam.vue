<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../../assets/images/icon_fanhui.png" />
        </a>
      </div>
      {{isCase == 1 ? deptname : "轮转手册"}}
    </c-header>
    <div class="g-main">
      <div v-for="(item, index) in caseList" :key="index" @click="toCaseList(item)" v-show="isCase == 2">
        <p class="left">
          <img src="../../../assets/images/singup.png" alt />
        </p>
        <div class="process-box">
          <div class="text-info">
            <div>{{item.diseaseName}}</div>
            <div>完成进度: {{item.finishRate}}%</div>
          </div>
          <cProgress :percentage="item.finishRate"></cProgress>
        </div>
        <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt />
      </div>

      <div v-if="isCase == 1" @click="zpTurnManual()">
        <p class="left">
          <img src="../../../assets/images/singup.png" alt />
          <span>轮转手册</span>
        </p>
        <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt />
      </div>
      <div v-if="isCase == 1 && !isdoctor" @click="zpDailyEva()">
        <p class="left">
          <img src="../../../assets/images/icon_richangpingjia.png" alt />
          <span>日常评价</span>
        </p>
        <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt />
      </div>
      <div v-if="isCase == 1 && isdoctor" @click="evaluate">
        <p class="left">
          <img src="../../../assets/images/icon_richangpingjia.png" alt />
          <span>日常评价</span>
        </p>
        <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt />
      </div>
      <div v-if="isCase == 1 && !isdoctor" @click="zpOutDepartmentResult()">
        <p class="left">
          <img src="../../../assets/images/icon_richangpingjia.png" alt />
          <span>出科小结</span>
        </p>
        <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt />
      </div>
      <div @click="graduateSummary" v-if="isCase == 1 && isdoctor">
        <p class="left">
          <img src="../../../assets/images/icon_richangpingjia.png" alt />
          <span>出科小结</span>
        </p>
        <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt />
      </div>
      <div @click="toexam" v-if="isCase == 1 && isdoctor && ckShow">
        <p class="left">
          <img src="../../../assets/images/singup.png" alt />
          <span>出科报名</span>
        </p>
        <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt />
      </div>
      <!-- <div v-if="isCase == 1" @click="graduateSummary">
        <p class="left">
          <img src="../../../assets/images/icon_richangpingjia.png" alt />
          <span>出科小结</span>
        </p>
        <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt />
      </div>-->
      <div @click="check" v-if="isCase == 1">
        <p class="left">
          <img src="../../../assets/images/icon_richangkaoke.png" alt />
          <span>月度考核查看</span>
        </p>
        <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt />
      </div>
      <div @click="ckexam" v-if="isCase == 1">
        <p class="left">
          <img src="../../../assets/images/examine.png" alt />
          <span>出科考核成绩</span>
        </p>
        <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt />
      </div>

      <div @click="toexamlist" v-if="isCase == 1">
        <p class="left">
          <img src="../../../assets/images/icon_Annualexamination.png" alt />
          <span>年度考核成绩</span>
        </p>
        <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt />
      </div>
      <div @click="activity" v-if="isCase == 1">
        <p class="left">
          <img src="../../../assets/images/icon-statistics.png" alt />
          <span>教学活动统计</span>
        </p>
        <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt />
      </div>
      <div @click="attendance" v-if="isCase == 1">
        <p class="left">
          <img src="../../../assets/images/icon-attendance.png" alt />
          <span>考勤统计</span>
        </p>
        <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt />
      </div>
      <div @click="upCase" v-if="isCase == 1">
        <p class="left">
          <img src="../../../assets/images/singup.png" alt />
          <span>病历上传</span>
        </p>
        <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt />
      </div>
      <div class="no-data" v-if="isCase == 3">
        <div>暂无</div>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from "jquery";
  import cHeader from "../../header";
  import methods from "../../../methods";
  import { mapState, mapActions } from "vuex";
  import cProgress from "@/components/progress";
  export default {
    name: "rotation_doctor_exam",
    components: {
      cHeader,
      cProgress
    },
    data() {
      return {
        stdid: "",
        deptname: "",
        id: "", //当前所在的轮转详情id
        type: "", //当前访问的角色
        currentType: "",
        isdoctor: true,
        // 病种列表
        caseList: [],
        // 是否可以添加病种
        isCase: 1,
        //1 初始页面 2只显示病种进度 3显示暂无
        validate: "",
        // 是否是学生
        isStu: "0",
        evaluateid: "",
        ckShow: true,
      };
    },
    computed: {
      ...mapState(["turninfo"])
    },
    created() {
      let self = this;
      self.currentType = this.$route.query.type
      self.checkIsCase();
      self.judgeCk()
      if (this.$route.query.id) {
        // 判断角色
        self.judgeRole().then(res => {
          self.init();
        });
      } else {
        self.deptname = this.turninfo.districtname;
      }
    },
    mounted() {
      let self = this;
      // 1.点击首页的进入按钮进入
      // 2.点击轮转计划的轮转中进入
      self.isdoctor = this.$route.query.type == 0 ? true : false; //是否是住院医
      self.id = this.$route.query.id;
      self.registerToNative("goBack", function (data) {
        self.back();
      });

      // 2019-06-26 将plandetailid, type 存入vuex turnInfo中
      this.setTurninfo({ k: "plandetailid", v: this.$route.query.id });
      this.setTurninfo({ k: "type", v: this.$route.query.type });
    },
    methods: {
      ...methods,
      ...mapActions(["setTurninfo", "setTurnManual"]),

      // 获取轮转手册数据
      upCase() {
        if (this.currentType != 0) {
          // 科秘书
          this.$router.push({
            name: "fdRotation_doctor_up_case",
            query: {
              businessid: this.$route.query.id
            }
          });
        } else {
          this.$router.push({
            name: "fdRotation_doctor_up_case_withbottom",
            query: {
              id: this.$route.query.id,
              type: this.$route.query.type,
              deptid: this.$route.query.deptid,
              teachingid: this.$route.query.teachingid
            }
          });
        }

      },
      getTurnManualData(turnId, deptId, stdId, phase) {
        // 信息存储
        this.setTurnManual({ k: "deptId", v: deptId });
        this.setTurnManual({ k: "stdId", v: stdId });
        this.setTurnManual({ k: "stage", v: phase });
        this.setTurnManual({ k: "turnId", v: turnId });

        this.post("/turnManual/queryTurnManualDiseaseDeptList", {
          command: "turnManual/queryTurnManualDiseaseDeptList",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          turnId: turnId,
          deptId: deptId,
          stdId: stdId,
          stage: phase,
          plandetailid: this.$route.query.id
        })
          .done(data => {
            if (data && data.errcode == 0) {
              data.result.map(
                item => (item.finishRate = parseInt(item.finishRate))
              );
              this.caseList = data.result;
              this.validate = data.validate;
            }
          })
          .fail(error => { });
      },

      // 获取基础数据
      init() {
        let self = this;
        self
          .post("/turn/getturndetailbyid", {
            command: "turn/getturndetailbyid",
            sessionid: $.cookie("sid"),
            loginid: $.cookie("uid"),
            plandetailid: this.$route.query.id
          })
          .done(function (data) {
            self.setTurninfo({
              k: "businessid",
              v: data.detailinfo.plandetailid
            });
            self.setTurninfo({ k: "districtname", v: data.detailinfo.deptname });
            self.setTurninfo({
              k: "deptname",
              v: data.detailinfo.turnofficename
            });
            self.setTurninfo({ k: "deptid", v: data.detailinfo.turnofficeid });
            self.setTurninfo({ k: "status", v: data.detailinfo.status });
            self.setTurninfo({ k: "teachingid", v: data.detailinfo.teachingid });
            self.deptname = data.detailinfo.deptname;
            self.stdid = data.detailinfo.stdid
            self.setTurnManual({ k: "turnTrainId", v: data.detailinfo.profId });
            // *** 轮转手册 phase为null 传0, 有值阶段数加一 ***
            let phase = data.detailinfo.phase
              ? parseInt(data.detailinfo.phase) + 1
              : 0;
            self.getTurnManualData(
              data.detailinfo.turnId,
              data.detailinfo.deptid,
              data.detailinfo.stdid,
              phase
            );
            self.evaluateid = data.detailinfo.stdid;
          });
      },
      judgeCk() {
        let self = this
        self.post('/commparaconf/queryCommparaConfList', {
          command: "commparaconf/queryCommparaConfList",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          paramcode: 'ck_settings',
          paramvalue: "8"
        }).then(data => {
          if (data && data.errcode == "0") {
            if (data.commparaConfList.length > 0) {
              self.ckShow = Number(data.commparaConfList[0].param1)
            }
          }
        })
      },
      /**
       * 2019-06-26
       * 判断进入的角色 学生和非学生
       * 病种详情跳转  两种情况  一种有子项  一种无子项 跳转路径不一样
       */

      // 判断角色
      judgeRole() {
        return new Promise((resolve, reject) => {
          this.post("/turnManual/validateStd", {
            command: "turnManual/validateStd",
            sessionid: $.cookie("sid"),
            loginid: $.cookie("uid"),
            uid: $.cookie("uid")
          })
            .done(data => {
              if (data && data.errcode == 0) {
                console.log(data);
                this.isStu = data.validateStd;
                resolve(data);
              }
            })
            .fail(error => {
              reject(data);
            });
        });
      },

      // 病种详情跳转
      toCaseList(item) {
        let self = this;
        this.setTurnManual({ k: "caseName", v: item.diseaseName });
        // 学生和非学生角色
        // 存储到localStorage中
        localStorage.setItem("caseDetail", JSON.stringify(item));
        // 无子项
        if (item.type == 0 && this.isStu == 0) {
          console.log(111);
          this.$router.push({
            // path: "/turnManual/detailList",
            name: 'caseDetailList',
            query: {
              id: item.turnManualId,
              type: item.type,
              validate: this.validate,
              baseId: item.baseId,
              user: self.$route.query.type,
              businessid: self.$route.query.id
            }
          });
        } else if (item.type == 1 && this.isStu == 0) {
          // 有子项
          console.log(222);
          this.$router.push({
            name: "caseInfoList",
            query: {
              id: item.turnManualId,
              type: item.type,
              validate: this.validate,
              user: self.$route.query.type,
              businessid: self.$route.query.id
            }
          });
        } else if (item.type == 1 && this.isStu == 1) {
          // 有子项 非学生角色
          console.log(333);
          this.$router.push({
            name: "caseInfoList",
            query: {
              id: item.turnManualId,
              type: item.type,
              isStu: this.isStu
            }
          });
        } else {
          // 无子项 非学生角色
          console.log(444);
          this.$router.push({
            name: "checkList",
            query: {
              id: item.turnManualId,
              type: item.type,
              isStu: this.isStu,
              baseId: item.baseId
            }
          });
        }
      },
      // 出科小结
      graduateSummary() {
        this.$router.push({
          name: "stuSummary",
          query: {
            role: 0, // 0学生 1老师 2科主任
            plandetailid: this.$route.query.id
          }
        });
      },
      // 日常考核查看
      check: function () {
        let self = this;
        this.$router.push({
          name: "fdRotation_doctor_exam_date",
          query: {
            booking: 0,
            type: self.$route.query.type,
            where: self.$route.query.where,
            id: self.$route.query.id,
            evaluateid: self.evaluateid
          }
        });
      },
      // 出科考核
      ckexam: function () {
        let self = this;
        this.$router.push({
          name: "fdRotation_doctor_ckresult",
          query: {
            type: self.$route.query.type,
            where: self.$route.query.where,
            id: self.$route.query.id,
            stdid: self.stdid
          }
        });
      },
      // 评价带教老师
      evaluate: function () {
        let self = this;
        if (self.$route.query.type == 0) {
          console.log(111);
          this.$router.push({
            name: "fdRotation_doctor_evaluate",
            query: {
              type: self.$route.query.type,
              id: self.$route.query.id,
              evaluateid: self.evaluateid,
              deptid: self.$route.query.deptid,
              teachingid: self.$route.query.teachingid
            }
          });
        } else {
          console.log(222);
          this.$router.push({
            name: "fdRotation_doctor_evaluate",
            query: {
              booking: 0,
              type: self.$route.query.type,
              id: self.$route.query.id,
              evaluateid: self.evaluateid
            }
          });
        }
      },
      toexam() {
        //出科报名
        let self = this;
        this.$router.push({
          name: "fdDoctorRegistration",
          query: {
            type: self.$route.query.type,
            id: self.$route.query.id
          }
        });
      },
      activity() {
        //教学活动统计
        let self = this;
        this.$router.push({
          name: "fdRotation_activity",
          query: {
            type: self.$route.query.type,
            id: self.$route.query.id
          }
        });
      },
      toexamlist() {
        //教学活动统计
        let self = this;
        this.$router.push({
          name: "fdRotation_examlist",
          query: {
            type: self.$route.query.type,
            id: self.$route.query.id
          }
        });
      },
      attendance() {
        //考勤统计
        let self = this;
        this.$router.push({
          name: "fdRotation_attendstatis",
          query: {
            type: self.$route.query.type,
            id: self.$route.query.id
          }
        });
      },
      zpTurnManual() {
        console.log("轮转手册");
        // let self = this;
        // this.$router.push({
        //   name: "fdRotation_doctor_turn_manual",
        //   query: {
        //     type: self.$route.query.type,
        //     id: self.$route.query.id
        //   }
        // });
        let self = this;
        if (self.caseList.length > 0) {
          self.isCase = 2;
        } else {
          self.isCase = 3;
        }
      },
      zpDailyEva() {
        console.log("日常评价");
        let self = this;
        this.$router.push({
          name: "fdRotation_doctor_daily_eva",
          query: {
            type: self.$route.query.type,
            id: self.$route.query.id,
            deptid: self.$route.query.deptid,
            teachingid: self.$route.query.teachingid
          }
        });
      },
      zpOutDepartmentResult() {
        console.log("出科小结");
        let self = this;
        this.$router.push({
          name: "fdRotation_doctor_out_department_result",
          query: {
            type: self.$route.query.type,
            id: self.$route.query.id
          }
        });
      },
      checkIsCase() {
        let self = this;
        if (self.$route.query.case) {
          if (self.$route.query.case == 2) {
            self.isCase = 2;
          }
        }
      },
      // back() {
      //   window.history.go(-1);
      // }
      back() {
        let self = this;
        if (self.isCase !== 1) {
          self.isCase = 1;

          return;
        }
        if (self.$route.query.type != 0) {
          this.$router.push({
            name: "fdRotation_doctor_plan",
            query: {
              type: self.$route.query.type,
              where: self.$route.query.where,
              id: self.$route.query.id
            }
          });
        } else {
          if ($.cookie("doctor_from") == 0) {
            this.$router.push({
              name: "fdRotation_doctor",
              query: {
                type: self.$route.query.type,
                id: self.$route.query.id
              }
            });
          } else if ($.cookie("doctor_from") == 1) {
            console.log(111)
            this.$router.push({
              name: "fdRotation_doctor_plan",
              query: {
                type: self.$route.query.type,
                id: self.$route.query.id
              }
            });
          }
        }
      }
    }
  };
</script>
<style scoped lang="scss">
  .g-main {
    font-size: 0.24rem;
    background: #f8f7f9 !important;
    color: rgb(100, 100, 100);
    .no-data {
      height: 80%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
    }
  }

  .g-main>div {
    width: 100%;
    background: white;
    /*border-bottom: solid 1px rgb(230,230,230);*/
    /*height: 1rem;*/
    /*line-height: 1rem;*/
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.1rem 0.3rem;
    margin-top: 0.1rem;
  }

  .left {
    margin: 0;
    /*color: #333333;*/
    /*font-size: .3rem;*/
    display: flex;
    align-items: center;
  }

  .left img {
    width: 0.66rem;
    height: 0.66rem;
    margin-right: 0.2rem;
  }

  .right {
    width: 0.2rem;
    height: 0.2rem;
  }

  .g-main>div:nth-of-type(2) {
    border: none;
  }

  .process-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .process-box .progress {
    background: #fff;
    border: 1px solid rgb(204, 200, 200);
    box-sizing: border-box;
  }

  .text-info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.1rem;
  }

  .process-box /deep/ .progress-text {
    color: transparent;
  }
</style>
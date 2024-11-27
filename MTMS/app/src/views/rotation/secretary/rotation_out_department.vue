<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../../assets/images/icon_fanhui.png" />
        </a>
      </div>
      <div class="deptname">出科鉴定</div>
      <!--护培轮转-->
    </c-header>
    <div class="list-box">
      <div class="daily-eva" v-if="evaShow">
        <div class="rd-daily-title">日常评价</div>
        <div class="rd-daily-list" v-for="(item, index) in evaList" :key="index">
          <div class="eva-date">{{ item.evaluateDate }}</div>
          <div class="eva-item" v-if="item.evaluate1 == true || item.evaluate1 == false">
            <div class="eva-obj">护培生评价带教</div>
            <div class="eva-result-true" v-if="item.evaluate1 == true">已完成</div>
            <div class="eva-result-false" v-else>未完成</div>
          </div>
          <div class="eva-item" v-if="item.evaluate2 == true || item.evaluate2 == false">
            <div class="eva-obj">护培生评价科室</div>
            <div class="eva-result-true" v-if="item.evaluate2 == true">已完成</div>
            <div class="eva-result-false" v-else>未完成</div>
          </div>
          <div class="eva-item" v-if="item.evaluate3 == true || item.evaluate3 == false">
            <div class="eva-obj">带教评价护培生</div>
            <div class="eva-result-true" v-if="item.evaluate3 == true">已完成</div>
            <div class="eva-result-false" v-else>未完成</div>
          </div>
          <div class="eva-item" v-if="item.evaluate4 == true || item.evaluate4 == false">
            <div class="eva-obj">护士长评价护培生</div>
            <div class="eva-result-true" v-if="item.evaluate4 == true">已完成</div>
            <div class="eva-result-false" v-else>未完成</div>
          </div>
        </div>
      </div>
      <div class="act" v-if="actShow">
        <div class="act-title">教学活动</div>
        <div class="act-content">
          <div class="act-content-left">教学活动</div>
          <div class="act-content-right">{{ actTime2 }}次</div>
        </div>
        <div class="act-tips">
          <div class="act-tip-left">要求: {{ actTime1 }}次</div>
          <div class="act-tip-right"></div>
        </div>
      </div>
      <div class="act" v-if="type == 2">
        <div class="act-title">出科考核</div>
        <div class="act-content">
          <div class="act-content-left">技能考核</div>
          <div class="ck-content-right-true" v-if="ckResult.skillScoreStatus == 1">未录入</div>
          <div class="ck-content-right-true" v-else-if="ckResult.skillScoreStatus == 2">{{ ckResult.skillScore }}分&nbsp;合格</div>
          <div class="ck-content-right-false" v-else-if="ckResult.skillScoreStatus == 3">{{ ckResult.skillScore }}分&nbsp;不合格</div>
        </div>
        <div class="ck-tips">
          <div class="act-tip-left">要求: {{ ckResult.proportionInfo.passSkillScore }}分及以上</div>
          <div class="act-tip-right"></div>
        </div>
         <div class="act-content">
          <div class="act-content-left">理论考核</div>
          <div class="ck-content-right-true" v-if="ckResult.theoryScoreStatus == 1">未录入</div>
          <div class="ck-content-right-true" v-else-if="ckResult.theoryScoreStatus == 2">{{ ckResult.theoryScore }}分&nbsp;合格</div>
          <div class="ck-content-right-false" v-else-if="ckResult.theoryScoreStatus == 3">{{ ckResult.theoryScore }}分&nbsp;不合格</div>
        </div>
        <div class="ck-tips">
          <div class="act-tip-left">要求: {{ ckResult.proportionInfo.passTheoryScore }}分及以上</div>
          <div class="act-tip-right"></div>
        </div>
        <div class="act-content">
          <div class="act-content-left">综合考核</div>
          <div class="ck-content-right-true" v-if="ckResult.compreScoreStatus == 1">未录入</div>
          <div class="ck-content-right-true" v-else-if="ckResult.compreScoreStatus == 2">{{ ckResult.compreScore }}分&nbsp;合格</div>
          <div class="ck-content-right-false" v-else-if="ckResult.compreScoreStatus == 3">{{ ckResult.compreScore }}分&nbsp;不合格</div>
        </div>
        <div class="ck-tips">
          <div class="act-tip-left">要求: {{ ckResult.proportionInfo.passCompreScore}}分及以上</div>
          <div class="act-tip-right"></div>
        </div>
        <div class="act-content">
          <div class="act-content-left">病历书写</div>
          <div class="ck-content-right-true" v-if="ckResult.bigCaseeScoreStatus == 1">未录入</div>
          <div class="ck-content-right-true" v-else-if="ckResult.bigCaseScoreStatus == 2">{{ ckResult.bigCaseScore }}分&nbsp;合格</div>
          <div class="ck-content-right-false" v-else-if="ckResult.bigCaseScoreStatus == 3">{{ ckResult.bigCaseScore }}分&nbsp;不合格</div>
        </div>
        <div class="ck-tips">
          <div class="act-tip-left">要求: {{ ckResult.proportionInfo.passBigCaseScore}}分及以上</div>
          <div class="act-tip-right"></div>
        </div>
      </div>
      <div class="act" v-if="type == 1">
        <div class="act-title">出科考核</div>
        <div class="act-content">
          <div class="act-content-left">技能考核</div>
          <div class="ck-content-right-true">{{ ckResult.skillScore | examScore}}</div>
          
        </div>
        <div class="ck-tips">
          <div class="act-tip-left">成绩占比: {{ ckResult.proportionInfo.theoryScoreProportion | percentage }}</div>
          <div class="act-tip-right"></div>
        </div>
         <div class="act-content">
          <div class="act-content-left">理论考核</div>
          <div class="ck-content-right-true">{{ ckResult.theoryScore | examScore}}</div>
          
        </div>
        <div class="ck-tips">
          <div class="act-tip-left">成绩占比: {{ ckResult.proportionInfo.skillScoreProportion | percentage  }}</div>
          <div class="act-tip-right"></div>
        </div>
        <div class="act-content">
          <div class="act-content-left">综合考核</div>
          <div class="ck-content-right-true">{{ ckResult.compreScore | examScore}}</div>
          
        </div>
        <div class="ck-tips">
          <div class="act-tip-left">成绩占比: {{ ckResult.proportionInfo.compreScoreProportion | percentage  }}</div>
          <div class="act-tip-right"></div>
        </div>
        <div class="act-content">
          <div class="act-content-left">病历书写</div>
          <div class="ck-content-right-true">{{ ckResult.bigCaseScore | examScore }}</div>
        </div>
        <div class="ck-tips">
          <div class="act-tip-left">成绩占比: {{ ckResult.proportionInfo.bigCaseScoreProportion | percentage  }}</div>
          <div class="act-tip-right"></div>
        </div>
        <div class="act-content">
          <div class="act-content-left">总分</div>
          <div class="ck-content-right-true" v-if="ckResult.proportionScoreStatus == 1">未录入</div>
          <div class="ck-content-right-true" v-else-if="ckResult.proportionScoreStatus == 2">{{ ckResult.scoreSum | examScore}}&nbsp;合格</div>
          <div class="ck-content-right-false" v-else-if="ckResult.proportionScoreStatus == 3">{{ ckResult.scoreSum | examScore}}&nbsp;不合格</div>
        </div>
        <div class="ck-tips">
          <div class="act-tip-left">合格分: {{ ckResult.proportionInfo.passScore }}分及以上</div>
          <div class="act-tip-right"></div>
        </div>
      </div>
      <!-- <div class="noData" v-if="!evaShow && !actShow">
        <div>
          <img src="../../../assets/images/noddata.png" alt />
          <div class="noDataTip">无出科要求</div>
        </div>
      </div> -->
      <div class="nod"></div>
    </div>
    <div class="outBtn">
      <!-- <van-button type="info" size="large" @click="timeShow = true">确认出科</van-button> -->
      <van-button type="info" size="large" @click="outDepartment()">确认出科</van-button>
    </div>
    <van-dialog id="van-dialog" show-cancel-button />

    <van-popup v-model="timeShow" position="bottom">
        <div style="width: 100%;">
            <div style="display: flex;justify-content: space-between;align-items: center;margin: 10px 0;">
                <button type="button" class="van-picker__cancel" @click="timeShow=false">取消</button>
                <div class="van-picker__title" style="font-weight: bold;">
                {{"确认对"+$route.query.name+" "+$route.query.base+" "+$route.query.time +")进行出科操作吗?" }}</div>
                <button type="button" class="van-picker__confirm" @click="outDepartment">确认</button>
            </div>
            <p style="text-align: center;margin: 5px 0;color: #898989 !important;font-size: 15px;">请选择实际出科时间 </p>
         </div>
        <van-datetime-picker
            v-model="realEndTime" 
            type="date"  :formatter="formatter" :show-toolbar="false"
            :min-date="minDate"
            :max-date="maxDate"
        >
        </van-datetime-picker>
    </van-popup>
  </div>
</template>
<script>
  import Vue from "vue";
  import $ from "jquery";
  import { Field } from "vant";
  import cHeader from "../../header";
  import methods from "../../../methods";
  import cTab from "../../../components/tab";
  import { mapState, mapActions } from "vuex";
  import cTabs from "../../../components/tabs";
  import rotationReady from "./rotation_ready";
  import rotationWating from "./rotation_wating";
  import rotationNotturn from "./rotation_notturn";
  import rotationAlready from "./rotation_already";
  import cPicker from "../../../components/default-picker";
  import moment from "moment";
  let bus = new Vue();

  export default {
    name: "rotation_admin",
    components: {
      cTab,
      cTabs,
      rotationReady,
      rotationWating,
      rotationNotturn,
      rotationAlready,
      cPicker,
      cHeader,
      methods
    },
    data() {
      return {
        ckResult: {},
        type: 0,
        evaShow: true,
        actShow: true,
        evaList: [],
        actTime1: 1,
        actTime2: 0,
        checkObj: {
          skill: {
            line: "",
            point: 0,
            isPass: "",
            sw: 0
          },
          theory: {
            line: "",
            point: 0,
            isPass: "",
            sw: 0
          },
          syn: {
            line: "",
            point: 0,
            isPass: "",
            sw: 0
          },
          case: {
            line: "",
            point: 0,
            isPass: "",
            sw: 0
          }
        },
        timeShow:false,
        realEndTime:new Date(),//入科时间
        maxDate:new Date(),
        minDate:new Date(1990, 0, 1),
        formatter(type, val) {
          if (type === 'year') {
            return val + '年';
          }
          if (type === 'month') {
            return val + '月';
          }
          if (type === 'day') {
            return val + '日';
          }
          return val;
        },

      };
    },
    created() {
      let self = this;
      self.getEvaList();
      self.getActTimes1();
      self.getActTimes2();
      // self.getCkList();
      self.getCkLine();
      self.registerToNative("goBack", function (data) {
        self.back();
      });
    },
    //  computed: {
    //     bactive: function(){
    //         return this.type - 1;
    //     }
    // },
    filters: {
    flag: function(value) {
      if (value == 0) {
        return "";
      } else if (value == 1) {
        return "补考";
      } else if (value == 2) {
        return "已补考报名";
      }
    },
    score: function(value) {
      if (value < 0) {
        return "缺考";
      } else if (value === 0 || value == "0" || value) {
        return value;
      } else if (value === "" || value === null) {
        return "";
      }
    },
    percentage: function(value) {
      return (value * 100).toFixed(0) + '%'
    },
    examScore: function(value) {
      if(value) {
        return value + "分"
      }else {
        ""
      }
    }
  },
    mounted() {
      let self = this;
      console.log(self.checkObj);
    },
    methods: {
      ...methods,
      ...mapActions([
        "showAlert",
        "showConfirm",
        "showLoading",
        "hideLoading",
        "toast",
        "setTurninfo"
      ]),
      // outDepartment(){
      //   let self = this
      //   let params = {
      //     command: "turn/updateturnstatus",
      //     sessionid: $.cookie("sid"),
      //     loginid: $.cookie("uid"),
      //     uid: self.$route.query.uid,
      //     tpdid: self.$route.query.tpdid,
      //     num: self.$route.query.num,
      //     turnstatus: 3,
      //     realEndTime:moment(this.realEndTime).format("YYYY-MM-DD")
      //   };
      //   self
      //     .post("/turn/updateturnstatus", params)
      //     .done(function (data) {
      //       if (data && data.errcode == 0) {
      //         self.toast("出科成功");
      //         self.back();
      //       } else if (data && data.error == "4005") {
      //         self.toast("该护培生未分配带教老师,不能出科!");
      //       } else {
      //         self.toast(data.errdesc);
      //       }
      //     })
      //     .fail(function (error) {
      //       self.toast("出科失败");
      //     });
      // },
      outDepartment() {
        let self = this;
        // let name = self.$route.query.name;
        // let base = self.$route.query.base;
        // let time = self.$route.query.time;
        this.$dialog
          .confirm({
            // message: "确认对${name}(${base}${time})进行出科操作吗"
            confirmButtonColor: '#1989fa',
            message:
              "确认对" +
              self.$route.query.name +
              "(&nbsp;" +
              self.$route.query.base +
              "(&nbsp;" +
              self.$route.query.time +
              ")进行出科操作吗?"
              
          })
          .then(() => {
            let params = {
              command: "turn/updateturnstatus",
              sessionid: $.cookie("sid"),
              loginid: $.cookie("uid"),
              uid: self.$route.query.uid,
              tpdid: self.$route.query.tpdid,
              num: self.$route.query.num,
              turnstatus: 3
            };
            self
              .post("/turn/updateturnstatus", params)
              .done(function (data) {
                if (data && data.errcode == 0) {
                  self.toast("出科成功");
                  self.back();
                } else if (data && data.error == "4005") {
                  self.toast("该住院医未分配带教老师,不能出科!");
                } else {
                  self.toast("出科失败");
                }
              })
              .fail(function (error) {
                self.toast("出科失败");
              });
          })
          .catch(() => {
            // on cancel
          });
      },
      getEvaList() {
        let self = this;
        let params = {
          command: "turn/queryDailyEvaluates",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          businessid: self.$route.query.businessid,
          filter: "1"
        };
        self
          .post("/turn/queryDailyEvaluates", params)
          .done(function (data) {
            if (Object.keys(data.turnDailyEvaluates[0]).length > 1) {
              self.evaShow = true;
            } else {
              self.evaShow = false;
            }
            self.evaList = data.turnDailyEvaluates;
          })
          .fail(function (error) {
            console.log("fail", error);
          });
      },
      getActTimes1() {
        let self = this;
        let params = {
          command: "commparaconf/queryCommparaConfList",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          paramcode: "ck_settings",
          paramvalue: "4"
        };
        self
          .post("/commparaconf/queryCommparaConfList", params)
          .done(function (data) {
            if (Number(data.commparaConfList[0].param1) == 0) {
              self.actShow = false;
            }
            self.actTime1 = data.commparaConfList[0].param2;
          })
          .fail(function (error) {
            console.log("fail", error);
          });
      },
      getActTimes2() {
        let self = this;
        let params = {
          command: "studentFile/teacherActionStatistics",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          turnPlanDetailId: self.$route.query.businessid
        };
        self
          .post("/studentFile/teacherActionStatistics", params)
          .done(function (data) {
            self.actTime2 = data.teacherAction;
          })
          .fail(function (error) {
            console.log("fail", error);
          });
      },
      getCkList() {
        let self = this;
        // let params = {
        //   command: "turnscore/querystuturnscore",
        //   sessionid: $.cookie("sid"),
        //   loginid: $.cookie("uid"),
        //   deptid: self.$route.query.deptid || "133557",
        //   businessid: self.$route.query.businessid,
        //   uid: self.$route.query.uid || 1
        // };
        // self
        //   .post("/turnscore/querystuturnscore", params)
        //   .done(function (data) {
        //     if (data.stuturnscorelist[0]) {
        //       self.checkObj.skill.point = Number(
        //         data.stuturnscorelist[0].skillscore
        //       );
        //       self.checkObj.theory.point = Number(
        //         data.stuturnscorelist[0].theoryscore
        //       );
        //       self.checkObj.syn.point = Number(
        //         data.stuturnscorelist[0].comprescore
        //       );
        //       self.checkObj.case.point = Number(
        //         data.stuturnscorelist[0].bigCaseScore
        //       );
        //     } else {
        //       self.checkObj.skill.point = 0;
        //       self.checkObj.theory.point = 0;
        //       self.checkObj.syn.point = 0;
        //       self.checkObj.case.point = 0;
        //     }
        //     self.isPass(self.checkObj.skill);
        //     self.isPass(self.checkObj.theory);
        //     self.isPass(self.checkObj.syn);
        //     self.isPass(self.checkObj.case);
        //   })
        //   .fail(function (error) {
        //     console.log("fail", error);
        //   });
        self
        .get(`/base/turnScore/getPlanScore/${self.$route.query.businessid}`)
        .done(res => {
          if (res.resCode == 200) {
            self.ckResult = res.model;
            self.type = res.model.type;
          }
        });
      },
      getCkLine() {
        let self = this;
        let params = {
          command: "commparaconf/queryCommparaConfList",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          paramcode: "ck_settings",
          paramvalue: "5"
        };
        self
          .post("/commparaconf/queryCommparaConfList", params)
          .done(function (data) {
            self.checkObj.skill.line = Number(data.commparaConfList[0].param2);
            self.checkObj.theory.line = Number(data.commparaConfList[0].param4);
            self.checkObj.syn.line = Number(data.commparaConfList[0].param6);
            self.checkObj.case.line = Number(data.commparaConfList[0].param8);
            self.checkObj.skill.sw = Number(data.commparaConfList[0].param1);
            self.checkObj.theory.sw = Number(data.commparaConfList[0].param3);
            self.checkObj.syn.sw = Number(data.commparaConfList[0].param5);
            self.checkObj.case.sw = Number(data.commparaConfList[0].param7);
            self.getCkList();
          })
          .fail(function (error) {
            console.log("fail", error);
          });
      },
      isPass(obj) {
        if (
          Number(obj.point) > Number(obj.line) ||
          Number(obj.point) == Number(obj.line)
        ) {
          obj.isPass = true;
        } else {
          obj.isPass = false;
        }
      },
      back() {
        window.history.go(-1);
      }

      // 是否配置自动出科

      // 是否配置自动未轮转
    }
  };
</script>
<style lang="scss">
  .iptBox {
    .van-field {
      .van-field__label {
        display: none !important;
      }
      .van-field__body {
        border: 1px solid #cccccc !important;
        border-radius: 3px !important;
      }
    }
  }

  .btnRow {
    .van-button {
      margin-left: 5px;
    }
    .van-button--default {
      border: 1px solid #797979 !important;
      border-radius: 3px;
    }
  }

  .van-dialog {
    .van-dialog__message {
      font-size: 15px;
    }
  }
</style>
<style scoped lang="scss">
  .outBtn {
    width: 100%;
    position: fixed;
    bottom: 0px;
    background: #ffffff;
  }

  .ck-check {
    margin-top: 8px;
    background-color: #ffffff;
    .ck-title {
      border-bottom: 0.5px solid #e2e2e2;
      height: 53px;
      line-height: 53px;
      background-color: #ffffff;
      padding-left: 14px;
      color: #111111;
      font-size: 18px;
      font-weight: 500;
      display: flex;
    }
  }

  .act {
    margin-top: 8px;
    background-color: #ffffff;
    .act-title {
      border-bottom: 0.5px solid #e2e2e2;
      height: 53px;
      line-height: 53px;
      background-color: #ffffff;
      padding-left: 14px;
      color: #111111;
      font-size: 18px;
      font-weight: 500;
      display: flex;
    }
    .act-content {
      display: flex;
      height: 37px;

      .act-content-left {
        flex: 6;
        line-height: 53px;
        font-size: 15px;
        border-right: 0.5px solid #e2e2e2;
        padding-left: 14px;
        color: #111111;
      }
      .act-content-right {
        flex: 4;
        line-height: 53px;
        font-size: 15px;
        padding-left: 14px;
        color: #111111;
      }
      .ck-content-right-true {
        flex: 4;
        line-height: 53px;
        font-size: 15px;
        padding-left: 14px;
        color: #111111;
      }
      .ck-content-right-false {
        flex: 4;
        line-height: 53px;
        font-size: 15px;
        padding-left: 14px;
        color: #ec5926;
      }
    }
    .act-tips {
      height: 33px;
      display: flex;
      .act-tip-left {
        line-height: 17px;
        flex: 6;
        border-right: 0.5px solid #e2e2e2;
        padding-left: 14px;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0.16px;
      }
      .act-tip-right {
        line-height: 17px;
        flex: 4;
        padding-left: 14px;
      }
    }
    .ck-tips {
      height: 33px;
      display: flex;
      border-bottom: 0.5px solid #e2e2e2;
      .act-tip-left {
        line-height: 17px;
        flex: 6;
        border-right: 0.5px solid #e2e2e2;
        padding-left: 14px;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0.16px;
      }
      .act-tip-right {
        line-height: 17px;
        flex: 4;
        padding-left: 14px;
      }
    }
  }

  .rd-daily-title {
    height: 53px;
    line-height: 53px;
    background-color: #ffffff;
    padding-left: 14px;
    color: #111111;
    font-size: 18px;
    font-weight: 500;
    display: flex;
  }

  .rd-daily-list {
    .eva-date {
      display: flex;
      // line-height: 2;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      color: #666666;
      letter-spacing: 0.16px;
      font-weight: 400;
      background-color: linear-gradient(270deg, #ffffff 0%, #fafafa 76%);
      padding-left: 14px;
      // padding: 8px 0px 8px 14px;
    }
    .eva-item {
      height: 53px;
      line-height: 53px;
      display: flex;
      background-color: #ffffff;
      // line-height: 3;
      font-size: 15px;
      color: #111111;
      letter-spacing: 0;
      font-weight: 500;
      border-bottom: 0.5px solid #e2e2e2;
      // padding: 16px 0px 16px 14px;
      .eva-obj {
        line-height: 53px;
        flex: 6;
        border-right: 0.5px solid #e2e2e2;
        padding-left: 14px;
        font-size: 15px;
        color: #111111;
        letter-spacing: 0;
        font-weight: 500;
      }
      .eva-result-true {
        line-height: 53px;
        flex: 4;
        font-size: 15px;
        color: #111111;
        letter-spacing: 0;
        font-weight: 400;
        padding-left: 14px;
      }
      .eva-result-false {
        line-height: 53px;
        flex: 4;
        font-size: 15px;
        color: #ec5926;
        letter-spacing: 0;
        font-weight: 500;
        padding-left: 14px;
      }
    }
    .eva-item-buttom {
      border-bottom: none;
    }
  }

  .looktable {
    font-size: 0.3rem;
    margin-top: 0.1rem;
  }

  .deptname {
    width: 50%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 0.36rem !important;
    img {
      width: 0.28rem;
    }
  }

  .van-dialog {
    .ttitle {
      margin: 10px 0px 0px 15px;
    }

    .btnRow {
      display: flex;
      justify-content: flex-end;
      margin: 0px 15px 10px;
    }
  }

  .unchecked {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ul.c-content {
    margin: 0.1rem 0;
    li.title {
      padding-left: 0.2rem;
      height: 0.6rem;
      line-height: 0.6rem;
    }
    >li {
      background: #fff;
      color: #666;
      font-size: 0.22rem;
      border-bottom: 1px solid #eee;

      div.title {
        background: rgba(242, 242, 242, 1);
      }
      div {
        height: 0.6rem;
        span {
          text-align: center;
          font-size: 0.24rem;
          line-height: 0.6rem;
        }
        span:nth-child(4) {
          flex: 0.5;
        }
        span.cancle {
          color: rgb(52, 153, 219);
        }
      }
      div {
        display: flex;
        position: relative;
      }
      span {
        flex: 1;
        width: 0;
      }
    }
    .out-department-scores {
      .operation {
        color: #3499db;
      }
    }
  }

  .noData {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    width: 100%;
    img {
      width: 100%;
    }
    .noDataTip {
      font-size: 17px;
      color: #868e97;
      text-align: center;
      font-weight: 400;
    }
  }

  .list-box {
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
  }

  .nod {
    height: 50px;
  }
  /deep/.van-picker__toolbar{
        margin: 10px 0 !important;
        height: auto !important;
  }
</style>
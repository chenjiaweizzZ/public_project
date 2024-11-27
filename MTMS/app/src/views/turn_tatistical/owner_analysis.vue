<template>
  <div class="g-wrapper">
    <!--筛选条件-->
    <ul class="select">
      <!-- <li
        class="open-deptlist"
        :class="{'active': k == 0 , 'onopen':baseconfig.show }"
        @click="k = 0 ; baseconfig.show = true"
      >科室</li>-->
      <li
        class="open-deptlist"
        :class="{'active': k == 1 }"
        @click="k = 1 , monthconfig.show = true"
      >日期</li>
      <li :class="{'active': k == 2 }" @click="k = 2 , normal()">默认</li>
    </ul>
    <div class="g-main">
      <!--科室评分 && 带教评分-->
      <div v-if="code == 0 || code == 1">
        <div class="echarts-content">
          <div id="echarts-rate"></div>
        </div>
      </div>
      <div v-if="code == 2">
        <div class="echarts-content">
          <div id="echarts-rate-plan"></div>
        </div>
      </div>
      <div v-if="code == 3">
        <div class="echarts-content-plan">
          <div id="echarts-trends"></div>
          <div id="echarts-rates"></div>
        </div>
      </div>
      <div v-show="code !== 3" class="tatistical">
        <div class="tatistical-improve">
          <p>
            <span>需要改进的地方（评分3分以下）</span>
            <span class="show-icon"></span>
          </p>
          <ul>
            <li v-for="(item,index) in improvelist">{{index + 1}}.{{item}}</li>
            <li v-show="improvelist.length == 0" style="text-align: center">当前月暂无内容</li>
          </ul>
        </div>
        <div class="tatistical-advice">
          <p>学员建议</p>
          <ul>
            <li v-for="(item,index) in advicelist">{{index + 1}}.{{item}}</li>
            <li v-show="advicelist.length == 0" style="text-align: center">当前月暂无内容</li>
          </ul>
        </div>
      </div>
      <!--选择科室-->
      <select-group :config="baseconfig" :data-list="basetree" @confirm="baseselect"></select-group>
      <!--选择要看的月份-->
      <c-timepicker :config="monthconfig" @confirm="timeselect" :year="year" :month="month"></c-timepicker>
    </div>
  </div>
</template>
<script>
import methods from "../../methods";
import { mapState, mapActions } from "vuex";
import cTimepicker from "../../components/timepicker";
import selectGroup from "../../components/select-group";
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/line";
export default {
  props: ["code"],
  data() {
    return {
      dept: "",
      deptList: [],
      k: null,
      improvelist: "",
      advicelist: "",
      selecttime: "",
      currentmonth: "",
      trendSelect: "签到率",
      rateOpinion: [],
      rateOpinionData: [],
      lineXdata: [],
      linedata: [],
      attendancelist: "",
      monthconfig: {
        show: false,
        istime: false,
        custom: true
      },
      year: [2023],
      month: [1, 12],
      baseconfig: {
        show: false,
        label: "deptname",
        fixedvalue: "1.52rem",
        textposition: "center"
      },
      basetree: [],
      normalId: "",
      hospital: "哈医大附四院"
    };
  },
  components: {
    cTimepicker,
    selectGroup
  },
  watch: {
    code: function(val, oldval) {
      let self = this;
      if ((val || val == 0) && val !== oldval) {
        self.normalmonth();
        if (this.tatistcal.systype == 1) {
          if (val === 0 || val === "0") {
            self.initOffice(5);
            self.initTeachingImprove(5);
            self.initTeachingAdvance(5);
          } else if (val == 1) {
            self.initTeaching(1);
            self.initTeachingImprove(1);
            self.initTeachingAdvance(1);
          } else if (val == 2) {
            self.initActionplan();
            this.initTeachingImprove(6);
            this.initTeachingAdvance(6);
          } else if (val == 3) {
            self.initAttendanceRate();
            self.initAttendanceTrend();
          }
        } else {
          if (val === 0 || val === "0") {
            if (this.$route.query.menutype == 1) {
              self.initOffice(18);
              self.initTeachingImprove(18);
              self.initTeachingAdvance(18);
            } else {
              self.initOffice(8);
              self.initTeachingImprove(8);
              self.initTeachingAdvance(8);
            }
          } else if (val == 1) {
            if (this.$route.query.menutype == 1) {
              self.initTeaching(18);
              self.initTeachingImprove(18);
              self.initTeachingAdvance(18);
            } else {
              self.initTeaching(8);
              self.initTeachingImprove(8);
              self.initTeachingAdvance(8);
            }
          } else if (val == 2) {
            self.initActionplan();
            this.initTeachingImprove(6);
            this.initTeachingAdvance(6);
          } else if (val == 3) {
            self.initAttendanceRate();
            self.initAttendanceTrend();
          }
        }
      }
    },
    "tatistcal.dept": function(val, oldval) {
      if (val !== oldval) {
        if (this.tatistcal.systype == 1) {
          if (this.code === 0 || this.code === "0") {
            this.initOffice(5);
            this.initTeachingImprove(5);
            this.initTeachingAdvance(5);
          } else if (this.code == 1) {
            this.initTeaching(1);
            this.initTeachingImprove(1);
            this.initTeachingAdvance(1);
          } else if (this.code == 2) {
            this.initActionplan();
            this.initTeachingImprove(6);
            this.initTeachingAdvance(6);
          } else if (this.code == 3) {
            this.initAttendanceRate();
            this.initAttendanceTrend();
          }
        } else {
          if (this.code === 0 || this.code === "0") {
            if (this.$route.query.menutype == 1) {
              this.initOffice(18);
              this.initTeachingImprove(18);
              this.initTeachingAdvance(18);
            } else {
              this.initOffice(8);
              this.initTeachingImprove(8);
              this.initTeachingAdvance(8);
            }
          } else if (this.code == 1) {
            this.initTeaching(1);
            if (this.$route.query.menutype == 1) {
              this.initTeachingImprove(18);
              this.initTeachingAdvance(18);
            } else {
              this.initTeachingImprove(8);
              this.initTeachingAdvance(8);
            }
          } else if (this.code == 2) {
            this.initActionplan();
            this.initTeachingImprove(6);
            this.initTeachingAdvance(6);
          } else if (this.code == 3) {
            this.initAttendanceRate();
            this.initAttendanceTrend();
          }
        }
      }
    }
  },
  filters: {},
  computed: {
    ...mapState(["tatistcal"])
  },
  created() {
    this.dept = this.tatistcal.dept;
    this.deptname = this.tatistcal.deptname;
    this.role = this.tatistcal.role;
    this.normalmonth();
    this.initrole();
  },
  mounted() {
    this.tatistcal.systype = Number(this.$route.query.systype);
    if (this.tatistcal.systype == 1) {
      this.initOffice(5);
      this.initTeachingImprove(5);
      this.initTeachingAdvance(5);
    } else {
      if (this.$route.query.menutype == 1) {
        this.initTeaching(18);
        this.initTeachingImprove(18);
        this.initTeachingAdvance(18);
      } else {
        this.initTeaching(8);
        this.initTeachingImprove(8);
        this.initTeachingAdvance(8);
      }
    }
  },
  methods: {
    ...methods,
    ...mapActions([
      "showAlert",
      "showConfirm",
      "showLoading",
      "hideLoading",
      "toast",
      "setTatistical"
    ]),
    //重置为当前月
    normalmonth() {
      let nowyear = new Date().getFullYear() + 20;
      let _month = new Date().getMonth() + 1;
      let month = _month < 10 ? "0" + _month : _month;
      this.year.push(nowyear);
      //                if(nowyear > 2018){
      //                    this.yearconfig.mainlist.push(nowyear)
      //                }
      this.selecttime = new Date().getFullYear() + "-" + month;
      this.currentmonth = new Date().getFullYear() + "-" + month;
    },
    //            initbaselist(){//获取科室列表
    //                let self = this;
    //                this.post('/actionplanbase/getalldeptastree',{
    //                    command: 'actionplanbase/getalldeptastree',
    //                    sessionid:$.cookie('sid'),
    //                    loginid:$.cookie('uid'),
    //                }).done((data)=>{
    //                    if(data&&data.errcode ==0){
    //                        self.basetree = data.depttree;
    //                    }else if(data.errdesc){
    //                        self.toast(data.errdesc)
    //                    }else {
    //                        self.toast('服务器错误，请联系管理员。')
    //                    }
    //                })
    //            },
    initrole() {
      let self = this;
      this.post("/turnbaseinfo/querydeptnodebyuid", {
        command: "turnbaseinfo/querydeptnodebyuid",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid")
      }).done(res => {
        if (res && res.errcode) {
          if (res.errcode == 0) {
            if (!this.dept) {
              self.deptname = res.depttreelist[0].deptname;
              self.dept = res.depttreelist[0].id;
              self.normalId = res.depttreelist[0].id;
              self.setTatistical({ k: "dept", v: res.depttreelist[0].id });
              self.setTatistical({ k: "deptname", v: self.deptname });
            }
            if (res.depttreelist[0].deptcode !== "hospital") {
              let _arr = [];
              _arr.push(res.depttreelist[0]);
              self.basetree = {
                id: 99,
                pid: 0,
                deptname: self.hospital,
                deptlevel: null,
                deptcode: "hospital",
                childlist: _arr
              };
            } else {
              self.basetree = res.depttreelist[0];
            }
            if (this.role !== 0 && this.role !== 1) {
              if (res.depttreelist[0].deptcode == "office") {
                self.role = 0;
                self.setTatistical({ k: "role", v: self.role });
              } else {
                self.role = 1;
                self.setTatistical({ k: "role", v: self.role });
              }
            }
            if (this.tatistcal.systype == 1) {
              if (this.code == 0) {
                this.initOffice(1);
                this.initTeachingImprove(5);
                this.initTeachingAdvance(5);
              } else if (this.code == 1) {
                this.initTeaching(1);
                this.initTeachingImprove(1);
                this.initTeachingAdvance(1);
              } else if (this.code == 2) {
                this.initActionplan();
                this.initTeachingImprove(6);
                this.initTeachingAdvance(6);
              } else if (this.code == 3) {
                this.initAttendanceRate();
              }
            } else {
              if (this.code == 0 || this.code == 1) {
                //带教评分
                if (this.$route.query.menutype == 1) {
                  this.initTeaching(18);
                  this.initTeachingImprove(18);
                  this.initTeachingAdvance(18);
                } else {
                  this.initTeaching(8);
                  this.initTeachingImprove(8);
                  this.initTeachingAdvance(8);
                }
              } else if (this.code == 2) {
                this.initActionplan();
                this.initTeachingImprove(6);
                this.initTeachingAdvance(6);
              } else if (this.code == 3) {
                this.initAttendanceRate();
              }
            }
          } else {
            self.toast(res.errdesc);
          }
        } else {
          self.toast("系统错误，请联系管理员~");
        }
      });
    },
    //科室评分
    initOffice(param) {
      let self = this;
      let opitions = {};
      if (typeof this.dept === "number") {
        let _dept = [];
        _dept.push(this.dept);
        opitions.deptidlist = _dept;
      } else {
        opitions.deptidlist = this.dept;
      }
      if (opitions.deptidlist && opitions.deptidlist.length > 0) {
        this.post("/turnevaluate/queryscorestats", {
          command: "turnevaluate/queryscorestats",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          evaluationmonth: self.selecttime,
          evaluationtype: param,
          ...opitions
        }).done(res => {
          if (res && res.errcode == 0) {
            self.rateOpinionData = [];
            self.rateOpinion = [];
            res.scorestats.map(item => {
              self.rateOpinionData.push({
                value: item.percent,
                name: item.graderange
              });
              self.rateOpinion.push(item.graderange);
            });
            self.$nextTick(function() {
              self.drawGraph("echarts-rate", "科室评分比例分析");
            });
          } else if (res.errdesc) {
            self.toast(res.errdesc);
          } else {
            // self.toast('服务器错误，请联系管理员。')
          }
        });
      }
    },
    //带教评分
    initTeaching(param) {
      let self = this;
      let opitions = {};
      if (typeof this.dept === "number") {
        let _dept = [];
        _dept.push(this.dept);
        opitions.deptidlist = _dept;
      } else {
        opitions.deptidlist = this.dept;
      }
      if (opitions.deptidlist && opitions.deptidlist.length > 0) {
        this.post("/turnevaluate/queryscorestats", {
          command: "turnevaluate/queryscorestats",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          evaluationmonth: self.selecttime,
          evaluationtype: param,
          ...opitions
        }).done(res => {
          if (res && res.errcode == 0) {
            self.rateOpinionData = [];
            self.rateOpinion = [];
            res.scorestats.map(item => {
              self.rateOpinionData.push({
                value: item.percent,
                name: item.graderange
              });
              self.rateOpinion.push(item.graderange);
            });
            self.$nextTick(function() {
              self.drawGraph("echarts-rate", "带教评分比例分析");
            });
          } else if (res.errdesc) {
            self.toast(res.errdesc);
          } else {
            // self.toast('服务器错误，请联系管理员。')
          }
        });
      }
    },
    initTeachingImprove(param) {
      let self = this;
      let opitions = {};
      if (typeof this.dept === "number") {
        let _dept = [];
        _dept.push(this.dept);
        opitions.deptidlist = _dept;
      } else {
        opitions.deptidlist = this.dept;
      }
      if (opitions.deptidlist && opitions.deptidlist.length > 0) {
        this.post("/turnevaluate/queryadviselist", {
          command: "turnevaluate/queryadviselist",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          evaluationmonth: self.selecttime,
          evaluationtype: param,
          systype: this.tatistcal.systype,
          pagenum: "",
          pagepersize: "",
          ...opitions
        }).done(res => {
          if (res && res.errcode == 0) {
            if (res.adviselist) {
              self.advicelist = res.adviselist;
            } else {
              self.advicelist = [];
            }
          } else if (res.errdesc) {
            self.toast(res.errdesc);
          } else {
            // self.toast('服务器错误，请联系管理员。')
          }
        });
      }
    },
    initTeachingAdvance(param) {
      console.log("heiheihe", param);
      let self = this;
      let opitions = {};
      if (typeof this.tatistcal.dept === "number") {
        let _dept = [];
        _dept.push(this.tatistcal.dept);
        opitions.deptidlist = _dept;
      } else {
        opitions.deptidlist = this.dept;
      }
      if (opitions.deptidlist && opitions.deptidlist.length > 0) {
        this.post("/turnevaluate/queryimproveinfolist", {
          command: "turnevaluate/queryimproveinfolist",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          evaluationmonth: self.selecttime,
          evaluationtype: param,
          systype: this.tatistcal.systype,
          pagenum: "",
          pagepersize: "",
          ...opitions
        }).done(res => {
          if (res && res.errcode == 0) {
            if (res.improveinfolist) {
              self.improvelist = res.improveinfolist;
            } else {
              self.improvelist = [];
            }
          } else if (res.errdesc) {
            self.toast(res.errdesc);
          } else {
            self.toast("服务器错误，请联系管理员。");
          }
        });
      }
    },
    //教学活动
    initActionplan() {
      let self = this;
      let opitions = {};
      if (typeof this.dept === "number") {
        let _dept = [];
        _dept.push(this.dept);
        opitions.deptidlist = _dept;
      } else {
        opitions.deptidlist = this.dept;
      }
      if (opitions.deptidlist && opitions.deptidlist.length > 0) {
        this.post("/turnanalysismanager/actioncountmonthanalysispicadmin", {
          command: "turnanalysismanager/actioncountmonthanalysispicadmin",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid"),
          systype: this.tatistcal.systype,
          yearmonth: this.selecttime,
          ...opitions
        }).done(res => {
          if (res && res.errcode == 0) {
            self.rateOpinionData = [];
            self.rateOpinion = [];
            res.beanlist.map(item => {
              self.rateOpinionData.push({
                value: item.count,
                name: item.circlename
              });
              self.rateOpinion.push(item.circlename);
            });
            self.$nextTick(function() {
              self.drawGraph("echarts-rate-plan", "教学活动次数比例分析");
            });
          } else if (res.errdesc) {
            self.toast(res.errdesc);
          } else {
            // self.toast('服务器错误，请联系管理员。')
          }
        });
      }
    },
    //考勤统计
    initAttendanceTrend() {
      let self = this;
      let opitions = {};
      if (typeof this.dept === "number") {
        let _dept = [];
        _dept.push(this.dept);
        opitions.deptidlist = _dept;
      } else {
        opitions.deptidlist = this.dept;
      }
      if (opitions.deptidlist && opitions.deptidlist.length > 0) {
        this.post("/turnanalysismanager/workattendadminpic", {
          command: "turnanalysismanager/workattendadminpic",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid"),
          systype: this.tatistcal.systype,
          ...opitions
        }).done(res => {
          if (res && res.errcode == 0) {
            self.attendancelist = res.beanlist;
            self.lineXdata = [];
            self.linedata = [];
            if (res.beanlist.length > 0) {
              res.beanlist.map(val => {
                self.lineXdata.push(val.yearmonth);
                self.linedata.push(val.signpercent);
              });
            }
            self.$nextTick(function() {
              self.drawLine("echarts-trends", "近六个月签到率趋势");
            });
          } else if (res.errdesc) {
            self.toast(res.errdesc);
          } else {
            // self.toast('服务器错误，请联系管理员。')
          }
        });
      }
    },
    initAttendanceRate() {
      let self = this;
      let opitions = {};
      if (typeof this.dept === "number") {
        let _dept = [];
        _dept.push(this.dept);
        opitions.deptidlist = _dept;
      } else {
        opitions.deptidlist = this.dept;
      }
      if (opitions.deptidlist && opitions.deptidlist.length > 0) {
        this.post("/turnanalysismanager/monthworanalysispicadmin", {
          command: "turnanalysismanager/monthworanalysispicadmin",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid"),
          systype: this.tatistcal.systype,
          yearmonth: this.selecttime,
          ...opitions
        }).done(res => {
          if (res && res.errcode == 0) {
            self.rateOpinionData = [];
            self.rateOpinion = [];
            self.rateOpinionData = [
              { value: res.bean.signpercent, name: "签到" },
              { value: res.bean.leavepercent, name: "请假" },
              { value: res.bean.absencepercent, name: "旷工" },
              { value: res.bean.latepercent, name: "迟到" },
              { value: res.bean.earlyretreatpercent, name: "早退" },
              // { value: res.bean.otherpercent, name: "其他" }
            ];
            self.rateOpinion = ["签到", "请假", "旷工", "迟到", "早退"];
            self.$nextTick(function() {
              self.drawGraph("echarts-rates", "考勤分析");
            });
          } else if (res.errdesc) {
            self.toast(res.errdesc);
          } else {
            // self.toast('服务器错误，请联系管理员。')
          }
        });
      }
    },
    //饼图
    drawGraph: function(id, name) {
      var self = this;
      self.chart = echarts.init(document.getElementById(id));
      this.chart.showLoading();
      self.chart.setOption({
        title: {
          text: name,
          x: "center"
        },
        tooltip: {
          trigger: "item",
          show: false,
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          bottom: 0,
          left: "center",
          data: self.rateOpinion,
          itemHeight: 10,
          itemWidth: 10,
          itemGap: 6,
          textStyle: { fontSize: 12 }
        },
        series: [
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["35%", "50%"],
            data: self.rateOpinionData,
            label: {
              normal: {
                formatter: "{b}：{d}%  "
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ],
        color: [
          "#c7f316",
          "#38ce9b",
          "#ebb600",
          "#00b4f4",
          "#f97a1c",
          "#a550f5"
        ]
      });
      this.chart.hideLoading();
    },
    //折线图
    drawLine: function(id, name) {
      var self = this;
      self.chart = echarts.init(document.getElementById(id));
      let formatter = "";
      let xformatter = "";
      if (id == "echarts-rate-plan") {
        formatter = "{value}";
        xformatter = "{c}";
      } else {
        formatter = "{value}";
        xformatter = "{c}";
      }
      this.chart.showLoading();
      self.chart.setOption({
        title: {
          text: name,
          left: "center"
        },
        xAxis: {
          type: "category",
          data: self.lineXdata,
          //坐标轴颜色
          axisLine: {
            lineStyle: {
              color: "#666"
            }
          },
          //x轴文字旋转
          axisLabel: {
            rotate: 30,
            interval: 0
          }
        },
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: formatter
            }
          }
        ],
        series: [
          {
            data: self.linedata,
            type: "line",
            color: ["#3499db"],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: xformatter
                }
              }
            }
          }
        ]
      });
      this.chart.hideLoading();
    },
    //时间筛选
    timeselect(data) {
      this.currentmonth = data;
      this.selecttime = data;
      if (this.tatistcal.systype == 1) {
        if (this.code == 0) {
          this.initOffice(5);
          this.initTeachingImprove(5);
          this.initTeachingAdvance(5);
        } else if (this.code == 1) {
          this.initTeaching(1);
          this.initTeachingImprove(1);
          this.initTeachingAdvance(1);
        } else if (this.code == 2) {
          this.initActionplan();
          this.initTeachingImprove(6);
          this.initTeachingAdvance(6);
        } else if (this.code == 3) {
          this.initAttendanceRate();
        }
      } else {
        if (this.code == 0) {
          if (this.$route.query.menutype == 1) {
            this.initOffice(18);
            this.initTeachingImprove(18);
            this.initTeachingAdvance(18);
          } else {
            this.initOffice(8);
            this.initTeachingImprove(8);
            this.initTeachingAdvance(8);
          }
        } else if (this.code == 1) {
          if (this.$route.query.menutype == 1) {
            this.initTeaching(18);
            this.initTeachingImprove(18);
            this.initTeachingAdvance(18);
          } else {
            this.initTeaching(8);
            this.initTeachingImprove(8);
            this.initTeachingAdvance(8);
          }
        } else if (this.code == 2) {
          this.initActionplan();
          this.initTeachingImprove(6);
          this.initTeachingAdvance(6);
        } else if (this.code == 3) {
          this.initAttendanceRate();
        }
      }
    },
    baseselect(data) {
      let _list = [];
      if (data.checkall == "true") {
        this.dept = data.id;
      } else {
        if (data.childlist && data.childlist.length > 0) {
          data.childlist.map(value => {
            if (value.checkflag == true) {
              _list.push(value.id);
            }
          });
          this.dept = _list;
        }
      }
      this.setTatistical({ k: "dept", v: this.dept });
      this.dept = this.tatistcal.dept;
      if (this.tatistcal.systype) {
        if (this.code == 0) {
          this.initOffice(1);
          this.initTeachingImprove(5);
          this.initTeachingAdvance(5);
        } else if (this.code == 1) {
          this.initTeaching(1);
          this.initTeachingImprove(1);
          this.initTeachingAdvance(1);
        } else if (this.code == 2) {
          this.initActionplan();
          this.initTeachingImprove(6);
          this.initTeachingAdvance(6);
        } else if (this.code == 3) {
          this.initAttendanceRate();
        }
      } else {
        if (this.code == 0) {
          if (this.$route.query.menutype == 1) {
            this.initOffice(18);
            this.initTeachingImprove(18);
            this.initTeachingAdvance(18);
          } else {
            this.initOffice(8);
            this.initTeachingImprove(8);
            this.initTeachingAdvance(8);
          }
        } else if (this.code == 1) {
          this.initTeaching(1);
          if (this.$route.query.menutype == 1) {
            this.initTeachingImprove(18);
            this.initTeachingAdvance(18);
          } else {
            this.initTeachingImprove(8);
            this.initTeachingAdvance(8);
          }
        } else if (this.code == 2) {
          this.initActionplan();
          this.initTeachingImprove(6);
          this.initTeachingAdvance(6);
        } else if (this.code == 3) {
          this.initAttendanceRate();
        }
      }

      this.baseconfig.show = false;
    },
    normal() {
      console.log(111)
      this.k = 2;
      let _month = new Date().getMonth() + 1;
      let month = _month < 10 ? "0" + _month : _month;
      this.selecttime = new Date().getFullYear() + "-" + month;
      // this.dept = this.tatistcal.normalId;
      // this.setTatistical({ k: "dept", v: this.tatistcal.normalId });
      this.initrole();
    }
  }
};
</script>
<style lang="scss" scoped>
.select {
  display: flex;
  background: #fff;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  li {
    width: 0;
    flex: 1;
    line-height: 0.76rem;
    text-align: center;
  }
}
.active {
  color: #3499db;
}
.open-deptlist:after {
  content: "";
  display: inline-block;
  width: 0.2rem;
  height: 0.2rem;
  background: url("../../assets/images/xia-jiantou.png") 0 0 no-repeat;
  background-size: 100% 100%;
  margin-left: 0.1rem;
}
.select:first-child.onopen::after {
  content: "";
  display: inline-block;
  width: 0.2rem;
  height: 0.2rem;
  background: url("../../assets/images/shang-jiantou.png") 0 0 no-repeat;
  background-size: 100% 100%;
  margin-left: 0.1rem;
}
.master-office {
  color: #666;
  p {
    display: flex;
    justify-content: space-between;
    padding: 0.2rem;
    margin: 0;
    border-bottom: 1px solid #e0e0e0;
  }
}
.trend {
  background: #fff;
  color: #666;
  padding: 0.2rem 0;
  p {
    color: #333;
    line-height: 0.6rem;
    padding: 0.2rem;
    margin: 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;
    span:first-child {
      font-weight: bold;
      font-size: 0.35rem;
    }
  }
  .trend-select {
    color: #3499db;
  }
  .trend-content {
    height: 5rem;
    padding: 0.2rem;
    background: #fff;
    #echarts-trends {
      /*需要制定具体高度，以px为单位*/
      height: 100%;
      width: 100%;
    }
  }
}
.rate {
  background: #fff;
  color: #666;
  padding: 0.2rem 0;
  p {
    line-height: 0.6rem;
    color: #333;
    font-weight: bold;
    font-size: 0.35rem;
    padding: 0 0.2rem;
    margin: 0;
    display: flex;
    justify-content: space-between;
    img {
      width: 0.4rem;
      vertical-align: middle;
    }
  }
  .rate-content {
    height: 5rem;
    padding: 0.2rem;
    background: #fff;
    #echarts-rates {
      /*需要制定具体高度，以px为单位*/
      height: 100%;
      width: 100%;
    }
  }
}
.echarts-content {
  height: 5rem;
  padding: 0.2rem;
  background: #fff;
  #echarts-trend,
  #echarts-rate,
  #echarts-rate-plan,
  #echarts-trend-plan {
    /*需要制定具体高度，以px为单位*/
    height: 100%;
    width: 100%;
  }
}
.echarts-content-plan {
  height: 10rem;
  padding: 0.2rem;
  background: #fff;
  #echarts-rates,
  #echarts-trends {
    /*需要制定具体高度，以px为单位*/
    height: 50%;
    width: 100%;
  }
}
.tatistical {
  color: #666;
  background: #fff;
  border-top: 1px solid #e0e0e0;
  ul {
    padding: 0.2rem;
  }
  p {
    color: #000;
    background: #eee;
    padding: 0.2rem;
  }
  li {
    padding: 0.1rem 0;
  }
}
.choice:after {
  content: "";
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  background: url("../../assets/images/you-jiantou.png") 0 0 no-repeat;
  background-size: 100% 100%;
  position: absolute;
  right: 0.05rem;
  top: 0.15rem;
}
</style>

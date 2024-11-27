<script src="../../../../../../../../0331/misrobot-web-node/sys-config.js"></script>
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
      <li :class="{'active': k == 2 }" @click="normal">默认</li>
    </ul>
    <div class="master-office">
      <ul>
        <li v-if="code == 0 || code == 1">
          <span v-if="code == 1">姓名</span>
          <span>科室</span>
          <span class="changeup" @click="changeup(0)">得分</span>
          <!--0,1-->
          <span>评分日期</span>
        </li>
        <li v-if="code == 2">
          <span>科室</span>
          <span class="changeup" @click="changeup(1)">活动次数</span>
          <!--1,2-->
          <span class="changeup" @click="changeup(2)">签到率</span>
          <!--3,4-->
          <span>日期</span>
        </li>
        <li v-if="code == 3">
          <span>科室</span>
          <span class="changeup" @click="changeup(1)">签到率</span>
          <!--1,2-->
          <span class="changeup" @click="changeup(2)">缺勤率</span>
          <!--3,4-->
          <span>日期</span>
        </li>
      </ul>
    </div>
    <div class="g-main">
      <!--科室评分 && 带教评分-->
      <div v-if="code == 0 || code == 1">
        <div class="master-office">
          <ul>
            <li
              v-for="(item,index) in listOffice"
              @click="todetail(item.evaluatedid,item.evaluationmonth)"
            >
              <span v-if="code == 1">{{item.name}}</span>
              <span>
                <template v-if="code == 0">{{item.name}}</template>
                <template v-else>{{item.deptname}}</template>
              </span>
              <span>{{item.avgscore | fen}}</span>
              <span class="choice">{{item.evaluationmonth}}</span>
            </li>
            <li>
              <span v-show="listOffice.length == 0">暂无数据</span>
            </li>
          </ul>
        </div>
      </div>
      <!--教学活动-->
      <div v-if="code == 2">
        <div class="master-office">
          <ul>
            <li v-for="(item,index) in listPlan" @click="todetail(item.deptid,item.yearmonth)">
              <span>{{item.deptname}}</span>
              <span>{{item.actioncount}}</span>
              <span>{{item.signpercent | rate}}</span>
              <span class="choice">{{item.yearmonth}}</span>
            </li>
          </ul>
        </div>
      </div>
      <!--考勤统计-->
      <div v-if="code == 3">
        <div class="master-office">
          <ul>
            <li
              v-for="(item,index) in listAttendance"
              @click="todetail(item.deptid,item.yearmonth)"
            >
              <span>{{item.deptname}}</span>
              <span>{{item.signpercent | rate }}</span>
              <span>{{item.absencepercent | rate }}</span>
              <span class="choice">{{item.yearmonth | date}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--选择科室-->
    <select-group :config="baseconfig" :data-list="basetree" @confirm="baseselect"></select-group>
    <!--选择要看的月份-->
    <c-timepicker :config="monthconfig" @confirm="timeselect" :year="year" :month="month"></c-timepicker>
  </div>
</template>
<script>
import methods from "../../methods";
import { mapState, mapActions } from "vuex";
import selectGroup from "../../components/select-group";
import cTimepicker from "../../components/timepicker";
export default {
  props: ["code", "deptList"],
  data() {
    return {
      k: null,
      selecttime: "",
      ordertype: 1,
      listOffice: [],
      listPlan: [],
      listAttendance: [],
      yearconfig: {
        show: false,
        mainlist: [
          {
            val: 2018
          }
        ],
        valueKey: "val"
      },
      monthconfig: {
        show: false,
        istime: false,
        custom: true
      },
      year: [2018],
      month: [1, 12],
      baseconfig: {
        show: false,
        label: "deptname",
        fixedvalue: "1.52rem",
        textposition: "center"
      },
      basetree: [],
      deptname: "",
      dept: "",
      // deptList: [],
      normaldeptid: "",
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
        this.normalmonth();
        this.listOffice = [];
        if (this.tatistcal.systype == 1) {
          if (val === 0 || val === "0") {
            this.initOffice(5);
          } else if (val == 1) {
            this.initOffice(1);
          } else if (val == 2) {
            self.initActionplan();
          } else if (val == 3) {
            self.initAttendance();
          }
        } else {
          if (val === 0 || val === "0") {
            if (this.$route.query.menutype == 1) {
              this.initOffice(18);
            } else {
              this.initOffice(8);
            }
          } else if (val == 1) {
            if (this.$route.query.menutype == 1) {
              this.initOffice(18);
            } else {
              this.initOffice(8);
            }
          } else if (val == 2) {
            self.initActionplan();
          } else if (val == 3) {
            self.initAttendance();
          }
        }
      }
    },
    selecttime: function(val, oldval) {
      if (val) {
        this.setTatistical({ k: "selecttime", v: val });
      }
    },
    "tatistcal.dept": function(val, oldval) {
      if (val !== oldval) {
        if (this.tatistcal.systype == 1) {
          if (this.code === 0 || this.code === "0") {
            this.initOffice(5);
          } else if (this.code == 1) {
            this.initOffice(1);
          } else if (this.code == 2) {
            this.initActionplan();
          } else if (this.code == 3) {
            this.initAttendance();
          }
        } else {
          if (this.code === 0 || this.code === "0") {
            if (this.$route.query.menutype == 1) {
              this.initOffice(18);
            } else {
              this.initOffice(8);
            }
          } else if (this.code == 1) {
            if (this.$route.query.menutype == 1) {
              this.initOffice(18);
            } else {
              this.initOffice(8);
            }
          } else if (this.code == 2) {
            this.initActionplan();
          } else if (this.code == 3) {
            this.initAttendance();
          }
        }
      }
    }
  },
  filters: {
    rate: function(value) {
      if (!value) {
        if (parseInt(value) == 0) {
          return Number(value).toFixed(2) + "%";
        } else {
          return "-";
        }
      } else {
        return Number(value).toFixed(2) + "%";
      }
    },
    date: function(val) {
      if (!val) {
        if (parseInt(val) == 0) {
          return "0";
        } else {
          return "-";
        }
      } else {
        return val;
      }
    },
    fen: function(val) {
      if (!val) {
        if (parseInt(val) == 0) {
          return "0";
        } else {
          return "-";
        }
      } else {
        return val + "分";
      }
    }
  },
  computed: {
    ...mapState(["tatistcal"])
  },
  created() {
    this.dept = this.tatistcal.dept;
    this.deptname = this.tatistcal.deptname;
    let nowyear = new Date().getFullYear() + 20;
    this.year.push(nowyear);
    if (nowyear > 2018 && this.tatistcal.role == 1) {
      this.yearconfig.mainlist.push(nowyear);
    }
    if (this.tatistcal.isback) {
      this.initrole();
      if (this.tatistcal.systype == 1) {
        if (this.code === 0) {
          this.initOffice(5);
        } else if (this.code === 1) {
          this.initOffice(1);
        } else if (this.code === 2) {
          this.initActionplan();
        } else if (this.code === 3) {
          this.initAttendance();
        }
      } else {
        if (this.code === 0 || this.code === 1) {
          this.initOffice(8);
        } else if (this.code === 2) {
          this.initActionplan();
        } else if (this.code === 3) {
          this.initAttendance();
        }
      }
    } else {
      this.normalmonth();
      // this.initrole();
    }
  },
  mounted() {},
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
      let nowyear = new Date().getFullYear();
      let _month = new Date().getMonth() + 1;
      let month = _month < 10 ? "0" + _month : _month;
      this.year.push(nowyear);
      if (nowyear > 2018) {
        this.yearconfig.mainlist.push(nowyear);
      }
      this.selecttime = new Date().getFullYear() + "-" + month;
    },
    //初始话角色
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
            //顶部角色对象if没有后台接口返回的角色默认为医院;
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
            //isback统计返回标志
            if (!this.dept && this.tatistcal.isback !== 1) {
              self.deptname = res.depttreelist[0].deptname;
              self.dept = res.depttreelist[0].id;
            }
            if (!this.tatistcal.dept || !this.tatistcal.deptname) {
              self.setTatistical({ k: "dept", v: res.depttreelist[0].id });
              self.setTatistical({ k: "deptname", v: self.deptname });
            }
            self.normaldeptid = res.depttreelist[0].id;
            if (res.depttreelist[0].deptcode == "office") {
              self.role = 0;
              self.setTatistical({ k: "role", v: self.role });
            } else {
              self.role = 1;
              self.setTatistical({ k: "role", v: self.role });
            }
            if (this.tatistcal.systype == 1) {
              if (this.code === 0 && self.role == 1) {
                this.initOffice(5);
              } else if (this.code === 1) {
                this.initOffice(1);
              } else if (this.code === 2) {
                this.initActionplan();
              } else if (this.code === 3) {
                this.initAttendance();
              }
            } else {
              if (this.code === 0 || this.code === 1) {
                if (this.$route.query.menutype == 1) {
                  this.initOffice(18);
                } else {
                  this.initOffice(8);
                }
              } else if (this.code === 2) {
                this.initActionplan();
              } else if (this.code === 3) {
                this.initAttendance();
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
    initbaselist() {
      //获取科室列表
      let self = this;
      this.post("/actionplanbase/getalldeptastree", {
        command: "actionplanbase/getalldeptastree",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid")
      }).done(data => {
        if (data && data.errcode == 0) {
          self.basetree = data.depttree;
        } else if (data.errdesc) {
          self.toast(data.errdesc);
        } else {
          self.toast("服务器错误，请联系管理员。");
        }
      });
    },
    initOffice(param) {
      console.log("```````", this.dept, param, this.code);
      console.log(this.tatistcal);
      let self = this;
      let opitions = {};
      let _type = "";
      if (this.tatistcal.systype == 1) {
        _type = param;
      } else {
        if (this.tatistcal.systype == 2) {
          if (this.$route.query.menutype == 1) {
            _type = 18;
          } else {
            _type = 8;
          }
        }
      }
      if (this.tatistcal.isback === 1) {
        //返回的时候取 vuex 存的值，因为tab切换的时候此方法会在vuex值改变之前执行
        this.selecttime = this.tatistcal.selecttime;
        opitions.evaluationmonth = this.tatistcal.selecttime;
      } else {
        opitions.evaluationmonth = this.selecttime;
      }
      if (typeof this.dept === "number") {
        let _dept = [];
        // _dept.push(this.dept);
        // opitions.deptidlist = _dept;
        _dept.push(this.tatistcal.dept);
        opitions.deptidlist = _dept;
        console.log(_dept);
      } else {
        opitions.deptidlist = this.dept;
      }
      if (!opitions.deptidlist) {
        return;
      }
      if (this.$route.query.menutype == 1) {
        opitions.stdtype = 1;
      }
      console.log(opitions);
      this.post("/turnevaluate/queryscorelistinbase", {
        command: "turnevaluate/queryscorelistinbase",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        evaluationtype: _type,
        ordertype: this.ordertype,
        pagenum: "",
        pagepersize: "",
        ...opitions
      }).done(res => {
        if (res && res.errcode) {
          if (res.errcode == 0) {
            self.listOffice = [];
            self.listOffice = res.evaluationscorelist;
            self.setTatistical({ k: "isback", v: 0 });
          } else {
            self.toast(res.errdesc);
          }
        } else {
          self.toast("系统错误，请联系管理员~");
        }
      });
    },
    initActionplan() {
      let self = this;
      let opitions = {};
      let _time = null;
      let _dept = [];
      if (typeof this.dept === "number") {
        _dept.push(this.dept);
        opitions.deptidlist = _dept;
      } else {
        opitions.deptidlist = this.dept;
      }
      if (!opitions.deptidlist || opitions.deptidlist[0] == "") {
        _dept.push(this.tatistcal.dept);
        opitions.deptidlist = _dept;
        if (!opitions.deptidlist || opitions.deptidlist[0] == "") {
          return;
        }
      }
      if (!this.selecttime) {
        _time = this.tatistcal.selecttime;
      } else {
        _time = this.selecttime;
      }
      this.post("/turnanalysismanager/actionmonthanalysisadmin", {
        command: "turnanalysismanager/actionmonthanalysisadmin",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid"),
        systype: this.tatistcal.systype,
        orderflag: this.ordertype,
        yearmonth: _time,
        ...opitions
      }).done(res => {
        if (res && res.errcode) {
          if (res.errcode == 0) {
            self.listPlan = [];
            self.listPlan = res.beanlist;
          } else {
            self.toast(res.errdesc);
          }
        } else {
          self.toast("系统错误，请联系管理员~");
        }
      });
    },
    initAttendance() {
      let self = this;
      let opitions = {};
      let _dept = [];

      if (typeof this.dept === "number") {
        if (this.dept == 99) {
          opitions.deptidlist = [];
        } else {
          _dept.push(this.dept);
          opitions.deptidlist = _dept;
        }
      } else {
        opitions.deptidlist = this.dept;
      }
      if (!opitions.deptidlist || opitions.deptidlist[0] == "") {
        _dept.push(this.tatistcal.dept);
        opitions.deptidlist = _dept;
        if (!opitions.deptidlist || opitions.deptidlist[0] == "") {
          return;
        }
      }

      this.post("/turnanalysismanager/workattendmonthanalysisadmin", {
        command: "turnanalysismanager/workattendmonthanalysisadmin",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid"),
        systype: this.tatistcal.systype,
        orderflag: this.ordertype,
        yearmonth: this.selecttime,
        ...opitions
      }).done(res => {
        if (res && res.errcode) {
          if (res.errcode == 0) {
            self.listAttendance = [];
            self.listAttendance = res.beanlist;
          } else {
            self.toast(res.errdesc);
          }
        } else {
          self.toast("系统错误，请联系管理员~");
        }
      });
    },
    //排序
    changeup(i) {
      if (this.code == 0 || this.code == 1) {
        this.ordertype = this.ordertype == 1 ? 0 : 1;
      } else if (this.code == 2 || this.code == 3) {
        if (i && i == 1) {
          this.ordertype = this.ordertype == 2 ? 1 : 2;
        } else if (i && i == 2) {
          this.ordertype = this.ordertype == 4 ? 3 : 4;
        }
      }
      if (this.tatistcal.systype == 1) {
        if (this.code == 0) {
          this.initOffice(5);
        } else if (this.code == 1) {
          this.initOffice(1);
        } else if (this.code == 2) {
          this.initActionplan();
        } else if (this.code == 3) {
          this.initAttendance();
        }
      } else {
        if (this.code == 0 || this.code == 1) {
          if (this.$route.query.menutype == 1) {
            this.initOffice(18);
          } else {
            this.initOffice(8);
          }
        } else if (this.code == 2) {
          this.initActionplan();
        } else if (this.code == 3) {
          this.initAttendance();
        }
      }
    },
    baseselect(data) {
      console.log('data',data)
      let self = this;
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
      self.setTatistical({ k: "dept", v: this.dept });
      if (this.tatistcal.systype) {
        if (this.code == 0) {
          this.initOffice(5);
        } else if (this.code == 1) {
          this.initOffice(1);
        } else if (this.code == 2) {
          this.initActionplan();
        } else if (this.code == 3) {
          this.initAttendance();
        }
      } else {
        if (this.code == 0) {
          if (this.$route.query.menutype == 1) {
            this.initOffice(18);
          } else {
            this.initOffice(8);
          }
        } else if (this.code == 1) {
          if (this.$route.query.menutype == 1) {
            this.initOffice(18);
          } else {
            this.initOffice(8);
          }
        } else if (this.code == 2) {
          this.initActionplan();
        } else if (this.code == 3) {
          this.initAttendance();
        }
      }
      this.baseconfig.show = false;
    },
    normal() {
      this.k = 2;
      let _month = new Date().getMonth() + 1;
      let month = _month < 10 ? "0" + _month : _month;
      this.selecttime = new Date().getFullYear() + "-" + month;
      this.dept = this.tatistcal.normal;
      this.setTatistical({ k: "dept", v: this.tatistcal.normal });
      this.initrole();
    },
    timeselect(param) {
      //如果选择的就是当前年份就return掉
      if (param.val == this.selecttime) {
        this.monthconfig.show = false;
        return;
      }
      this.selecttime = param;
      if (this.tatistcal.systype == 1) {
        if (this.code == 0) {
          this.initOffice(5);
        } else if (this.code == 1) {
          this.initOffice(1);
        } else if (this.code == 2) {
          this.initActionplan();
        } else if (this.code == 3) {
          this.initAttendance();
        }
      } else {
        if (this.code == 0 || this.code == 1) {
          if (this.$route.query.menutype == 1) {
            this.initOffice(18);
          } else {
            this.initOffice(8);
          }
        } else if (this.code == 2) {
          this.initActionplan();
        } else if (this.code == 3) {
          this.initAttendance();
        }
      }

      this.setTatistical({ k: "selecttime", v: this.selecttime });
      this.monthconfig.show = false;
    },
    todetail(id, month) {
      if (this.code == 0 || this.code == 1) {
        this.$router.push({
          name: "fdTatistical_detail",
          query: {
            id: id,
            month: month
          }
        });
      } else if (this.code == 2 || this.code == 3) {
        this.$router.push({
          name: "fdTatistical_detail",
          query: {
            id: id,
            month: month
          }
        });
      }
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
  ul {
    background: #fff;
    li {
      display: flex;
      padding: 0 0.2rem;
      border-bottom: 1px solid #e0e0e0;
      position: relative;
      span {
        width: 0;
        flex: 1;
        text-align: center;
        line-height: 0.6rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span:nth-child(2),
      span:nth-child(3) {
        flex: 1.2;
      }
    }
  }
}
.changeup {
  position: relative;
}
.changeup::after {
  content: "";
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  background: url("../../assets/images/icon-updown.png") 0 0 no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 0.15rem;
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

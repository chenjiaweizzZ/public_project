<template>
  <div class="g-wrapper">
    <div class="g-main">
      <!--待分配-->
      <div class="allotTeacher fixed" @click="allotTeacherAll">
        <div>
          <img v-show="assingning" src="../../../assets/images/icon_xiangxia-.png" alt />
          <img v-show="!assingning" src="../../../assets/images/bnt_xiangyou.png" alt />
          <span>待&ensp;分&ensp;配</span>
        </div>
        <span>{{assignteachlist.length}}</span>
      </div>
      <!-- <transition name='slide'> -->
      <div class="main assignMain" :class="{'stopscroll': isscroll}" v-show="assingning">
        <div v-for="(item,key) in assignteachlist" class="list">
          <ul @click="plan(item)">
            <li class="head">
              <div class="headDiv">
                <img src="../../../assets/images/icon_morentoux-.png" alt />
                <div>
                  <p class="headerName">
                    <span>{{item.name}}</span>
                    <span>{{item.period}}</span>
                  </p>
                  <p class="headerName">
                    <span>{{item.base}}</span>
                    <span>{{item.mobile}}</span>
                  </p>
                </div>
              </div>
            </li>
            <!--<li>
                            <span>专业基地：{{item.base}}</span>
                        </li>
                        <li>
                            <span>科&emsp;&emsp;室：{{item.dept}}</span>
                        </li>
                        <li>
                            <span>带教老师：{{item.teaching}}</span>
            </li>-->
            <!--<li>
                            <span>培训专业：{{item.base}}</span>
            </li>-->
            <li>
              <span>轮转科室：{{item.turndeptname}}</span>
            </li>
            <li>
              <span>轮转周期：{{item.begintime | date}}-{{item.endtime | date}}</span>
            </li>
            <li v-if="item.teaching">
              <span>轮转进度：{{item.progress | rating}}</span>
            </li>
          </ul>
          <div class="footerBtn">
            <a v-show="!isSubmit" @click="allotTeacher(item.tpdid,item.turningdeptid)" v-if="item.teaching == null && roleAuthority['app:run:assignTeacher'] && item.isGraduation!=2">分配带教老师</a>
            <a v-show="isSubmit" v-if="item.teaching == null && roleAuthority['app:run:assignTeacher'] && item.isGraduation!=2">分配带教老师</a>
            <!-- <a v-if="showck" v-show="!isSubmit && roleAuthority['app:run:confirmOutDept'] && item.isGraduation!=2" @click="finishTrain(item.tpdid,item.num,item.id)">出科确认</a>
            <a v-if="showck" v-show="isSubmit && roleAuthority['app:run:confirmOutDept'] && item.isGraduation!=2">出科确认</a> -->
          </div>
        </div>
      </div>
      <!-- 轮转中 -->
      <div class="allotTeacher allTurn" @click="showAllTurn">
        <div>
          <img v-show="allTurn" src="../../../assets/images/icon_xiangxia-.png" alt />
          <img v-show="!allTurn" src="../../../assets/images/bnt_xiangyou.png" alt />
          <span>轮&ensp;转&ensp;中</span>
        </div>
        <span>{{turnList.length}}</span>
      </div>
      <div class="main allTurnMain" :class="{'stopscroll': isscroll}" v-show="allTurn">
        <div v-for="(item,key) in turnList" class="list">
          <ul @click="plan(item)">
            <li class="head">
              <div class="headDiv">
                <img src="../../../assets/images/icon_morentoux-.png" alt />
                <div>
                  <p class="headerName">
                    <span>{{item.name}}</span>
                    <span>{{item.period}}</span>
                  </p>
                  <p class="headerName">
                    <span>{{item.base}}</span>
                    <span>{{item.mobile}}</span>
                  </p>
                </div>
              </div>
            </li>
            <!--<li>
                            <span>专业基地：{{item.base}}</span>
                        </li>
                        <li>
                            <span>科&emsp;&emsp;室：{{item.dept}}</span>
            </li>-->
            <li>
              <span>轮转科室：{{item.dept}}</span>
            </li>
            <li>
              <span>带教老师：{{item.teaching}}</span>
            </li>
            <li>
              <span>轮转周期：{{item.begintime | date}}-{{item.endtime | date}}</span>
              <span class="t-turncode">轮转进度：{{item.progress | rating}}</span>
            </li>
          </ul>
          <div class="footerBtn">
            <!-- <a style="margin-right: 0.2rem" @click="outDepartment(item)" v-if="roleAuthority['app:run:confirmOutDept'] && item.isGraduation!==2">出科</a>

            <a style="margin-right: 0.2rem" @click="outDepartmentScore(item)" v-if="roleAuthority['app:run:outDeptTest']">出科考核</a> -->

            <a @click="allotTeacher(item.tpdid,item.turningdeptid)" style="margin-right: 0.2rem" v-show="!isSubmit && roleAuthority['app:run:assignTeacher'] && item.isGraduation!=2">修改带教老师</a>
            <!-- <a style="margin-right: 0.2rem" v-show="isSubmit && roleAuthority['app:run:assignTeacher'] && item.isGraduation!=2">修改带教老师</a> -->

            <!-- <a v-if="showck && item.isGraduation!==2" v-show="!isSubmit && roleAuthority['app:run:confirmOutDept'] && item.isGraduation!==2" @click="finishTrain(item.tpdid,item.num,item.id,item.endtime)">出科确认</a> -->
            <!-- <a v-if="showck" v-show="isSubmit && roleAuthority['app:run:confirmOutDept'] && item.isGraduation!=2">出科确认</a> -->
          </div>
        </div>
      </div>
      <!-- </transition> -->
      <!--全部学员-->
      <div class="allotTeacher allStudent" @click="showAllStudent">
        <div>
          <img v-show="allStudent" src="../../../assets/images/icon_xiangxia-.png" alt />
          <img v-show="!allStudent" src="../../../assets/images/bnt_xiangyou.png" alt />
          <span>待&ensp;出&ensp;科</span>
        </div>
        <span>{{deptOutDoctors.length}}</span>
      </div>
      <div class="main allStuMain" :class="{'stopscroll': isscroll}" v-show="allStudent">
        <div v-for="(item,key) in deptOutDoctors" class="list">
          <ul @click="plan(item)">
            <li class="head">
              <div class="headDiv">
                <img src="../../../assets/images/icon_morentoux-.png" alt />
                <div>
                  <p class="headerName">
                    <span>{{item.name}}</span>
                    <span>{{item.period}}</span>
                  </p>
                  <p class="headerName">
                    <span>{{item.base}}</span>
                    <span>{{item.mobile}}</span>
                  </p>
                </div>
              </div>
            </li>
            <!--<li>
                            <span>专业基地：{{item.base}}</span>
                        </li>
                        <li>
                            <span>科&emsp;&emsp;室：{{item.dept}}</span>
            </li>-->
            <li>
              <span>轮转科室：{{item.dept}}</span>
            </li>
            <li>
              <span>分带教：{{item.teaching}}</span>
            </li>
            <li>
              <span>轮转周期：{{item.begintime | date}}-{{item.endtime | date}}</span>
              <span class="t-turncode">轮转进度：{{item.progress | rating}}</span>
            </li>
            <li v-if="ckShow">
              <span>是否符合出科条件：{{item.auditStatus | exam}}</span>
            </li>
          </ul>
          <div class="footerBtn">
            <a style="margin-right: 0.2rem" @click="outDepartmentExam(item)" v-if="ckShow && roleAuthority['app:outwait:review'] && item.isGraduation!=2">出科条件审核</a>
            <!-- <a style="margin-right: 0.2rem" @click="outDepartment(item)" v-if="checkExam(item.auditStatus) || !ckShow" v-show="roleAuthority['app:outwait:confirmOutDept']">出科</a> -->
            <a style="margin-right: 0.2rem" @click="outDepartment(item)" v-if="checkExam(item.auditStatus) || !ckShow" v-show="roleAuthority['app:outwait:confirmOutDept']">出科</a>
            <!-- <a style="margin-right: 0.2rem" @click="outDepartment(item)" v-if="roleAuthority['app:run:confirmOutDept'] && item.isGraduation!==2">出科</a> -->

            <a style="margin-right: 0.2rem" @click="outDepartmentScore(item)" v-if="roleAuthority['app:outwait:outDeptTest'] && checkCkShow(item.auditStatus)">出科考核</a>

            <a @click="allotTeacher(item.tpdid,item.turningdeptid)" style="margin-right: 0.2rem" v-show="!isSubmit && roleAuthority['app:outwait:assignTeacher'] && item.isGraduation!=2">修改带教老师</a>
            <!-- <a style="margin-right: 0.2rem" v-show="isSubmit && roleAuthority['app:run:assignTeacher'] && item.isGraduation!=2">修改带教老师</a> -->

            <!-- <a v-if="showck && item.isGraduation!==2" v-show="!isSubmit && roleAuthority['app:run:confirmOutDept'] && item.isGraduation!==2" @click="finishTrain(item.tpdid,item.num,item.id,item.endtime)">出科确认</a> -->
            <!-- <a v-if="showck" v-show="isSubmit && roleAuthority['app:run:confirmOutDept'] && item.isGraduation!=2">出科确认</a> -->
          </div>
        </div>
      </div>
    </div>
    <c-picker :config="selteacher" @confirm="choiceteacher"></c-picker>
  </div>
</template>
<script>
  import $ from "jquery";
  import cModel from "../../../components/modal";
  import methods from "../../../methods";
  import cPicker from "../../../components/default-picker";
  import { mapState, mapActions } from "vuex";
  import bus from "../../../bus.js";
  export default {
    props: ["active", "showck", "titledeptid", "deptname"],
    name: "rotation_admin_left",
    components: {
      cModel,
      cPicker
    },
    filters: {
      date: function (value) {
        if (value) {
          return value.split("-").join(".");
        }
      },
      rating: function (value) {
        if (value || value == 0) {
          return (value * 100).toFixed(0) + "%";
        }
      },
      exam: function(data) {
        if (data === null) {
          return "待审核";
        } else if (data === 1) {
          return "是";
        } else if (data === 0) {
          return "否";
        } else {
          return "无效状态";
        }
      }
    },
    data() {
      return {
        ckShow: false,
        isSubmit: false,
        isscroll: false,
        teachers: [],
        totalDoctor: [],
        turndoctors: [],
        assignteachlist: [],
        deptOutDoctors: [],
        turnList: [],
        periods: ["全部", "2014级", "2015级", "2016级", "2017级", "2018级"],
        tpdid: 0,
        value: "全部",
        teacherid: 0,
        slide: false,
        allStufixed: false,
        assingning: false,
        allStudent: false,
        allTurn: false,
        selteacher: {
          show: false,
          mainlist: [],
          valueKey: function (value) {
            return (
              '<span class="picker-center">' +
              value.tech_name +
              '</span><span class="picker-center">' +
              value.stud_num +
              "</span>"
            );
          }
        }
      };
    },
    watch: {
      // 监视待分配学员是否展开
      assingning: function (val, oldval) {
        // if (val == true) {
        //   this.allStudent = false;
        // }
      },
      // 监视所有学员是否展开
      allStudent: function (val, oldval) {
        // if (val == true) {
        //   this.assingning = false;
        //   $(".allStudent").css({
        //     position: "fixed",
        //     top: "2.14rem",
        //     "z-index": "10"
        //   });
        //   $(".allStuMain").css("margin-top", "0.66rem");
        // }
      },
      active: function (val, oldVal) {
        if (val) {
          let self = this;
          self.init("全部");
          bus.$on("confirmDept", function () {
            self.init("全部");
          });
          // $(".allStudent").css({
          //   position: "inherit",
          //   top: "2.78rem",
          //   "z-index": "10"
          // });
          $(".allStuMain").css("margin-top", "0rem");
        }
      },
      "selteacher.show": function (value) {
        this.isscroll = value ? true : false;
      },
      titledeptid: function (val, oldval) {
        if (val && oldval != val) {
          this.init();
        }
      },
      deptname: function (val, oldval) {
        if (val && val != oldval) {
          this.deptname = val;
        }
      }
    },
    computed: {
      ...mapState(["roleAuthority"]),
    },
    mounted() {
      let self = this;
      self.judgeCk();
      this.getRoleAuthority(['app:run:confirmOutDept', 'app:run:assignTeacher', 'app:outwait:review','app:outwait:confirmOutDept','app:outwait:outDeptTest','app:outwait:assignTeacher']);
      if (this.$route.query.deptid && this.$route.query.where == 1) {
        this.titledeptid = this.$route.query.deptid;
      }
      this.$nextTick(function () {
        self.init("全部");
        bus.$on("confirmDept", function () {
          self.init("全部");
        });
        $(".allStudent").css({
          position: "fixed",
          top: "2.78rem",
          "z-index": "10"
        });
        $(".allTurn").css({
          position: "inherit",
          top: "2.14rem",
          "z-index": "10"
        });
        $(".allStuMain").css("margin-top", "0.66rem");
      });
    },
    methods: {
      ...methods,
      ...mapActions([
        "showAlert",
        "showConfirm",
        "showLoading",
        "hideLoading",
        "toast",
        "setTurninfo",
        "getRoleAuthority"
      ]),
      checkCkShow(auditStatus) {
        if(self.ckShow) {
          return true
        }else {
          if(auditStatus == 1) {
            return true
          }
        }
        return false
      },
      judgeCk() {
        let self = this
        self.post('/commparaconf/queryCommparaConfList', {
          command: "commparaconf/queryCommparaConfList",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          paramcode: 'ck_settings',
          paramvalue: "9"
        }).then(data => {
          if (data && data.errcode == "0") {
            if (data.commparaConfList.length > 0) {
              self.ckShow = Number(data.commparaConfList[0].param1)
            }
          }
        })
      },
      outDepartmentExam(item) {
        this.$emit('savePreId')
        this.$router.push({
          name: "fdRotation_OutExam",
          query: {
            id: item.plandetailid
          }
        });
      },
      checkExam(data) {
        if (data === null) {
          return false;
        } else if (data === 1) {
          return true;
        } else if (data === 0) {
          return false;
        } else {
          return false;
        }
      },
      // 点击待分配
      outDepartmentScore(item) {
        let self = this;
        this.$emit('savePreId')
        this.$router.push({
          name: "fdRotation_out_department_score",
          query: {
            type: self.$route.query.type,
            where: self.$route.query.where,
            id: self.$route.query.id,
            deptid: this.titledeptid,
            deptname: this.deptname,
            uid: item.id,
            businessid: item.tpdid,
            endtime: item.endtime,
            plandetailid: item.plandetailid,
            auditStatus: item.auditStatus
          }
        });
      },
      outDepartment(item) {
        console.log(item);
        this.$emit('savePreId')
        let self = this;
        this.$router.push({
          name: "fdRotation_out_department",
          query: {
            type: self.$route.query.type,
            where: 1,
            deptid: this.titledeptid,
            deptname: this.deptname,
            uid: item.id,
            businessid: item.tpdid,
            tpdid: item.tpdid,
            num: item.num,
            name: item.name,
            base: item.base,
            time: item.begintime + "至" + item.endtime
          }
        });
      },
      allotTeacherAll() {
        // $(".allStudent").css("position", "inherit");
        // $(".assignMain").css("margin-top", "0px");
        // this.assingning = !this.assingning;
        if (!this.assingning) {
          this.assingning = true;
          this.allStudent = false;
          this.allTurn = false;
        } else {
          this.assingning = false;
        }
        $(".allStudent").css({
          position: "inherit",
          top: "2.14rem",
          "z-index": "10"
        });
        $(".allTurn").css({
          position: "inherit",
          top: "2.78rem",
          "z-index": "10"
        });
      },
      showAllTurn() {
        //   this.allTurn = !this.allTurn;
        if (!this.allTurn) {
          this.assingning = false;
          this.allStudent = false;
          this.allTurn = true;
          $(".allTurnMain").css("margin-top", "0.66rem");
          $(".allStudent").css({
            position: "inherit",
            top: "2.78rem",
            "z-index": "10"
          });
          $(".allTurn").css({
            position: "fixed",
            top: "2.14rem",
            "z-index": "10"
          });
        } else {
          this.allTurn = false;
          $(".allStudent").css({
            position: "inherit",
            top: "2.78rem",
            "z-index": "10"
          });
          $(".allTurn").css({
            position: "inherit",
            top: "2.14rem",
            "z-index": "10"
          });
        }
      },
      // 点击所有学员
      showAllStudent() {
        // $(".allStuMain").css("margin-top", "0.66rem");
        // this.allStudent = !this.allStudent;
        if (!this.allStudent) {
          this.assingning = false;
          this.allStudent = true;
          this.allTurn = false;
          $(".allStuMain").css("margin-top", "1.32rem");
          $(".allStudent").css({
            position: "fixed",
            top: "2.80rem",
            "z-index": "10"
          });
          $(".allTurn").css({
            position: "fixed",
            top: "2.14rem",
            "z-index": "10"
          });
        } else {
          this.allStudent = false;
          $(".allStudent").css({
            position: "inherit",
            top: "2.78rem",
            "z-index": "10"
          });
          $(".allTurn").css({
            position: "inherit",
            top: "2.14rem",
            "z-index": "10"
          });
        }
      },
      // 点击列表去计划页面
      plan: function (item) {
        this.$emit('savePreId')
        this.setTurninfo({ k: "stuid", v: item.id });
        this.$router.push({
          name: "fdRotation_doctor_plan",
          query: {
            type: 2,
            where: 1,
            deptid: this.titledeptid,
            deptname: this.deptname
          }
        });
      },
      // 初始化轮转中学生数据
      init(period) {
        let self = this;
        let postdata = {
          command: "turn/queryturningdoctors",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          // deptid: self.titledeptid,
          deptIdList: !Array.isArray(self.titledeptid) ? [self.titledeptid] : self.titledeptid,
          pageno: 1,
          pagesize: 100,
          includeChildDeptFlag: "0"
        };
        if (period == "全部") {
          postdata = postdata;
        } else {
          postdata.period = period;
        }
        self
          .post("/turn/queryturningdoctors", postdata)
          .done(function (data) {
            if (data.periods) {
              data.periods.unshift("全部");
              self.periods = data.periods;
              // 动态的判断级数导航条的宽度
            }

            self.turndoctors = data.turndoctors;
            self.assignteachlist = [];
            if (self.turndoctors) {
              self.assignteachlist = self.turndoctors;
            }
          })
          .fail(function (error) { });
        //更改（待出科改为接口查询）
        let postdata_stayout = {
          command: "turn/queryturningdoctors",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          teachidflag: 1,
          // deptid: self.titledeptid,
          deptIdList: !Array.isArray(self.titledeptid) ? [self.titledeptid] : self.titledeptid,
          pageno: 1,
          pagesize: 100
        };
        self
          .post("/turn/queryturningdoctors", postdata_stayout)
          .done(function (data) {
            if (data.periods) {
              data.periods.unshift("全部");
              self.periods = data.periods;
            }
            self.turndoctors = data.turndoctors;
            self.turnList = [];
            self.deptOutDoctors = [];
            self.turnList = [];
            if (self.turndoctors) {
              self.turndoctors.forEach(i => {
                // console.log(self.isCurrentMonth(i.endtime))
                if (self.isCurrentMonth(i.endtime)) {
                  self.deptOutDoctors.push(i)
                } else {
                  self.turnList.push(i);

                }
              });
              // self.deptOutDoctors = self.turndoctors;
              console.log(self.turnList, self.deptOutDoctors)
            }
          })
          .fail(function (error) { });
      },
      judgeCk() {
        let self = this
        self.post('/commparaconf/queryCommparaConfList', {
          command: "commparaconf/queryCommparaConfList",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          paramcode: 'ck_settings',
          paramvalue: "9"
        }).then(data => {
          if (data && data.errcode == "0") {
            if (data.commparaConfList.length > 0) {
              self.ckShow = Number(data.commparaConfList[0].param1)
            }
          }
        })
      },
      isCurrentMonth(dateStr) {
        let dateObj = new Date(dateStr);
        let currentMonth = new Date().getMonth() + 1;
        let currentYear = new Date().getYear()
        let month = dateObj.getMonth() + 1;
        let year = dateObj.getYear();
        if (year < currentYear) {
          return true
        } else if (year > currentYear) {
          return false
        } else {
          if (month <= currentMonth) {
            return true;
          } else {
            return false;
          }
        }
      },

      // 分配带教老师
      allotTeacher: function (tpdid, deptid) {
        // this.enterNum++
        this.tpdid = tpdid;
        this.getTeacher(deptid);
      },

      // 带教老师数据请求
      getTeacher: function (id) {
        let self = this;
        self.isSubmit = true;
        this.post("/turn/queryTeacherList", {
          command: "turn/queryTeacherList",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          dept_id: id,
          teachertype: 1
        })
          .done(function (data) {
            self.isSubmit = false;
            if (data.dept_teach_list) {
              self.selteacher.mainlist = data.dept_teach_list;
              self.selteacher.show = true;
            }
          })
          .fail(() => {
            self.isSubmit = false;
          });
      },
      choiceteacher(data) {
        this.teacherid = data.tech_id;
        this.ok();
      },
      // 确定按钮
      ok() {
        let self = this;
        if (self.teacher == "") {
          self.toast("至少选择一个带教老师");
        } else {
          this.showConfirm({
            title: "分配带教老师",
            msg: "是否确认为该学员分配带教老师？",
            theme: "modal-confirm modal-white",
            cancel: function () { },
            ok: function () {
              self.selectTeacher();
            }
          });
        }
      },
      // 分配带教老师接口
      selectTeacher() {
        let self = this;
        self
          .post("/turn/assignteaching", {
            command: "turn/assignteaching",
            sessionid: $.cookie("sid"),
            loginid: $.cookie("uid"),
            teachingid: self.teacherid,
            tpdid: self.tpdid
          })
          .done(function (data) {
            self.selteacher.show = false;
            self.init(self.value);
          });
      },
      // 出科确认
      finishTrain(tpdid, num, uid, endtime) {
        let self = this;
        self.showConfirm({
          title: "出科确认",
          msg: "计划出科日期为" + endtime + "，是否确认让该学员出科。",
          theme: "modal-confirm modal-white",
          cancel: function () { },
          ok: function () {
            self.isSubmit = true;
            self
              .post("/turn/turnoutvalidate", {
                command: "turn/turnoutvalidate",
                sessionid: $.cookie("sid"),
                loginid: $.cookie("uid"),
                turnstatus: 3,
                id: tpdid
              })
              .done(function (data) {
                self.isSubmit = false;
                if (data) {
                  if (data.errcode == 400507) {
                    self.showConfirm({
                      title: "出科确认",
                      msg: "当前还有未完成的评价，是否确认该学员出科？",
                      theme: "modal-confirm modal-white",
                      cancel: function () { },
                      ok: function () {
                        self.updatastatus(tpdid, num, uid);
                      }
                    });
                  } else if (data.errcode == 0) {
                    self.updatastatus(tpdid, num, uid);
                  }
                }
              })
              .fail(function (error) {
                self.isSubmit = false;
              });
          }
        });
      },
      // 数组去重
      unique: function (arr) {
        let res = [];
        let json = {};
        for (var i = 0; i < arr.length; i++) {
          if (!json[arr[i]]) {
            res.push(arr[i]);
            json[arr[i]] = 1;
          }
        }
        return res.sort();
      },
      updatastatus(tpdid, num, uid) {
        let self = this;
        self.isSubmit = true;
        self
          .post("/turn/updateturnstatus", {
            command: "turn/updateturnstatus",
            sessionid: $.cookie("sid"),
            loginid: $.cookie("uid"),
            turnstatus: 3,
            tpdid: tpdid,
            num: num,
            uid: uid
          })
          .done(function (res) {
            self.isSubmit = false;
            if (res && res.errcode == 0) {
              self.init(self.value);
            } else if (res.errdesc) {
              self.toast(res.errdesc);
            } else {
              self.toast("服务器错误，请联系管理员。");
            }
          })
          .fail(function (error) {
            self.toast(error);
            self.isSubmit = false;
          });
      }
    }
  };
</script>
<style scoped>
  .g-main {
    padding-top: 0.66rem;
    font-size: 0.22rem;
    background: #f8f7f9 !important;
    color: rgb(100, 100, 100);
  }

  .allotTeacher {
    width: 100%;
    height: 0.66rem;
    background: rgb(253, 253, 253);
    /*border-bottom: solid 1px #c3c3c3;*/
    /*color: #3499db;*/
    line-height: 0.66rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.3rem;
  }

  .fixed {
    position: fixed;
    top: 1.48rem;
    z-index: 10;
  }

  .allotTeacher img {
    width: 0.2rem;
    height: 0.2rem;
    margin-right: 0.2rem;
    /*float: right;*/
  }

  /*.main{
        margin-bottom: 0.2rem;
    }*/
  /*.main:nth-last-of-type(1){
        margin-top: .2rem;
    }*/
  .list {
    padding-top: 0;
    /*background: white;*/
    background: rgb(252, 252, 252);
  }

  .doctorsDiv {
    width: 100%;
    height: 0.6rem;
    overflow-x: auto;
  }

  .doctorsDiv a {
    display: inline-block;
    height: 0.6rem;
    line-height: 0.6rem;
    text-align: center;
  }

  ul {
    background: rgb(252, 252, 252);
    padding: 0 0.3rem 0;
  }

  ul p {
    margin: 0;
  }

  ul li {
    padding: 0.05rem 0;
  }

  ul li:nth-of-type(1) {
    border-bottom: solid 1px rgb(240, 240, 240);
    padding: 0.1rem 0;
  }

  ul li:nth-of-type(2) {
    padding-top: 0.1rem;
  }

  ul li:nth-last-of-type(1) {
    padding-bottom: 0.1rem;
    border-bottom: solid 1px rgb(240, 240, 240);
  }

  ul li span:nth-of-type(2) {
    float: right;
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .headDiv {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0.05rem 0;
  }

  .headDiv div {
    width: calc(100% - 1rem);
  }

  .headerName {
    width: 100%;
  }

  .headerName span:nth-of-type(2) {
    float: right;
  }

  .headDiv img {
    width: 0.66rem;
    height: 0.66rem;
    margin-right: 0.2rem;
  }

  .footerBtn {
    width: 100%;
    height: 0.66rem;
    padding: 0.15rem 0.3rem;
    background: rgb(252, 252, 252);
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .footerBtn a {
    background: #3499db;
    color: white;
    padding: 0.1rem;
    border-radius: 0.1rem;
  }

  .modelol {
    height: 2rem;
    overflow-y: auto;
  }

  .modelol li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0.5rem;
    padding: 0 0.5rem;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.5s;
  }

  .slide-enter,
  .slide-leave-active {
    transform: translateY(100%);
    opacity: 0;
  }

  .modelDiv {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.2);
    position: fixed;
    top: 0;
    z-index: 100;
  }

  .modelCont {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 4rem;
    background: white;
  }

  .modelHead {
    width: 100%;
    height: 0.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.2rem;
    border-bottom: solid 1px #c3c3c3;
    margin: 0;
  }

  .modelHead a:nth-last-of-type(1) {
    color: #3499db;
  }

  .modelCont ol {
    width: 100%;
    height: 3.2rem;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1.3rem;
  }

  .modelCont ol li {
    width: 100%;
    height: 0.6rem;
    line-height: 0.6rem;
    text-align: center;
    color: #c3c3c3;
  }

  .center {
    border-top: solid 1px #c3c3c3;
    border-bottom: solid 1px #c3c3c3;
    width: calc(100% - 0.4rem);
    height: 0.6rem;
    position: absolute;
    z-index: 5000;
    bottom: 1.3rem;
    margin: 0 0.2rem;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  /*.slide-enter-active,.slide-leave-active{
        transition: all .5s ease;
    }
    .slide-enter,.slide-leave-active{
        transform: translateY(-100%);
        opacity: 0;
    }*/
  .teacherLi {
    color: black !important;
  }

  .stopscroll {
    overflow: hidden;
  }

  .noclick {
    pointer-events: none;
  }

  .t-turncode {
    color: #0b78e3;
  }
</style>
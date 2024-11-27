<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../assets/images/icon_fanhui.png" />
        </a>
      </div>
      <span class="deptname" @click="showPop">
        考勤-{{ deptname }}
        <template>
          <img v-if="seldept.show == true" src="../../assets/images/up-icon.png" />
          <img v-else src="../../assets/images/down-icon.png" />
        </template>
      </span>
      <div slot="headerRight" @click="totoa()" style="font-size: 0.3rem;color:#fff">查看历史</div>
    </c-header>
    <div class="g-main">
      <div class="census-content">
        <div id="echart"></div>
      </div>
      <div class="info">
        <ul class="getinfo">
          <li>
            <span :class="{ 'active': i == 0 }" @click="i = 0; showlist = signinlist">已签到({{ signinlist.length }})</span>
          </li>
          <li>
            <span :class="{ 'active': i == 1 }" @click="i = 1; showlist = notsignlist">未签到({{ notsignlist.length
            }})</span>
          </li>
        </ul>
        <ul class="stu-list">
          <li>
            <span>姓名</span>
            <span>学号</span>
            <span>带教老师</span>
            <span>出勤情况</span>
          </li>
          <template v-show="showlist && showlist.length > 0">
            <li :class="{ 'choice': item.editflag == 1, 'noclick': item.editflag == 0 }"
              @click="status.show = true, id = item.id" v-for="(item, index) in showlist">
              <span>{{ item.name }}</span>
              <span>{{ item.username }}</span>
              <span>{{ item.workusername }}</span>
              <span>{{ item.workattendancename }}</span>
            </li>
          </template>
          <li v-show="showlist.length == 0">
            <span>暂无内容</span>
          </li>
        </ul>
      </div>
      <!--更新状态-->
      <c-picker :config="status" @confirm="changeSinginStatus"></c-picker>
      <!--科室选择-->
      <c-picker :config="seldept" @confirm="selectdept"></c-picker>

      <div class="rotationc">
        <van-popup v-model="popShow" :lazy-render="false" :close-on-click-overlay="false" position="bottom">
          <van-nav-bar title="请选择" left-text="取消" right-text="确定" left-arrow @click-left="onClickLeft"
            @click-right="onClickRight" />
          <van-toast></van-toast>
          <div class="popCK">
            <div class="popCBox">
              <van-sidebar v-model="activeKey" @change="onChange">
                <van-sidebar-item v-for="(item, index) in columns" :title="item.name" :key="index" />
              </van-sidebar>
            </div>
            <div class="popKBox">
              <el-tree show-checkbox :check-strictly="true" :data="deptlist" :props="defaultProps"
                @check-change="checkClick" node-key="id" ref="tree"></el-tree>
            </div>
          </div>
        </van-popup>
      </div>
      <van-popup v-model="listShow" :lazy-render="false" :close-on-click-overlay="false" position="bottom">
        <van-picker ref="van_picker" show-toolbar
          :title="workattendanceType == '3' ? '旷工' : (workattendanceType == '4' ? '迟到' : (workattendanceType === '5' ? '早退' : '其他'))"
          :columns="columns" @cancel="onCancel" @confirm="onConfirm">
          <template #option="option">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div>{{ option }}{{ workattendanceType == '3' ? '天' : '分钟' }}</div>
            </div>
          </template>
        </van-picker>
      </van-popup>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import { Toast } from "vant";
import methods from "../../methods";
import { mapState, mapActions } from "vuex";
import cHeader from "../header";
import cPicker from "../../components/default-picker";
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/chart/pie";
export default {
  props: ["active"],
  data() {
    return {
      preId: null,
      id: "",
      opinion: ["签到", "请假", "旷工", "迟到", "早退"],
      opinionData: [],
      deptid: "",
      deptname: "",
      deptlist: [],
      signinlist: [],
      notsignlist: [],
      i: 0,
      showlist: [],
      status: {
        show: false,
        mainlist: [],
        valueKey: "name"
      },
      seldept: {
        show: false,
        mainlist: [],
        valueKey: "deptname"
      },
      indexList: [0, 0, 0],
      columnsc: [],
      popShow: false,
      popShow2: false,
      columns: [],
      oriactiveKey: "",
      activeKey: "",
      treeList: [],
      defaultProps: {
        children: "childrens",
        label: "name",
        disabled: function (data, node) {
          // 禁用回收站选项
          if (data.havePermission == 1) {
            return false;
          } else {
            return true;
          }
        }
      },
      orideptnameidList: [],
      deptnameidList: [],
      colTitle: '',
      listShow: false,
      workattendanceType: '',
      columns: [],
      day_columns: [1, 0.5]
    };
  },
  components: {
    cPicker,
    cHeader
  },
  watch: {},
  filters: {
    rate: function (value) {
      return Number(value).toFixed(2);
    }
  },
  computed: {
    ...mapState(["systype", "singindept", "turnstatus"])
  },
  created() {
    this.setsystype();
    let year = new Date().getFullYear();
    let _month = new Date().getMonth() + 1;
    let month = _month < 10 ? "0" + _month : _month;
    let day = new Date().getDate();
    this.workdate = year + "-" + month + "-" + day;
    this.setTurnstatus(this.$route.query.menutype);
  },
  mounted() {
    let self = this;
    self.preId = self.getPreId(this.$route.name);
    // this.initalldept();
    self.getTree();
    this.initstatus();
    this.registerToNative("goBack", function (data) {
      self.back();
    });
  },
  beforeDestroy() {
    console.log("destory");
    this.savePreId();
  },
  methods: {
    ...methods,
    ...mapActions([
      "showAlert",
      "showConfirm",
      "showLoading",
      "hideLoading",
      "toast",
      "setSystype",
      "setSingindept",
      "setMenuType",
      "setTurnstatus"
    ]),
    setsystype() {
      this.setSystype(this.$route.query.systype);
      this.setMenuType(this.$route.query.menutype);
    },
    totoa() {
      this.savePreId();
      this.$router.push({
        name: 'fdAttendance_history',
      })
    },
    initstatus() {
      let self = this;
      this.post("/traineestudent/queryDictionaryList", {
        command: "traineestudent/queryDictionaryList",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        // code:'workattendancetype'
        code: 'workattendancetype_pub'
      }).done(res => {
        if (res && res.errcode) {
          if (res.errcode == 0) {
            self.status.mainlist = res.dic_list;
          } else {
            self.toast(res.errdesc);
          }
        } else {
          self.toast("系统错误，请联系管理员~");
        }
      });
    },
    //获取所在的节点
    savePreId() {
      if ($.cookie("preIdList")) {
        let arr = JSON.parse($.cookie("preIdList"));
        let item = arr.find(item => item.route == this.$route.name);
        if (item) {
          item.id = this.$refs.tree.getCheckedKeys();
        } else {
          arr.push({
            route: this.$route.name,
            id: this.$refs.tree.getCheckedKeys()
          });
        }
        $.cookie("preIdList", JSON.stringify(arr), { expires: 30, path: "/" });
        console.log(arr)
      } else {
        let preIdList = [
          {
            route: this.$route.name,
            id: this.$refs.tree.getCheckedKeys()
          }
        ];
        let preIdListString = JSON.stringify(preIdList);
        console.log(preIdListString)
        $.cookie("preIdList", preIdListString, { expires: 30, path: "/" });
      }
    },
    initalldept() {
      let self = this;
      //   actionplanbase/getusermanagerdeptnotroles    19-02-24  原接口
      this.post("/deptinfo/getusermanagerdeptinfoforsysrole", {
        command: "deptinfo/getusermanagerdeptinfoforsysrole",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid"),
        ckrolecode: "traineeplandetailroles",
        ckparamvalue: self.turnstatus //self.$route.query.menutype,
      }).done(res => {
        if (res && res.errcode == 0) {
          self.deptlist = res.beanlist.officelist;
          self.seldept.mainlist = self.deptlist;
          if (self.singindept == "") {
            self.deptid = self.deptlist[0].id;
            self.deptname = self.deptlist[0].deptname;
          } else {
            self.deptid = self.singindept;
            self.deptlist.map(val => {
              if (val.id == self.deptid) {
                self.deptname = val.deptname;
              }
            });
          }
          self.init();
          self.getstulist();
          self.setSingindept(self.deptid);
        } else if (res.errdesc) {
          self.toast(res.errdesc);
        } else {
          self.toast("服务器错误，请联系管理员。");
        }
      });
    },
    init() {
      let self = this;
      this.post("/workattendance/workattendancedayanalysis", {
        command: "workattendance/workattendancedayanalysis",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        systype: self.systype,
        deptid: self.deptid,
        workdate: self.workdate,
        stdtype: self.turnstatus
      }).done(res => {
        if (res && res.errcode == 0) {
          self.opinionData = "";
          self.opinionData = [
            { value: res.bean.signpercent, name: "签到" },
            { value: res.bean.leavepercent, name: "请假" },
            { value: res.bean.absencepercent, name: "旷工" },
            { value: res.bean.latepercent, name: "迟到" },
            { value: res.bean.earlyretreatpercent, name: "早退" },
            // { value: res.bean.otherpercent, name: "其他" }
          ];
          self.$nextTick(function () {
            self.drawGraph("echart");
          });
        } else if (res.errdesc) {
          self.toast(res.errdesc);
        } else {
          self.toast("服务器错误，请联系管理员。");
        }
      });
    },
    showPop() {
      let self = this;
      self.popShow = true;
    },
    drawGraph: function (id) {
      //饼图
      let self = this;
      self.chart = echarts.init(document.getElementById(id));
      this.chart.showLoading();
      self.chart.setOption({
        title: {
          text: "考勤分析",
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
          data: self.opinion,
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
            data: self.opinionData,
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
    //获取人员列表
    getstulist() {
      let self = this;
      this.post("/workattendance/getworkattendanceforsecretary", {
        command: "workattendance/getworkattendanceforsecretary",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid"),
        systype: this.systype,
        deptid: self.deptid,
        workdate: self.workdate,
        stdtype: self.turnstatus
      }).done(res => {
        if (res && res.errcode == 0) {
          self.signinlist = res.result.signlist;
          self.notsignlist = res.result.notsignlist;
          self.showlist =
            self.i == 0 ? res.result.signlist : res.result.notsignlist;
        } else if (res.errdesc) {
          self.toast(res.errdesc);
        } else {
          self.toast("服务器错误，请联系管理员。");
        }
      });
    },
    onCancel() {
      let self = this;
      self.$refs.van_picker.setIndexes([0])
      self.listShow = false
    },
    onConfirm(value) {
      let self = this
      console.log(value)
      console.log(self.workattendanceType)
      this.post("/workattendance/updateworkattendance", {
        command: "workattendance/updateworkattendance",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        id: self.id,
        // workattendancetype: data.key
        workattendancetype:self.workattendanceType,
        timeLength: value,
        timeUnit: self.workattendanceType == '3' ? 4 : 2
      }).done(res => {
        if (res && res.errcode) {
          if (res.errcode == 0) {
            self.status.show = false;
            self.listShow = false;
            self.$refs.van_picker.setIndexes([0])
            Toast("修改成功~");
            self.getstulist();
            self.init();
          } else {
            self.toast(res.errdesc);
          }
        } else {
          self.toast("系统错误，请联系管理员~");
        }
      });
    },
    generateArray() {
      const array = [];
      for (let i = 1; i <= 120; i++) {
        array.push(i);
      }
      return array;
    },
    // 修改状态
    changeSinginStatus(data) {
      let self = this;
      self.workattendanceType = data.key;
      if (data.key == "3") {
        self.columns = self.day_columns
        self.listShow = true
        return
      } else if (data.key == '4' || data.key == '5') {
        self.columns = self.generateArray()
        self.listShow = true
        return
      }
      this.post("/workattendance/updateworkattendance", {
        command: "workattendance/updateworkattendance",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        id: self.id,
        workattendancetype: data.key
      }).done(res => {
        if (res && res.errcode) {
          if (res.errcode == 0) {
            self.status.show = false;
            // self.toast("修改成功~");
            Toast("修改成功~");
            self.getstulist();
            self.init();
          } else {
            self.toast(res.errdesc);
          }
        } else {
          self.toast("系统错误，请联系管理员~");
        }
      });
    },
    selectdept(data) {
      this.seldept.show = false;
      this.deptid = data.id;
      this.deptname = data.name;
      this.setSingindept(data.id);
      this.init();
      this.getstulist();
    },
    back() {
      this.savePreId()
      window.location.href =
        "/pages/futuredoctorapp/index.html/#/wxIndex";
      // if(this.$route.query.stem) {
      //   this.$router.push({
      //   name: "wxMenu",
      //   });
      // }else {
      //   this.$router.push({
      //   name: "wxIndex",
      //   });
      // }
    },
    getTree() {
      let self = this;
      self
        .post("/base/dept/getMyDeptTree", {
          showHospital: 1,
          showNoDeptHospital: 0,
          needBaseDept: 0,
          hospitalId: ""
        })
        .done(res => {
          if (res && res.resCode == 200) {
            if (Array.isArray(res.model) && res.model.length > 0) {
              console.log(res.model);
              if (self.preId) {
                let preObj = self.findObjectAndIndex(
                  res.model,
                  Number(self.preId)
                );
                console.log("preobj", preObj)
                if (preObj) {
                  console.log(111)
                  self.columns = res.model;
                  self.deptlist = res.model[preObj.index].childrens;
                  self.deptname = preObj.object.name;
                  self.orideptnameidList = [preObj.object.id];
                  self.deptid = preObj.object.id;
                  self.activeKey = preObj.index;
                  self.oriactiveKey = preObj.index;
                  this.$refs.tree.setCheckedKeys(self.orideptnameidList);
                  self.init();
                  self.getstulist();
                  self.setSingindept(self.deptid);
                } else {
                  console.log(222)
                  self.columns = res.model;
                  self.deptlist = res.model[0].childrens;
                  if (res.model[0].childrens[0].havePermission) {
                    self.deptname = res.model[0].childrens[0].name;
                    self.orideptnameidList = [res.model[0].childrens[0].id];
                    self.deptid = res.model[0].childrens[0].id;
                  } else {
                    if (res.model[0].childrens[0].childrens[0].havePermission) {
                      self.deptname =
                        res.model[0].childrens[0].childrens[0].name;
                      self.orideptnameidList = [
                        res.model[0].childrens[0].childrens[0].id
                      ];
                      self.deptid = res.model[0].childrens[0].childrens[0].id;
                    } else {
                      self.deptname =
                        res.model[0].childrens[0].childrens[0].childrens[0].name;
                      self.orideptnameidList = [
                        res.model[0].childrens[0].childrens[0].childrens[0].id
                      ];
                      self.deptid =
                        res.model[0].childrens[0].childrens[0].childrens[0].id;
                    }
                  }

                  this.$refs.tree.setCheckedKeys(self.orideptnameidList);
                  self.init();
                  self.getstulist();
                  self.setSingindept(self.deptid);
                }
              } else {
                self.columns = res.model;
                self.deptlist = res.model[0].childrens;
                if (res.model[0].childrens[0].havePermission) {
                  self.deptname = res.model[0].childrens[0].name;
                  self.orideptnameidList = [res.model[0].childrens[0].id];
                  self.deptid = res.model[0].childrens[0].id;
                } else {
                  if (res.model[0].childrens[0].childrens[0].havePermission) {
                    self.deptname = res.model[0].childrens[0].childrens[0].name;
                    self.orideptnameidList = [
                      res.model[0].childrens[0].childrens[0].id
                    ];
                    self.deptid = res.model[0].childrens[0].childrens[0].id;
                  } else {
                    self.deptname =
                      res.model[0].childrens[0].childrens[0].childrens[0].name;
                    self.orideptnameidList = [
                      res.model[0].childrens[0].childrens[0].childrens[0].id
                    ];
                    self.deptid =
                      res.model[0].childrens[0].childrens[0].childrens[0].id;
                  }
                }

                this.$refs.tree.setCheckedKeys(self.orideptnameidList);
                self.init();
                self.getstulist();
                self.setSingindept(self.deptid);
              }

            }
          }
        });
    },
    onChange(index) {
      let self = this;
      self.hosIdByDeptSave = self.columns[index].id;
      self.deptlist = self.columns[index].childrens;
    },
    checkClick(data, checked, node) {
      if (checked) {
        this.$refs.tree.setCheckedKeys([data.id]);
      }
    },
    onClickLeft() {
      let self = this;
      self.popShow = false;
      self.activeKey = self.oriactiveKey;
      self.deptnameidList = self.orideptnameidList;
      this.$refs.tree.setCheckedKeys(self.orideptnameidList);
    },
    onClickRight() {
      let self = this;
      if (
        this.$refs.tree.getCheckedKeys()[0] &&
        this.$refs.tree.getCheckedNodes()[0]
      ) {
        self.hosIdByDept = self.hosIdByDeptSave;
        self.oriactiveKey = self.activeKey;
        self.deptname = this.$refs.tree.getCheckedNodes()[0].name;
        self.deptid = this.$refs.tree.getCheckedNodes()[0].id;
        self.orideptnameidList = this.$refs.tree.getCheckedKeys();
        self.popShow = false;
        self.setSingindept(self.deptid);
        this.init();
        this.getstulist();
        this.savePreId();
      } else {
        Toast({
          message: "请选择科室",
          position: "bottom"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.census-content {
  display: flex;
  height: 5rem;
  padding: 0.2rem;
  background: #fff;

  #echart {
    /*需要制定具体高度，以px为单位*/
    height: 100%;
    width: 100%;
  }
}

.info {
  background: #fff;
  margin-top: 0.2rem;

  ul.getinfo {
    display: flex;
    border-bottom: 1px solid #eee;

    li {
      width: 0;
      flex: 1;
      text-align: center;
      line-height: 0.7rem;
      color: #888;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span {
      line-height: 0.7rem;
      font-size: 0.22rem;
    }

    span.active {
      border-bottom: 2px solid #3499db;
      color: #3499db;
    }
  }
}

ul.stu-list {
  color: #666;
  background: #fff;

  li {
    display: flex;
    border-bottom: 1px solid #eee;
    line-height: 0.6rem;
    text-align: center;
    padding: 0 0.2rem;
    position: relative;

    span {
      line-height: 0.6rem;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex: 1;
      width: 0;
    }
  }
}

.choice {
  padding-right: 0.4rem;
}

.choice:after {
  content: "";
  display: inline-block;
  flex: 3;
  width: 0.3rem;
  height: 0.3rem;
  background: url("../../assets/images/you-jiantou.png") 0 0 no-repeat;
  background-size: 100% 100%;
  position: absolute;
  right: 0.2rem;
  top: 0.15rem;
}

.noclick {
  pointer-events: none;
}

.deptname {
  width: 50%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.26rem !important;

  img {
    width: 0.28rem;
  }
}
</style>

<style lang="scss">
.popCBox {
  width: 40%;
  height: 350px;
  overflow: scroll;
}

.popKBox {
  width: 60%;
  height: 350px;
  overflow: scroll;
  padding-bottom: 80px;
}

.rotationc {
  .van-popup {
    height: 350px;
    transform: translate3d(0%, 0%, 0);
    overflow: hidden;
  }

  .popCK {
    display: flex;
    height: 350px;
  }

  .van-sidebar {
    width: 100%;
    height: 350px;
    padding-bottom: 48px;
  }

  .van-sidebar-item--select:before {
    background-color: #0079fd;
  }
}
</style>
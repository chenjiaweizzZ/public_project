<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../assets/images/icon_fanhui.png" />
        </a>
      </div>
      <span class="deptname" @click="showPop">
        {{tatistcal.deptname}}
        <template>
          <img v-if="seldept.show == true" src="../../assets/images/up-icon.png" />
          <img v-else src="../../assets/images/down-icon.png" />
        </template>
      </span>
      <div slot="headerRight" class="header-right-btn" @click="toanslysis">
        <img src="../../assets/images/analysis.png" />
      </div>
    </c-header>
    <!--TODO 列表-->
    <div class="top-slider">
      <ul v-if="tatistcal.systype == 1">
        <li
          :class="{'active':i == index}"
          v-for="(item,index) in sliderlist"
          @click="changeTab(index)"
          :key="index"
        >{{item.name}}</li>
      </ul>
      <ul v-else>
        <li
          :class="{'active':i == index}"
          v-for="(item,index) in trainee_sliderlist"
          @click="changeTab(index)"
          :key="index"
        >{{item.name}}</li>
      </ul>
    </div>
    <div class="g-main">
      <!--统计列表-->
      <c-master v-if="role == 0" :code="i" :deptList="deptList"></c-master>
      <c-owner v-else :code="i"></c-owner>
    </div>
    <!--科室选择-->
    <c-picker :config="seldept" @confirm="selectdept"></c-picker>
    <div class="rotationh">
      <van-popup
        v-model="popShow"
        :lazy-render="false"
        :close-on-click-overlay="false"
        position="bottom"
      >
        <van-picker
          ref="pick"
          show-toolbar
          title="请选择"
          :columns="columnsc"
          value-key="name"
          @confirm="onConfirm"
          @cancel="onCancel"
        />
      </van-popup>
    </div>
    <div class="rotationc">
      <van-popup
        v-model="popShow2"
        :lazy-render="false"
        :close-on-click-overlay="false"
        position="bottom"
      >
        <van-nav-bar
          title="请选择"
          left-text="取消"
          right-text="确定"
          left-arrow
          @click-left="onClickLeft"
          @click-right="onClickRight"
        />
        <van-toast></van-toast>
        <div class="popCK">
          <div class="popCBox">
            <van-sidebar v-model="activeKey" @change="onChange">
              <van-sidebar-item v-for="(item,index) in columns" :title="item.name" :key="index" />
            </van-sidebar>
          </div>
          <div class="popKBox">
            <el-tree
              show-checkbox
              :check-strictly="true"
              :data="treeList"
              :props="defaultProps"
              @check-change="checkClick"
              @check="changetree"
              node-key="id"
              :default-checked-keys="deptnameidList"
              :default-expanded-keys="deptnameidList"
              ref="tree"
            ></el-tree>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import methods from "../../methods";
import { mapState, mapActions } from "vuex";
import cHeader from "../header";
import cPicker from "../../components/default-picker";
import cMaster from "./master_list";
import cOwner from "./owner_list";

export default {
  data() {
    return {
      preId: null,
      role: null,
      i: null,
      dept: "",
      deptname: "",
      deptid: "",
      deptList: [],
      seldept: {
        show: false,
        mainlist: [],
        valueKey: "deptname"
      },
      sliderlist: [
        {
          name: "科室评分"
        },
        {
          name: "带教评分"
        },
        {
          name: "教学活动"
        },
        {
          name: "考勤统计"
        }
      ],
      trainee_sliderlist: [
        {
          //必要对象;下标取值
        },
        {
          name: "带教评分"
        },
        {
          name: "教学活动"
        },
        {
          name: "考勤统计"
        }
      ],
      indexList: [0, 0, 0],
      columnsc: [],
      popShow: false,
      popShow2: false,
      columns: [],
      oriactiveKey: 0,
      activeKey: 0,
      treeList: [],
      defaultProps: {
        children: "childrens",
        label: "name",
        disabled: function(data, node) {
          // 禁用回收站选项
          if (data.havePermission == 1) {
            return false;
          } else {
            return true;
          }
        }
      },
      orideptnameidList: [],
      deptnameidList: []
    };
  },
  components: {
    cPicker,
    cHeader,
    cMaster,
    cOwner
  },
  watch: {
    i: function(val, oldval) {
      if (val !== oldval) {
        this.setTatistical({ k: "tab", v: val });
      }
    }
  },
  filters: {},
  computed: {
    ...mapState(["tatistcal"])
  },
  created() {
    // this.setsystype();
    if (this.$route.query.systype == 1) {
      this.i = this.tatistcal.tab || 0;
    } else {
      this.i = this.tatistcal.tab || 1;
    }
    // setTimeout(()=>{
    //     console.log(this.tatistcal)
    //     this.dept = this.tatistcal.dept
    //
    //     this.deptname = this.tatistcal.deptname
    //     this.role = this.tatistcal.role
    // },3000)
    //  this.initrole();
  },
  mounted() {
    //初始化将路由上的systype的属性值设置在vuex中
    let self = this;
    self.preId = self.getPreId(this.$route.name);
    this.setsystype();
    // this.initrole();
    this.getTree();
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
            self.seldept.mainlist = res.depttreelist;
            if (!this.tatistcal.deptname || !self.deptname) {
              self.deptname = res.depttreelist[0].deptname;
              self.dept = res.depttreelist[0].id;
              self.setTatistical({ k: "deptname", v: self.deptname });
              self.setTatistical({ k: "dept", v: res.depttreelist[0].id });
            }
            if (!this.tatistcal.dept) {
              self.setTatistical({ k: "deptname", v: self.deptname });
              self.setTatistical({ k: "dept", v: res.depttreelist[0].id });
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
            this.role = this.tatistcal.role;
          } else {
            self.toast(res.errdesc);
          }
        } else {
          self.toast("系统错误，请联系管理员~");
        }
      });
    },
    selectdept(param) {
      this.deptname = param.deptname;
      this.dept = param.id;
      this.setTatistical({ k: "normal", v: param.id });
      this.setTatistical({ k: "dept", v: param.id });
      this.setTatistical({ k: "deptname", v: param.deptname });
      // if (param.deptcode == "office") {
      //   this.role = 0;
      // } else {
      //   this.role = 1;
      // }
      if (param.deptlevel == 3) {
        this.role = 0;
        this.deptList = [];
      } else {
        this.deptList = [param.id];
        this.role = 1;
      }
      this.setTatistical({ k: "role", v: this.role });
      this.seldept.show = false;
    },
    //设置类型
    setsystype() {
      this.setTatistical({ k: "systype", v: this.$route.query.systype });
    },
    //科室评分 带教评分 教学活动 考勤统计切换栏
    changeTab(index) {
      this.i = index;
      this.dept = this.tatistcal.dept;
      this.deptList = [];
    },
    //饼状图统计
    toanslysis() {
      if (this.tatistcal.systype == 1) {
        this.i = 0;
      } else {
        this.i = 1;
      }
      //跳转统计页面
      if (this.$route.query.systype == 1) {
        // this.$router.push({
        //   path: "/tatistical/analysis",
        //   query: {
        //     systype: this.$route.query.systype,
        //     menutype: this.$route.query.menutype,
        //     index0: this.indexList[0],
        //     index1: this.indexList[1],
        //     index2: this.indexList[2]
        //   }
        // });
        this.savePreId()
        this.$router.push({
          // path: "/tatistical/analysis",
          name: "fdTatistical_analysis",
          query: {
            systype: this.$route.query.systype,
            menutype: this.$route.query.menutype,
            activeKey: this.activeKey,
            deptid: this.deptnameidList[0]
          }
        });
      } else if (this.$route.query.systype == 2) {
        this.$router.push({
          // path: "/tatistical/analysis",
          name: "fdTatistical_analysis",
          query: {
            systype: this.$route.query.systype,
            menutype: this.$route.query.menutype,
            activeKey: this.activeKey,
            deptid: this.deptnameidList[0]
          }
        });
      }
    },
    back() {
      this.savePreId()
      window.location.href =
        "/pages/futuredoctorapp/index.html/#/wxIndex";
      
    },
    showPop() {
      let self = this;
      if (self.$route.query.systype == 1) {
        // self.popShow = true;
        // self.$refs.pick.setColumnIndex(0, this.indexList[0]);
        // self.$refs.pick.setColumnIndex(1, this.indexList[1]);
        // self.$refs.pick.setColumnIndex(2, this.indexList[2]);
        self.popShow2 = true;
        self.oriactiveKey = self.activeKey;
        self.orideptnameidList = self.deptnameidList;
        console.log(self.orideptnameidList);
        this.$refs.tree.setCheckedKeys(self.orideptnameidList);
      } else if (self.$route.query.systype == 2) {
        self.popShow2 = true;
        self.oriactiveKey = self.activeKey;
        self.orideptnameidList = self.deptnameidList;
        console.log(self.orideptnameidList);
        this.$refs.tree.setCheckedKeys(self.orideptnameidList);
      }
      // self.seldept.show = true;
    },
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
    getTree() {
      let self = this;
      if (self.$route.query.systype == 1) {
        self.post("/base/dept/getMyDeptTree", {
        showHospital: 1,
        showNoDeptHospital: 0,
        needBaseDept: 0,
        hospitalId: "",
          })
          .done(res => {
            let preObj = null
            if(self.preId) {
              preObj = self.findObjectAndIndex(
                  res.model,
                  Number(self.preId)
              ); 
            }
            if(preObj) {
              self.columns = res.model;
              self.treeList = res.model[preObj.index].childrens;
              self.titledeptid = preObj.object.id;
                self.deptnameidList = [preObj.object.id];
                self.deptname = preObj.object.name;
                self.deptnameid = preObj.object.id;
                self.deptid = preObj.object.id;
                self.activeKey = preObj.index;
                  self.oriactiveKey = preObj.index;
                self.$refs.tree.setCheckedKeys([preObj.object.id]);
                let obj = {
                deptname: self.deptname,
                id: self.deptnameid,
                deptlevel: 3
              };
              self.selectdept(obj);
              self.setTatistical({ k: "deptname", v: self.deptname });
              self.setTatistical({ k: "dept", v: self.deptid });
            }else {
              self.columns = res.model;
              self.treeList = res.model[0].childrens;
              self.titledeptid = self.deptnameid;
              if (self.treeList[0].havePermission == 1) {
                console.log(self.treeList[0].id);
                self.$refs.tree.setCheckedKeys([self.treeList[0].id]);
                self.deptnameidList = [self.treeList[0].id];
                self.deptname = self.treeList[0].name;
                self.deptnameid = self.treeList[0].id;
                self.deptid = self.treeList[0].id;
              } else if (self.treeList[0].childrens[0].havePermission == 1) {
                console.log(self.treeList[0].childrens[0].id);
                self.$refs.tree.setCheckedKeys([
                  self.treeList[0].childrens[0].id
                ]);
                self.deptnameidList = [self.treeList[0].childrens[0].id];
                self.deptname = self.treeList[0].childrens[0].name;
                self.deptnameid = self.treeList[0].childrens[0].id;
                self.deptid = self.treeList[0].childrens[0].id;
              } else if (
                self.treeList[0].childrens[0].childrens[0].havePermission == 1
              ) {
                console.log(self.treeList[0].childrens[0].childrens[0].id);
                self.$refs.tree.setCheckedKeys([
                  self.treeList[0].childrens[0].childrens[0].id
                ]);
                self.deptnameidList = [
                  self.treeList[0].childrens[0].childrens[0].id
                ];
                self.deptname = self.treeList[0].childrens[0].childrens[0].name;
                self.deptnameid = self.treeList[0].childrens[0].childrens[0].id;
                self.deptid = self.treeList[0].childrens[0].childrens[0].id;
              }
              let obj = {
                deptname: self.deptname,
                id: self.deptnameid,
                deptlevel: 3
              };
              self.selectdept(obj);
              self.setTatistical({ k: "deptname", v: self.deptname });
              self.setTatistical({ k: "dept", v: self.deptid });
              // self.role = 1;
              this.deptList = [];
            }
          });
      } else if (self.$route.query.systype == 2) {
        self
          .post("/base/dept/getMyDeptTree", {
            showHospital: 1,
            showNoDeptHospital: 0,
            needBaseDept: 0,
            hospitalId: "",
          })
          .done(res => {
            setTimeout(() => {
              self.columns = res.model;
              self.treeList = res.model[0].childrens;
              self.titledeptid = self.deptnameid;
              if (self.treeList[0].havePermission == 1) {
                console.log(self.treeList[0].id);
                self.$refs.tree.setCheckedKeys([self.treeList[0].id]);
                self.deptnameidList = [self.treeList[0].id];
                self.deptname = self.treeList[0].name;
                self.deptnameid = self.treeList[0].id;
                self.deptid = self.treeList[0].id;
              } else if (self.treeList[0].childrens[0].havePermission == 1) {
                console.log(self.treeList[0].childrens[0].id);
                self.$refs.tree.setCheckedKeys([
                  self.treeList[0].childrens[0].id
                ]);
                self.deptnameidList = [self.treeList[0].childrens[0].id];
                self.deptname = self.treeList[0].childrens[0].name;
                self.deptnameid = self.treeList[0].childrens[0].id;
                self.deptid = self.treeList[0].childrens[0].id;
              } else if (
                self.treeList[0].childrens[0].childrens[0].havePermission == 1
              ) {
                console.log(self.treeList[0].childrens[0].childrens[0].id);
                self.$refs.tree.setCheckedKeys([
                  self.treeList[0].childrens[0].childrens[0].id
                ]);
                self.deptnameidList = [
                  self.treeList[0].childrens[0].childrens[0].id
                ];
                self.deptname = self.treeList[0].childrens[0].childrens[0].name;
                self.deptnameid = self.treeList[0].childrens[0].childrens[0].id;
                self.deptid = self.treeList[0].childrens[0].childrens[0].id;
              }
              let obj = {
                deptname: self.deptname,
                id: self.deptnameid,
                deptlevel: 3
              };
              console.log("obj2", obj);
              self.selectdept(obj);
              self.setTatistical({ k: "deptname", v: self.deptname });
              self.setTatistical({ k: "dept", v: self.deptid });
              // self.role = 1;
              this.deptList = [];
            }, 100);
          });
      }
    },
    onConfirm(list, index) {
      let self = this;
      self.indexList = index;
      self.deptname =
        self.columnsc[index[0]].children[index[1]].children[index[2]].name;
      self.deptid =
        self.columnsc[index[0]].children[index[1]].children[index[2]].id;
      this.popShow = false;
      let obj = {
        deptname: self.deptname,
        id: self.deptid,
        deptlevel:
          self.columnsc[index[0]].children[index[1]].children[index[2]]
            .deptlevel
      };
      console.log("onconfirmobj", obj);
      self.selectdept(obj);
    },
    onCancel() {
      let self = this;
      self.popShow = false;
      console.log(this.indexList);
      self.$refs.pick.setColumnIndex(0, this.indexList[0]);
      self.$refs.pick.setColumnIndex(1, this.indexList[1]);
      self.$refs.pick.setColumnIndex(2, this.indexList[2]);
    },
    handleNodeClick(data) {
      console.log(data);
    },
    onChange(index) {
      let self = this;
      self.treeList = self.columns[index].childrens;
    },
    onClickLeft() {
      let self = this;
      self.popShow2 = false;
      self.activeKey = self.oriactiveKey;
      self.deptnameidList = self.orideptnameidList;
      this.$refs.tree.setCheckedKeys(self.orideptnameidList);
      // self.treeList = self.
    },
    onClickRight() {
      let self = this;
      if (
        this.$refs.tree.getCheckedKeys()[0] &&
        this.$refs.tree.getCheckedNodes()[0]
      ) {
        console.log("22222222222", this.$refs.tree.getCheckedNodes()[0]);
        self.deptid = this.$refs.tree.getCheckedKeys()[0];
        self.deptname = this.$refs.tree.getCheckedNodes()[0].name;
        self.deptnameid = this.$refs.tree.getCheckedKeys()[0];
        self.deptid = this.$refs.tree.getCheckedKeys()[0];
        self.deptnameidList = this.$refs.tree.getCheckedKeys();
        let obj = {
          deptname: self.deptname,
          id: self.deptid,
          deptlevel: 3
        };
        console.log("thisisobj", obj);
        self.selectdept(obj);
        self.popShow2 = false;
        this.savePreId();
        // console.log(self.deptid);
        // console.log(self.deptname);
        // this.init();
        // this.getstulist();
      } else {
        Toast({
          message: "请选择科室",
          position: "bottom"
        });
        Toast({
          message: "请选择科室",
          position: "bottom"
        });
        Toast({
          message: "请选择科室",
          position: "bottom"
        });
        Toast({
          message: "请选择科室",
          position: "bottom"
        });
      }
      // self.popShow = false;
      // self.deptnameid = this.$refs.tree.getCheckedKeys()[0];
      // self.deptnameidList = this.$refs.tree.getCheckedKeys();
      // self.selectdept(this.$refs.tree.getCheckedNodes()[0]);
    },
    checkClick(data, checked, node) {
      if (checked) {
        this.$refs.tree.setCheckedKeys([data.id]);
      }
    },
    changetree(data, lst) {
      if (lst.checkedKeys.length == 0) {
        //这里的treeForm是你el-tree命名的ref的值
        this.$refs.tree.setCheckedKeys([data.id]);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.header-right-btn {
  img {
    width: 0.35rem;
  }
}
.top-slider {
  background: #fff;
  height: 0.76rem;
  ul {
    height: 0.76rem;
    overflow-y: hidden;
    overflow-x: scroll;
    display: flex;
    cursor: move;
  }
  li {
    display: inline;
    white-space: nowrap;
    line-height: 0.76rem;
    padding: 0 0.3rem;
    font-size: 0.3rem;
  }
  .active {
    color: #3499db;
  }
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

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
    </c-header>
    <!--TODO 列表-->
    <div class="top-slider">
      <ul v-if="tatistcal.systype == 1" class="uulldja">
        <li
          :class="{'active':i == index}"
          v-for="(item,index) in sliderlist"
          @click="changeTab(index)"
          :key="index"
        >{{item.name}}</li>
      </ul>
      <ul v-else uulldja>
        <li
          :class="{'active':i == index}"
          v-for="(item,index) in tainee_sliderlist"
          @click="changeTab(index)"
          :key="index"
        >{{item.name}}</li>
      </ul>
    </div>
    <div class="g-main">
      <!--统计图表-->
      <!--<c-master v-if="role == 0" :code ='i'>-->

      <!--</c-master>-->
      <c-owner :code="i"></c-owner>
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
import cMaster from "./master_analysis";
import cOwner from "./owner_analysis";
export default {
  data() {
    return {
      i: 0,
      role: "",
      deptname: "",
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
      tainee_sliderlist: [
        {
          //不要删掉这个空对象,因为此处用下标取值
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
      selecttime: "",
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
  watch: {},
  filters: {},
  computed: {
    ...mapState(["tatistcal"])
  },
  created() {
    if (this.tatistcal.systype == 1) {
      this.i = 0;
    } else {
      this.i = 1;
    }
    this.role = this.tatistcal.role;
    this.deptname = this.tatistcal.deptname;
    let _month = new Date().getMonth() + 1;
    let month = _month < 10 ? "0" + _month : _month;
    this.inselecttime = new Date().getFullYear() + "-" + _month;
  },
  mounted() {
    this.initrole();
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
    changeTab(index) {
      this.i = index;
    },
    back() {
      window.history.back();
    },

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
            if (this.role !== 0 && this.role !== 1) {
              if (res.depttreelist[0].deptcode == "office") {
                self.role = 0;
                self.setTatistical({ k: "role", v: self.role });
              } else {
                self.role = 1;
                self.setTatistical({ k: "role", v: self.role });
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
    selectdept(param) {
      console.log("thissss", param);
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
      } else {
        this.role = 1;
      }
      this.setTatistical({ k: "role", v: this.role });
      this.seldept.show = false;
    },
    showPop() {
      let self = this;
      if (self.$route.query.systype == 1) {
        // self.popShow = true;
        // self.$refs.pick.setColumnIndex(0, this.indexList[0]);
        // self.$refs.pick.setColumnIndex(1, this.indexList[1]);
        // self.$refs.pick.setColumnIndex(2, this.indexList[2]);
        self.popShow2 = true;
      } else {
        self.popShow2 = true;
      }
      // self.seldept.show = true;
    },
    getTree() {
      let self = this;
      if (self.$route.query.systype == 1) {
        // self
        //   .post("/base/dept/getMyHosBaseDeptTree", {
        //     showHospital: 1,
        //     showNoDeptHospital: 0
        //   })
        //   .done(res => {
        //     res.model.forEach(i => {
        //       i.childrens.forEach(j => {
        //         if (j.childrens == null) {
        //           j.childrens = [];
        //         }
        //         j.childrens.unshift({
        //           id: j.id,
        //           name: j.name,
        //           baseId: j.baseId,
        //           deptlevel: j.deptlevel,
        //           havePermission: j.havePermission,
        //           type: j.type,
        //           pid: j.pid
        //         });
        //       });
        //     });
        //     self.columnsc = JSON.parse(
        //       JSON.stringify(res.model).replace(/childrens/g, "children")
        //     );
        //     setTimeout(() => {
        //       self.indexList = [
        //         self.$route.query.index0,
        //         self.$route.query.index1,
        //         self.$route.query.index2
        //       ];
        //     }, 100);
        //   });
        self
          .post("/base/dept/getMyDeptTree", {
            showHospital: 1,
            showNoDeptHospital: 0,
            needBaseDept: 0,
            hospitalId: "",
          })
          .done(res => {
            self.columns = res.model;
            self.treeList = res.model[self.$route.query.activeKey].childrens;
            self.deptnameidList = [self.$route.query.deptid];
            self.orideptnameidList = [self.$route.query.deptid];
            self.activeKey = self.$route.query.activeKey;
            self.oriactiveKey = self.$route.query.activeKey;
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
            self.columns = res.model;
            self.treeList = res.model[self.$route.query.activeKey].childrens;
            self.deptnameidList = [self.$route.query.deptid];
            self.orideptnameidList = [self.$route.query.deptid];
            self.activeKey = self.$route.query.activeKey;
            self.oriactiveKey = self.$route.query.activeKey;
          });
      }
    },
    onConfirm(list, index) {
      let self = this;
      console.log(index);
      self.indexList = index;
      console.log(
        self.columnsc[index[0]].children[index[1]].children[index[2]]
      );
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
      console.log(obj);
      // this.setTatistical({ k: "normal", v: self.deptid });
      // this.setTatistical({ k: "dept", v: self.deptid });
      // this.setTatistical({ k: "deptname", v: self.deptname });
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
        console.log(self.deptid, self.deptname);
        this.setTatistical({ k: "normal", v: self.deptid });
        this.setTatistical({ k: "dept", v: self.deptid });
        this.setTatistical({ k: "deptname", v: self.deptname });
        console.log(
          this.tatistcal.dept,
          this.tatistcal.deptname,
          this.tatistcal.role
        );
        self.selectdept(obj);
        self.popShow2 = false;
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
.top-slider {
  background: #fff;
  height: 0.76rem;

  ul {
    height: 0.76rem;
    overflow-y: hidden;
    overflow-x: scroll;
    cursor: move;
    display: flex;
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

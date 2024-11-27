<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../../assets/images/icon_fanhui.png" />
        </a>
      </div>
      <!--住培轮转-->
      <span class="deptname" @click="showPop">
        {{deptname}}
        <template>
          <img v-if="seldept.show == true" src="../../../assets/images/up-icon.png" />
          <img v-else src="../../../assets/images/down-icon.png" />
        </template>
      </span>
      <div slot="headerRight" class="looktable" @click="totablelist">报表查看</div>
    </c-header>
    <c-tabs :bus="bus" @change-tab="changeTab">
      <c-tab title="轮转中" :active="type == 1" :bus="bus" data="1"></c-tab>
      <c-tab title="待入科" :active="type == 2" :bus="bus" data="2"></c-tab>
      <c-tab title="未轮转" :active="type == 3" :bus="bus" data="3"></c-tab>
      <c-tab title="己轮转" :active="type == 5" :bus="bus" data="5"></c-tab>
    </c-tabs>
    <div class="g-main">
      <div v-show="type == 1">
        <rotation-ready
          :active="type == 1"
          :showck="showck"
          :titledeptid="titledeptid"
          :deptname="deptname"
          @savePreId="savePreId"
        ></rotation-ready>
      </div>
      <div v-show="type == 2">
        <rotation-wating
          :active="type == 2"
          :shownotturn="shownotturn"
          :titledeptid="titledeptid"
          :deptname="deptname"
          @savePreId="savePreId"
        ></rotation-wating>
      </div>
      <div v-show="type == 3">
        <rotation-notturn :active="type == 3" :titledeptid="titledeptid" :deptname="deptname" @savePreId="savePreId"></rotation-notturn>
      </div>
      <div v-show="type == 5">
        <rotation-already
          :active="type == 5"
          :shownotturn="shownotturn"
          :titledeptid="titledeptid"
          :deptname="deptname"
          @savePreId="savePreId"
        ></rotation-already>
      </div>
    </div>
    <!--科室选择-->
    <c-picker :config="seldept" @confirm="selectdept"></c-picker>
    <div class="rotationc">
      <van-popup
        v-model="popShow"
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
        <div style="overflow-y: scroll;height: 304px;">
          <!-- <div class="popCBox">
            <van-sidebar v-model="activeKey" @change="onChange">
              <van-sidebar-item v-for="(item,index) in columns" :title="item.name" :key="index" />
            </van-sidebar>
          </div>
          <div class="popKBox"> -->
            <el-tree
              show-checkbox
              :check-strictly="true"
              :data="deptList"
              :props="defaultProps"
              @check-change="checkClick"
              node-key="id"
              ref="tree"
            ></el-tree>
          <!-- </div> -->
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import Vue from "vue";
import cHeader from "../../header";
import methods from "../../../methods";
import cTab from "../../../components/tab";
import cTabs from "../../../components/tabs";
import rotationReady from "./rotation_ready";
import rotationWating from "./rotation_wating";
import rotationNotturn from "./rotation_notturn";
import rotationAlready from "./rotation_already";
import cPicker from "../../../components/default-picker";
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
      preId: null,
      type: 1,
      bus: bus,
      showck: true,
      shownotturn: true,
      seldept: {
        show: false,
        mainlist: [],
        valueKey: "deptname"
      },
      deptname: "",
      titledeptid: "",
      popShow: false,
      columns: [],
      deptList: [],
      hosIdByDeptSave: 0,
      oriactiveKey: 0,
      activeKey: 0,
      deptnameidList: [],
      orideptnameidList: [],
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
      }
    };
  },
  created() {
    let self = this
    if (this.$route.query.where == 4) {
      this.type = 3;
    } else {
      this.type = this.$route.query.where;
    }
  },
  //  computed: {
  //     bactive: function(){
  //         return this.type - 1;
  //     }
  // },
  mounted() {
    let self = this;
    self.preId = self.getPreId(this.$route.name)
    // this.initdeptname();
    self.registerToNative("goBack", function(data) {
      self.back();
    });
    this.initautoturnckconf();
    this.initautonotturnconf();
    this.getTree();
  },
  beforeDestroy() {
    console.log("destory");
    this.savePreId();
  },
  methods: {
    ...methods,
    back: function() {
      this.savePreId()
      // location.href = "/pages/futuredoctorapp/todo.html?view=application";
      window.location.href =
        "/pages/futuredoctorapp/index.html/#/wxIndex";
    },
    changeTab(tab) {
      this.type = tab.data;
    },
    savePreId() {
      console.log('科室ids',this.$refs.tree.getCheckedKeys());
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
      } else {
        let preIdList = [
          {
            route: this.$route.name,
            id: this.$refs.tree.getCheckedKeys()
          }
        ];
        let preIdListString = JSON.stringify(preIdList);
        $.cookie("preIdList", preIdListString, { expires: 30, path: "/" });
      }
    },
    // 是否配置自动出科
    initautoturnckconf() {
      let self = this;
      self
        .post("/turn/ckparaminfo", {
          command: "turn/ckparaminfo",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          code: "autoturnckconf",
          paramvalue: 1
        })
        .done(function(data) {
          if (data && data.errcode == 0) {
            self.showck = data.value == 1 ? false : true;
          }
        })
        .fail(function(error) {});
    },
    // 是否配置自动未轮转
    initautonotturnconf() {
      let self = this;
      self
        .post("/turn/ckparaminfo", {
          command: "turn/ckparaminfo",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          code: "autonotturnconf",
          paramvalue: 1
        })
        .done(function(data) {
          if (data && data.errcode == 0) {
            self.shownotturn = data.value == 1 ? false : true;
          }
        })
        .fail(function(error) {});
    },

    initdeptname() {
      let self = this;
      self
        .post("/deptinfo/getusermanagerdeptinfoforsysrole", {
          command: "deptinfo/getusermanagerdeptinfoforsysrole",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid"),
          ckrolecode: "turndoctorroles", //住陪系统：turndoctorroles<br>实习生系统：traineeroles |
          rolelist: [2] //科秘：[2]//科主任：[3]//实习秘书:[1]//>管理者:[6, 7, 8] |
        })
        .done(function(data) {
          if (data && data.errcode == 0) {
            //  self.deptname = data.beanlist.officelist[0].deptname;
            //  self.titledeptid = data.beanlist.officelist[0].id;
            self.seldept.mainlist = data.beanlist.officelist;
            if (self.$route.query.deptid) {
              self.deptname = self.$route.query.deptname;
              self.titledeptid = self.$route.query.deptid;
            } else {
              self.deptname = data.beanlist.officelist[0].deptname;
              self.titledeptid = data.beanlist.officelist[0].id;
            }
          }
        })
        .fail(function(error) {});
    },

    selectdept(param) {
      this.deptname = param.deptname;
      this.titledeptid = param.id;
      this.seldept.show = false;
    },
    totablelist() {
      //前往列表
      this.$router.push({
        name: "fdRotation_reportlist",
        query: {
          deptid: this.titledeptid,
          deptname: this.deptname,
          activeKey: this.activeKey
        }
      });
    },
    showPop() {
      let self = this;
      self.popShow = true;
    },
    getTree() {
      let self = this;
      self
        .post("/base/dept/getMyDeptTree", {
          showBase: false
        })
        .done(res => {
          if (res && res.resCode == 200) {
            if (Array.isArray(res.model) && res.model.length > 0) {
              self.deptList = res.model
              self.columns = res.model;
              if (self.$route.query.back) {
                console.log("000",this.$route.query.deptid)
                if(!Array.isArray(this.$route.query.deptid)){
                  self.orideptnameidList = [this.$route.query.deptid]
                } else{
                  self.orideptnameidList = this.$route.query.deptid;
                }
                self.deptname = this.$route.query.deptname;
                self.titledeptid = this.$route.query.deptid;
                this.$refs.tree.setCheckedKeys(self.orideptnameidList);
              } else if (self.preId) {
                console.log("111",self.preId) //preId为数组
                let preObj = {}
                let preList = []
                let deptname = []
                let titledeptid = []
                self.preId.map(item=>{
                  preObj = self.findObjectAndIndex(res.model,Number(item));
                  if (preObj) {
                    preList.push(preObj)
                    deptname.push(preObj.object.name) //科室名
                    titledeptid.push(preObj.object.id) //科室id
                  }
                })
                if (preList) {
                  self.deptname = deptname.join(',');
                  self.orideptnameidList = titledeptid;
                  self.titledeptid =titledeptid;
                  this.$refs.tree.setCheckedKeys(self.orideptnameidList);
                } else {
                  let obj = self.findObjectWithDeptLevel3(res.model);
                  self.deptname = obj.object.name;
                  self.orideptnameidList = [obj.object.id];
                  self.titledeptid = obj.object.id;
                  this.$refs.tree.setCheckedKeys(self.orideptnameidList);
                }
              } else {
                console.log("222")
                  let obj = self.findObjectWithDeptLevel3(res.model);
                  console.log(obj);
                  self.deptname = obj.object.name;
                  self.orideptnameidList = [obj.object.id];
                  self.titledeptid = obj.object.id;
                  this.$refs.tree.setCheckedKeys(self.orideptnameidList);
              }
              // self.init()
            }
          }
        });
    },
    onChange(index) {
      let self = this;
      self.hosIdByDeptSave = self.columns[index].id;
      self.deptList = self.columns[index].childrens;
    },
    checkClick(data, checked, node) {
      // if (checked) {
      //   this.$refs.tree.setCheckedKeys([data.id]);
      // }
      console.log(data, checked, node);
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
        let checkList = this.$refs.tree.getCheckedNodes()
        let names = []
        let ids =[]
        checkList.map(item=>{
          names.push(item.name)
          ids.push(item.id)
        })
        self.hosIdByDept = self.hosIdByDeptSave;
        self.oriactiveKey = self.activeKey;
        self.deptname = names.join(',');
        self.titledeptid = ids;
        self.orideptnameidList = this.$refs.tree.getCheckedKeys();
        self.popShow = false;
        // self.init()
        console.log(111,self.titledeptid);
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
<style scoped lang="scss">
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
</style>

<style lang="scss">
.rotationh {
  .van-popup--bottom {
    transform: translate3d(0%, 0%, 0);
  }
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
  }

  .van-sidebar-item--select:before {
    background-color: #0079fd;
  }
}
</style>
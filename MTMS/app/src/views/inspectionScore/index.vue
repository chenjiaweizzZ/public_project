<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../assets/images/icon_fanhui.png" />
        </a>
      </div>巡查评分
      <div slot="headerRight" style="font-size: 0.3rem" @click="scoretype.show=true">评分</div>
    </c-header>
    <div class="fixed_top">
      <!--搜索-->
      <div class="div_search">
        <input type="text" placeholder="请输入查房老师姓名快速搜索" @input="search" v-model="searchValue" />
        <button @click="search">
          <img src="../../assets/images/icon-search.png" alt />
        </button>
      </div>
      <div class="selectWrap">
        <ul>
          <!-- <li @click="deptlist.show = true;navIndex=0" :class="{'active':navIndex===0}">
                        <span >科室</span>
          </li>-->
          <li @click="showPop" :class="{'active':navIndex===0}">
            <span>科室</span>
          </li>
          <li @click="gettype.show=true;navIndex=1" :class="{'active':navIndex===1}">
            <span>类型</span>
          </li>
          <li @click="gettime.show=true;navIndex=2" :class="{'active':navIndex===2}">
            <span>日期</span>
          </li>
        </ul>
      </div>
    </div>
    <!--列表内容-->
    <div class="g-main">
      <load-more
        :loading-text="loadingText"
        :infinite-loading="isgetmore"
        :to-top="istotop"
        @getmore="init()"
      >
        <div
          class="inspect_list"
          v-for="item in patrollist"
          v-if="item.patroltype==2"
          @click="toPage(item)"
        >
          <div class="score">
            教学查房
            <span>{{item.totalscore}}分</span>
          </div>
          <div class="inspect_list_item">
            <ul>
              <li>查房老师：{{item.secretary}}</li>
              <li>{{item.techtitle}}</li>
              <li>所属科室：{{item.deptname}}</li>
              <li></li>
              <li>评分人：{{item.patroller}}</li>
              <li>评分日期：{{item.patroldate}}</li>
            </ul>
          </div>
        </div>
        <div
          class="inspect_list"
          v-for="item in patrollist"
          v-if="item.patroltype==1"
          @click="toPage(item)"
        >
          <div class="score">
            教学巡查
            <span>{{item.totalscore}}分</span>
          </div>
          <div class="inspect_list_item">
            <ul>
              <li>巡查科室：{{item.deptname}}</li>
              <li>科秘：
                <!-- <span v-for="(item,index) in item.secretarylist" :key="index"> -->
                  {{ item.secretary }}
                <!-- </span> -->
              </li>
              <li>评分人：{{item.patroller}}</li>
              <li>评分日期：{{item.patroldate}}</li>
            </ul>
          </div>
        </div>
      </load-more>
    </div>
    <!--选择时间-->
    <c-timepicker :config="gettime" @confirm="selectstarttime" :year="year" :month="month"></c-timepicker>
    <!--科室选择-->
    <c-picker :config="deptlist" @confirm="selectdept"></c-picker>
    <!--类型选择-->
    <c-picker :config="gettype" @confirm="selectType"></c-picker>
    <!--评分列表页面-->
    <c-picker :config="scoretype" @confirm="toType"></c-picker>
    <!--<no-content v-if="nocontent"></no-content>-->
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
              :data="deptList"
              :props="defaultProps"
              @check-change="checkClick"
              node-key="id"
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
import cHeader from "../header";
import noContent from "../no_content";
import cTimepicker from "./timepicker";
import cPicker from "@/components/default-picker";
import { mapState, mapActions } from "vuex";
import loadMore from "@/components/load-more";
export default {
  data() {
    return {
      gettime: {
        show: false,
        isday: false,
        istime: false,
        custom: true
      },
      deptlist: {
        show: false,
        mainlist: [],
        valueKey: "name"
      },
      gettype: {
        show: false,
        mainlist: [
          { type: "全部" },
          { type: "教学查房" },
          { type: "教学巡查" }
        ],
        valueKey: "type"
      },
      scoretype: {
        show: false,
        mainlist: [{ type: "教学查房" }, { type: "教学巡查" }],
        valueKey: "type"
      },
      selecttime: "", //选中的时间
      year: [2018, 2028],
      month: [1, 12],
      list: [],
      nocontent: false,
      deptidlist: [],
      navIndex: "",
      istotop: false,
      isgetmore: true,
      loadingText: "加载中",
      searchValue: "",
      deptidlist: [],
      patrollist: [], //巡查 查房列表,
      patroltype: "", //1教学巡查 2教学查房,
      page: 1,
      pagesize: 10,
      totalCount: 0,
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
      },
    };
  },
  components: {
    cHeader,
    cTimepicker,
    noContent,
    loadMore,
    cPicker
  },
  mounted() {
    let self = this;
    this.init();
    this.registerToNative("goBack", function(data) {
      self.back();
    });
    this.getDeptList();
    this.getTree();
  },
  methods: {
    ...methods,
    ...mapActions([
      "showAlert",
      "showConfirm",
      "showLoading",
      "hideLoading",
      "toast"
    ]),
    search() {
      this.init();
    },
    toPage(item) {
      if (item.patroltype == 1) {
        this.$router.push({
          // path: "/inspection_score",
          name: "fdinspectionScore",
          query: { id: item.patrolid }
        });
      } else {
        this.$router.push({
          // path: "/inspection/check",
          name: "inspection_check",
          query: { id: item.patrolid }
        });
      }
    },
    getDeptList() {
      let self = this;
      this.post("/turnbaseinfo/querydept", {
        command: "turnbaseinfo/querydept",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        searchinfo: self.searchContent,
        deptcode: "office"
      }).done(res => {
        if (res && res.errcode) {
          if (res.errcode == 0) {
            res.deptlist.unshift({ name: "全部" });
            self.deptlist.mainlist = res.deptlist;
          }
        } else {
          self.toast(res.errdesc);
        }
      });
    },
    init() {
      let self = this;
      this.post("/turnevaluate/queryturnpatrollist", {
        command: "turnevaluate/queryturnpatrollist",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        deptlist: self.deptidlist,
        uid: $.cookie("uid"),
        patrolmonth: self.selecttime,
        searchinfo: self.searchValue,
        patroltype: self.patroltype
      }).done(res => {
        if (res && res.errcode) {
          if (res.errcode == 0) {
            self.patrollist = res.patrollist;
            self.totalCount = self.patrollist.length;
            self.page += 1;
            self.pagesize += 10;
            self.isgetmore = false;
            self.loadingText = "加载完成";
          } else {
            self.toast(res.errdesc);
          }
        } else {
          self.toast("系统错误，请联系管理员~");
        }
      });
    },
    selectstarttime(data) {
      this.selecttime = data;
      this.init();
    },
    selectdept(param) {
      this.deptlist.show = false;
      this.popShow = false;
      this.deptidlist = [];
      if (param) {
        this.navIndex = 0;
        if (param.txt == "全部") {
          this.deptidlist = [];
        }
        if (param && param.id) {
          this.deptidlist.push(param.id);
        }
      }
      this.init();
    },
    showdetail(param, params) {
      this.$router.push({
        name: "fdinspectionScore",
        query: {
          detailid: param,
          deptname: params,
          show: 1
        }
      });
    },
    selectType(data) {
      this.gettype.show = false;
      if (data.txt == "教学查房") {
        this.patroltype = 2;
      }
      if (data.txt == "教学巡查") {
        this.patroltype = 1;
      }
      if (data.txt == "全部") {
        this.patroltype = "";
      }
      this.init();
    },
    //进入评分页面
    toType(val) {
      if (val.txt == "教学查房") {
        this.$router.push({ 
          // path: "inspection/check"
          name: "inspection_check",
         });
      }
      if (val.txt == "教学巡查") {
        this.$router.push({ 
          // path: "inspection_score"
          name: "fdinspectionScore",
         });
      }
    },
    back() {
      // window.location.href =
      //   "/pages/futuredoctorapp/todo.html?view=application";
      // if(this.$route.query.stem) {
      //   this.$router.push({
      //   name: "wxMenu",
      //   });
      // }else {
      //   this.$router.push({
      //   name: "wxIndex",
      //   });
      // }
      window.location.href =
        "/pages/futuredoctorapp/index.html/#/wxIndex";
    },
    showPop() {
      let self = this;
      self.popShow = true;
    },
    getTree() {
      let self = this;
      self.post("/base/dept/getMyDeptTree", {
        showHospital: 1,
        showNoDeptHospital: 0,
        needBaseDept: 0,
        hospitalId: "",
      }).done(res => {
        if(res && res.resCode == 200) {
          if(Array.isArray(res.model) && res.model.length > 0) {
              self.columns = res.model
              self.deptList = res.model[0].childrens
          }
        }
      })
    },
    
    onChange(index) {
      let self = this;
      self.hosIdByDeptSave = self.columns[index].id;
      self.deptList = self.columns[index].childrens;
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
        self.oriactiveKey = self.activeKey
        self.deptname = this.$refs.tree.getCheckedNodes()[0].name;
        self.deptid = this.$refs.tree.getCheckedNodes()[0].id;
        self.orideptnameidList = this.$refs.tree.getCheckedKeys();
        self.popShow = false;
        // self.init()
        self.selectdept({
          id: self.deptid
        })
      } else {
        Toast({
          message: "请选择科室",
          position: "bottom"
        });
      }
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../../scss/mixin";
li {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
header {
  background: #fff;
  height: 0.5rem;
  display: flex;
  justify-content: space-between;
  padding: 0 0.2rem;
  margin-bottom: 0.1rem;
  color: #3499db;
  span {
    line-height: 0.5rem;
    padding: 0 0.1rem;
  }
}
.fixed_top {
  width: 100%;
  background: #fff;
  margin-bottom: 0.2rem;
  .div_search {
    padding: 0 $paddingL;
    padding-top: 0.1rem;
    padding-bottom: 0.1rem;
    background: #fff;
    position: relative;
    input {
      width: 100%;
      height: 0.6rem;
      border: 1px solid $borderColor;
      padding-left: $paddingL;
    }
    button {
      position: absolute;
      width: 0.3rem;
      height: 0.3rem;
      right: 0.3rem;
      top: 0.22rem;
      img {
        width: 100%;
      }
    }
  }
  .selectWrap {
    ul {
      @include sexy-flex;
      flex-flow: row nowrap;
      li {
        @include flex1();
        text-align: center;
        height: 0.6rem;
        line-height: 0.6rem;
        color: $wordColor;
        font-size: $fontSize;
        border-top: 1px solid $borderColor;
        border-bottom: 1px solid $borderColor;
        span {
          display: inline-block;
          width: 100%;
          border-right: 1px solid $borderColor;
        }
      }
      li.active {
        color: $activeColor;
      }
      li:nth-child(3) {
        span {
          border: none;
        }
      }
    }
  }
}

.g-main {
  background: #fff;
  .inspect_list {
    background: #fff;
    border-top: 1px solid $borderColor;
    border-bottom: 1px solid $borderColor;
    margin-bottom: 0.2rem;
    .score {
      padding: 0 $paddingL;
      height: 0.5rem;
      font-size: $fontSize;
      line-height: 0.5rem;
      border-bottom: 1px solid $borderColor;
      span {
        float: $fr;
        margin-top: 0.1rem;
      }
    }
    .inspect_list_item {
      ul {
        @include sexy-flex;
        flex-flow: row wrap;
        li {
          width: 50%;
          height: 0.6rem;
          line-height: 0.6rem;
          font-size: $fontSize;
          padding-left: $paddingL;
        }
      }
    }
  }
  .scroll-loadmore {
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
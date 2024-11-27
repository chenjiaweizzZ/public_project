<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../../assets/images/icon_fanhui.png" />
        </a>
      </div>
      <span class="deptname" @click="showPop">
        {{deptname}} - 查看历史
        <template>
          <img v-if="seldept.show == true" src="../../../assets/images/up-icon.png" />
          <img v-else src="../../../assets/images/down-icon.png" />
        </template>
      </span>
    </c-header>
    <div class="content_wrap">
      <div class="fix_left_div">
        <div class="fixDiv">
          <ul>
            <li :style="styleFix">月份</li>
            <li v-for="(item,index) in arrlist">{{item.yearmonth}}</li>
          </ul>
        </div>
      </div>
      <div class="sliderDiv">
        <ul>
          <li>
            <ul :style="styleFix">
              <li>
                计划轮
                <br />转人数
              </li>
              <li>
                实际轮
                <br />转人数
              </li>
              <li>
                实际入
                <br />科人数
              </li>
              <li>
                实际出
                <br />科人数
              </li>
              <li>
                带教未
                <br />评人数
              </li>
              <li>
                学员未
                <br />评人数
              </li>
            </ul>
            <ul class="sizecolor" v-for="(item,index) in arrlist">
              <li @click="todetail(item,1,item.planturncount)">{{item.planturncount}}&nbsp;</li>
              <li @click="todetail(item,2,item.exactturncount)">{{item.exactturncount}}&nbsp;</li>
              <li @click="todetail(item,3,item.incount)">{{item.incount}}&nbsp;</li>
              <li @click="todetail(item,4,item.outcount)">{{item.outcount}}&nbsp;</li>
              <li @click="todetail(item,5,item.notevacounttec)">{{item.notevacounttec}}&nbsp;</li>
              <li @click="todetail(item,6,item.notevacountstd)">{{item.notevacountstd}}&nbsp;</li>
            </ul>
          </li>
        </ul>
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
import Vue from "vue";
import cHeader from "../../header";
import methods from "../../../methods";
import { mapState, mapActions } from "vuex";
import cPicker from "../../../components/default-picker";

export default {
  name: "admin_report_check",
  data() {
    return {
      deptname: "",
      seldept: {
        show: false,
        mainlist: [{ deptname: "内科基地" }, { deptname: "外科基地" }],
        valueKey: "deptname"
      },
      styleFix: true,
      arrlist: [],
      year: 2018,
      mouth: 10,
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
      },
    };
  },
  components: {
    cHeader,
    cPicker
  },
  mounted() {
    // this.initdeptname();
    this.deptname = this.$route.query.deptname;
    this.titledeptid = this.$route.query.deptid;
    let self = this;
    self.registerToNative("goBack", function(data) {
      self.back();
    });
    self.getTree();
  },
  watch: {
    titledeptid: function(val, oldval) {
      if (val && val != oldval) {
        this.init();
      }
    }
  },
  methods: {
    ...methods,
    back() {
      this.$router.push({
        name: "fdRotation_reportlist",
        query: {
          deptid: this.titledeptid,
          deptname: this.deptname,
          activeKey: this.activeKey
        }
      });
    },
    //科室切换
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
            //    self.deptname = data.beanlist.officelist[0].deptname;
            //    self.titledeptid = data.beanlist.officelist[0].id;
            self.seldept.mainlist = data.beanlist.officelist;
            self.init();
          }
        })
        .fail(function(error) {});
    },
    // 回调
    // selectdept(param) {
    //   this.deptname = param.deptname;
    //   this.titledeptid = param.id;
    //   this.seldept.show = false;
    // },
    // ，列表
    init() {
      let self = this;
      self
        .post("/turnedoctormain/deptreportshow", {
          command: "turnedoctormain/deptreportshow",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid"),
          deptid: self.titledeptid,
          type: 2, //当前或未来轮转信息：1		//查看历史报告：2
          searchflag: 2
        })
        .done(function(data) {
          if (data && data.errcode == 0) {
            self.arrlist = data.beanlist;
          }
        })
        .fail(function(error) {});
    },

    todetail(item, index, data) {
      //详情
      if (data) {
        this.$router.push({
          name: "fdRotation_reportdetail",
          query: {
            deptid: this.titledeptid,
            deptname: this.deptname,
            listtype: index,
            yearmonth: item.yearmonth,
            iswhere: 2
          }
        });
      } else {
        return;
      }
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
            self.deptList = res.model[this.$route.query.activeKey].childrens
            self.deptname = this.$route.query.deptname
            self.orideptnameidList = [ this.$route.query.deptid ]
            self.titledeptid = this.$route.query.deptid
            self.oriactiveKey = this.$route.query.activeKey
            self.activeKey =  this.$route.query.activeKey 
            this.$refs.tree.setCheckedKeys(self.orideptnameidList);
            self.init()
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
        self.titledeptid = this.$refs.tree.getCheckedNodes()[0].id;
        self.orideptnameidList = this.$refs.tree.getCheckedKeys();
        self.popShow = false;
        self.init()
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

<style scoped lang="scss">
@import "../../../scss/mixin.scss";
.g-wrapper {
  background: #fff;
  font-size: 0.22rem;
  .deptname {
    font-size: 0.3rem !important;
    img {
      width: 0.28rem;
    }
  }
  .content_wrap {
    overflow-y: auto;
    height: 100%;
    border-bottom: 1px solid $borderColor;
    position: relative;
    .fix_left_div {
      @include sexy-flex;
      flex-flow: column nowrap;
      width: 1.3rem;
      float: left;
      overflow: hidden;
      ul {
        li {
          width: 1.3rem;
          line-height: 0.6rem;
          text-align: center;
          border-bottom: 1px solid $borderColor;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          height: 0.6rem;
          background: #fff;
        }
      }
    }
    .sliderDiv {
      margin-left: 1.3rem;
      white-space: nowrap;
      overflow-x: auto;
      > ul {
        > li {
          text-align: center;
          > ul:nth-child(n + 2) {
            li {
              line-height: 0.6rem;
            }
          }
          > ul {
            font-size: 0;
            > li {
              display: inline-block;
              width: 25%;
              text-align: center;
              height: 0.6rem;
              border-bottom: 1px solid $borderColor;
              font-size: 0.22rem;
            }
          }
        }
      }
    }
  }
}
.sizecolor {
  li {
    color: #3499db;
  }
}
</style>

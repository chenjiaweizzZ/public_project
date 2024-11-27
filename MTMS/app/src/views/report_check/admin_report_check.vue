<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a class="header-back-btn" @click="back">
          <img src="../../assets/images/icon_fanhui.png" />
        </a>
      </div>
      <span class="deptname" @click="showPop">
        报告查看
        <template>
          <img v-if="baselist.show == true" src="../../assets/images/up-icon.png" />
          <img v-else src="../../assets/images/down-icon.png" />
        </template>
      </span>
    </c-header>
    <!--详情-->
    <entry-detail
      v-if="detailVisible"
      :url="url"
      :deptid="deptid"
      :yearmonth="yearmonth"
      :type="type"
      @getVisible="getVisible"
    ></entry-detail>
    <div class="dataPicker">
      <ul>
        <li>
          <img src="../../assets/images/zuo-jiantou.png" @click="leftTime" />
        </li>
        <li>{{year}}年{{mouth}}月</li>
        <li>
          <img src="../../assets/images/bnt_xiangyou.png" @click="rightTime" />
        </li>
      </ul>
    </div>
    <div class="content_wrap">
      <v-loading v-show="loading"></v-loading>
      <div class="fix_left_div">
        <div class="fixDiv">
          <ul>
            <li :style="styleFix">科室</li>
            <li v-for="(item,index) in datalist">{{item.deptname}}</li>
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
              <li v-if="planVisible">
                计划入
                <br />科人数
              </li>
              <li v-if="planVisible">
                计划出
                <br />科人数
              </li>
              <li v-if="!planVisible">
                实际入
                <br />科人数
              </li>
              <li v-if="!planVisible">
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
            <ul v-for="(item,index) in datalist">
              <li
                @click="detail(item.id,1,year+'-'+mouth)"
                :class="{'noclick':!item.planturncount}"
              >{{item.planturncount}}&nbsp</li>
              <li
                @click="detail(item.id,2,year+'-'+mouth)"
                :class="{'noclick':!item.exactturncount}"
              >{{item.exactturncount}}&nbsp</li>
              <li
                @click="detail(item.id,3,year+'-'+mouth)"
                :class="{'noclick':!item.incount}"
              >{{item.incount}}&nbsp</li>
              <li
                @click="detail(item.id,4,year+'-'+mouth)"
                :class="{'noclick':!item.outcount}"
              >{{item.outcount}}&nbsp</li>
              <li
                @click="detail(item.id,5,year+'-'+mouth)"
                :class="{'noclick':!item.notevacounttec}"
              >{{item.notevacounttec}}&nbsp</li>
              <li
                @click="detail(item.id,6,year+'-'+mouth)"
                :class="{'noclick':!item.notevacountstd}"
              >{{item.notevacountstd}}&nbsp</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <!--科室选择-->
    <c-picker :config="baselist" @confirm="selectdept"></c-picker>
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
import methods from "@/methods";
import { mapState, mapActions } from "vuex";
import cHeader from "@/views/header";
import cPicker from "@/components/default-cpicker";
import vLoading from "@/components/vLoading";
import entryDetail from "./entry_detail";

export default {
  name: "admin_report_check",
  data() {
    return {
      preId: null,
      baselist: {
        show: false,
        mainlist: [],
        valueKey: "deptname"
      },
      url: "",
      deptid: "",
      type: "",
      loading: false,
      deptidlist: [],
      styleFix: true,
      planVisible: "",
      initialYear: new Date().getFullYear(),
      initialMonth:
        new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      mouth:
        new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1,
      datalist: "",
      yearmonth: this.year + "-" + this.mouth,
      detailVisible: false,
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
    cPicker,
    vLoading,
    entryDetail
  },
  methods: {
    ...methods,
    selectdept(param) {
    //   this.baselist.show = false;
      this.deptidlist = [];
      if (typeof param == "object") {
        this.deptidlist = [param.id];
      } else {
        this.deptidlist.push(param.id);
      }
      setTimeout(() => {
        this.getData();
      },500)
    },
    detail(deptid, type, yearmonth, url) {
      this.detailVisible = true;
      this.type = type;
      this.deptid = deptid;
      this.yearmonth = yearmonth;
      this.url = url;
    },
    getVisible(val) {
      this.detailVisible = val;
    },
    getData() {
      let self = this;
      this.loading = true;
      if (this.month < 10) {
        this.mouth = "0" + this.mouth;
      }
      this.post("/turnedoctormain/getmanagerreportlist", {
        command: "turnedoctormain/getmanagerreportlist",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid"),
        yearmonth: self.year + "-" + self.mouth,
        ckrolecode: "turndoctorroles",
        rolelist: [6, 8, 9],
        deptidlist: this.deptidlist
      })
        .done(res => {
          this.loading = false;
          if (res && res.errcode) {
            if (res.errcode == 0) {
              self.datalist = res.beanlist;
            } else {
              self.toast(res.errdesc);
            }
          }
        })
        .fail(() => {
          this.loading = false;
        });
    },
    rightTime() {
      this.mouth = parseInt(this.mouth);
      this.mouth += 1;
      if (this.mouth < 10) {
        this.mouth = "0" + this.mouth;
      }
      if (this.mouth > 12) {
        this.mouth = "0" + 1;
        this.year += 1;
      }
      this.planTime();
      this.getData();
    },
    planTime() {
      let time = this.year + "-" + this.mouth;
      let initialTime = this.initialYear + "/" + this.initialMonth;
      let finishDate = time.replace("-", "/");
      let initialTimeStamp = Date.parse(initialTime);
      let finishDateStamp = Date.parse(finishDate);
      if (
        initialTimeStamp < finishDateStamp ||
        initialTimeStamp == finishDateStamp
      ) {
        // 指定的日期比今天的日期要小
        this.planVisible = true;
      } else {
        this.planVisible = false;
      }
    },
    leftTime() {
      this.mouth = parseInt(this.mouth);
      this.mouth -= 1;
      if (this.mouth < 10) {
        this.mouth = "0" + this.mouth;
      }
      if (this.mouth < 1) {
        this.mouth = 12;
        this.year -= 1;
      }
      this.planTime();
      this.getData();
    },
    getDeptList() {
      let self = this;
      this.post("/deptinfo/getusermanagerdeptinfoforsysroletree", {
        command: "deptinfo/getusermanagerdeptinfoforsysroletree",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid")
      }).done(res => {
        if (res && res.errcode) {
          if (res.errcode == 0) {
            self.baselist.mainlist = res.beanlist.baselist;
          }
        } else {
          self.toast(res.errdesc);
        }
      });
    },
    back() {
      this.savePreId()
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
    savePreId() {
      if(this.$refs.tree.getCheckedKeys()) {
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
      }else {
        return
      }
      
    },
    showPop() {
      let self = this;
      self.popShow = true;
    },
    getTree() {
      let self = this;
      self.post("/base/dept/getMyDeptTree", {
        showBase: false,
      }).done(res => {
        if(res && res.resCode == 200) {
          if(Array.isArray(res.model) && res.model.length > 0) {
              if(self.preId) {
                let preObj = self.findObjectAndIndex(
                  res.model,
                  Number(self.preId)
                );
                if(preObj) {
                  console.log(preObj)
                  self.columns = res.model
                  self.activeKey = preObj.index;
                  self.oriactiveKey = preObj.index;
                  self.orideptnameidList = [preObj.object.id];
                  self.deptnameidList = [preObj.object.id];
                  self.deptidlist = [preObj.object.id];
                  self.selectdept({
                    id: preObj.object.id
                  })
                  this.$refs.tree.setCheckedKeys(self.orideptnameidList);
                  self.deptList = res.model[preObj.index].childrens
                  this.getData();
                }else {
                  self.columns = res.model
                  self.deptList = res.model[0].childrens
                  this.getData();
                }
              }else {
                self.columns = res.model
                self.deptList = res.model[0].childrens
                this.getData();
              }
              
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
      self.popShow = false;
      if (
        this.$refs.tree.getCheckedKeys()[0] &&
        this.$refs.tree.getCheckedNodes()[0]
      ) {
        self.hosIdByDept = self.hosIdByDeptSave;
        self.oriactiveKey = self.activeKey
        self.deptname = this.$refs.tree.getCheckedNodes()[0].name;
        self.deptid = this.$refs.tree.getCheckedNodes()[0].id;
        self.orideptnameidList = this.$refs.tree.getCheckedKeys();
        // self.init()
        self.selectdept({
          id: self.deptid
        })
        this.savePreId();
      } else {
        Toast({
          message: "请选择科室",
          position: "bottom"
        });
      }
    },
  },
  mounted() {
    let self = this;
    self.preId = self.getPreId(this.$route.name)
    
    this.getDeptList();
    this.registerToNative("goBack", function(data) {
      self.back();
    });
    this.planTime();
    self.getTree();
  },
  beforeDestroy() {
    console.log("destory");
    this.savePreId();
  },
};
</script>

<style scoped lang="scss">
@import "../../scss/mixin.scss";
.g-wrapper {
  background: #fff;
  font-size: 0.2rem;
  .deptname {
    font-size: 0.36rem !important;
    img {
      width: 0.28rem;
    }
  }
  .dataPicker {
    ul {
      height: 0.6rem;
      border-bottom: 1px solid $borderColor;
      @include sexy-flex;
      background: #fff;

      li {
        @include flex1(1);
        text-align: left;
        line-height: 0.6rem;
        padding-left: 0.1rem;
        img {
          width: $arrowWidth;
          height: $arrowHeight;
          margin-top: 0.12rem;
        }
      }
      li:nth-child(2) {
        text-align: center;
        @include flex1(2);
      }
      li:nth-child(3) {
        text-align: right;
        padding-right: 0.1rem;
      }
    }
  }
  .fixedTitle {
    ul {
      overflow-x: hidden;
      white-space: nowrap;
      border-bottom: 1px solid $borderColor;
      > li:nth-child(1) {
        width: 1.3rem;
        line-height: 0.6rem;
        float: left;
      }
      > li {
        display: inline-block;
        text-align: center;
        height: 0.6rem;
        width: 1rem;
        background: #fff;
      }
    }
  }
  .content_wrap {
    overflow-y: auto;
    height: 100%;
    border-bottom: 1px solid $borderColor;
    position: relative;
    /*.noclick{pointer-events:none;}*/
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
          @include box-sizing;
          height: 0.6rem;
          background: #fff;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
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
              color: $activeColor;
            }
          }
          > ul {
            font-size: 0;
            > li {
              display: inline-block;
              width: 27%;
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

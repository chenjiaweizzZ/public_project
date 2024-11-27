<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../assets/images/icon_fanhui.png" />
        </a>
      </div>教学查房考核评分表
      <div slot="headerRight" v-if="!isdisabled">
        <div style="font-size: 0.3rem;" @click="submit">提交</div>
      </div>
      <div slot="headerRight" v-else>
        <div style="font-size: 0.3rem;" @click="edit">提交</div>
      </div>
    </c-header>
    <!--搜索-->
    <search-partment :showDetails="showDetails" @getDetails="getDetails"></search-partment>
    <!--查房老师列表-->
    <teacher-list v-if="teacherVisible" @getTeachers="getTeachers" :deptid="deptid"></teacher-list>
    <div class="fix_top">
      <p>
        总
        <span style="opacity: 0">空格</span>分：
        <span>100分</span>
      </p>
      <p>
        得分：
        <span v-if="totalscore">{{totalscore}}分</span>
      </p>
    </div>

    <!--文字内容-->
    <div class="g-main inspection_Wrap">
      <div class="baseContent">
        <ul class="Ul">
          <li @click="searchList">
            <span class="red">*</span>科
            <span style="opacity: 0">空格</span>室 ：
            <span style="padding-left:0.2rem">{{deptname}}</span>
            <img src="@/assets/images/bnt_xiangyou.png" />
          </li>
          <li @click="teachingrounds">
            <span class="red">*</span>查房老师 ：
            <span class="fr">{{techName}}</span>
            <img src="@/assets/images/bnt_xiangyou.png" />
          </li>
          <li>
            <span class="red">*</span>技术职称：
            <span class="fr">{{techtitle}}</span>
          </li>
          <li>
            <span class="red">*</span>患者护培生号：
            <input placeholder="请输入护培生号" v-model="admissionnum" />
          </li>
          <li>
            <span class="red">*</span>疾病名称：
            <input placeholder="请输入疾病名称" v-model="diseasename" />
          </li>
        </ul>
      </div>
      <div class="bgLIne"></div>
      <div class="pf_wrap" style="position: relative">
        <!--评分-->
        <evaluate-score
          @getTotalScore="getTotalScore"
          ref="evaluateScore"
          :evaluatedlist="evaluatedlist"
        ></evaluate-score>
        <div class="advise">
          <p>意见和建议</p>
          <textarea
            v-model="advise"
            placeholder="请填写您的建议或意见..."
            @focus="textareaFocus"
            @blur="textareaBlur"
          ></textarea>
        </div>
      </div>
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
  </div>
</template>
<script>
import { Toast } from "vant";
import $ from "jquery";
import methods from "@/methods";
import cHeader from "../header";
import { mapState, mapActions } from "vuex";
import vueUploader from "@/components/vue-uploader";
import searchPartment from "./data_department";
import teacherList from "./teacher_list";
import evaluateScore from "./rd_evaluate_score";
export default {
  data() {
    return {
      secretary: "", //实习秘书
      count: "", //应到人数
      deptname: "", //科室名字
      totalscore: "",
      teacherList: [],
      isSubmit: false,
      showDetails: false,
      teacherVisible: false,
      deptid: "",
      techid: "",
      techtitle: "", //技术职称
      techName: "",
      admissionnum: "",
      diseasename: "",
      checkIndex: [],
      noSelectIndex: 0,
      detaillist: [],
      checkedlist: [],
      advise: "",
      evaluateid: "",
      isdisabled: false,
      evaluatedlist: [],
      loading: false,
      secretaryNameList: [],
      secretaryIdList: [],
      techtitleid: "",
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
  methods: {
    ...methods,
    ...mapActions(["toast", "showConfirm"]),
    back() {
      let self = this;
      if (this.$route.query.id === undefined) {
        self.showConfirm({
          title: "提醒",
          msg: "你当前评价尚未提交保存，是否确认返回？",
          theme: "modal-confirm modal-white",
          ok: function() {
            window.history.back();
          },
          cancel: function() {}
        });
      } else {
        window.history.back();
      }
    },
    //编辑
    edit() {
      //detaillist（编辑）
      let self = this;
      if (this.deptid == "") {
        this.toast("请选择科室");
        return;
      }
      if (this.techName == "") {
        this.toast("请选择查房老师");
        return;
      }
      if (this.admissionnum == "") {
        this.toast("请填写患者护培生号");
        return;
      }
      if (this.diseasename == "") {
        this.toast("请填写疾病名称");
        return;
      }
      let checkedlist = this.$refs.evaluateScore.checkedlist;

      if (checkedlist) {
        for (let item of checkedlist) {
          this.detaillist.push({
            submitsourceflag: 0,
            evaluationitemid: item.id,
            evascore: item.score,
            evacontent: item.score + "分",
            weightratio: 1
          });
        }
      }
      this.post("/turnevaluate/updateturnpatrol", {
        command: "turnevaluate/updateturnpatrol",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid"),
        businessid: self.$route.query.id,
        advise: self.advise,
        deptid: self.deptid,
        techtitle: self.techtitleid,
        admissionnum: self.admissionnum,
        diseasename: self.diseasename,
        detaillist: self.detaillist,
        evaluateid: self.evaluateid,
        type: 14
      }).done(res => {
        if (res && res.errcode) {
          if (res.errcode == 0) {
            self.toast("提交成功");
            self.$router.push({ 
              // path: "/inspection_List"
              name: "fdinspectionList",
             });
          }
        } else {
          self.toast("系统错误，请联系管理员~");
        }
      });
    },
    //应到人数列表
    countDetail(result) {
      this.peopleCountVisible = true;
      // this.$router.push({path: '/inspection_ug_detail', query: {result: result}})
    },
    // 评分应到列表
    getPeopleVisible(val) {
      this.peopleCountVisible = val;
    },
    //搜索列表
    searchList() {
      // this.showDetails=!this.showDetails;
      let self = this;
      this.techName = "";
      this.techtitle = "";
      self.popShow = true;
    },
    //显示查房老师列表
    teachingrounds() {
      if (this.deptid == "") {
        this.toast("请先选择科室");
        return;
      }
      this.teacherVisible = true;
    },
    //查询评分
    getEvaluateByType() {
      let self = this;
      this.post("/turnevaluate/getevaluatebytype", {
        command: "turnevaluate/getevaluatebytype",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        type: 13
      }).done(res => {
        self.scoreList = res.beanlist;
      });
    },
    //设置搜索组建的显示隐藏
    getDetails(val) {
      this.showDetails = false;
      if (val.query) {
        this.deptname = val.query.deptname;
      }
      if (val.query && val.query.deptid) {
        this.deptid = val.query.deptid;
      }
    },
    //关闭查房老师列表弹框
    getTeachers(val) {
      console.log(val);
      this.teacherVisible = !this.teacherVisible;
      if (val && val.techtitle) {
        this.techtitle = val.techtitle;
      }
      if (val && val.techid) {
        this.techid = val.techid;
        this.techtitleid = val.techid;
      }
      if (val && val.name) {
        this.techName = val.name;
      }
      if (val && val.id) {
        this.evaluateid = val.id;
      }
    },
    getdfsurl() {
      let self = this;
      this.post("/turnbaseinfo/getdfsurl", {
        command: "turnbaseinfo/getdfsurl",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid")
      }).done(res => {
        if (res && res.errcode) {
          if (res.errcode == 0) {
            self.fdfsurl = res.dfsurl;
          } else {
            self.toast(res.errdesc);
          }
        } else {
          self.toast("系统错误，请联系管理员~");
        }
      });
    },
    init() {
      let self = this;
      this.post("/turnevaluate/queryturnpatroldetail", {
        command: "turnevaluate/queryturnpatroldetail",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        turnpatrolid: self.$route.query.id
      }).done(res => {
        if (res && res.errcode) {
          if (res.errcode == 0) {
            self.deptname = res.deptname;
            self.advise = res.turnevaluateresult.advise;
            self.techName = res.secretary;
            self.techtitle = res.techtitle;
            self.diseasename = res.diseasename;
            self.admissionnum = res.admissionnum;
            self.evaluatedlist = res.turnevaluateresult.beanlist;
            self.totalscore = res.turnevaluateresult.totalscore;
            self.deptid = res.deptid;
            self.evaluateid = res.uid;
            self.techtitleid = res.techid;
          }
        } else {
          self.toast("系统错误，请联系管理员~");
        }
      });
    },
    getScrollTop(elements) {
      let top = elements.offsetTop;
      let parent = elements.offsetParent;
      while (parent != null) {
        top += parent.offsetTop;
        parent = parent.offsetParent;
      }
      return top;
    },
    getPostionList(index) {
      if (index !== -1) {
        let firstDom = $(".evaluate_wrap .problems")
          .eq(index)
          .get(0);
        let scrollTop = this.getScrollTop(firstDom) - 200; //获取第一个空值的offsetTop;
        $(".g-main").animate({ scrollTop: scrollTop }, 100);
        this.toast("请在此处选择评分项");
        return false;
      } else {
        return true;
      }
    },
    //获得最高得分
    getTotalScore(val) {
      if (val && val.score) {
        this.totalscore = val.score;
      }
      if (val && val.checkedlist) {
        this.checkedlist = val.checkedlist;
      }
    },
    checkScoreItem() {
      this.checkIndex = [];
      let evaluationList = this.$refs.evaluateScore.evaluationList;
      for (let i = 0; i < evaluationList.length; i++) {
        this.checkIndex.push(false);
      }
      for (let i = 0; i < evaluationList.length; i++) {
        for (let j = 0; j < evaluationList[i].evaluationitems.length; j++) {
          if (evaluationList[i].evaluationitems[j].checked) {
            this.checkIndex[i] = true;
          }
        }
      }
      this.noSelectIndex = this.checkIndex.indexOf(false);
      return this.getPostionList(this.noSelectIndex);
    },
    textareaFocus() {
      $(".g-main").css("padding-bottom", "5rem");
    },
    textareaBlur() {
      $(".g-main").css("padding-bottom", "0");
    },
    submit() {
      let self = this;
      if (this.deptid == "") {
        this.toast("请选择科室");
        return;
      }
      if (this.techName == "") {
        this.toast("请选择查房老师");
        return;
      }
      if (this.admissionnum == "") {
        this.toast("请填写患者护培生号");
        return;
      }
      if (this.diseasename == "") {
        this.toast("请填写疾病名称");
        return;
      }
      if (this.checkScoreItem()) {
        this.detaillist = [];
        for (let item of this.checkedlist) {
          this.detaillist.push({
            submitsourceflag: 0,
            evaluationitemid: item.id,
            evascore: item.score,
            evacontent: item.score + "分",
            weightratio: 1
          });
        }
        this.post("/turnevaluate/submitevaluate", {
          command: "turnevaluate/submitevaluate",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid"),
          businessid: "",
          advise: self.advise,
          deptid: self.deptid,
          techtitle: self.techid,
          admissionnum: self.admissionnum,
          diseasename: self.diseasename,
          detaillist: self.detaillist,
          evaluateid: self.evaluateid,
          type: 14
        }).done(res => {
          if (res && res.errcode) {
            if (res.errcode == 0) {
              self.toast("提交成功");
              self.$router.push({ 
                // path: "/inspection_List"
                name: "fdinspectionList",
               });
            }
          } else {
            self.toast("系统错误，请联系管理员~");
          }
        });
      }
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
      } else {
        Toast({
          message: "请选择科室",
          position: "bottom"
        });
      }
    },
  },
  components: {
    cHeader,
    vueUploader,
    searchPartment,
    evaluateScore,
    teacherList
  },
  created() {
    if (this.$route.query.id) {
      this.isdisabled = true;
    }
  },
  mounted() {
    let self = this;
    this.textResize(); //文本自动收缩;
    //初始化数据
    if (this.$route.query.id) {
      this.init();
    }
    if (this.$route.query.score) {
      this.isNeed = false;
    }
    this.registerToNative("goBack", function(data) {
      self.back();
    });
    // 获取服务器前缀
    // this.getdfsurl();
    this.getTree();
  }
};
</script>
<style lang="scss">
@import "../../scss/mixin.scss";
.fix_top {
  height: 0.6rem;
  background: #fff;
  @include sexy-flex;
  font-size: $fontSize;
  padding: 0 $paddingL;
  border-bottom: 1px solid $borderColor;
  p {
    line-height: 0.6rem;
    @include flex1();
  }
  p:nth-child(2) {
    text-align: right;
  }
}
.inspection_Wrap {
  .must {
    color: red;
  }
  .inspection_Item:nth-last-child(3) {
    border-bottom: 1px solid $borderColor;
  }
  height: 100%;
  overflow-y: scroll;
  color: $wordColor;
  background: #fff !important;
  > .bgLIne {
    background: $bgLineColor;
    height: 0.1rem;
  }
  .radio {
    width: 0.25rem;
    height: 0.25rem;
    position: relative;
    box-shadow: #dfdfdf 0 0 0 0 inset;
    @include sexy-radius(0.15rem);
    background-clip: content-box;
    display: inline-block;
    -webkit-appearance: none;
    user-select: none;
    outline: none;
    background-image: url("../../assets/images/gouxuan.png");
    background-size: cover;
    &:checked {
      background-image: url("../../assets/images/gouxuan_on.png");
    }
  }
  > .title {
    line-height: 0.7rem;
    font-size: 0.24rem;
    text-align: center;
    border-bottom: 1px solid $borderColor;
    padding-top: 0.1rem;
  }
  .baseColor {
    background: $bgColor;
  }
  .baseContent {
    font-size: 0.2rem;
    .Ul {
      @include sexy-flex;
      flex-flow: column wrap;
      li {
        font-size: 0.22rem;
        height: 0.6rem;
        line-height: 0.6rem;
        padding: 0 0.2rem;
        border-bottom: 1px solid $borderColor;
        > .autoSpan {
          overflow-x: auto;
          white-space: nowrap;
          width: 4rem;
          padding-left: 0.2rem;
          vertical-align: middle;
        }
        > img {
          float: right;
          width: $arrowWidth;
          height: $arrowHeight;
          margin-top: 0.12rem;
        }
        > p {
          display: inline-block;
        }
        > p:nth-child(2) {
          float: right;
          margin-top: 0.18rem;
        }
      }
    }
  }
  .advise {
    padding: 0.1rem;
    background: white;
  }
  .advise textarea {
    width: 100%;
    height: 2rem;
    border: solid 0.01rem #c3c3c3;
    padding: 0.1rem;
  }
  .noclick {
    pointer-events: none;
  }
}
</style>


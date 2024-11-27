<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../../assets/images/icon_fanhui.png" />
        </a>
      </div>
      <!-- 科米舒 -->
      <div class="deptname">出科考核成绩</div>
      <!--护培轮转-->
    </c-header>
    <div class="g-main">
      <!-- <div class="g-main-c" v-if="!nocontent">
        <ul class="c-content" v-for="(item,index) in newList" :key="index">
          <li class="title" v-if="item.examdate">出科考试报名日期：{{ item.examdate }}</li>
          <li>
            <div class="title">
              <span>考试类型</span>
              <span>成绩</span>
              <span>操作</span>
            </div>
          </li>
          <li class="out-department-scores">
            <div>
              <span>理论考核</span>
              <span class="out-department-scores">{{ item.theoryscore }}</span>
              <span class="operation" @click="typeIn(item,1,1)">录入</span>
            </div>
            <div>
              <span>技能考核</span>
              <span class="out-department-scores-active" @click="getskillscore(item.examid,1)">{{ item.skillscore }}</span>
              <span class="operation" @click="typeIn(item,1,2)">录入</span>
            </div>
            <div>
              <span>综合考核</span>
              <span class="out-department-scores-active" @click="getskillscore(item.examid,2)">{{ item.comprescore }}</span>
              <span class="operation" @click="typeIn(item,1,3)">录入</span>
            </div>
            <div>
              <span>病历书写</span>
              <span class="out-department-scores">{{ item.avgBigCaseScore }}</span>
              <span class="operation" @click="typeIn(item,1,4)">录入</span>
            </div>
          </li>
          <ul class="c-content bk-content" v-for="(bkitem,index) in item.turnscoredetaillist" :key="index">
            <li class="title">出科考试补考报名日期：{{bkitem.examdate}}</li>
            <li>
              <div class="title">
                <span>考试类型</span>
                <span>成绩</span>
                <span>操作</span>
              </div>
            </li>
            <li class="out-department-scores">
              <div v-if="bkitem.examtype==1">
                <span>理论考试</span>
                <span class="flag">{{bkitem.theoryscore}}</span>
                <span class="operation" @click="typeIn(bkitem,2,1)">录入</span>
              </div>
              <div v-if="bkitem.examtype==2">
                <span>技能考核</span>
                <span class="flag" @click="getskillscore(bkitem.examid,1)">{{bkitem.skillscore}}</span>
                <span class="operation" @click="typeIn(bkitem,2)">录入</span>
              </div>
              <div v-if="bkitem.examtype==3">
                <span>综合考核</span>
                <span class="flag" @click="getskillscore(bkitem.examid,2)">{{bkitem.comprescore}}</span>
                <span class="operation" @click="typeIn(bkitem,2)">录入</span>
              </div>
              <div v-if="bkitem.examtype==4">
                <span>病历书写</span>
                <span class="flag">{{bkitem.avgBigCaseScore}}</span>
                <span class="operation" @click="typeIn(bkitem,2,2)">录入</span>
              </div>
            </li>
          </ul>
        </ul>
      </div>-->
      <!-- <div class="g-main-c" v-else-if="nocontent && !ckShow">
        <ul class="c-content">
          <li class="title" v-if="item.examdate">出科考试报名日期：</li>
          <li>
            <div class="title">
              <span>考试类型</span>
              <span>成绩</span>
              <span>操作</span>
            </div>
          </li>
          <li class="out-department-scores">
            <div>
              <span>理论考核</span>
              <span class="out-department-scores"></span>
              <span class="operation" @click="typeIn('',3,1)">录入</span>
            </div>
            <div>
              <span>技能考核</span>
              <span class="out-department-scores-active"></span>
              <span class="operation" @click="typeIn('',3,2)">录入</span>
            </div>
            <div>
              <span>综合考核</span>
              <span class="out-department-scores-active"></span>
              <span class="operation" @click="typeIn('',3,3)">录入</span>
            </div>
            <div>
              <span>病历书写</span>
              <span class="out-department-scores-active"></span>
              <span class="operation" @click="typeIn('',3,4)">录入</span>
            </div>
          </li>
        </ul>
      </div>-->
      <!-- <div class="noData" v-else>学员出科报名审核通过后，才可录入成绩</div> -->
      <van-dialog v-model="show" title :showConfirmButton="false">
        <div class="ttitle">录入</div>
        <div class="iptBox">
          <van-field
            id="ipt"
            v-model="typeInValue"
            label
            placeholder
            :border="true"
            type="number"
            :change="typeInCheck()"
          />
        </div>

        <div class="btnRow">
          <van-button type="default" @click="cancel" size="small">取消</van-button>
          <van-button type="info" size="small" @click="typeInConfirm" :loading="isLoading">确认</van-button>
        </div>
      </van-dialog>
      <!-- <div class="ck-result" v-if="type == 2">
        <div class="ck-result-content">
          <div class="title1">考试类型</div>
          <div class="title1">成绩</div>
          <div class="title1"  @click="typeIn()">操作</div>
        </div>
        <div class="ck-result-content">
          <div class="title2">理论考试</div>
          <div class="title3">{{ ckResult.theoryScore }}</div>
          <div class="title3"  @click="typeIn(ckResult.theoryScore,1)">录入</div>
        </div>
        <div class="ck-result-content">
          <div class="title2">技能考试</div>
          <div class="title3">{{ ckResult.skillScore }}</div>
          <div class="title3"  @click="typeIn(2)">录入</div>
        </div>
        <div class="ck-result-content">
          <div class="title2">综合考核</div>
          <div class="title3">{{ ckResult.compreScore }}</div>
          <div class="title3"  @click="typeIn(3)">录入</div>
        </div>
        <div class="ck-result-content">
          <div class="title2">病历书写</div>
          <div class="title3">{{ ckResult.bigCaseScore }}</div>
          <div class="title3"  @click="typeIn(4)">录入</div>
        </div>
      </div>-->
      <div class="ck-result" v-if="isEdit">
        <div class="ck-result-content">
          <div class="title1">考试类型</div>
          <div class="title1" v-if="type == 1">占比</div>
          <div class="title1">成绩</div>
          <div class="title1">操作</div>
        </div>
        <div class="ck-result-content">
          <div class="title2">理论考试</div>
          <div
            class="title2"
            v-if="type == 1"
          >{{ ckResult.proportionInfo.theoryScoreProportion | percentage }}</div>
          <div class="title3" @click="scoreDetail(ckResult,3)">{{ ckResult.theoryScore }}</div>
          <div class="title3" @click="typeIn(ckResult.theoryScore,1)">录入</div>
        </div>
        <div class="ck-result-content">
          <div class="title2">技能考试</div>
          <div
            class="title2"
            v-if="type == 1"
          >{{ ckResult.proportionInfo.skillScoreProportion | percentage }}</div>
          <div class="title3" @click="scoreDetail(ckResult,1)">{{ ckResult.skillScore }}</div>
          <div class="title3" @click="typeIn(ckResult.skillScore,2)">录入</div>
        </div>
        <div class="ck-result-content">
          <div class="title2">综合考核</div>
          <div
            class="title2"
            v-if="type == 1"
          >{{ ckResult.proportionInfo.compreScoreProportion | percentage }}</div>
          <div class="title3" @click="scoreDetail(ckResult,2)">{{ ckResult.compreScore }}</div>
          <div class="title3" @click="typeIn(ckResult.compreScore,3)">录入</div>
        </div>
        <div class="ck-result-content">
          <div class="title2">病历书写</div>
          <div
            class="title2"
            v-if="type == 1"
          >{{ ckResult.proportionInfo.bigCaseScoreProportion | percentage }}</div>
          <div class="title3" @click="scoreDetail(ckResult,4)">{{ ckResult.bigCaseScore }}</div>
          <div class="title3" @click="typeIn(ckResult.bigCaseScore,4)">录入</div>
        </div>
        <div class="ck-result-content" v-if="type == 1">
          <div class="title4">总分:{{ ckResult.scoreSum }}</div>
        </div>
      </div>
      <div class="nodata" v-else>
        <img  src="../../../assets/images/noddata.png" />
        <div  class="nodataText">学生报名审核通过后,才可录入成绩</div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Field } from "vant";
import cHeader from "../../header";
import methods from "../../../methods";
import cTab from "../../../components/tab";
import { mapState, mapActions } from "vuex";
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
      isEdit: false,
      isLoading: false,
      ckResult: {
        theoryScore: "",
        skillScore: "",
        compreScore: "",
        bigCaseScore: "",
        scoreSum: ""
      },
      type: 0,
      typeInObj: "",
      newList: [],
      nocontent: false,
      data: {},
      showreason: false,
      typeInValue: "",
      input: "",
      show: false,
      isbk: "",
      scoreType: 0,
      ckShow: ""
    };
  },
  created() {},
  //  computed: {
  //     bactive: function(){
  //         return this.type - 1;
  //     }
  // },
  mounted() {
    let self = this;
    self.init();
    self.registerToNative("goBack", function(data) {
      self.back();
    });
    self.getScoreList();
    self.judgeCk();
    self.getIsEdit()
  },
  filters: {
    percentage: function(value) {
      return (value * 100).toFixed(0) + "%";
    }
  },
  methods: {
    ...methods,
    ...mapActions([
      "showAlert",
      "showConfirm",
      "showLoading",
      "hideLoading",
      "toast",
      "setTurninfo"
    ]),
    init: function() {
      let self = this;
      self.data = {
        command: "turn/turnplan",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid")
      };
      // 由带教老师页面跳转过来
      // if (self.$route.query.type != 0) {
      //   self.data.uid = this.turninfo.stuid;
      // }
      // self
      //   .post("/turn/turnplan", self.data)
      //   .done(function(data) {
      //     // self.list = self.sort(data.plandetaillist)
      //     if (data.plandetaillist) {
      //       self.list = data.plandetaillist;
      //     }
      //     self.list.map(function(item, index, arr) {
      //       if (item.realendtime == null && item.turnstatus != 4) {
      //         item.realendtime = "目前";
      //       }
      //     });
      //     if (self.list.length == 0) {
      //       self.noContent = true;
      //     }
      //   })
      //   .fail(function(error) {
      //     self.noContent = true;
      //   });
    },
    back() {
      window.history.go(-1);
    },
    getIsEdit() {
      let self = this
      self.get(`/base/turnscore/isEdit/${self.$route.query.plandetailid}`).done(res => {
        self.isEdit = res.model
      })
    },
    judgeCk() {
      let self = this;
      self
        .post("/commparaconf/queryCommparaConfList", {
          command: "commparaconf/queryCommparaConfList",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          paramcode: "ck_settings",
          paramvalue: "8"
        })
        .then(data => {
          if (data && data.errcode == "0") {
            if (data.commparaConfList.length > 0) {
              self.ckShow = Number(data.commparaConfList[0].param1);
              console.log(self.ckShow);
            }
          }
        });
    },
    typeIn(score, type) {
      let self = this;
      self.typeInValue = score;
      // self.typeInObj = obj;
      self.show = true;
      self.scoreType = type;
      // console.log(self.typeInObj);
    },
    cancel() {
      let self = this;
      self.show = false;
    },
    onChange(event) {
      // console.log(event.detail);
    },
    // formatter(value) {
    //   过滤输入的数字
    // },
    typeInCheck() {
      let self = this;
      console.log(self.typeInValue);
      if (self.typeInValue > 200) {
        self.typeInValue = 200;
      }
      if (self.typeInValue < 0) {
        self.typeInValue = 0;
      }
      // if (
      //   String(self.typeInValue).indexOf("e") != -1 ||
      //   String(self.typeInValue).indexOf("+") != -1 ||
      //   String(self.typeInValue).indexOf("-") != -1
      // ) {
      //   console.log("error");
      //   self.typeInValue = "";
      // }
      // let prohibitInput = ["-", "e", "+", "E"];
      // if (self.typeInValue.includes(self.typeInValue)) {
      //   self.typeInValue = "";
      // }
      self.typeInValue = String(this.typeInValue).replace(
        /^(-)*(\d+)\.(\d\d).*$/,
        "$1$2.$3"
      );
      if (self.typeInValue == "") {
        self.typeInValue = "";
      }
      // self.typeInValue = String(this.typeInValue).replace(/[^\d]/g, "");
      // // let ipt = document.getElementById("ipt");
      // // console.log(ipt);
    },
    scoreDetail(item,type) {
      let self = this
      this.$router.push({
        name: "fdRotation_doctor_ckrecord",
        query: {
          tpid: this.$route.query.businessid,
          id:item.id,
          type: type,
          stdid: this.$route.query.stdid,
          uid: this.$route.query.uid
        }
      });
      // self.post(`/base/turnscorehistory/list?turnScoreId=${item.id}&scoreType=${type}&pageSize=999&pageNum=1`).done(res => {
      //   console.log(res)
      // })
    },
    getScoreList() {
      let self = this;
      // self
      //   .post("/turnscore/querystuturnscore", {
      //     command: "turnscore/querystuturnscore",
      //     sessionid: $.cookie("sid"),
      //     loginid: $.cookie("uid"),
      //     deptid: self.$route.query.deptid,
      //     businessid: self.$route.query.businessid,
      //     uid: self.$route.query.uid
      //   })
      //   .done(function (data) {
      //     if (data && data.errcode == 0) {
      //       let examid = [];
      //       if (data.stuturnscorelist.length > 0) {
      //         self.newList = data.stuturnscorelist;
      //         for (let i = 0; i < self.newList.length; i++) {
      //           let ai = 0;
      //         }
      //         self.nocontent = false;
      //       } else {
      //         self.nocontent = true;
      //       }
      //       console.log("thisnocontent", self.nocontent);
      //     }
      //   })
      //   .fail(function (error) {
      //     self.nocontent = true;
      //   });
      self
        .get(`/base/turnScore/getPlanScore/${self.$route.query.plandetailid}`)
        .done(res => {
          if (res.resCode == 200) {
            self.ckResult = res.model;
            self.type = res.model.type;
          }
        });
    },
    getskillscore(seiid, type) {
      let typename;
      let self = this;
      if (type == 1) {
        typename = "出科考核（技能）";
      }
      if (type == 2) {
        typename = "出科考核（综合）";
      }
      if (type == 3) {
        typename = "病历书写";
        // 跳转病历评分表
        // this.$router.push({
        //   path: "/extranceExam/averagepagerelation",
        //   query: {
        //     seiid: seiid,
        //     // stuid: $.cookie("uid"),
        //     stuid: self.$route.query.uid,
        //     typename: typename,
        //     type: type
        //   }
        // });
      }
      this.$router.push({
        // path: "/extranceExam/averagepagerelation",
        name: 'averagepagerelation',
        query: {
          seiid: seiid,
          // stuid: $.cookie("uid"),
          stuid: self.$route.query.uid,
          typename: typename,
          type: type
        }
      });
    },
    // typeInConfirm() {
    //   let self = this;
    //   if (self.typeInValue == "") {
    //     self.$toast("成绩格式错误");
    //     return;
    //   }
    //   let turnscoredetaillist = [];
    //   let bigCaseScore = null;
    //   let theoryscore = null;
    //   let skillscore = null;
    //   let comprescore = null;
    //   let score = {};
    //   if (self.isbk == 1) {
    //     theoryscore =
    //       self.scoreType == 1 ? self.typeInValue : self.typeInObj.theoryscore;
    //     skillscore =
    //       self.scoreType == 2 ? self.typeInValue : self.typeInObj.skillscore;
    //     comprescore =
    //       self.scoreType == 3 ? self.typeInValue : self.typeInObj.comprescore;
    //     bigCaseScore =
    //       self.scoreType == 4
    //         ? self.typeInValue
    //         : self.typeInObj.avgBigCaseScore;
    //     score = {
    //       theoryscore: null,
    //       skillscore: null,
    //       comprescore: null,
    //       turnscoreid: self.typeInObj.turnscoreid,
    //       id: self.typeInObj.turnscoredetailid
    //     };

    //     turnscoredetaillist.push(score);
    //   } else if (self.isbk == 2) {
    //     if (self.scoreType == 1) {
    //       bigCaseScore = self.typeInObj.avgBigCaseScore;
    //       theoryscore = self.typeInValue;
    //       skillscore = self.typeInObj.skillscore;
    //       comprescore = self.typeInObj.comprescore;
    //       score = {
    //         theoryscore: null,
    //         skillscore: null,
    //         comprescore: null,
    //         // bigCaseScore: self.typeInObj.bigCaseScore,
    //         turnscoreid: self.typeInObj.turnscoreid,
    //         id: self.typeInObj.id
    //       };
    //     } else if (self.scoreType == 2) {
    //       bigCaseScore = self.typeInValue;
    //       theoryscore = self.typeInObj.theoryscore;
    //       skillscore = self.typeInObj.skillscore;
    //       comprescore = self.typeInObj.comprescore;
    //       score = {
    //         theoryscore: null,
    //         skillscore: null,
    //         comprescore: null,
    //         // bigCaseScore: self.typeInValue,
    //         turnscoreid: self.typeInObj.turnscoreid,
    //         id: self.typeInObj.id
    //       };
    //     }
    //     turnscoredetaillist.push(score);
    //   } else if (self.isbk == 3) {
    //     let params = {};
    //     if (self.scoreType == 1) {
    //       params = {
    //         command: "turnscore/addturnscore",
    //         sessionid: $.cookie("sid"),
    //         loginid: $.cookie("uid"),
    //         uid: self.$route.query.uid,
    //         deptid: self.$route.query.deptid,
    //         ckdate: this.$route.query.endtime,
    //         examdate: this.$route.query.endtime,
    //         turndeptid: "",
    //         theoryscore: self.typeInValue,
    //         skillscore: "",
    //         comprescore: "",
    //         bigCaseScore: ""
    //       };
    //     } else if (self.scoreType == 2) {
    //       params = {
    //         command: "turnscore/addturnscore",
    //         sessionid: $.cookie("sid"),
    //         loginid: $.cookie("uid"),
    //         uid: self.$route.query.uid,
    //         deptid: self.$route.query.deptid,
    //         ckdate: this.$route.query.endtime,
    //         examdate: this.$route.query.endtime,
    //         turndeptid: "",
    //         theoryscore: "",
    //         skillscore: self.typeInValue,
    //         comprescore: "",
    //         bigCaseScore: ""
    //       };
    //     } else if (self.scoreType == 3) {
    //       params = {
    //         command: "turnscore/addturnscore",
    //         sessionid: $.cookie("sid"),
    //         loginid: $.cookie("uid"),
    //         uid: self.$route.query.uid,
    //         deptid: self.$route.query.deptid,
    //         ckdate: this.$route.query.endtime,
    //         examdate: this.$route.query.endtime,
    //         turndeptid: "",
    //         theoryscore: "",
    //         skillscore: "",
    //         comprescore: self.typeInValue,
    //         bigCaseScore: ""
    //       };
    //     } else if (self.scoreType == 4) {
    //       params = {
    //         command: "turnscore/addturnscore",
    //         sessionid: $.cookie("sid"),
    //         loginid: $.cookie("uid"),
    //         uid: self.$route.query.uid,
    //         deptid: self.$route.query.deptid,
    //         ckdate: this.$route.query.endtime,
    //         examdate: this.$route.query.endtime,
    //         turndeptid: "",
    //         theoryscore: "",
    //         skillscore: "",
    //         comprescore: "",
    //         bigCaseScore: self.typeInValue
    //       };
    //     }
    //     self.post("/turnscore/addturnscore", params).done(res => {
    //       self.getScoreList();
    //       self.$toast("录入成功");
    //       return;
    //     });
    //   } else {
    //     return;
    //   }
    //   self
    //     .post("/turnscore/updateturnscore", {
    //       command: "turnscore/updateturnscore",
    //       sessionid: $.cookie("sid"),
    //       loginid: $.cookie("uid"),
    //       turnscoreid: self.typeInObj.turnscoreid,
    //       bigCaseScore: bigCaseScore,
    //       theoryscore: theoryscore,
    //       skillscore: skillscore,
    //       comprescore: comprescore,
    //       turnscoredetaillist
    //     })
    //     .done(function(data) {
    //       self.show = false;
    //       self.getScoreList();
    //       self.$toast("录入成功");
    //     })
    //     .fail(function(error) {
    //       console.log("fail");
    //     });
    // }
    // 是否配置自动出科

    // 是否配置自动未轮转
    typeInConfirm() {
      let self = this;
      self.isLoading = true
      self.show = false;
      // let params = {
      //   id: self.ckResult.id,
      //   theoryScore:
      //     self.scoreType == 1 ? self.typeInValue : self.ckResult.theoryScore,
      //   skillScore:
      //     self.scoreType == 2 ? self.typeInValue : self.ckResult.skillScore,
      //   compreScore:
      //     self.scoreType == 3 ? self.typeInValue : self.ckResult.compreScore,
      //   bigCaseScore:
      //     self.scoreType == 4
      //       ? self.typeInValue
      //       : self.ckResult.bigCaseScore
      // };
      let params
      if(self.scoreType == 1) {
        params = {
          id: self.ckResult.id,
          theoryScore: self.typeInValue,
        }
      }else if(self.scoreType == 2) {
        params = {
          id: self.ckResult.id,
          skillScore: self.typeInValue,
        }
      }else if(self.scoreType == 3) {
        params = {
          id: self.ckResult.id,
          compreScore: self.typeInValue,
        }
      }else if(self.scoreType == 4) {
        params = {
          id: self.ckResult.id,
          bigCaseScore: self.typeInValue,
        }
      }
      self.post("/base/turnscore/editTurnScore",params).done(res => {
        self.getScoreList()
        setTimeout(() => {
          self.isLoading = false
        },500)
      })
    }
  }
};
</script>
<style lang="scss">
.iptBox {
  .van-field {
    .van-field__label {
      display: none !important;
    }
    .van-field__body {
      border: 1px solid #cccccc !important;
      border-radius: 3px !important;
    }
  }
}

.btnRow {
  .van-button {
    margin-left: 5px;
  }
  .van-button--default {
    border: 1px solid #797979 !important;
    border-radius: 3px;
  }
}
</style>
<style scoped lang="scss">
.ck-result {
  .ck-result-content {
    display: flex;
    .title1 {
      flex: 1;
      height: 40px;
      background: #fff;
      line-height: 40px;
      color: #111111;
      letter-spacing: 0.2px;
      font-size: 18px;
      text-align: center;
      border-bottom: 0.5px solid #e2e2e2;
      border-right: 0.5px solid #e2e2e2;
    }
    .title2 {
      flex: 1;
      height: 40px;
      background: #fff;
      line-height: 40px;
      color: #111111;
      letter-spacing: 0.2px;
      font-size: 15px;
      text-align: center;
      border-bottom: 0.5px solid #e2e2e2;
      border-right: 0.5px solid #e2e2e2;
    }
    .title3 {
      flex: 1;
      height: 40px;
      background: #fff;
      line-height: 40px;
      color: #2685d2;
      letter-spacing: 0.2px;
      font-size: 15px;
      text-align: center;
      border-bottom: 0.5px solid #e2e2e2;
      border-right: 0.5px solid #e2e2e2;
    }
    .title4 {
      flex: 1;
      height: 40px;
      background: #fff;
      line-height: 40px;
      color: #111111;
      letter-spacing: 0.2px;
      font-size: 15px;
      border-bottom: 0.5px solid #e2e2e2;
      border-right: 0.5px solid #e2e2e2;
      padding-left: 30px;
    }
  }
}
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

.van-dialog {
  .ttitle {
    margin: 10px 0px 0px 15px;
  }

  .btnRow {
    display: flex;
    justify-content: flex-end;
    margin: 0px 15px 10px;
  }
}

.unchecked {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

ul.c-content {
  margin: 0.1rem 0;
  li.title {
    padding-left: 0.2rem;
    height: 0.6rem;
    line-height: 0.6rem;
  }
  > li {
    background: #fff;
    color: #666;
    font-size: 0.22rem;
    border-bottom: 1px solid #eee;

    div.title {
      background: rgba(242, 242, 242, 1);
    }
    div {
      height: 0.6rem;
      span {
        text-align: center;
        font-size: 0.24rem;
        line-height: 0.6rem;
      }
      span:nth-child(4) {
        flex: 0.5;
      }
      span.cancle {
        color: rgb(52, 153, 219);
      }
    }
    div {
      display: flex;
      position: relative;
    }
    span {
      flex: 1;
      width: 0;
    }
  }
  .out-department-scores {
    .operation {
      color: #3499db;
    }
  }
  .out-department-scores-active {
    color: #3499db;
    .operation {
      color: #3499db;
    }
  }
}

.noData {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.nodata {
  background: #ffffff;
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    height: 138px;
    width: 280px;
  }
  .nodataText {
    font-size: 17px;
    color: #868e97;
  }
}
</style>
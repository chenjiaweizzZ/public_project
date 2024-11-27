<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../../assets/images/icon_fanhui.png" />
        </a>
      </div>出科考核成绩
    </c-header>
    <div class="g-main">
      <!-- <div class="g-main-c" v-for="(item,index) in newList"> -->
        <!--学生本人-->
        <!-- <ul class="c-content" v-show="isstdself">
          <li class="title" v-if="item.examdate" v-if="ckShow">出科考试报名日期：{{item.examdate}}</li>
          <li>
            <div class="title">
              <span>考试类型</span>
              <span>成绩</span>
              <span v-if="ckShow">状态</span>
              <span v-if="ckShow">详情</span>
            </div>
          </li>
          <li class="first-score bk-score">
            <div>
              <span>理论考试</span>
              <span class="flag">{{item.theoryscore | score }}</span>
              <span
                class="flag"
                v-if="item.theoryflag && ckShow"
                @click="makeup('theory',item.turnscoreid)"
                :class="{noclick:issubmit}"
                :style="{'color':computeColor(item.theoryflag) , 'pointer-events' : computeEvent(item.theoryflag)} "
              >{{item.theoryflag | flag}}</span>
              <span v-if="ckShow"></span>
            </div>
            <div>
              <span>技能考核</span>
              <span class="flag">{{item.skillscore | score}}</span>
              <span
                class="flag"
                :style="{'color':computeColor(item.skillflag) , 'pointer-events' : computeEvent(item.skillflag)}"
                v-if="item.skillflag && ckShow"
                @click="makeup('skill',item.turnscoreid)"
                :class="{noclick:issubmit}"
              >{{item.skillflag | flag}}</span>
              <span v-if="ckShow">
                <i
                  :class="{choice:turnexam.turnexamid}"
                  @click="getskillscore(item.examid,1)"
                  v-if="turnexam.turnexamtype==1"
                  v-for="turnexam in item.turnexamlist"
                ></i>
              </span>
            </div>
            <div>
              <span>综合考核</span>
              <span class="flag">{{item.comprescore | score}}</span>
              <span
                class="flag"
                :style="{'color':computeColor(item.compreflag) , 'pointer-events' : computeEvent(item.compreflag)}"
                v-if="item.compreflag && ckShow"
                @click="makeup('compre',item.turnscoreid)"
                :class="{noclick:issubmit}"
              >{{item.compreflag | flag}}</span>
              <span v-if="ckShow">
                <i
                  :class="{choice:turnexam.turnexamid}"
                  @click="getskillscore(item.examid,2)"
                  v-if="turnexam.turnexamtype==2"
                  v-for="turnexam in item.turnexamlist"
                ></i>
              </span>
            </div>
            <div>
              <span>病历书写</span>
              <span class="flag">{{item.avgBigCaseScore | score}}</span>
              <span
                class="flag"
                :style="{'color':computeColor(item.bigCaseflag) , 'pointer-events' : computeEvent(item.bigCaseflag)}"
                v-if="item.bigCaseflag && ckShow"
                :class="{noclick:issubmit}"
              ></span>
              <span v-if="ckShow">
                <i
                  :class="{choice:turnexam.turnexamid}"
                  v-if="false"
                  v-for="turnexam in item.turnexamlist"
                ></i>
              </span>
            </div>
          </li>
        </ul> -->
        <!--非学生本人-->
        <!-- <ul class="c-content" v-show="!isstdself">
          <li class="title" v-if="item.examdate" v-if="ckShow">出科考试报名日期：{{item.examdate}}</li>
          <li>
            <div class="title">
              <span>考试类型</span>
              <span>成绩</span>
            </div>
          </li>
          <li class="first-score bk-score">
            <div>
              <span>理论考试</span>
              <span class="flag">{{item.theoryscore | score }}</span>
            </div>
            <div>
              <span>技能考核</span>
              <span class="flag">{{item.skillscore | score}}</span>
            </div>
            <div>
              <span>综合考核</span>
              <span class="flag">{{item.comprescore | score}}</span>
            </div>
            <div>
              <span>病历书写</span>
              <span class="flag">{{item.avgBigCaseScore | score}}</span>
            </div>
          </li>
        </ul> -->
        <!--补考列表-->
        <!-- <ul class="c-content bk-content" v-for="bkitem in item.turnscoredetaillist">
          <li class="title" v-if="ckShow">出科考试补考报名日期：{{bkitem.examdate}}</li>
          <li>
            <div class="title">
              <span>考试类型</span>
              <span>成绩</span>
              <span v-if="ckShow"></span>
            </div>
          </li>
          <li>
            <div v-if="bkitem.examtype==1">
              <span>理论考试</span>
              <span class="flag">{{bkitem.theoryscore | score }}</span>
              <span v-if="ckShow">
                <i class="cancel-bk" @click.stop="cancelBk(bkitem.examid)">取消</i>
              </span>
            </div>
            <div v-if="bkitem.examtype==2">
              <span>技能考核</span>
              <span class="flag">{{bkitem.skillscore | score}}</span>
              <span v-if="ckShow">
                <i
                  :class="{choice:bkitem.turnexamid}"
                  @click="getskillscore(bkitem.examid,1)"
                  v-if="bkitem.turnexamid"
                ></i>
                <i v-else class="cancel-bk" @click.stop="cancelBk(bkitem.examid)">取消</i>
              </span>
            </div>
            <div v-if="bkitem.examtype==3">
              <span>综合考核</span>
              <span class="flag">{{bkitem.comprescore | score}}</span>
              <span v-if="ckShow">
                <i
                  :class="{choice:bkitem.turnexamid}"
                  @click="getskillscore(bkitem.examid,2)"
                  v-if="bkitem.turnexamid"
                ></i>
                <i class="cancel-bk" @click.stop="cancelBk(bkitem.examid)" v-else>取消</i>
              </span>
            </div>
            <div v-if="bkitem.examtype==4">
              <span>病历书写</span>
              <span class="flag">{{bkitem.avgBigCaseScore | score}}</span>
              <span v-if="ckShow">
                <i
                  :class="{choice:bkitem.turnexamid}"
                  v-if="false"
                ></i>
                <i class="cancel-bk" v-if="false"></i>
              </span>
            </div>
          </li>
        </ul> -->
      <!-- </div> -->
      <!-- <div class="ck-result" v-if="type == 2">
        <div class="ck-result-content">
          <div class="title1">考试类型</div>
          <div class="title1">成绩</div>
        </div>
        <div class="ck-result-content">
          <div class="title2">理论考试</div>
          <div class="title3">{{ ckResult.theoryScore }}</div>
        </div>
        <div class="ck-result-content">
          <div class="title2">技能考试</div>
          <div class="title3">{{ ckResult.skillScore }}</div>
        </div>
        <div class="ck-result-content">
          <div class="title2">综合考核</div>
          <div class="title3">{{ ckResult.compreScore }}</div>
        </div>
        <div class="ck-result-content">
          <div class="title2">病历书写</div>
          <div class="title3">{{ ckResult.bigCaseScore }}</div>
        </div>
      </div> -->
      <div class="ck-result">
        <div class="ck-result-content">
          <div class="title1">考试类型</div>
          <div class="title1" v-if="type == 1">占比</div>
          <div class="title1">成绩</div>
        </div>
        <div class="ck-result-content">
          <div class="title2">理论考试</div>
          <div class="title2" v-if="type == 1">{{ ckResult.proportionInfo.theoryScoreProportion | percentage }}</div>
          <div class="title3" @click="scoreDetail(ckResult,3)" v-if="ckResult.theoryScore">{{ ckResult.theoryScore }}</div>
          <div class="title3"  v-else>{{ ckResult.theoryScore }}</div>
        </div>
        <div class="ck-result-content">
          <div class="title2">技能考试</div>
          <div class="title2" v-if="type == 1">{{ ckResult.proportionInfo.skillScoreProportion | percentage  }}</div>
          <div class="title3" @click="scoreDetail(ckResult,1)" v-if="ckResult.skillScore">{{ ckResult.skillScore }}</div>
          <div class="title3"  v-else>{{ ckResult.skillScore }}</div>
        </div>
        <div class="ck-result-content">
          <div class="title2">综合考核</div>
          <div class="title2" v-if="type == 1">{{ ckResult.proportionInfo.compreScoreProportion | percentage  }}</div>
          <div class="title3" @click="scoreDetail(ckResult,2)" v-if="ckResult.compreScore">{{ ckResult.compreScore }}</div>
          <div class="title3"  v-else>{{ ckResult.compreScore }}</div>
        </div>
        <div class="ck-result-content">
          <div class="title2">病历书写</div>
          <div class="title2" v-if="type == 1">{{ ckResult.proportionInfo.bigCaseScoreProportion | percentage  }}</div>
          <div class="title3" @click="scoreDetail(ckResult,4)" v-if="ckResult.bigCaseScore">{{ ckResult.bigCaseScore }}</div>
          <div class="title3"  v-else>{{ ckResult.bigCaseScore }}</div>
        </div>
        <div class="ck-result-content" v-if="type == 1">
          <div class="title4">总分:{{ ckResult.scoreSum }}</div>
        </div>
      </div>
    </div>
    <no-content v-if="nocontent"></no-content>
  </div>
</template>
<script>
import cHeader from "../../header";
import methods from "../../../methods";
import { mapState, mapActions } from "vuex";
import noContent from "../../no_content";
export default {
  data() {
    return {
      list: [],
      ckResult: {
        theoryScore: "",
        skillScore: "",
        compreScore: "",
        bigCaseScore: "",
        scoreSum: ""
      },
      type: 0,
      nocontent: false,
      iscompre: false,
      isskill: false,
      istheory: false,
      issubmit: false,
      newList: [],
      isstdself: false,
      ckShow: true
    };
  },
  components: { cHeader, noContent },
  computed: {
    ...mapState(["turninfo"])
  },
  watch: {},
  created() {
    this.judgeCk()
  },
  filters: {
    flag: function(value) {
      if (value == 0) {
        return "";
      } else if (value == 1) {
        return "补考";
      } else if (value == 2) {
        return "已补考报名";
      }
    },
    score: function(value) {
      if (value < 0) {
        return "缺考";
      } else if (value === 0 || value == "0" || value) {
        return value;
      } else if (value === "" || value === null) {
        return "";
      }
    },
    percentage: function(value) {
      return (value * 100).toFixed(0) + '%'
    }
  },
  mounted() {
    this.init();
    console.log(this.turninfo);
  },
  methods: {
    ...methods,
    judgeCk() {
      let self = this
      self.post('/commparaconf/queryCommparaConfList', {
          command: "commparaconf/queryCommparaConfList",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          paramcode: 'ck_settings',
          paramvalue: "8"
        }).then(data => {
          if(data && data.errcode == "0") {
            if(data.commparaConfList.length > 0) {
              self.ckShow = Number(data.commparaConfList[0].param1)
            }
          }
        })
    },
    scoreDetail(item,type) {
      let self = this
      this.$router.push({
        name: "fdRotation_doctor_ckrecord",
        query: {
          tpid: this.$route.query.id,
          id:item.id,
          type: type,
          uid: this.$route.query.stdid
        }
      });
      // self.post(`/base/turnscorehistory/list?turnScoreId=${item.id}&scoreType=${type}&pageSize=999&pageNum=1`).done(res => {
      //   console.log(res)
      // })
    },
    cancleExam(param, id) {
      let self = this;
      let opition = {};
      if (param == "theory") {
        opition.examflag = "1";
      } else if (param == "skill") {
        opition.examflag = "2";
      } else if (param == "compre") {
        opition.examflag = "3";
      }
      self
        .post("/turnexam/validateturnexamday", {
          command: "turnexam/validateturnexamday",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          businessid: self.turninfo.businessid,
          turnscoreid: id,
          ...opition
        })
        .done(function(data) {
          if (data && data.flag == 1) {
            self.showConfirm({
              title: "提醒",
              msg: "确认要删除此次补考报名？",
              theme: "modal-confirm modal-white",
              ok: function() {
                self
                  .post("/turnexam/deleteexamination", {
                    command: "turnexam/deleteexamination",
                    sessionid: $.cookie("sid"),
                    loginid: $.cookie("uid"),
                    id: id
                  })
                  .done(function(data) {
                    if (data && data.errcode == 0) {
                      self.init();
                    }
                  })
                  .fail(function(error) {
                    // self.nocontent = true
                  });
              },
              cancel: function() {}
            });
          } else {
            self.$toast("报名时间已过，禁止删除");
          }
        });
    },
    getskillscore(seiid, type) {
      let typename;
      if (type == 1) {
        typename = "出科考核（技能）";
      }
      if (type == 2) {
        typename = "出科考核（综合）";
      }
      this.$router.push({
        // path: "/extranceExam/averagepagerelation",
        name: 'averagepagerelation',
        query: {
          seiid: seiid,
          stuid: $.cookie("uid"),
          typename: typename,
          type: type
        }
      });
    },
    ...mapActions([
      "showAlert",
      "showConfirm",
      "showLoading",
      "hideLoading",
      "toast"
    ]),
    cancelBk(examid) {
      let self = this;
      this.showConfirm({
        title: "提醒",
        msg: "你确定要取消此次补考？",
        theme: "modal-confirm modal-white",
        ok: function() {
          self
            .post("/turnexam/cancelexamination", {
              command: "turnexam/cancelexamination",
              sessionid: $.cookie("sid"),
              loginid: $.cookie("uid"),
              id: examid
            })
            .done(function(data) {
              if (data && data.errcode == 0 && data.flag == 0) {
                self.toast("报名取消成功");
                self.init();
              } else {
                self.toast(data.message);
              }
            });
        },
        cancel: function() {}
      });
    },
    init() {
      let self = this;
      let user = "";
      if (self.$route.query.type == 0) {
        user = $.cookie("uid");
      } else {
        user = this.turninfo.stuid;
      }
      if (user == $.cookie("uid")) {
        this.isstdself = true;
      } else {
        this.isstdself = false;
      }
      // self
      //   .post("/turnscore/querystuturnscore", {
      //     command: "turnscore/querystuturnscore",
      //     sessionid: $.cookie("sid"),
      //     loginid: $.cookie("uid"),
      //     deptid: self.turninfo.deptid,
      //     businessid: self.$route.query.id,
      //     uid: user
      //   })
      //   .done(function(data) {
      //     if (data && data.errcode == 0) {
      //       let examid = [];
      //       if (data.stuturnscorelist.length > 0) {
      //         self.newList = data.stuturnscorelist;
      //         for (let i = 0; i < self.newList.length; i++) {
      //           let ai = 0;
      //         }
      //       } else {
      //         self.nocontent = true;
      //       }
      //     }
      //   })
      //   .fail(function(error) {
      //     self.nocontent = true;
      //   });
      self
        .get(`/base/turnScore/getPlanScore/${self.$route.query.id}`)
        .done(res => {
          if (res.resCode == 200) {
            self.ckResult = res.model;
            self.type = res.model.type;
          }
        });
    },
    computeColor(param) {
      if (param == 1) {
        return "#3499db";
      } else if (param == 2) {
        return "#666";
      }
    },
    computeEvent(param) {
      if (param == 1) {
        return "auto";
      } else if (param == 2 || param == 0) {
        return "none";
      }
    },
    makeup(param, id) {
      let self = this;
      let opition = {};
      if (param == "theory") {
        opition.examflag = "1";
      } else if (param == "skill") {
        opition.examflag = "2";
      } else if (param == "compre") {
        opition.examflag = "3";
      }
      this.issubmit = true;
      self
        .post("/turnexam/validateturnexamday", {
          command: "turnexam/validateturnexamday",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          businessid: self.turninfo.businessid,
          turnscoreid: id,
          ...opition
        })
        .done(function(data) {
          self.issubmit = false;
          if (data && data.flag == 1) {
            self.showConfirm({
              title: "提醒",
              msg: "是否确认补考报名？",
              theme: "modal-confirm modal-white",
              ok: function() {
                self.enlist(param, id);
              },
              cancel: function() {}
            });
          } else {
            self.$toast(data.message);
          }
        })
        .fail(() => {
          self.issubmit = false;
        });
    },
    enlist(param, id) {
      let self = this;
      let opitions = {};
      if (param == "theory") {
        opitions.theorystatus = "1";
        opitions.examtype = "1";
      } else if (param == "skill") {
        opitions.skillstatus = "1";
        opitions.examtype = "2";
      } else if (param == "compre") {
        opitions.comprestatus = "1";
        opitions.examtype = "3";
      }else if (param == "bigcase") {
        opitions.comprestatus = "1";
        opitions.examtype = "4";
      }
      let date =
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate();
      self
        .post("/turnexam/addtrunexaminition", {
          command: "turnexam/addtrunexaminition",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          examdate: date,
          stuid: $.cookie("uid"),
          businessid: self.turninfo.businessid,
          deptid: self.turninfo.deptid,
          enlisttype: "2",
          isresouce: "0",
          turnscoreid: id,
          ...opitions
        })
        .done(function(data) {
          if (data && data.errcode == 0) {
            self.toast("报名成功！");
            self.init();
          } else {
            self.toast(data.errdesc);
          }
        });
    },
    back() {
      let self = this;
      this.$router.push({
        name: "fdRotation_doctor_exam",
        query: {
          type: self.$route.query.type,
          where: self.$route.query.where,
          id: self.$route.query.id
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
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
      border-bottom: 0.5px solid #E2E2E2;
      border-right: 0.5px solid #E2E2E2;
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
      border-bottom: 0.5px solid #E2E2E2;
      border-right: 0.5px solid #E2E2E2;
    }
    .title3 {
      flex: 1;
      height: 40px;
      background: #fff;
      line-height: 40px;
      color: #2685D2;
      letter-spacing: 0.2px;
      font-size: 15px;
      text-align: center;
      border-bottom: 0.5px solid #E2E2E2;
      border-right: 0.5px solid #E2E2E2;
    }
    .title4 {
      flex: 1;
      height: 40px;
      background: #fff;
      line-height: 40px;
      color: #111111;
      letter-spacing: 0.2px;
      font-size: 15px;
      border-bottom: 0.5px solid #E2E2E2;
      border-right: 0.5px solid #E2E2E2;
      padding-left: 20px;
    }
  }
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
}
ul.m-content {
  margin-top: 0.1rem;
  padding: 0.1rem 0;
  color: #888;
  border-top: 1px solid #c9caca;
  li {
    display: flex;
    span {
      flex: 1;
      width: 0;
    }
  }
}
i.choice {
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  margin-top: 0.15rem;
  background: url("../../../assets/images/you-jiantou.png") 0 0 no-repeat;
  background-size: 100% 100%;
}
i.onchoice {
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  background: url("../../../assets/images/xia-jiantou.png") 0 0 no-repeat;
  background-size: 100% 100%;
  right: -0.25rem;
}
.flag {
  text-align: center;
}
i.cancel-bk {
  color: #3499db;
  font-style: normal;
}
</style>

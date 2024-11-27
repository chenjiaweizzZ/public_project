<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../assets/images/icon_fanhui.png" />
        </a>
      </div>
      {{examtypename}}
      <div class="btn-group" slot="headerRight">
        <img @click="addconfig.show = true" src="../../assets/images/icon_zengjia.png" />
      </div>
    </c-header>
    <add-group :config="addconfig" :data-list="addlist" @confirm="addselect"></add-group>
    <!--弹框-->
    <div class="g-main">
      <div class="list-wrap">
        <div class="wrap-c">
          <ul>
            <li>
              <div class="tit">科室：</div>
              <div>{{deptnameString(info.deptIdNameVoList)}}</div>
            </li>
            <li>
              <div class="tit">考核项目：</div>
              <div>{{examitemnamearr.join(',')}}</div>
            </li>
            <li>
              <div class="tit">考官：</div>
              <div>{{teacherName.join(',')}}</div>
            </li>
            <li>
              <div class="tit">考核时间：</div>
              <div>{{info.starttime}}-{{info.endtime}}</div>
            </li>
            <li>
              <div class="tit">考核地点：</div>
              <div>{{info.place}}</div>
            </li>
            <li>
              <div class="tit">备注：</div>
              <div>{{info.remark}}</div>
            </li>
          </ul>
        </div>
        <div class="exam-form">
          <div class="title">
            被考核学员
            <label class="red" v-if="isExaminer&&!$route.query.examfinished">
              （点击下方
              <span class="edit-icon"></span>进行打分）
            </label>
          </div>
          <div class="exam-table">
            <van-loading color="#1989fa" v-if="loading" />
            <div class="sheet" v-if="!loading&&scoreSheet.length>0">
              <div class="fl">
                <ul>
                  <li>姓名</li>
                  <li v-for="(item,i) of scoreSheet" :key="i" class="nameBox">
                    <p class="p-box">{{item.stuname}}</p>
                    <p class="p-box">{{item.code}}</p>
                  </li>
                </ul>
              </div>
              <!--<div class="fl" v-if="$route.query.key==2">-->
              <!--<ul >-->
              <!--<li>姓名</li>-->
              <!--<li v-for="(item,i) of scoreSheet" :key="i">-->
              <!--<p>{{item.stuname}}</p>-->
              <!--<p>{{item.username}}</p>-->
              <!--</li>-->
              <!--</ul>-->
              <!--</div>-->
              <div class="mid comprehensive">
                <ul class="items">
                  <ul
                    class="items"
                    :class="{short:scoreSheet[0].itemscorelist.length>3,long:scoreSheet[0].itemscorelist.length<=3}"
                  >
                    <li v-for="(item,i) of scoreSheet[0].itemscorelist" :key="i">
                      <p>{{item.examitemname|filterword}}</p>
                    </li>
                    <!-- <li v-if="zh_examtype==2">
                                            <p style="text-align:right;padding-right: 0.3rem">出科考核综合</p>
                    </li>-->
                  </ul>
                </ul>
                <ul
                  class="items"
                  v-for="(item,i) of scoreSheet"
                  :key="i"
                  :class="{short:item.itemscorelist.length>3,long:item.itemscorelist.length<=3}"
                >
                  <li v-for="(innerItem,k) of item.itemscorelist">
                    <!--0是待评-->
                    <span
                      v-if="innerItem.status==0&&!$route.query.examfinished&&!overduetime"
                      class="edit-icon"
                      @click="editFun($event,innerItem.examitemid,item.stuid,innerItem.examitemname,item.seiIds,item)"
                    ></span>
                    <!--1已评 非考官-->
                    <span
                      v-else-if="innerItem.status===1&&!isExaminer"
                      @click="detailScore(innerItem,item.stuid,item.seiIds)"
                      class="active"
                    >{{innerItem.score}}</span>
                    <!--已评考官-->
                    <span
                      v-else-if="innerItem.status==1&&isExaminer&&!$route.query.examfinished"
                      @click="editdetailFn($event,innerItem.examitemid,item.stuid,innerItem.examitemname,item.seiIds)"
                      class="active"
                    >{{innerItem.score}}</span>
                    <!--null是不能评-->
                    <span
                      v-else-if="innerItem.status===null||$route.query.examfinished"
                      @click="detailScore(innerItem,item.stuid,item.seiIds)"
                      :class="{noclick:innerItem.score==null}"
                      class="active"
                    >{{innerItem.score}}</span>
                  </li>
                </ul>
              </div>
              <div class="fr">
                <ul>
                  <li>平均分</li>
                  <li
                    v-for="(item,i) of scoreSheet"
                    :key="i.score"
                    @click="averagerFn(item,info.examtypename,item.stuid,item.seiid)"
                    :class="{noclick:isExaminer}"
                  >
                    <p class="active" v-if="item.status<0">缺考</p>
                    <p class="active" v-else>{{item.score ? item.score.toFixed(2): ''}}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import $ from "jquery";
import cHeader from "@/views/header";
import cTab from "@/components/tab";
import cTabs from "@/components/tabs";
import methods from "@/methods";
import { mapState, mapActions } from "vuex";
import addGroup from "@/components/add-group";
export default {
  components: {
    cHeader,
    addGroup
  },
  data() {
    return {
      deptname: "",
      examtypename: "", //出科考试类型
      info: {},
      scoreSheet: [],
      loading: true,
      examitemid: "",
      stuid: "",
      isExaminer: false,
      teacherName: [],
      examitemnamearr: [],
      addlist: [
        {
          name: "记录反馈",
          isused: 1
        }
      ],
      addconfig: {
        show: false,
        label: "name",
        fixedtop: ".8rem",
        fixedright: ".1rem"
      },
      overduetime: false,
      arrivedtime: false,
      zh_examtype: "",
      examstarttime: "",
      examendtime: ""
    };
  },
  filters: {
    filterword: function(val) {
      if (val.length > 10) {
        return val.slice(0, 10) + "..";
      } else {
        return val;
      }
    },
    statusFilter(val) {
      if (val == -1) {
        return "法撒旦";
      }
    }
  },
  methods: {
    ...methods,
    deptnameString(list) {
      if (list) {
        return list.map(i => i.deptName).join("、");
      } else {
        return "";
      }
    },
    getstdinfo() {
      this.post("/turnExamInfo/turnexamdetail", {
        command: "turnExamInfo/turnexamdetail",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        id: this.$route.query.id
      }).done(res => {
        if (res && res.errcode == 0) {
          this.info = res;
          this.deptname = res.deptname;
          this.examtypename = res.examtypename;
          this.zh_examtype = res.examtype;
          this.info.teacherlist.map(item => {
            this.teacherName.push(item.teachername);
          });
          this.info.examitemlist.map(item => {
            this.examitemnamearr.push(item.examitemname);
          });
          this.examstarttime = this.info.starttime;
          this.examendtime = this.info.endtime;
        } else if (res.errdesc) {
          this.toast(res.errdesc);
        } else {
          this.toast("服务器错误，请联系管理员。");
        }
      });
    },
    // 平均分
    averagerFn(datascore, examTypeName, stuid, seiid) {
      this.$router.push({
        // path: "/extranceExam/averagepage",
        name: 'averagepage',
        query: {
          score: JSON.stringify(datascore),
          examid: this.$route.query.id,
          examId: this.$route.query.id,
          examTypeName: examTypeName,
          stuid: stuid,
          seiid: seiid
        }
      });
    },
    addselect(param) {
      console.log(param)
      if (param) {
        this.$set(
          this.addlist[0],
          "path",
          "/recordfeedback?deptId=" +
            this.info.deptid +
            "&teId=" +
            this.$route.query.id
        );
        // this.$router.push({
        //   path: '/' + param.path
        // });
        this.$router.push({
          name: 'recordfeedback',
          query: {
            deptId: this.info.deptIdNameVoList.map(i => i.deptId),
            teId: this.$route.query.id
          }
        })
      }
    },
    back() {
      if (this.$route.query.message) {
        // window.location.href =
        //   "/pages/futuredoctorapp/todo.html?view=application";
      //   if(this.$route.query.stem) {
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
      } else {
        window.history.back();
      }
    },
    detailScore(item, stuid, seiid) {
      this.$router.push({
        // path: "/extranceExam/assessmentpage",
        name: 'assessmentpage',
        query: {
          examId: this.info.id,
          examid: this.$route.query.id,
          stuid: stuid,
          examitemid: item.examitemid,
          examitemname: item.examitemname,
          averagescore: item.score,
          seiid: seiid
        }
      });
    },
    editdetailFn(event, examitemid, stuid, examitemname, seiid) {
      this.istimearrived().then(data => {
        if (data) {
          if (this.zh_examtype == 1) {
            this.$router.push({
              // path: "/extranceExam/scoreSheet",
              name: 'scoreSheet',
              query: {
                examitemid: examitemid,
                examineeid: stuid,
                examid: this.$route.query.id,
                examId: this.$route.query.id,
                examitemname: examitemname,
                seiid: seiid,
                detail: true,
                examtype: 1
              }
            });
          } else {
            this.$router.push({
              // path: "/extranceExam/scoreSheetZh",
              name: 'scoreSheetZh',
              query: {
                examitemid: examitemid,
                examineeid: stuid,
                examid: this.$route.query.id,
                examId: this.$route.query.id,
                examitemname: examitemname,
                seiid: seiid,
                detail: true,
                examtype: 2
              }
            });
          }
        } else {
          this.$toast("时间不在考试范围内,不能评分");
        }
      });
    },
    editFun(event, examitemid, stuid, examitemname, seiid, item) {
      console.log(item);
      this.istimearrived().then(data => {
        if (data) {
          this.$router.push({
            // path: "/extranceExam/scoreSheet",
            name: 'scoreSheet',
            query: {
              examitemid: examitemid,
              examineeid: stuid,
              examid: this.$route.query.id,
              examitemname: examitemname,
              seiid: seiid,
              deptname: this.deptname,
              examId: this.info.id
            }
          });
        } else {
          this.$toast("时间不在考试范围内,不能评分");
        }
      });
    },
    init() {
      this.loading = true;
      this.post("/turnExamInfo/querystuscorelist", {
        command: "turnExamInfo/querystuscorelist",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        examid: this.$route.query.id,
        code: "",
        stuname: "",
        mergeSeiId :true
      }).done(res => {
        setTimeout(() => {
          this.loading = false;
        }, 500);

        if (res && res.errcode == 0) {
          if (res.stuScoreList.length > 0) {
            this.scoreSheet = res.stuScoreList;
            this.isExaminer = res.isExaminer == 1 ? true : false;
          }
        } else if (res.errdesc) {
          this.toast(res.errdesc);
        } else {
          this.toast("服务器错误，请联系管理员。");
        }
      });
    },
    getTimeFn() {
      return new Promise((resolve, reject) => {
        let inittime = new Date().valueOf();
        var nowTime;
        this.post("/commserv/time/uuts", {
          command: "commserv/time/uuts",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          peercurts: inittime
        }).done(res => {
          if (res && res.errcode == 0) {
            nowTime = Number(res.uuts);
            resolve(nowTime);
          } else if (res.errdesc) {
            this.$toast(res.errdesc);
          } else {
            this.$toast("服务器错误，请联系管理员。");
          }
        });
      });
    },
    istimearrived() {
      return new Promise((resolve, reject) => {
        this.getTimeFn().then(nowTime => {
          let starttime = new Date(
            this.examstarttime.replace(/-/g, "/")
          ).getTime();
          let endtime = new Date(this.examendtime.replace(/-/g, "/")).getTime();
          if (nowTime >= starttime && nowTime <= endtime) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },
    isoverdue() {
      this.getTimeFn().then(nowTime => {
        let starttime = new Date(
          this.examstarttime.replace(/-/g, "/")
        ).getTime();
        let endtime = new Date(this.examendtime.replace(/-/g, "/")).getTime();
        if (nowTime > endtime) {
          this.overduetime = true;
        } else {
          this.overduetime = false;
        }
      });
    }
  },
  watch: {},
  mounted() {
    this.registerToNative("goBack", function(data) {
      this.back();
    });
    this.overduetime = this.isoverdue(); //判断考试时间是否过期
    this.init(); //初始化评分页面
    this.getstdinfo();
  }
};
</script>
<style scoped lang="scss">
@import "../../scss/mixin.scss";
.g-main {
  font-size: 0.26rem;
  background: #f8f7f9 !important;
  color: rgb(100, 100, 100);
}
.nameBox {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
// .p-box {
//     overflow: hidden;
//     text-overflow: ellipsis;
//     white-space: nowrap;
// }
div.pop-up {
  position: absolute;
  padding: 5px;
  padding-bottom: 0;
  background: #fff;
  border: 1px solid $borderColor;
  display: none;
  font-size: 0.23rem;
  z-index: 10;
  text-align: center;
  div {
    background: $bgColor;
    line-height: 0.4rem;
    height: 0.4rem;
    border: 1px solid $borderColor;
    border-radius: 2px;
    margin-bottom: 5px;
  }
}
.list-wrap {
  font-size: 0.26rem;
  text-align: center;
  .h3 {
    font-size: 0.25rem;
    height: 0.6rem;
    line-height: 0.6rem;
    background: #f8f7f9;
  }
  .wrap-c {
    background: #fff;
    li {
      display: flex;
      flex-flow: row nowrap;
      font-size: 0.24rem;
      line-height: 0.5rem;
      min-height: 0.5rem;
      word-break: break-all;
      div {
        line-height: 0.5rem;
      }
      div.tit {
        min-width: 1.4rem;
        text-align: right;
      }
    }
    .action {
      padding: 0.1rem 0;
      text-align: right;
      button {
        display: inline-block;
        width: 0.8rem;
        height: 0.35rem;
        border: 1px solid #3499db;
        border-radius: 3px;
        color: #3499db;
        font-size: 0.24rem;
        &.delete {
        }
      }
    }
  }

  .exam-form {
    .title {
      height: 0.7rem;
      background: #fff;
      margin-top: 0.2rem;
      line-height: 0.7rem;
      font-size: 0.24rem;
    }
    .exam-table .sheet {
      overflow: hidden;
      background: #fff;
      font-size: 0.2rem;
      display: flex;
      justify-content: space-around;
      div.fl {
        width: 100px;
        font-size: 0.2rem;
        ul {
          li:nth-child(1) {
            background: $bgColor;
          }
          li {
            border-bottom: 1px solid $borderColor;
          }
        }
      }
      div.fr {
        width: 50px;
        font-size: 0.2rem;
        ul {
          li:nth-child(1) {
            background: $bgColor;
          }
          li {
            border-bottom: 1px solid $borderColor;
          }
        }
      }
      div.mid {
        flex: 1;
        overflow-x: auto;
        ul.items {
          background: #fff;
          font-size: 0;
          height: 1rem;
          border-bottom: 1px solid $borderColor;
          white-space: nowrap;
          text-align: center;
          p {
            width: 0.6rem;
            display: inline-block;
            white-space: normal;
            word-break: break-all;
            margin-top: 0.05rem;
            font-size: 9px;
          }
          li {
            /*flex:1;*/
            font-size: 0.2rem;
            line-height: 0.6rem;
            border-bottom: 1px solid $borderColor;
            vertical-align: top;
            display: inline-block;
          }
        }
        ul.items.short {
          li {
            width: 33.3%;
          }
        }
        ul.items.long {
          display: flex;
          li {
            flex: 1;
            p {
              width: 100%;
            }
          }
        }
        ul.items:nth-child(1) {
          li {
            background: $bgColor;
          }
        }
      }
      div.mid.comprehensive {
        ul.items {
          background: #fff;
          font-size: 0;
          height: 0.6rem;
          border-bottom: 1px solid $borderColor;
          white-space: nowrap;
          text-align: center;
          /*li {*/
          /*width: 100%;*/
          /*p{*/
          /*width: 100%;*/
          /*}*/
          /*}*/
        }
      }
      ul {
        li {
          height: 0.6rem;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          p {
            margin: 0;
          }
          p.active {
            color: $activeColor;
            cursor: pointer;
          }
        }
      }
    }
    .edit-icon {
      width: 0.4rem;
      height: 0.4rem;
      display: inline-block;
      background: url(../../assets/images/edit.png) no-repeat center -4px;
      background-size: 0.4rem 0.4rem;
      vertical-align: middle;
    }
  }
}

.btn-group {
  height: 0.76rem;
  img {
    width: 0.4rem;
    height: 0.4rem;
    margin-top: 0.18rem;
    margin-left: 0.15rem;
  }
}
.addcontent {
  position: absolute;
  width: 100%;
  height: 100%;
}
span.active {
  color: #3499db;
}
div.title-zh {
  text-align: left;
  padding-left: 0.2rem;
  height: 0.6rem;
  line-height: 0.6rem;
}
.zh-title {
  display: flex;
  background: #ccc;
  border-bottom: 1px solid #ccc;
  li.action {
    flex: 0.5;
    height: 0.6rem;
  }
  li {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
  }
}
.sheet-content {
  li {
    display: flex;
    min-height: 0.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    border-bottom: 1px solid $borderColor;
    .choice-div {
      flex: 0.5;
    }
    div {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column wrap;
      height: 0.7rem;

      p {
        font-size: 0.22rem;
        margin-bottom: 0;
      }
    }
  }
}

i.choice {
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  margin-top: 0.15rem;
  background: url("../../assets/images/you-jiantou.png") 0 0 no-repeat;
  background-size: 100% 100%;
}
.zhalign {
  text-align: right;
  padding-right: 0.7rem;
}
</style>



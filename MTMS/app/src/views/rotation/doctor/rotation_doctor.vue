<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../../assets/images/icon_fanhui.png" />
        </a>
      </div>护培轮转
    </c-header>
    <div class="g-main" v-if="!nocontent">
      <div class="headerMes">
        <div>
          <span>学员类型：{{messages.typename}}</span>
          <span>学号 ： {{messages.username}}</span>
        </div>
        <div>
          <span>专业基地：{{messages.userbasename}}</span>
          <span>年级 ： {{messages.period}}</span>
        </div>

        <!--<p>科&emsp;&emsp;室：{{messages.doctorofficename}}</p>-->
      </div>
      <div class="main">
        <div class="rotation_plan margin flex" @click="detail(messages.plandetailid)">
          <span>轮转计划</span>
          <a>
            {{messages.term}}
            <img src="../../../assets/images/bnt_xiangyou.png" alt />
          </a>
        </div>
        <div class="rotation_progress margin">
          <h2>轮转计划进度</h2>
          <div class="progress">
            <div class="progressLine">
              <img src="../../../assets/images/icon_guangbiao_on.png" alt />
              <img src="../../../assets/images/icon_guangbiao.png" alt />
              <p class="progressOn">
                <img src="../../../assets/images/icon_guangbiao_on.png" />
                <small>还剩{{messages.remaining}}天</small>
              </p>
            </div>
            <p class="progressTime flex">
              <span>
                开始日期
                <br />
                {{messages.begindate}}
              </span>
              <span>
                结束日期
                <br />
                {{messages.enddate}}
              </span>
            </p>
          </div>
        </div>
        <template>
          <div class="rotationContent" v-if="showdetail">
            <div class="rotation_place">
              <span>
                轮转科室
                <span class="place">{{messages.deptname}}</span>
              </span>
              <img v-if="messages.turnstatus == 3" src="../../../assets/images/icon_yi.png" alt />
              <img v-if="messages.turnstatus == 1" src="../../../assets/images/icon_zhong.png" alt />
              <img
                v-if="messages.turnstatus == 0"
                src="../../../assets/images/icon_dairuke-.png"
                alt
              />
            </div>
            <div class="rotation_person">
              <!-- <p class="t-right">
                <span>
                  科室主任：
                  <i v-for="(item,index) in messages.directorlist">{{item.name}}&emsp;</i>
                </span>
              </p> -->
              <p>
                <span>
                  总带教：
                  <i v-for="(item,index) in messages.secretarylist">{{item.name}}&emsp;</i>
                </span>
              </p>
              <p v-if="messages.turnstatus != 0">
                <span>分带教：{{messages.teaching}}</span>
              </p>
            </div>
            <ul>
              <li>
                <span>轮转周期：{{messages.begintime}}-{{messages.endtime}}</span>
              </li>
              <li>
                <span>规定轮转时间：{{messages.settime}}</span>
                <span v-if="messages.turnstatus != 0">已轮转时间：{{messages.hasturn}}天</span>
              </li>
            </ul>
            <div class="rotation_pro" v-if="messages.turnstatus != 0">
              <p>轮转科室进度</p>
              <p class="grayBar">
                <van-progress :percentage="getRating(messages.progress)" stroke-width="8" />
              </p>
            </div>
            <div class="enter" v-if="messages.turnstatus != 0">
              <a
                @click="enter(messages.plandetailid,messages.endtime,messages.deptid,messages.teachingid)"
              >点击进入</a>
            </div>
          </div>
          <div class="no-icon" v-else>
            <img src="../../../assets/images/icon-renwu.png" alt />
            <p>恭喜你，你已经完成了你的轮转计划~</p>
          </div>
        </template>
      </div>
    </div>
    <no-content v-if="nocontent" :txtdescription="txtdescription"></no-content>
  </div>
</template>
<script>
import $ from "jquery";
import cHeader from "../../header";
import methods from "../../../methods";
import moment from "moment";
import noContent from "../../no_content";
import { mapState, mapActions } from "vuex";
export default {
  name: "rotation_doctor",
  components: {
    cHeader,
    moment,
    noContent
  },
  filters: {
    rating: function(value) {
      // if ((value * 100).toFixed(0) >= 100) {
      //   return "100%";
      // } else {
        return (value * 100).toFixed(0) + "%";
      // }
    }

  },
  data() {
    return {
      messages: {},
      nocontent: false,
      showdetail: true,
      txtdescription: "您当前不在轮转计划中！"
    };
  },
  created() {
    let self = this;
    self.init();
    self.registerToNative("goBack", function(data) {
      self.back();
    });
  },
  methods: {
    ...methods,
    ...mapActions(["setTurninfo"]),
    // 初始化获取护培生信息
    getRating(num) {
      if(num) {
        return (num*100).toFixed(0)
      }else {
        return 0
      }
      
    },
    init: function() {
      let self = this;
      self
        .post("/turn/turndoctor", {
          command: "turn/turndoctor",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid")
          // uid:$.cookie('uid')
        })
        .done(function(data) {
          if (data.turnflag == -1) {
            self.nocontent = true;
          } else if (data.turnflag == 0) {
            self.messages = data;
            self.messages.begindate = self.checkDate(self.messages.begindate);
            self.messages.enddate = self.checkDate(self.messages.enddate);
            // self.messages.begindate = self.getNewDate(self.messages.begindate);
            // self.messages.enddate = self.getNewDate(self.messages.enddate);
            self.messages.begintime = self.checkDate(self.messages.begintime);
            self.messages.endtime = self.checkDate(self.messages.endtime);
            self.progress();
          } else if (data.turnflag == 5) {
            self.showdetail = false;
            self.messages = data;
            self.messages.begindate = self.checkDate(self.messages.begindate);
            self.messages.enddate = self.checkDate(self.messages.enddate);
            // self.messages.begindate = self.getNewDate(self.messages.begindate);
            // self.messages.enddate = self.getNewDate(self.messages.enddate);
            self.messages.begintime = self.checkDate(self.messages.begintime);
            self.messages.endtime = self.checkDate(self.messages.endtime);
            self.progress();
          }
        })
        .fail(function(error) {
          self.nocontent = true;
        });
    },
    checkDate(date) {
      if (date) {
        return date.split("-").join(".");
      }
    },
    getNewDate(time) {
      // let ttime = new Date(String(time).substring(0, 10));
      if (!time) {
        return ""
      }
      let ttime = new Date(time);
      let year = ttime.getFullYear();
      let month = ttime.getMonth() + 1;
      let date = ttime.getDate();
      let newTime = year + "-" + month + "-" + date;
      return newTime;
    },
    // 返回键
    back: function() {
      // location.href = "/pages/futuredoctorapp/todo.html?view=application";
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
    // 点击轮转计划箭头
    detail: function(param) {
      let self = this;
      $.cookie("doctor_from", 1);
      if (self.messages.term) {
        self.$router.push({
          name: "fdRotation_doctor_plan",
          query: {
            type: 0,
            id: param
          }
        });
      }
    },
    // 点击进入按钮
    enter: function(param, params, deptid, teachingid) {
      let self = this;
      $.cookie("doctor_from", 0);
      this.setTurninfo({ k: "planendtime", v: params });
      this.setTurninfo({ k: "teachingid", v: deptid });
      this.setTurninfo({ k: "deptid", v: teachingid });
      self.$router.push({
        name: "fdRotation_doctor_exam",
        query: {
          type: 0,
          id: param,
          deptid: deptid,
          teachingid: teachingid
        }
      });
    },
    // 进度条
    progress: function() {
      // 设置轮转进度条
      let self = this;
      let _startime = self.messages.begindate.split(".").join("-");
      let startTime = moment(_startime).format("X");
      let _endtime = self.messages.enddate.split(".").join("-");
      let endTime = moment(_endtime).format("X");
      let nowTime = moment().format("X");
      let totalDays = Math.ceil((endTime - startTime) / 3600 / 24);
      let proTime = (totalDays - self.messages.remaining) / totalDays;
      let progressLine = $(".progressLine");
      let progressOn = $(".progressOn");
      let progressOnImg = $(".progressOn").find("img");
      let width = progressLine.width();
      let imgWidth = progressOnImg.width();
      if (nowTime <= startTime) {
        progressOn.css({
          width: "0px"
        });
        progressOnImg.css({
          display: "none"
        });
      } else {
        progressOn.css({
          width: width * proTime + "px"
        });

        progressOnImg.css({
          position: "absolute",
          display: "inline-block",
          left: width * proTime - imgWidth / 2 + "px"
        });
      }
      // 底部进度条
      // let grayBar = $(".grayBar");
      // let greenBar = $(".greenBar");
      // let rating = $(".rating");
      // let grayBarWidth = grayBar.width();
      // let resultwidth =
      //   grayBarWidth * self.messages.progress > grayBarWidth
      //     ? grayBarWidth
      //     : grayBarWidth * self.messages.progress;
      // greenBar.css({
      //   width: resultwidth + "px"
      // });
      // if (self.messages.progress == 0) {
      //   rating.css({
      //     left: "0px"
      //   });
      // } else {
      //   rating.css({
      //     left: resultwidth - imgWidth / 2 + "px"
      //   });
      // }
    }
  }
};
</script>
<style lang="scss" scoped>
.g-main {
  font-size: 0.24rem;
  background: #f8f7f9 !important;
  color: rgb(100, 100, 100);
}

.margin {
  margin: 0 auto;
  padding: 0 0.3rem;
}

.flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.flex-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.headerMes {
  background: white;
  padding: 0.1rem 0.3rem;
  /*i {
            font-style: normal;
            width: 1.2rem;
        }*/
  div {
    width: 100%;
    span {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    span:nth-child(1) {
      width: 65%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    span:nth-child(2) {
      width: 35%;
      float: right;
      text-align: left;
    }
  }

  p {
    margin: 0.1rem 0;
    padding: 0;
    display: flex;
  }
  p:last-child {
    span {
      width: 49%;
      padding-right: 0.1rem;
      display: flex;
      label {
        width: 1.2rem;
      }
    }
  }
}

.rotation_plan {
  width: 100%;
  padding: 0.1rem 0.3rem;
  background: white;
  margin-top: 0.15rem;
  justify-content: space-between;
  border-bottom: solid 1px rgb(240, 240, 240);
}

.rotation_plan img {
  position: relative;
  top: 0.03rem;
  width: 0.2rem;
  height: 0.2rem;
  margin-left: 0.1rem;
}

.rotation_progress {
  background: white;
  padding: 0.1rem 0.3rem;
  overflow: scroll;
}

.rotation_progress h2 {
  font-size: 0.22rem;
  font-weight: normal;
  /*padding: 0.1rem 0;*/
}

.progressLine {
  margin: 0.5rem 0.6rem 0.2rem 0.6rem;
  /*width: 90%;*/
  height: 0.05rem;
  background: #c3c3c3;
  position: relative;
}

.progressLine img {
  position: absolute;
  width: 0.4rem;
  height: 0.4rem;
  top: calc(50% - 0.2rem);
}

.progressLine img:nth-of-type(1) {
  left: -0.3rem;
}

.progressLine img:nth-of-type(2) {
  right: -0.3rem;
  /*background: lightgray;*/
}

.progressOn {
  width: 50%;
  background: #3499db;
  height: 0.05rem;
  position: relative;
}

.progressOn img {
  width: 0.4rem;
  height: 0.4rem;
  top: calc(50% - 0.2rem);
}

.progressOn small {
  width: 1.2rem;
  position: absolute;
  right: -0.7rem;
  top: -0.4rem;
  color: #3499db;
}

.progressTime {
  justify-content: space-between;
  /*padding: 0 0.3rem;*/
  /*color: #666666;*/
  font-size: 0.22rem;
  margin-bottom: 0;
}

.progressTime span {
  width: 1.5rem;
  text-align: center;
}

.progressTime span:nth-of-type(1) {
  text-align: left;
}

.progressTime span:nth-of-type(2) {
  text-align: right;
}

.rotationContent {
  margin-top: 0.15rem;
  padding: 0;
  background: white;
}

.rotation_place {
  /*height: 0.66rem;*/
  border-bottom: solid 1px rgb(240, 240, 240);
  line-height: 0.66rem;
  padding: 0.1rem 0.3rem;
  /*color: #333333;*/
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.place {
  margin-left: 0.4rem;
}

.rotation_place img {
  width: 1rem;
  height: 0.36rem;
}

.rotation_person {
  display: flex;
  flex-direction: column;
  border-bottom: solid 1px rgb(240, 240, 240);
  padding-top: 0.1rem;
  margin: 0 0.3rem;
  color: #666666;
}
.rotation_person i {
  font-style: normal;
}
.rotation_person p {
  /*padding-bottom: 0.1rem;*/
}

/* .rotation_person span {
         padding: 0.05rem 0 0;
     }*/

.rotationContent ul {
  padding-top: 0.1rem;
  margin: 0 0.3rem;
  /*border-bottom: solid 1px #c3c3c3;*/
}

.rotationContent ul li {
  padding-bottom: 0.1rem;
  /*color: #666666;*/
}

.rotationContent ul li span:nth-of-type(2) {
  float: right;
}

.rotation_pro {
  padding: 0.1rem 0;
  margin: 0 0.3rem;
  border-top: solid 1px rgb(240, 240, 240);
  /*border-bottom: solid 1px #c3c3c3;*/
  overflow: scroll;
}

.grayBar {
  position: relative;
  margin: 0.35rem 0.2rem 0.05rem 0.2rem;
  height: 0.2rem;
  // background: #c3c3c3;
  border-radius: 0.2rem;
}

.greenBar {
  display: inline-block;
  width: 50%;
  background: #3499db;
  height: 0.2rem;
  border-radius: 0.2rem;
  position: absolute;
}

.rating {
  position: absolute;
  top: -0.3rem;
  color: #3499db;
}

.enter {
  padding: 0.1rem 0.3rem;
  height: 0.66rem;
  border-top: solid 1px rgb(240, 240, 240);
}

.enter a {
  /*width: 1rem;*/
  height: 0.46rem;
  background: #3499db;
  text-align: center;
  line-height: 0.46rem;
  color: white;
  padding: 0 0.2rem;
  border-radius: 0.1rem;
  float: right;
}
.no-icon {
  width: 100%;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    width: 2rem;
  }
  p {
    display: inline-block;
    width: 3rem;
    color: #aaa;
    text-align: center;
    margin-top: 0.1rem;
  }
}
.t-right span:nth-child(2) {
  float: right;
}
</style>
<style lang="scss">
.rotation_pro {
  .van-progress {
    height: 8px;
  }
}
</style>

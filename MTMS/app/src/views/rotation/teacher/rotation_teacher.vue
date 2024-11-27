<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../../assets/images/icon_fanhui.png" />
        </a>
      </div>护培轮转
      <router-link
        slot="headerRight"
        :to="{name: 'fdRotation_teacher_history'}"
        style="font-size: 0.3rem;color: #fff;"
      >带教记录</router-link>
    </c-header>
    <div class="g-main" v-if="!noContent">
      <div v-for="item in turndoctors" class="list">
        <ul @click="plan(item.id)">
          <li class="head">
            <div class="headDiv">
              <img src="../../../assets/images/icon_morentoux-.png" alt />
              <div>
                <p class="headerName">
                  <span>{{item.name}}</span>
                  <span>年级：{{item.period}}</span>
                </p>
                <p class="headerName">
                  <span>{{item.base}}</span>
                  <span>{{item.mobile}}</span>
                </p>
              </div>
            </div>
          </li>

          <li>
            <span>轮转科室：{{item.dept}}</span>
          </li>
          <li>
            <span>分带教：{{item.teaching}}</span>
          </li>
          <li>
            <span>轮转周期 ：{{item.begintime | checkdate}}-{{item.endtime | checkdate}}</span>
            <span class="c-turncode">轮转进度：{{item.progress | progress}}</span>
          </li>
          <!--<li>
                        <span>轮转进度：{{item.progress | progress}}</span>
          </li>-->
        </ul>
        <div class="footerBtn">
          <a
            @click="toSingin(item.plandetailid,item.id,item.name)"
            style="margin-right: .15rem;"
          >考&emsp;勤</a>
          <a
            @click="dailyExam(item.realbegintime,item.plandetailid,item.id)"
            style="margin-right: .15rem;"
          >日常评价</a>
          <!-- 2019/08/05 -->
          <a @click="graduateComments(item.plandetailid)">出科评语</a>
        </div>
      </div>
    </div>
    <no-content v-if="noContent"></no-content>
  </div>
</template>
<script>
import cHeader from "../../header";
import methods from "../../../methods";
import noContent from "../../no_content";
import { mapState, mapActions } from "vuex";
import api from "./js/common.js";
export default {
  name: "rotation_teacher",
  components: {
    cHeader,
    noContent
  },
  filters: {
    progress: function(value) {
      if ((value * 100).toFixed(0) >= 100) {
        return 100 + "%";
      } else {
        return (value * 100).toFixed(0) + "%";
      }
    },
    checkdate(date) {
      if (date) {
        return date.split("-").join(".");
      }
    }
  },
  data() {
    return {
      turndoctors: [],
      noContent: false
    };
  },
  mounted() {
    let self = this;
    self.init();
    self.registerToNative("goBack", function(data) {
      self.back();
    });
  },
  methods: {
    ...methods,
    ...mapActions(["setTurninfo"]),
    // 代教老师学生列表数据展示
    init() {
      let self = this;
      self
        .post("/turn/myturndoctors", {
          command: "turn/myturndoctors",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid")
        })
        .done(function(data) {
          // console.log(data)
          self.turndoctors = data.turndoctors;
          if (self.turndoctors.length == 0) {
            self.noContent = true;
          }
        })
        .fail(function(error) {
          // self.noContent = trues
        });
    },
    // 出科评语 2019-08-05
    graduateComments(id) {
      api
        .judgeStuWrite(id)
        .then(res => {
          if (res == 0) {
            this.$toast("该学员还未填写出科小结");
          }

          if (res == 1) {
            this.$router.push({
              name: "stuSummary",
              query: {
                role: 1, // 0学生 1老师 2科主任
                type: 1, // 区别返回的地址
                plandetailid: id
              }
            });
          }
        })
        .catch(error => {});
    },

    // 日常考核按钮
    dailyExam: function(date, param, params) {
      this.setTurninfo({ k: "businessid", v: param });
      this.setTurninfo({ k: "stuid", v: params });
      this.$router.push({
        name: "fdRotation_teacher_date",
        query: {
          date: date,
          businessId: param,
          targetId: params
        }
      });
    },
    // 点击每一个学生列表调到学生的计划详情页
    plan: function(param) {
      this.setTurninfo({ k: "stuid", v: param });
      this.$router.push({
        name: "fdRotation_doctor_plan",
        query: {
          type: 1
        }
      });
    },
    //查看考勤
    toSingin(plandetailid, stuid, stuname) {
      this.setTurninfo({ k: "actionplanid", v: plandetailid });
      this.setTurninfo({ k: "stuid", v: stuid });
      this.setTurninfo({ k: "stuname", v: stuname });
      this.$router.push({
        name: "fdRotation_doctor_singin",
        query: {
          id: this.$route.query.id
        }
      });
    },
    back() {
      // location.href =
      //   "/pages/futuredoctorapp/todo.html?view=application&id=" +
      //   this.$route.query.id;
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
    }
  }
};
</script>
<style scoped>
.g-main {
  font-size: 0.22rem;
  background: #f8f7f9 !important;
  color: rgb(100, 100, 100);
}
.list {
  padding-top: 0;
}

ul {
  background: white;
  padding: 0 0.3rem 0;
}

ul p {
  margin: 0;
}

ul li {
  padding: 0.05rem 0;
}

ul li:nth-of-type(1) {
  border-bottom: solid 0.01rem rgb(240, 240, 240);
  padding: 0.1rem 0;
}

ul li:nth-of-type(2) {
  padding-top: 0.1rem;
}

ul li:nth-last-of-type(1) {
  padding-bottom: 0.1rem;
}

ul li span:nth-of-type(2) {
  float: right;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.headDiv {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.headDiv div {
  width: calc(100% - 1rem);
}

.headerName {
  width: 100%;
}

.headerName span:nth-of-type(1) {
  margin-bottom: 0.1rem;
}

.headerName span:nth-of-type(2) {
  float: right;
}

.headDiv img {
  width: 0.66rem;
  height: 0.66rem;
  margin-right: 0.2rem;
}

.footerBtn {
  border-top: solid 0.01rem rgb(240, 240, 240);
  text-align: right;
  padding: 0.1rem 0;
  margin: 0 0.3rem;
}

.footerBtn a {
  background: #3499db;
  color: white;
  padding: 0.1rem 0.15rem;
  border-radius: 0.1rem;
}

.c-turncode {
  color: #0b78e3;
}
</style>

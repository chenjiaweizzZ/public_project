<template>
  <div class="g-wrapper">
    <p class="cjwq search" @click="gettime.show = true">
      <span>日期</span>
      <i class="icon"></i>
    </p>
    <div class="g-main">
      <div v-for="item in turndoctors" class="list" v-if="!nocontent">
        <ul @click="tostudentplan(item)">
          <li class="head">
            <div class="headDiv">
              <img src="../../../assets/images/icon_morentoux-.png" alt />
              <div>
                <p class="headerName">
                  <span>{{item.stdname}}</span>
                  <span>{{item.gradename}}</span>
                </p>
                <p class="headerName">
                  <span>{{item.basename}}</span>
                  <span>{{item.mobile}}</span>
                </p>
              </div>
            </div>
          </li>
          <li>
            <span>轮转科室：{{item.deptname}}</span>
          </li>
          <li>
            <span>分带教：{{item.tecname}}</span>
          </li>
          <li>
            <span>轮转周期：{{item.starttimestr | checkdate}}-{{item.endtimestr | checkdate}}</span>
          </li>
          <li>
            <span>带教时间段：{{item.realbegintime | checkdate}}-{{item.realendtime | checkdate}}</span>
          </li>
          <li>
            <span>轮转进度：{{item.progress}}</span>
          </li>
        </ul>
        <div class="footerBtn">
          <a @click="dailyExam(item.detailid,item.stdid)" style="margin-right: .15rem;">考核查看</a>
          <!-- 2019/08/05 -->
          <a @click="graduateComments(item.detailid)">出科评语</a>
        </div>
      </div>
      <!--选择时间-->
      <c-timepicker :config="gettime" @confirm="selectstarttime" :year="year" :month="month"></c-timepicker>
      <no-content v-if="nocontent"></no-content>
    </div>
  </div>
</template>
<script>
import methods from "../../../methods";
import noContent from "../../no_content";
import cTimepicker from "../../../components/timepicker";
import { mapState, mapActions } from "vuex";
import api from "./js/common.js";
export default {
  props: ["active"],
  data() {
    return {
      turndoctors: [],
      nocontent: false,
      gettime: {
        show: false,
        isday: false,
        istime: false,
        custom: true
      },
      year: [2018, 2028],
      month: [1, 12]
    };
  },
  components: { noContent, cTimepicker },
  computed: {},
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
  watch: {
    active: function(val, oldVal) {
      if (val) {
        this.init();
      }
    }
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    ...methods,
    ...mapActions(["setTurninfo"]),
    init(param) {
      let self = this;
      self
        .post("/turn/listteachingrecord", {
          command: "turn/listteachingrecord",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          tecid: $.cookie("uid"),
          yearmonth: param,
          page: "",
          reqnum: ""
        })
        .done(function(data) {
          // console.log(data)
          self.turndoctors = data.result.recordlist;
          if (self.turndoctors.length == 0) {
            self.nocontent = true;
          } else {
            self.nocontent = false;
          }
        })
        .fail(function(error) {
          self.noContent = true;
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
                type: 2, // 区别返回的地址
                plandetailid: id
              }
            });
          }
        })
        .catch(error => {});
    },
    // 日常考核按钮
    dailyExam: function(param, params) {
      this.setTurninfo({ k: "businessid", v: param });
      this.setTurninfo({ k: "stuid", v: params });
      this.$router.push({
        name: "fdRotation_teacher_date",
        query: {
          where: 2,
          history: 1
        }
      });
    },
    selectstarttime(data) {
      this.init(data);
    },
    tostudentplan(item) {
      this.setTurninfo({ k: "stuid", v: item.stdid });
      this.$router.push({
        name: "fdRotation_doctor_plan",
        query: {
          type: 5
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.g-main {
  font-size: 0.22rem;
  background: #f8f7f9 !important;
  color: rgb(100, 100, 100);
  margin-top: 0.6rem;
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
  width: 1.8rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  padding: 0.1rem 0.05rem;
  border-radius: 0.1rem;
}
.search {
  display: flex;
  background: #fff;
  color: #3499db;
  padding: 0 0.2rem;
  justify-content: space-between;
  margin-bottom: 0.2rem;
  position: fixed;
  top: 1.48rem;
  width: 100%;
  z-index: 20;
  span {
    line-height: 0.5rem;
  }
}
i.icon {
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  background: url("../../../assets/images/you-jiantou.png") 0 0 no-repeat;
  background-size: 100% 100%;
  margin-top: 0.1rem;
  margin-left: calc(20vw - 0.3rem);
}
</style>

<style>
.cjwq {
  margin-left: 0;
}
</style>
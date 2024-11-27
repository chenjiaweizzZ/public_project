<template>
  <div class="g-wrapper">
    <p class="cjwq search" @click="gettime.show = true">
      <span>日期</span>
      <i class="icon"></i>
    </p>
    <div class="g-main" v-if="!nocontent">
      <ul>
        <li v-for="(item,index) in evaluatedlist" @click="showdetail(item.id)">
          <span>{{item.totalscore}}分</span>
          <span>{{item.evaluationmonth}}</span>
          <i class="icon"></i>
        </li>
      </ul>
    </div>
    <!--选择时间-->
    <c-timepicker :config="gettime" @confirm="selectstarttime" :year="year" :month="month"></c-timepicker>
    <no-content v-show="nocontent"></no-content>
  </div>
</template>
<script>
import methods from "../../../methods";
import cTimepicker from "../../../components/timepicker";
import noContent from "../../no_content";
export default {
  props: ["active"],
  data() {
    return {
      evaluatedlist: "",
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
    init(param) {
      let self = this;
      self.data = {
        command: "turn/queryEvaluatedMonths",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        evaluatedid: $.cookie("uid"),
        evayearmonth: param,
        type: 1,
        flag: 1,
        showfilter: 1 // 2019-05-05
      };
      self
        .post("/turn/queryEvaluatedMonths", self.data)
        .done(function(data) {
          self.evaluatedlist = data.monthlist;
          if (self.evaluatedlist.length <= 0) {
            self.nocontent = true;
          } else {
            self.nocontent = false;
          }
        })
        .fail(function(error) {
          self.nocontent = true;
        });
    },
    showdetail(param) {
      this.$router.push({
        name: "fdRotation_doctor_evaluate_score",
        query: {
          booking: 0,
          history: 1,
          param: 1,
          id: param
        }
      });
    },
    selectstarttime(data) {
      this.init(data);
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
li {
  display: flex;
  background: #fff;
  color: #888;
  padding: 0.1rem 0.2rem;
  justify-content: space-between;
  border-bottom: 1px solid #c9caca;
  span {
    line-height: 0.5rem;
  }
  span:first-child {
    width: 20vw;
  }
  span:nth-last-child(2) {
    flex: 1;
    text-align: center;
  }
}
</style>

<style>
.cjwq {
  margin-left: 0;
}
</style>

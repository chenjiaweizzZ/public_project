<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../../assets/images/icon_fanhui.png" />
        </a>
      </div>日常评价查看
      <div slot="headerRight" style="font-size: 0.3rem" v-if="history" @click="evaluateStudent">评分</div>
    </c-header>
    <div class="g-main">
      <div>
        <div class="list" v-for="item in evaluatedlist" @click="detail(item)">
          <span>{{item.uname}}</span>
          <span>{{item.totalscore}}</span>
          <p class="score">
            <span>{{item.evaluationmonth}}</span>
            <img src="../../../assets/images/bnt_xiangyou.png" alt />
          </p>
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
  name: "rotation_doctor_date",
  components: {
    cHeader,
    noContent
  },
  filters: {
    score: function(value) {
      return value + "分";
    }
  },
  data() {
    return {
      evaluatedlist: [
        // {'month':'2017年11月','score':28},
        // {'month':'2017年10月','score':28},
        // {'month':'2017年9月','score':28},
        // {'month':'2017年8月','score':28},
        // {'month':'2017年7月','score':28},
      ],
      nocontent: false,
      data: {},
      history: true
    };
  },
  computed: {
    ...mapState(["turninfo"])
  },
  created() {
    this.history = this.$route.query.history ? false : true;
  },
  mounted() {
    let self = this;
    self.evaluateMonth();
    self.registerToNative("goBack", function(data) {
      self.back();
    });
  },
  methods: {
    ...methods,
    ...mapActions([
      "showAlert",
      "showConfirm",
      "showLoading",
      "hideLoading",
      "toast"
    ]),
    // 查看日常考核详情
    detail: function(item) {
      this.$router.push({
        name: "scoreDetail",
        query: {
          // date: item.month,
          id: item.id,
          // evaluatedid: item.evaluatedid,
          businessid: item.businessid.query,
          routeTitleName: "护培生师规范化培训评价表",
          category: 1,
          type: 3,
          saveShow: true
        }
      });
    },
    // 是否可以进行评价
    evaluateStudent: function() {
      let self = this;
      self
        .post("/turn/validateEvaluation", {
          command: "turn/validateEvaluation",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid"),
          evaluatedid: this.turninfo.stuid,
          stuid: this.turninfo.stuid,
          businessid: this.turninfo.businessid,
          type: 4
        })
        .done(function(data) {
          if (data.errcode == 0) {
            if (data.validatecode == 0) {
              self.$router.push({
                name: "scoreTable",
                query: {
                  // date: self.$route.query.date,
                  businessId: self.$route.query.businessId,
                  targetId: self.$route.query.targetId,
                  routeTitleName: "护培生师规范化培训评价表",
                  category: 1,
                  type: 3,
                  saveShow: true
                }
              });
            } else if (data.validatecode == 400101) {
              self.showAlert("当前护培生不在轮转计划中！");
            } else if (data.validatecode == 400102) {
              self.showAlert("当前护培生本月已存在评价记录！");
            }else if (data.validatecode == 400108) {
              self.showAlert("未到出科评价时间！");
            } else if (data.validatecode == 400110) {
              self.showAlert("超出出科日期不能进行评价！");
            } else if (
              data.validatecode == 400103 ||
              data.validatecode == 400104 ||
              data.validatecode == 400105
            ) {
              self.showAlert(
                "请于" + data.evastartdate + "至" + data.evaenddate + "进行评价"
              );
            }
          } else {
            self.showAlert(data.errdesc);
          }
        })
        .fail(function(error) {});
    },
    // 初始化页面发送请求
    evaluateMonth: function() {
      let self = this;
      self.data = {
        command: "turn/queryEvaluatedMonths",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid"),
        evaluatedid: this.turninfo.stuid,
        businessid: this.turninfo.businessid,
        type: 4
      };
      self
        .post("/turn/queryEvaluatedMonths", self.data)
        .done(function(data) {
          self.evaluatedlist = data.monthlist;
          if (self.evaluatedlist.length == 0) {
            self.nocontent = true;
          }
        })
        .fail(function(error) {
          self.nocontent = true;
        });
    },
    back() {
      let self = this;
      if (this.$route.query.history) {
        self.$router.push({
          name: "fdRotation_teacher_history",
          query: {
            where: self.$route.query.where
          }
        });
      } else {
        self.$router.push({
          name: "fdRotation_teacher",
          query: {
            date: self.$route.query.date,
            type: self.$route.query.type,
            deptname: self.$route.query.deptname
          }
        });
      }
    }
  }
};
</script>
<style scoped>
.g-main {
  font-size: 0.24rem;
  color: rgb(100, 100, 100);
}
.list {
  margin: 0;
  padding: 0.2rem 0.3rem;
  /*height: 0.88rem;*/
  /*line-height: 0.88rem;*/
  /*font-size: 0.3rem;*/
  /*color: #333333;*/
  display: flex;
  align-items: center;
  justify-content: space-between;
  /*border-bottom: solid 1px #c3c3c3;*/
}
/*
        .list:nth-last-of-type(1) {
            border: none;
        }*/

.list img {
  width: 0.2rem;
  height: 0.2rem;
}

.score {
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

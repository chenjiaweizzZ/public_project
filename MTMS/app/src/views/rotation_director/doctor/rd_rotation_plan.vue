<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../../assets/images/icon_fanhui.png" />
        </a>
      </div>轮转计划
    </c-header>
    <div class="g-main">
      <div v-for="item in list" class="contentDiv">
        <p class="progress" :class="{green:item.turnstatus == 1,orange:item.turnstatus == 0}">
          <img v-if="item.turnstatus == 3" src="../../../assets/images/icon_hui.png" alt />
          <img v-if="item.turnstatus == 4" src="../../../assets/images/icon_red.png" />
          <img v-if="item.turnstatus == 1" src="../../../assets/images/icon_lv.png" alt />
          <img v-if="item.turnstatus == 0" src="../../../assets/images/icon_ju.png" alt />
        </p>
        <ul
          v-if="item.turnstatus == 1 || item.turnstatus == 3"
          @click="detail(item.turnstatus,item.plandetailid,item.planendtime)"
          class="list"
        >
          <li class="listTitle">
            <span>{{item.deptname}}</span>
            <img v-if="item.turnstatus == 3" src="../../../assets/images/icon_yi.png" alt />
            <img v-if="item.turnstatus == 1" src="../../../assets/images/icon_zhong.png" alt />
          </li>
          <!-- <li>
            <span>
              科主任：
              <span v-for="v in item.headlist">{{v.tecname}}</span>
            </span>
          </li> -->
          <li>
            <span>分带教：{{item.teaching}}</span>
          </li>
          <li>
            <span>
              总带教：
              <span v-for="v in item.secretarylist">{{v.tecname}}</span>
            </span>
          </li>
          <li>
            <span>
              计划轮转周期：
              <span
                v-if="item.planbegintime"
              >{{item.planbegintime | date}} - {{item.planendtime | date}}（{{item.settime}}）</span>
            </span>
          </li>
          <li>
            <span>
              实际轮转周期：
              <span
                v-if="item.realbegintime"
              >{{item.realbegintime | date}} - {{item.realendtime | date}}（{{item.actualdays}}）</span>
            </span>
          </li>
          <!-- <div class="icon-ckstatus">
                        <img src="../../../assets/images/turn_qualified.png" alt="" v-if="item.ckstatus =='合格' ">
                        <img src="../../../assets/images/turn_unqualified.png" alt="" v-else-if="item.ckstatus == '不合格'">
          </div>-->
        </ul>
        <ul v-else-if="item.turnstatus == 4" class="list" @click="showReasonContent(item)">
          <li class="listTitle">
            <span>{{item.deptname}}</span>
            <img v-if="item.turnstatus == 4" src="../../../assets/images/icon_weilunzhuan.png" alt />
          </li>
          <li>
            计划轮转周期：
            <span
              v-if="item.planbegintime"
            >{{item.planbegintime | date}}-{{item.planendtime | date}}（{{item.settime}}）</span>
          </li>
          <li>
            <span>实际轮转周期：</span>
          </li>
          <!-- <div class="not-icon-ckstatus">
                        <img src="../../../assets/images/turn_qualified.png" alt="" v-if="item.ckstatus =='合格' ">
                        <img src="../../../assets/images/turn_unqualified.png" alt="" v-else-if="item.ckstatus == '不合格'">
          </div>-->
        </ul>
        <ul v-else class="list">
          <li class="listTitle">
            <span>{{item.deptname}}</span>
            <img v-if="item.turnstatus == 0" src="../../../assets/images/icon_dairuke-.png" alt />
          </li>
          <li>
            <span>规定轮转周期 ：{{item.settime}}</span>
            <span></span>
          </li>
          <li>
            <span>
              计划轮转周期 ：
              <span
                v-if="item.planbegintime"
              >{{item.planbegintime | date}}-{{item.planendtime | date}}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <!--未轮转理由-->
    <div class="for-reason" v-if="showreason">
      <div class="reason-content">
        <header>未轮转原因</header>
        <section>
          <label v-for="(v,index) in reason.turnnotlist">
            <input type="checkbox" class="radio" disabled />
            {{v.turnnotname}}
          </label>
          <textarea v-model="reason.remark" disabled></textarea>
        </section>
        <footer>
          <a @click="showreason = false">确定</a>
        </footer>
      </div>
    </div>
    <no-content v-if="noContent"></no-content>
  </div>
</template>
<script>
import methods from "../../../methods";
import cHeader from "../../header";
import noContent from "../../no_content";
import { mapState, mapActions } from "vuex";
import moment from "moment";
export default {
  name: "rotation_doctor_detail",
  components: {
    cHeader,
    noContent,
    moment
  },
  filters: {
    date: function(value) {
      if (value) {
        return value.split("-").join(".");
      }
    }
  },
  data() {
    return {
      list: [],
      noContent: false,
      data: {},
      showreason: false
    };
  },
  computed: {
    ...mapState(["turninfo"])
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
    // 点击每一个具体的详情内容
    detail: function(index, param, params) {
      let self = this;
      this.setTurninfo({ k: "planendtime", v: params });
      this.$router.push({
        name: "fdRotation_doctor_exam_director",
        query: {
          booking: 0,
          id: param,
          type: self.$route.query.type,
          where: self.$route.query.where
        }
      });
    },
    // 初始化获取轮转计划详情信息
    init: function() {
      let self = this;
      self.data = {
        command: "turn/turnplan",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid")
      };
      // 由带教老师页面跳转过来
      if (self.$route.query.type != 0) {
        self.data.uid = this.turninfo.stuid;
      }
      self
        .post("/turn/turnplan", self.data)
        .done(function(data) {
          // self.list = self.sort(data.plandetaillist)
          if (data.plandetaillist) {
            self.list = data.plandetaillist;
          }
          self.list.map(function(item, index, arr) {
            if (item.realendtime == null && item.turnstatus != 4) {
              item.realendtime = "目前";
            }
          });
          if (self.list.length == 0) {
            self.noContent = true;
          }
        })
        .fail(function(error) {
          self.noContent = true;
        });
    },
    // 倒叙
    // sort: function (elements) {
    //     for (var i = 0; i < elements.length - 1; i++) {
    //         for (var j = 0; j < elements.length - i - 1; j++) {
    //             if (moment(elements[j].realbegintime).format('X') > moment(elements[j + 1].realbegintime).format(
    //                     'X')) {
    //                 var swap = elements[j];
    //                 elements[j] = elements[j + 1]
    //                 elements[j + 1] = swap
    //             }
    //         }
    //     }
    //     return elements
    // },
    // 返回键
    showReasonContent(param) {
      this.reason = param;
      this.showreason = true;
    },
    // back() {
    //   window.history.go(-1);
    // }
    back() {
      if (this.$route.query.type == 0) {
        this.$router.push({
          name: "fdRotation_doctor_director",
          deptid: this.$route.query.deptid,
          deptname: this.$route.query.deptname
        });
      } else if (this.$route.query.type == 1) {
        this.$router.push({
          name: "fdRotation_teacher_director",
          query: {
            type: this.$route.query.type,
            deptid: this.$route.query.deptid,
            deptname: this.$route.query.deptname
          }
        });
      } else if (this.$route.query.type == 2) {
        this.$router.push({
          name: "fdRotation_secretary_director",
          query: {
            type: this.$route.query.type,
            where: this.$route.query.where,
            deptid: this.$route.query.deptid,
            deptname: this.$route.query.deptname
          }
        });
      } else if (this.$route.query.type == 3) {
        this.$router.push({
          name: "fdRotation_nurse_director",
          query: {
            type: this.$route.query.type,
            where: this.$route.query.where,
            deptname: this.$route.query.deptname
          }
        });
      } else if (this.$route.query.type == 4) {
        this.$router.push({
          name: "fdRotation_secretary_director",
          query: {
            type: this.$route.query.type,
            where: this.$route.query.where,
            deptid: this.$route.query.deptid,
            deptname: this.$route.query.deptname
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.g-main {
  font-size: 0.22rem;
  background: #f8f7f9 !important;
  color: rgb(100, 100, 100);
}
.list {
  margin-left: 0.4rem;
  margin-right: 0.2rem;
  padding: 0.05rem 0.3rem;
}

.contentDiv {
  position: relative;
}

.progress {
  position: absolute;
  background: #c3c3c3;
  width: 0.02rem;
  height: calc(100% - 0.24rem);
  top: 0.34rem;
  left: 0.2rem;
  z-index: 10;
}

.progress img {
  position: absolute;
  top: -0.34rem;
  left: calc(50% - 0.12rem);
  width: 0.24rem;
  height: 0.24rem;
}
.green {
  background: rgb(32, 219, 154);
}

.orange {
  background: orange;
}

.list:nth-of-type(1) {
  margin-top: 0.2rem;
}

.list li {
  padding: 0.05rem 0;
  /*font-size: 0.24rem;*/
  /*color: #666666;*/
}

.listTitle {
  padding-right: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.26rem;
  color: #333333;
}

.listTitle img {
  height: 0.36rem;
  width: 1rem;
}
.list > .icon-ckstatus {
  position: absolute;
  top: 1rem;
  right: 0.2rem;
  img {
    width: 1rem;
    height: 1rem;
  }
}
.list > .not-icon-ckstatus {
  position: absolute;
  top: 0.5rem;
  right: 0.2rem;
  img {
    width: 1rem;
    height: 1rem;
  }
}
.progress:nth-last-of-type(1) {
  height: calc(100% - 0.34rem);
}
.for-reason {
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 99;
  background: rgba(0, 0, 0, 0.5);
  .reason-content {
    border-radius: 10px;
    width: 80%;
    background: #fff;
    z-index: 100;
    header {
      text-align: center;
      line-height: 0.5rem;
      padding: 0.2rem 0;
    }
    section {
      padding: 0 0.2rem;
      label {
        margin: 0.1rem;
      }
      textarea {
        width: 100%;
        border: 1px solid #eee;
        padding-left: 0.1rem;
        margin: 0.2rem 0;
        resize: none;
      }
    }
    footer {
      display: flex;
      justify-content: space-around;
      padding: 0.1rem;
      border-top: 0.01rem solid #eee;
      a {
        line-height: 0.5rem;
        color: #3499db;
      }
    }
  }
}
.radio {
  width: 0.25rem;
  height: 0.25rem;
  position: relative;
  box-shadow: #dfdfdf 0 0 0 0 inset;
  border-radius: 0.15rem;
  border-top-left-radius: 0.15rem;
  border-top-right-radius: 0.15rem;
  border-bottom-left-radius: 0.15rem;
  border-bottom-right-radius: 0.15rem;
  background-clip: content-box;
  display: inline-block;
  -webkit-appearance: none;
  user-select: none;
  outline: none;

  background-image: url("../../../assets/images/gouxuan_on.png");
  background-size: cover;
  margin-right: 0.05rem;
}
</style>

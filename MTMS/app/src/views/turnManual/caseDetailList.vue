<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../assets/images/icon_fanhui.png" />
        </a>
      </div>
      {{caseName}}
      <div slot="headerRight" v-if="isInter == 0">
        <button style="font-size:0.3rem" @click="addCase">添加</button>
      </div>
    </c-header>
    <div class="finish-detail">
      <div>
        要求例数:
        <span>{{totalCount}}</span>
      </div>
      <div>
        已完成例数:
        <span>{{finishCount}}</span>
      </div>
    </div>
    <div class="g-main">
      <van-tabs @change="onClick" class="reset-style">
        <van-tab title="待审核">
          <van-pull-refresh v-model="checkList[0].isLoading" @refresh="onRefresh(0)">
            <van-list
              v-model="checkList[0].loading"
              finished-text="没有更多了"
              :finished="checkList[0].finished"
              @load="onLoad(0)"
              :loading-text="text"
              :offset="10"
            >
              <div class="case-detail-list">
                <ul>
                  <li
                    v-for="(item,index) in checkList[0].items"
                    :key="index"
                    @click.stop="queryDetails(item, index)"
                    @touchstart="touchIn(item, index)"
                    @touchend="cleartime(index)"
                  >
                    <div v-for="(val, idx) in item.iteminfo" :key="idx">
                      <span>{{val.writeInfo}}:</span>
                      <span>{{val.content}}</span>
                    </div>
                    <div :class="[item.userinfo[0].check == 0 ? '' : 'no-pass', 'case-tip']">
                      <span>{{item.userinfo[0].checkName}}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="已审核">
          <van-pull-refresh v-model="checkList[1].isLoading" @refresh="onRefresh(1)">
            <van-list
              v-model="checkList[1].loading"
              :loading-text="text"
              finished-text="没有更多了"
              :finished="checkList[1].finished"
              @load="onLoad(1)"
              :offset="10"
            >
              <div class="case-detail-list">
                <ul>
                  <li
                    v-for="(item,index) in checkList[1].items"
                    :key="index"
                    @click.stop="queryDetails(item, index)"
                  >
                    <div v-for="(val, idx) in item.iteminfo" :key="idx">
                      <span>{{val.writeInfo}}:</span>
                      <span>{{val.content}}</span>
                    </div>
                    <div class="case-pass case-tip">
                      <span>{{item.userinfo[0].checkName}}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import methods from "@/methods";
import { mapState, mapActions } from "vuex";
import cHeader from "@/views/header";
import cDatepicker from "@/components/timepicker";
import cPicker from "../../components/default-picker";
export default {
  data() {
    return {
      isInter: this.$route.query.user,
      isdoctor: "",
      caseName: "",
      totalCount: "", // 要完成的例数
      finishCount: "", // 完成的例数
      currentId: 0, // 0待审核 1已审核
      baseId: "", // 无子项要传递 病例病种的baseID
      text: "加载中",
      checkList: [
        {
          items: [],
          isLoading: false,
          loading: false,
          error: false,
          finished: false
        },
        {
          items: [],
          isLoading: false,
          loading: false,
          error: false,
          finished: false
        }
      ],
      pagenum: 1,
      pagesize: 10
    };
  },
  components: {
    cHeader,
    cDatepicker,
    cPicker
  },
  computed: {
    ...mapState(["turnManual"])
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

    /**
     * 查询列表
     * check 0待审核 1审核通过 2未通过
     * baseId 通过type值判断是否有子项  有子项就为子项Id, 无子项就为病种病例ID
     * stdId 学生ID
     * type 默认传0
     */
    queryList(stdId, base, check, type) {
      let baseId =
        base == 0 ? this.$route.query.baseId : this.$route.query.caseId;
      // 置空
      return new Promise((resolve, reject) => {
        this.post("/turnManual/queryTurnManualDiseaseStdDetail", {
          command: "turnManual/queryTurnManualDiseaseStdDetail",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          type: type,
          stdId: stdId,
          baseId: baseId,
          check: check,
          isdisplay: 1, // 在app中展示默认为1
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
          .done(data => {
            if (data && data.errcode == 0) {
              resolve(data);
            }
          })
          .fail(error => {
            reject(data);
          });
      });
    },

    // tab切换
    onClick(index) {
      this.currentId = index;
      this.pagenum = 1;
      this.checkList[index].isLoading = false;
      this.checkList[index].finished = false;
      this.checkList[index].items = [];
    },

    // 查询当前列表详情信息
    queryDetails(item, index) {
      let id = item.iteminfo[0].id;
      let checkId = item.userinfo[0].check;
      this.$router.push({
        // path: "/turnManual/create",
        name: 'createCaseInfo',
        query: {
          id: this.$route.query.id,
          type: this.$route.query.type,
          check: checkId,
          detailId: id
        }
      });
    },

    // 刷新
    onRefresh(type) {
      this.pagenum = 1;
      const list = this.checkList[type];
      list.isLoading = true;
      this.queryList(
        this.turnManual.stdId,
        this.$route.query.type,
        type,
        0
      ).then(data => {
        list.items = [];
        this.pagenum++;
        list.finished = false;
        if (list.isLoading) {
          for (var i in data.list) {
            list.items.push(data.list[i]);
          }
          list.isLoading = false;
        }
      });
    },

    // 加载
    onLoad(type) {
      // 待审核查询 默认为0
      this.queryList(
        this.turnManual.stdId,
        this.$route.query.type,
        type,
        0
      ).then(data => {
        this.pagenum++;
        const list = this.checkList[type];
        for (var i in data.list) {
          list.items.push(data.list[i]);
        }
        list.loading = false;
        if (list.items.length >= data.count) {
          list.finished = true;
        }
      });
    },

    delcaseItem(id) {
      this.post("/turnManual/deleteTurnManualStdItem", {
        command: "turnManual/deleteTurnManualStdItem",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        id: id
      })
        .done(data => {
          if (data && data.errcode == 0) {
            this.onClick(this.currentId);
          }
        })
        .fail(error => {});
    },

    // 删除
    touchIn(item, index) {
      let id = item.iteminfo[0].id;
      var self = this;
      clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
      this.Loop = setTimeout(() => {
        this.showConfirm({
          title: "温馨提示",
          msg: "是否删除？",
          theme: "modal-confirm modal-white",
          cancel: function() {},
          ok: function() {
            self.delcaseItem(id);
          }
        });
      }, 1000);
    },

    cleartime(index) {
      // 这个方法主要是用来将每次手指移出之后将计时器清零
      clearInterval(this.Loop);
    },

    addCase() {
      if (this.$route.query.validate == 1) {
        if (this.$route.query.type == 0) {
          this.$router.push({
            // path: "/turnManual/create",
            name: 'createCaseInfo',
            query: {
              id: this.$route.query.id,
              type: this.$route.query.type,
              baseId: this.$route.query.baseId,
              businessid: this.$route.query.businessid
            }
          });
        } else {
          this.$router.push({
            // path: "/turnManual/create",
            name: 'createCaseInfo',
            query: {
              id: this.$route.query.id,
              type: this.$route.query.type,
              baseId: this.$route.query.caseId,
              nameFlag: 0,
              businessid: this.$route.query.businessid
            }
          });
        }
      } else {
        this.$toast("您已不在当前科室轮转");
      }
    },
    // checkIsInter() {
    //   let self = this;
    //   if (this.$router.query.type) {
    //     if (this.$router.query.user == 0) {
    //       self.isInter = true;
    //     } else {
    //       self.isInter = false;
    //     }
    //   } else {
    //     self.isInter = false;
    //   }
    // },
    back() {
      this.$router.go(-1);
    }
  },
  mounted() {
    let self = this;
    let obj = JSON.parse(localStorage.getItem("caseDetail"));
    // 有无子项
    if (this.$route.query.type == 0) {
      this.totalCount = obj.count;
      this.finishCount = obj.baseCount;
      this.caseName = this.turnManual.caseName;
    } else {
      this.totalCount = obj.count;
      this.finishCount = obj.alreadyCheck;
      this.caseName = this.turnManual.caseDetailName;
    }
    // self.checkIsInter();
    this.registerToNative("goBack", function(data) {
      self.back();
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/mixin.scss";

.finish-detail {
  width: 100%;
  height: 1rem;
  background: #fff;
  display: flex;
  align-items: center;
  font-size: torem(16px);
}

.finish-detail div {
  margin: 0 torem(10px) 0 torem(20px);
}

.finish-detail span {
  color: #3499db;
}

// .reset-style /deep/ .van-tabs__wrap {
//   position: fixed;
//   border-bottom: 1px solid #c9caca;
//   border-top: 1px solid #c9caca;
//   top: 1.7rem;
// }

.reset-style /deep/ .van-tabs__line {
  background: #3499db;
}

.reset-style /deep/ .van-tab--active {
  color: #3499db;
}

.reset-style /deep/ .van-list {
  margin-top: 0.8rem;
}

.van-tabs--line {
  padding-top: 0 !important;
}

.case-detail-list {
}

.case-detail-list ul li {
  background: #fff;
  padding: torem(14px);
  border: 1px solid #e2e2e2;
  margin-bottom: 0.12rem;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  font-size: torem(14px);
  position: relative;
  overflow: hidden;
}

.case-detail-list ul li > div {
  width: 45%;
  margin-bottom: 0.1rem;
  display: flex;
  align-items: flex-start;
}

.case-detail-list ul li > div:nth-child(even) {
  margin-left: 0.4rem;
}

.case-detail-list ul li > div span:nth-child(even) {
  margin-left: 0.1rem;
}

.case-tip {
  position: absolute;
  top: -0.6rem;
  right: -0.6rem;
  width: 1.2rem !important;
  height: 1.2rem;
  color: #fff;
  background: #ff9900;
  transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  /* Internet Explorer */
  -moz-transform: rotate(45deg);
  /* Firefox */
  -webkit-transform: rotate(45deg);
  /* Safari 和 Chrome */
  -o-transform: rotate(45deg);
  /* Opera */
  font-size: torem(12px);
}

.case-tip span {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.no-pass {
  background: #ff0000;
}

.case-pass {
  background: #349adc;
}
</style>
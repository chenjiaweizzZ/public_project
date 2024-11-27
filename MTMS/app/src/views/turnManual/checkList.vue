<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../assets/images/icon_fanhui.png" />
        </a>
      </div>
      {{caseName}}
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
      <van-pull-refresh v-model="checkForm.isLoading" @refresh="onRefresh()">
        <van-list
          v-model="checkForm.loading"
          :loading-text="text"
          finished-text="没有更多了"
          :finished="checkForm.finished"
          @load="onLoad()"
          :offset="10"
        >
          <div class="case-detail-list">
            <ul>
              <li
                v-for="(item,index) in checkForm.items"
                :key="index"
                @click.stop="queryDetails(item, index)"
              >
                <div v-for="(val, idx) in item.iteminfo" :key="idx">
                  <span>{{val.writeInfo}}:</span>
                  <span>{{val.content}}</span>
                </div>
              </li>
            </ul>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import methods from "@/methods";
import { mapState, mapActions } from "vuex";
import cHeader from "@/views/header";
export default {
  data() {
    return {
      caseName: "",
      text: "加载中",
      checkForm: {
        isLoading: false,
        loading: false,
        items: [],
        finished: false
      },
      totalCount: "",
      finishCount: "",
      // 分页
      pagenum: 1,
      pagesize: 10
    };
  },
  components: {
    cHeader
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

    // 审核通过列表查询
    queryChekList() {
      let baseId = this.$route.query.baseId || "";
      return new Promise((resolve, reject) => {
        this.post("/turnManual/queryTurnManualDiseaseStdDetail", {
          command: "turnManual/queryTurnManualDiseaseStdDetail",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          type: 0, // 默认传0
          stdId: this.turnManual.stdId,
          baseId: baseId,
          check: 1, // 审核通过
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
            reject(error);
          });
      });
    },

    // 刷新
    onRefresh() {
      this.pagenum = 1;
      this.checkForm.isLoading = true;
      this.queryChekList().then(data => {
        this.pagenum++;
        this.checkForm.finished = false;
        this.checkForm.items = [];
        for (var i in data.list) {
          this.checkForm.items.push(data.list[i]);
        }
        this.checkForm.isLoading = false;
      });
    },

    // 加载
    onLoad() {
      this.queryChekList().then(data => {
        this.pagenum++;
        for (var i in data.list) {
          this.checkForm.items.push(data.list[i]);
        }
        this.checkForm.loading = false;
        if (this.checkForm.items.length >= data.count) {
          this.checkForm.finished = true;
        }
      });
    },

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

    back() {
      this.$router.go(-1);
    }
  },
  mounted() {
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
    this.queryChekList(); // 待审核查询
    let self = this;
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

.case-detail-list {
}

.case-detail-list ul li {
  background: #fff;
  padding: torem(8px);
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
</style>
<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../assets/images/icon_fanhui.png" />
        </a>
      </div>轮转手册审核历史
      <div slot="headerRight">
        <button v-if="!allCheckFlag" style="font-size:0.3rem" @click="handleCancel">取消</button>
      </div>
    </c-header>
    <div class="search-box">
      <form action="/">
        <van-search
          v-model="searchValue"
          placeholder="请输入学员姓名模糊查询"
          show-action
          shape="round"
          @cancel="onCancel"
          @search="onSearch"
        >
          <div slot="action" @click="onSearch">搜索</div>
        </van-search>
      </form>
    </div>
    <div class="g-main container">
      <van-tabs @click="onClick" class="reset-style">
        <van-tab title="审核通过">
          <van-pull-refresh v-model="list[0].isLoading" @refresh="onRefresh(0)">
            <van-list
              v-model="list[0].loading"
              :loading-text="text"
              finished-text="没有更多了"
              :finished="list[0].finished"
              @load="onLoad(0)"
              :offset="10"
            >
              <ul>
                <li v-for="(item, index) in list[0].items" :key="index">
                  <div :class="[allCheckFlag ? 'checked-left-box' : 'check-left-box']">
                    <input
                      type="checkbox"
                      @change.stop="selectIt(item.checked, index)"
                      id="checkbox"
                      v-model="item.checked"
                    />
                  </div>
                  <div
                    @click.prevent="choose(item)"
                    :class="[allCheckFlag ? 'checked-right-box' : 'check-right-box', 'check-box']"
                  >
                    <div class="check-title">{{item.userinfo[0].turnManualName}}</div>
                    <div class="check-content">
                      <div v-for="(val, idx) in item.iteminfo">
                        <template v-if="val.type == 3">
                          <span class="lableTxt">{{val.writeInfo}}:</span>
                          <span v-if="val.content == 0" class="contentTxt">否</span>
                          <span v-if="val.content == 1" class="contentTxt">是</span>
                        </template>
                        <template v-else>
                          <span class="lableTxt">{{val.writeInfo}}:</span>
                          <span class="contentTxt">{{val.content}}</span>
                        </template>
                      </div>
                    </div>
                    <div class="check-footer">
                      <span>{{item.userinfo[0].stdInfo}}</span>
                      <span>{{item.userinfo[0].createTime}}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="审核不通过">
          <van-pull-refresh v-model="list[1].isLoading" @refresh="onRefresh(1)">
            <van-list
              v-model="list[1].loading"
              :loading-text="text"
              finished-text="没有更多了"
              :finished="list[1].finished"
              @load="onLoad(1)"
              :offset="10"
            >
              <ul>
                <li v-for="(item, index) in list[1].items" :key="index">
                  <div :class="[allCheckFlag ? 'checked-left-box' : 'check-left-box']">
                    <input
                      type="checkbox"
                      @change.stop="selectIt(item.checked, index)"
                      id="checkbox"
                      v-model="item.checked"
                    />
                  </div>
                  <div
                    @click.prevent="choose(item)"
                    :class="[allCheckFlag ? 'checked-right-box' : 'check-right-box', 'check-box']"
                  >
                    <div class="check-title">{{item.userinfo[0].turnManualName}}</div>
                    <div class="check-content">
                      <div v-for="(val, idx) in item.iteminfo">
                        <template v-if="val.type == 3">
                          <span class="lableTxt">{{val.writeInfo}}:</span>
                          <span v-if="val.content == 0" class="contentTxt">否</span>
                          <span v-if="val.content == 1" class="contentTxt">是</span>
                        </template>
                        <template v-else>
                          <span class="lableTxt">{{val.writeInfo}}:</span>
                          <span class="contentTxt">{{val.content}}</span>
                        </template>
                      </div>
                    </div>
                    <div class="check-footer">
                      <span>{{item.userinfo[0].stdInfo}}</span>
                      <span>{{item.userinfo[0].createTime}}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
    <div class="footer-box">
      <div v-if="isChecked" class="operation-box">
        <div class="footer-left-box">
          <van-checkbox v-if="checkAll" v-model="allChecked" @click="allCheck">全选</van-checkbox>
          <van-checkbox v-else v-model="allChecked" @click="allNoCheck">取消全选</van-checkbox>
        </div>
        <div class="footer-right-box">
          <van-button square type="primary" @click="cancel">撤销</van-button>
        </div>
      </div>
      <div v-else class="all-check-box">
        <van-button square type="primary" @click="batchCheck">批量撤销</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import methods from "@/methods";
import { mapState, mapActions } from "vuex";
import cHeader from "@/views/header";
import api from "./js/common.js";
export default {
  data() {
    return {
      text: "加载中",
      searchValue: "",
      isload: false,
      isLoad: false,
      pagenum: 1,
      pagesize: 10,
      tabIndex: 0, // 0 通过  1不通过
      check: "1", // check 0待审核 1审核通过 2未通过
      list: [
        {
          isLoading: false,
          loading: false,
          items: [],
          finished: false
        },
        {
          isLoading: false,
          loading: false,
          items: [],
          finished: false
        }
      ],
      // 不显示radio按钮
      allCheckFlag: true,
      allChecked: false,
      // 是否批量审核
      isChecked: false,
      // 是否全选
      checkAll: true,
      // 审核项数组
      curIdList: [],
      // 验证数组
      validateList: []
    };
  },
  components: {
    cHeader
  },
  computed: {},
  methods: {
    ...methods,
    ...mapActions([
      "showAlert",
      "showConfirm",
      "showLoading",
      "hideLoading",
      "toast"
    ]),

    // 单选
    selectIt(checked, index) {
      let list = this.list[this.tabIndex];
      this.validateList = [];
      //选中
      if (checked) {
        this.validateList.push({
          id: list.items[index].iteminfo[0].id,
          createTime: list.items[index].userinfo[0].createTime
        });
        api
          .validateCheck(this.validateList)
          .then(data => {})
          .catch(data => {
            this.$nextTick(() => {
              list.items[index].checked = false;
            });
            this.$toast("当前审核项已过审核时间");
          });
      }
    },

    // 全选
    allCheck() {
      this.allCheckFlag = false;
      this.checkAll = false;
      let list = this.list[this.tabIndex];
      this.validateList = [];
      list.items.forEach(item => {
        item.checked = true;
        this.validateList.push({
          id: item.iteminfo[0].id,
          createTime: item.userinfo[0].createTime
        });
      });
      api
        .validateCheck(this.validateList)
        .then(data => {})
        .catch(data => {
          data.forEach(val => {
            this.$nextTick(() => {
              list.items.forEach((item, index) => {
                if (item.iteminfo[0].id == val) {
                  item.checked = false;
                }
              });
            });
          });
          this.$forceUpdate();
          this.$toast("时间已过的审核项已去除勾选");
        });
    },

    // 取消全选
    allNoCheck() {
      this.curIdList = [];
      this.validateList = [];
      this.checkAll = true;
      let list = this.list[this.tabIndex];
      list.items.forEach(item => {
        item.checked = false;
      });
    },

    // 撤销
    cancel() {
      let list = this.list[this.tabIndex];
      this.curIdList = [];
      this.validateList = [];
      list.items.forEach(item => {
        if (item.checked) {
          this.curIdList.push(item.iteminfo[0].id);
          this.validateList.push({
            id: item.iteminfo[0].id,
            createTime: item.userinfo[0].createTime
          });
        }
      });
      if (this.curIdList.length > 0) {
        this.showConfirm({
          title: "温馨提示",
          msg: "是否确认撤销该审核记录？",
          theme: "modal-confirm modal-white",
          cancel: function() {},
          ok: () => {
            this.checkCase();
          }
        });
      } else {
        this.$toast("请至少选择一项");
      }
    },

    // 审核
    checkCase() {
      this.post("/turnManual/turnManualCheck", {
        command: "turnManual/turnManualCheck",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid"),
        checksuggestion: "",
        checkType: 0, // 0待审核 1 审核通过 2 审核不通过
        list: this.curIdList
      }).done(data => {
        if (data && data.errcode == 0) {
          this.allChecked = false;
          this.checkAll = true;
          this.$toast("撤销成功");
          this.onSearch();
        }
      });
    },

    // 取消批量审核
    handleCancel() {
      this.allCheckFlag = true;
      this.isChecked = false;
      this.checkAll = true;
      this.allChecked = false;
      let list = this.list[this.tabIndex];
      list.items.forEach(item => {
        item.checked = false;
      });
    },

    // 批量审核
    batchCheck() {
      this.isChecked = true;
      this.allCheckFlag = false;
    },

    // search
    onSearch() {
      var list = this.list[this.tabIndex];
      this.pagenum = 1;
      this.queryCheckList().then(res => {
        list.items = [];
        this.pagenum++;
        list.finished = false;
        let newArr = [];
        for (let i in res.list) {
          //   list.items.push(res.list[i]);
          newArr.push(res.list[i]);
        }
        list.items = newArr;
        list.finished = true;
      });
    },

    onCancel() {
      this.searchValue = "";
      this.onSearch();
    },

    // tab切换
    onClick(index) {
      this.isload = false;
      const list = this.list[index];
      this.pagenum = 1;
      list.isLoading = false;
      list.finished = false;
      if (index == 0) {
        this.tabIndex = 0;
        this.check = 1;
      }

      if (index == 1) {
        this.tabIndex = 1;
        this.check = 2;
      }
    },

    // 查询审核列表
    queryCheckList() {
      return new Promise((resolve, reject) => {
        this.post("/turnManual/turnManualCheckList", {
          command: "turnManual/turnManualCheckList",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid"),
          check: this.check, // check 0待审核 1审核通过 2未通过
          isdisplay: 1, // 在app中展示默认为1
          serchInfo: this.searchValue,
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
    onRefresh(type) {
      const list = this.list[type];
      this.pagenum = 1;
      list.isLoading = true;
      this.queryCheckList().then(data => {
        list.items = [];
        this.pagenum++;
        list.finished = false;
        if (list.isLoading) {
          list.isLoading = false;
          let newArr = [];
          for (let i in data.list) {
            // list.items.push(data.list[i]);
            newArr.push(data.list[i]);
          }
          list.items = newArr;
          list.finished = true;
        }
      });
    },
    onLoad(type) {
      if (!this.isload) {
        this.isload = true;
        this.queryCheckList().then(data => {
          this.pagenum++;
          let klist = this.list[type];
          klist.items = [];
          for (let i in data.list) {
            //   newArr.push(data.list[i]);
            klist.items.push(data.list[i]);
          }
          // klist.items = newArr;
          klist.loading = false;
          console.log(klist.items.length);
          console.log(klist.items.length);
          console.log(this.list);
          if (
            klist.items.length > data.count ||
            klist.items.length == data.count
          ) {
            klist.finished = true;
          }
        });
      }

      // 分页判断 判断是否加载完成
      // 加载完成 finish设为true
      // 加载没完成 将loading 设为false, 到底会再次出发onload函数  page++
    },
    // 进入详情
    choose(item) {
      this.$router.push({
        // path: "/turnManual/checkTeaDetail",
        name: 'checkTeaDetail',
        query: {
          id: item.iteminfo[0].id,
          name: item.userinfo[0].turnManualName,
          check: this.check,
          createTime: item.userinfo[0].createTime
        }
      });
    },

    back() {
      this.$router.go(-1);
    }
  },
  mounted() {
    let self = this;
    this.registerToNative("goBack", function(data) {
      self.back();
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/mixin.scss";

.g-wrapper {
  background: #fff;
}

.search-box /deep/ .van-field__left-icon {
  margin-top: 3px;
}

.van-tabs--line {
  padding-top: 0 !important;
}

// .reset-style /deep/ .van-tabs__wrap {
//   position: fixed;
//   border-bottom: 1px solid #c9caca;
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

.container {
  margin-bottom: 0.8rem;
  background: #fff !important;
}

.container ul li {
  width: 100%;
  min-height: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 0.2rem;
}

.check-left-box {
  width: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checked-left-box input {
  width: 0;
}

.check-left-box input[type="checkbox"] {
  -webkit-appearance: none;
  width: torem(20px);
  height: torem(20px);
  border-radius: 50%;
  text-align: center;
  vertical-align: middle;
  line-height: 0.3rem;
  position: relative;
}

.check-left-box input[type="checkbox"]::before {
  content: "";
  position: absolute;
  border-radius: 50%;
  top: 0;
  left: 0;
  background: #fff;
  width: 100%;
  height: 100%;
  border: 1px solid #d9d9d9;
}

.check-left-box input[type="checkbox"]:checked::before {
  content: "";
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  font-size: torem(12px);
  color: #fff !important;
  background: url("../../assets/images/icon-selected.png") no-repeat center
    center;
  background-size: 100% 100%;
  background-color: #3499db;
}

.checked-right-box {
  width: 100%;
  border: none;
}

.check-right-box {
  width: calc(100% - 1.2rem);
  border: 1px solid #e2e2e2;
}

.check-box {
  font-size: torem(14px);
}

.check-title {
  height: 30px;
  line-height: 30px;
  background: #f2f2f2;
  font-weight: 600;
  text-align: left;
  padding-left: 0.1rem;
}

.check-content {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: torem(6px);
}

.check-content > div {
  display: flex;
  align-items: flex-start;
  padding: 0.1rem 0;
  width: 50%;
}

.check-content div span {
  margin-right: 0.2rem;
  display: inline-block;
  word-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap !important;
}

.lableTxt {
  width: 1rem;
  text-align: right;
}

.contentTxt {
  width: 40%;
}

.check-footer {
  height: torem(30px);
  line-height: torem(30px);
  background: #f2f2f2;
  text-align: right;
}

.check-footer span {
  padding: torem(6px);
}

.footer-box {
  width: 100%;
  height: 40px;
  background: #fff;
  border: 1px solid #3499db;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  align-items: center;
}

.van-button--primary {
  background: #fff;
  color: #3499db;
  border: 1px solid #3499db;
  border-radius: 5px;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  margin: 0.4px 0.1rem 0 0;
}

.all-check-box {
  width: 100%;
}

.all-check-box .van-button--primary {
  float: right;
}

.operation-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-left-box {
  margin-left: 0.2rem;
}
</style>
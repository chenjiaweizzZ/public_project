<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../assets/images/icon_fanhui.png" />
        </a>
      </div>轮转手册审核
      <div slot="headerRight">
        <button v-if="allCheckFlag" style="font-size:0.3rem" @click="handleHistory">历史</button>
        <button v-else style="font-size:0.3rem" @click="handleCancel">取消</button>
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
      <van-pull-refresh v-model="checkForm.isLoading" @refresh="onRefresh">
        <van-list
          v-model="checkForm.loading"
          :loading-text="text"
          :finished="checkForm.finished"
          finished-text="没有更多了"
          @load="onLoad"
          :offset="10"
        >
          <ul>
            <li v-for="(item, index) in checkForm.items" :key="index">
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
    </div>
    <div class="footer-box">
      <div v-if="isChecked" class="operation-box">
        <div class="footer-left-box">
          <van-checkbox v-if="checkAll" v-model="allChecked" @click="allCheck">全选</van-checkbox>
          <van-checkbox v-else v-model="allChecked" @click="allNoCheck">取消全选</van-checkbox>
        </div>
        <div class="footer-right-box">
          <van-button
            @click="noPass"
            square
            type="primary"
            style="color:#323232; border:1px solid #323232"
          >不通过</van-button>
          <van-button @click="pass" square type="primary">通过</van-button>
        </div>
      </div>
      <div v-else class="all-check-box">
        <van-button square type="primary" @click="batchCheck">批量审核</van-button>
      </div>
    </div>
    <reason :show-flag="show" @cancel="cancelSubmit" @save="saveSubmit" @click.stop="cstop"></reason>
  </div>
</template>

<script>
import $ from "jquery";
import methods from "@/methods";
import { mapState, mapActions } from "vuex";
import cHeader from "@/views/header";
import reason from "./components/noPassReason.vue";
import api from "./js/common.js";
export default {
  data() {
    return {
      show: false,
      searchValue: "",
      pagenum: 1,
      pagesize: 20,
      text: "加载中",
      checkForm: {
        isLoading: false,
        loading: false,
        items: [],
        finished: false
      },
      // 是否全选
      checkAll: true,
      // 不显示radio按钮
      allCheckFlag: true,
      allChecked: false,
      // 是否批量审核
      isChecked: false,
      // checkbox 选择的 column
      curIdList: [], // array id
      validateList: [], // 验证 array
      check: "", // check 0待审核 1审核通过 2未通过
      noPassText: "" // 不通过原因
    };
  },
  filters: {
    // formatDate(date) {
    //     let _date = new Date(date);
    //     let _year = _date.getFullYear();
    //     let _month = _date.getMonth() + 1;
    //     let _day = _date.getDate();
    //     _month = _month >= 10 ? _month : '0' + _month;
    //     _day = _day >= 10 ? _day : '0' + _day;
    //     return _year + '-' + _month + '-' + _day;
    // }
  },
  watch: {},
  components: {
    cHeader,
    reason
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
    cstop() {
      console.log(111);
    },
    // 获取选中
    getCheckItems(items) {
      this.curIdList = [];
      this.validateList = [];
      items.forEach(item => {
        if (item.checked) {
          this.curIdList.push(item.iteminfo[0].id);
          this.validateList.push({
            id: item.iteminfo[0].id,
            createTime: item.userinfo[0].createTime
          });
        }
      });
      if (this.curIdList.length > 0) {
        if (this.check == 1) {
          this.showConfirm({
            title: "温馨提示",
            msg: "是否确认通过该审核记录？",
            theme: "modal-confirm modal-white",
            cancel: function() {},
            ok: () => {
              this.checkCase(this.check);
            }
          });
        }
        if (this.check == 2) {
          this.showConfirm({
            title: "温馨提示",
            msg: "是否确认不通过该审核记录？",
            theme: "modal-confirm modal-white",
            cancel: function() {},
            ok: () => {
              this.checkCase(this.check);
            }
          });
        }
      } else {
        this.$toast("请至少选择一项");
      }
    },

    // 取消全选
    allNoCheck() {
      this.curIdList = [];
      this.validateList = [];
      this.checkAll = true;
      this.checkForm.items.forEach(item => {
        item.checked = false;
      });
    },

    // 全选
    allCheck() {
      this.allCheckFlag = false;
      this.checkAll = false;
      this.validateList = [];
      this.checkForm.items.forEach(item => {
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
              this.checkForm.items.forEach((item, index) => {
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

    // 勾选
    selectIt(checked, index) {
      this.validateList = [];
      //选中
      if (checked) {
        this.validateList.push({
          id: this.checkForm.items[index].iteminfo[0].id,
          createTime: this.checkForm.items[index].userinfo[0].createTime
        });
        api
          .validateCheck(this.validateList)
          .then(data => {})
          .catch(data => {
            this.$nextTick(() => {
              this.checkForm.items[index].checked = false;
            });
            this.$toast("当前审核项已过审核时间");
          });
      }
    },

    // 通过
    pass() {
      this.check = 1;
      this.getCheckItems(this.checkForm.items);
    },

    // 没通过
    noPass() {
      let flag = false;
      for (var i = 0, len = this.checkForm.items.length; i < len; i++) {
        if (this.checkForm.items[i].checked) {
          flag = true;
          break;
        }
      }
      if (flag) {
        this.check = 2;
        this.show = true;
      } else {
        this.$toast("请至少选择一项");
      }
    },

    cancelSubmit() {
      this.show = false;
    },

    saveSubmit(message) {
      this.show = false;
      this.noPassText = message;
      this.getCheckItems(this.checkForm.items);
    },

    // 审核
    checkCase(type) {
      this.post("/turnManual/turnManualCheck", {
        command: "turnManual/turnManualCheck",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid"),
        checksuggestion: this.noPassText,
        checkType: type, // 0待审核 1 审核通过 2 审核不通过
        list: this.curIdList
      }).done(data => {
        if (data && data.errcode == 0) {
          this.allChecked = false;
          this.checkAll = true;
          this.$toast("通过审核");
          this.onSearch();
        }
      });
    },

    // 查询审核列表
    queryCheckList() {
      return new Promise((resolve, reject) => {
        this.post("/turnManual/turnManualCheckList", {
          command: "turnManual/turnManualCheckList",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid"),
          check: 0, // check 0待审核 1审核通过 2未通过
          isdisplay: 1, // 在app中展示默认为1
          serchInfo: this.searchValue,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
          .done(data => {
            if (data && data.errcode == 0) {
              // if (data.list < this.pagesize) {
              //     this.checkForm.finished = true
              // }

              resolve(data);
            }
          })
          .fail(error => {
            reject(error);
          });
      });
    },

    // search
    onSearch() {
      this.pagenum = 1;
      this.queryCheckList().then(res => {
        this.checkForm.items = [];
        // this.pagenum++;
        this.checkForm.finished = false;
        for (var i in res.list) {
          this.checkForm.items.push(res.list[i]);
        }
      });
    },

    onCancel() {
      this.searchValue = "";
      this.onSearch();
    },

    // 审核历史
    handleHistory() {
      this.$router.push({
        // path: "historyCheckTeaList",
        name: 'historyCheckTeaList',
        query: {}
      });
    },
    // 取消全选
    handleCancel() {
      this.allCheckFlag = true;
      this.isChecked = false;

      this.checkAll = true;
      this.allChecked = false;
      this.checkForm.items.forEach(item => {
        item.checked = false;
      });
    },

    // 批量审核
    batchCheck() {
      this.isChecked = true;
      this.allCheckFlag = false;
    },

    // 刷新
    onRefresh() {
      console.log("cjw12138");
      this.pagenum = 1;
      this.checkForm.isLoading = true;
      this.checkForm.finished = false;
      this.queryCheckList().then(data => {
        this.checkForm.items = [];
        // this.pagenum++;

        if (this.checkForm.isLoading) {
          this.checkForm.isLoading = false;
          let newArr = [];
          for (var i in data.list) {
            newArr.push(data.list[i]);
          }
          this.checkForm.items = newArr;
        }
      });
    },
    onLoad() {
      // 分页判断 判断是否加载完成
      // 加载完成 finish设为true
      // 加载没完成 将loading 设为false, 到底会再次出发onload函数  page++
      this.queryCheckList().then(data => {
        this.pagenum++;
        let temp = 0;
        let newArr = [];
        for (var i in data.list) {
          temp = temp + 1;
          newArr.push(data.list[i]);
        }
        this.checkForm.items = newArr;
        this.checkForm.loading = false;
        if (this.checkForm.items.length >= data.count) {
          this.checkForm.finished = true;
        }
        if (temp < this.pagesize) {
          this.checkForm.finished = true;
        }
      });
    },
    // 进入详情  check 0待审核 1审核通过 2未通过
    choose(item) {
      this.$router.push({
        // path: "/turnManual/checkTeaDetail",
        name: 'checkTeaDetail',
        query: {
          id: item.iteminfo[0].id,
          name: item.userinfo[0].turnManualName,
          check: 0,
          createTime: item.userinfo[0].createTime
        }
      });
    },

    back() {
      // window.location.href =
      //   "/pages/futuredoctorapp/todo.html?view=application";
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
  },
  mounted() {
    let self = this;
    this.registerToNative("goBack", function(data) {
      self.back();
    });
    if (this.$route.query.predefine5) {
      this.searchValue = this.$route.query.predefine5;
    }
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
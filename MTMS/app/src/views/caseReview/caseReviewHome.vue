<template>
  <div class="case-review-home">
    <van-nav-bar title="病历审核" left-arrow @click-left="onClickLeft" />
    <van-tabs v-model="active" @click="tabClick()">
      <div class="search-row">
        <span class="review-ipt">
          <van-search v-model="keyword" placeholder="输入学员姓名或学号搜索" @search="onSearch" @cancel="onCancel" />
        </span>
        <span class="y-line"></span>
        <span class="review-picker" @click="timePopShow">
          <div class="select-item">
            <div class="se-text">{{ timeTxt }}</div>
            <van-col style="width:4px"></van-col>
            <!-- <van-icon name="play" :class="{active: show}" size="10"/> -->
            <img calss="jxx" src="../../assets/images/jx-x.png" />
          </div>
        </span>
      </div>
      <van-tab title="待审核">
        <div v-if="waitList.length > 0">
          <div class="exist-content" @click="reviewDetail(item)" v-for="(item, index) in waitList" :key="index">
            <van-swipe-cell>
              <div class="rd-case">
                <div class="rd-case-left">
                  <div class="rd-case-left-top">{{ item.name }}</div>
                  <div class="rd-case-left-bottom1">{{ item.stuName }} - {{ item.stuCode }}</div>
                  <div class="rd-case-left-bottom">{{ item.updateTime }}</div>
                </div>
              </div>
            </van-swipe-cell>
          </div>
        </div>
        <div class="nodata" v-else>
          <img src="../../assets/images/no-grade.png" />
          <div class="nodataText">暂无病历</div>
        </div>
      </van-tab>
      <van-tab title="已审核">
        <div v-if="alreadyList.length > 0">
          <div class="exist-content" v-for="(item, index) in alreadyList" :key="index" @click="reviewDetail(item)">
            <van-swipe-cell>
              <div class="rd-case">
                <div class="rd-case-left">
                  <div class="rd-case-left-top">{{ item.name }}</div>
                  <div class="rd-case-left-bottom1">{{ item.stuName }} - {{ item.stuCode }}</div>
                  <div class="rd-case-left-bottom">{{ item.updateTime }}</div>
                </div>
                <div class="rd-case-right">
                  <div class="rd-case-right-top">
                    <span class="rd-case-right-score">{{ item.score }}</span>
                    <span class="rd-case-right-unit">分</span>
                  </div>
                  <div class="rd-case-right-bottom">
                    <span class="x-line"></span>
                  </div>
                </div>
              </div>
            </van-swipe-cell>
          </div>
        </div>
        <div class="nodata" v-else>
          <img src="../../assets/images/no-grade.png" />
          <div class="nodataText">暂无病历</div>
        </div>
      </van-tab>
    </van-tabs>
    <van-popup v-model="show" position="bottom">
      <van-datetime-picker v-model="currentDate" type="year-month" title="选择年月" :min-date="minDate" :max-date="maxDate"
        :formatter="formatter" @confirm="timeConfirm" @cancel="timeCancel" />
    </van-popup>
  </div>
</template>

<script>
import { Toast, Dialog, col } from "vant";
import $ from "jquery";
import cHeader from "../header";
import methods from "../../methods";
import { mapState, mapActions } from "vuex";
import cProgress from "@/components/progress";
export default {
  name: "rotation_doctor_exam",
  components: {
    cHeader,
    cProgress
  },
  data() {
    return {
      active: 0,
      minDate: new Date(new Date().getFullYear() - 5, 0, 1),
      maxDate: new Date(new Date().getFullYear() + 9, 10, 1),
      currentDate: new Date(),
      show: false,
      keyword: "",
      time: "",
      timeTxt: "选择时间",
      waitList: [],
      alreadyList: []
    };
  },
  computed: {},
  created() {
    this.getList(0);
  },
  mounted() { },
  methods: {
    ...methods,
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    timePopShow() {
      let self = this;
      self.show = true;
    },
    timeConfirm(time) {
      let self = this;
      let dateObj = new Date(time);
      let year = dateObj.getFullYear();
      let month = dateObj.getMonth() + 1;
      self.timeTxt = `${year}年${month}月`;
      if (month < 10) {
        self.time = `${year}-0${month}`;
      } else {
        self.time = `${year}-${month}`;
      }
      self.show = false;
      self.getList(self.active);
    },
    timeCancel() {
      let self = this;
      self.show = false;
    },
    reviewDetail(item) {
      let self = this;
      this.$router.push({
        name: "caseReviewDetail",
        query: {
          id: item.id
        }
      });
    },
    tabClick() {
      let self = this;
      console.log(self.active);
      self.getList(self.active);
    },
    getList(index) {
      let self = this;
      self
        .get(
          `/base/largeMedicalRecord/auditList?tecId=${$.cookie("uid")}&month=${self.time
          }&keyword=${self.keyword}&auditStatus=${index}`
        )
        .done(res => {
          if (res.resCode == 200) {
            if (index) {
              self.alreadyList = res.model;
            } else {
              self.waitList = res.model;
            }
          }
        });
    },
    onClickLeft() {
      // location.href = "/pages/futuredoctorapp/todo.html?view=application";
      window.location.href =
        "/pages/futuredoctorapp/index.html/#/wxIndex";
      // if (this.$route.query.stem) {
      //   this.$router.push({
      //     name: "wxMenu",
      //   });
      // } else {
      //   this.$router.push({
      //     name: "wxIndex",
      //   });
      // }
    },
    onSearch() {
      let self = this;
      self.getList(self.active);
    },
    onCancel() {
      let self = this;
      self.keyword = "";
      self.getList(self.active);
    }
  }
};
</script>

<style scoped lang="scss">
.case-review-home {
  .y-line {
    width: 1px;
    height: 20px;
    background: #E2E2E2;
    // margin-left: 8px;
    margin-left: 2px;
  }

  .nodata {
    margin-top: 200px;
    background: #ffffff;
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    top: 132px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      height: 138px;
      width: 280px;
    }

    .nodataText {
      font-size: 17px;
      color: #868e97;
    }
  }

  .search-row {
    background: #fff;
    display: flex;
    align-items: center;
    position: sticky;
    top: 88px;
    z-index: 1;

    .review-ipt {
      flex: 7;
    }

    .review-picker {
      flex: 3;
      display: flex;
      align-items: center;
    }

    .select-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }

  .rd-case {
    // height: 103px;
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    margin: 12px 12px 0px 12px;
    border-radius: 6px;

    .rd-case-left {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      flex: 7;
      margin: 0px 0px 0px 14px;

      .rd-case-left-top {
        font-size: 16px;
        font-weight: bold;
        line-height: 19px;
        letter-spacing: 0.2px;
        color: #111111;
        margin: 16px 0px 13px 0px
      }

      .rd-case-left-bottom1 {
        font-size: 12px;
        font-weight: normal;
        line-height: 14px;
        letter-spacing: 0.15px;
        color: #999999;
        // margin: 16px 0px 13px 0px
        // margin-top: 16px
      }

      .rd-case-left-bottom {
        font-size: 12px;
        font-weight: normal;
        line-height: 14px;
        letter-spacing: 0.15px;
        color: #999999;
        margin: 7px 0px 19px 0px // margin-top: 16px
      }
    }

    .rd-case-right {
      flex: 2;
      display: flex;
      flex-direction: column;
      margin-top: 16px;
      align-items: center;

      .rd-case-right-score {
        font-size: 20px;
        font-weight: bold;
        line-height: 24px;
        text-align: right;
        letter-spacing: 0.22px;
        color: #2685d2;
      }

      .rd-case-right-unit {
        font-size: 14px;
        font-weight: bold;
        ;
        line-height: 17px;
        text-align: right;
        letter-spacing: 1.12px;
        color: #2685d2;
      }

      .rd-case-right-bottom {
        height: 1px;
        background: #2685d2;
        width: 47px;
        margin-top: 3px;
      }
    }
  }
}
</style>

<style lang="scss">
.case-review-home {

  /* WebKit browsers  */
  input::-webkit-input-placeholder {
    color: #B2B2B2;
    /* 字体大小直接写样式即可 */
    font-size: 14px;
  }

  /*  Mozilla Firefox 4-18使用伪类 */
  input:-moz-placeholder {
    color: #B2B2B2;
    font-size: 14px;
  }

  /* Mozilla Firefox 19+ 使用伪元素  */
  input::-moz-placeholder {
    color: #B2B2B2;
    font-size: 14px;
  }

  /* IE10使用伪类 */
  input:-ms-input-placeholder {
    color: #B2B2B2;
    font-size: 14px;
  }

  .van-search__content {
    background-color: #F6F6F6;
  }

  .van-tabs__line {
    background: #2F7DCD;
  }

  background: #F6F6F6;
  height: calc(100ch + 10px);

  .van-tabs {
    padding-top: 46px;

    .van-tab {
      color: #333333;
      font-size: 15px;
    }

    .van-tab--active {
      color: #2F7DCD;
    }

    .van-tabs__wrap {
      position: sticky;
      top: 44px;
      z-index: 1;
    }
  }

  .van-cell {
    align-items: center;
    border-radius: 4px;
  }

  .select-item {
    .se-text {
      font-size: 14px;
      font-weight: 700;
      text-align: center;
      color: #111111;
      border: 1px solid #CDCDCD;
      padding: 4px;
      border-radius: 2px;
      margin-left: 14px;

      &.active {
        color: #2f7dcd;
      }
    }

    .jxx {
      transform: rotate(90deg);
      height: 12px;
      width: 12px;

      &.active {
        color: #2f7dcd;
        transform: rotate(-90deg);
      }
    }
  }

  .van-nav-bar__content {
    width: 100%;

    .van-icon {
      line-height: 46px;
    }
  }

  .van-nav-bar {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    width: 100%;

    .van-nav-bar__left {
      bottom: auto;

      .van-icon {
        color: #111111;
        font-size: 24px;
      }
    }

    .van-nav-bar__title {
      font-size: 18px;
      font-weight: 550;
    }

    .van-nav-bar__right {
      bottom: auto;

      .van-nav-bar__text {
        color: #111111;
        font-size: 18px;
      }
    }
  }
}</style>
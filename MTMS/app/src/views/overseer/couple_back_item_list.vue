<template>
  <div class="couple_back_item_list">
    <van-nav-bar :title="title" left-text left-arrow @click-left="back" />
    <div class="couple-item" v-for="(item,index) in itemList" :key="index" @click="listItem(item)">
      <div class="item-left">
        <div class="item-left-top">
          <div class="item-name">{{ item.expertName }}</div>
          <div
            class="item-grade"
            v-if="item.score !== null"
          >&nbsp;&nbsp;&nbsp;&nbsp;督导评分:&nbsp;{{ Number(item.score) }}分</div>
        </div>
        <div class="item-left-bottom">{{ item.submitTime }}</div>
      </div>
      <div class="item-right">
        <div class="couple-back-active" v-if="item.status == 2">已反馈</div>
        <div class="couple-back-negative" v-else>未反馈</div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import methods from "../../methods";
import { NavBar } from "vant";
export default {
  name: "couple_back+item_list",
  data() {
    return {
      title: "督导反馈",
      itemList: []
    };
  },
  created() {
    let self = this;
    self.getItemList();
  },
  methods: {
    ...methods,
    back() {
      this.$router.push("couple_back");
    },
    getItemList() {
      let self = this;
      let params = {
        command: "supervisor/supervisorFeedbackUserList",
        loginid: $.cookie("uid"),
        supervisorId: this.$route.query.supervisorId
      };
      self
        .post("/supervisor/supervisorFeedbackUserList", params)
        .done(function(res) {
          console.log(res);
          self.itemList = res.result;
        });
    },
    listItem(item) {
      console.log(item);
      let self = this;
      let isEva;
      if (item.expertEvaluateId) {
        isEva = 1;
      } else {
        isEva = 0;
      }
      this.$router.push({
        name: "back_list_item",
        query: {
          supervisorId: self.$route.query.supervisorId,
          businessId: item.supervisorUserId,
          type: self.$route.query.type,
          isEva: isEva,
          deptId: self.$route.query.deptId,
          teachingActionType: self.$route.query.teachingActionType,
        }
      });
    }
  }
};
</script>

<style lang="scss">
.couple_back_item_list {
  height: 100%;
  background: #f6f6f6;
  .van-nav-bar {
    display: flex;
    align-items: center;
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
  .couple-item {
    background: #ffffff;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    margin: 12px 12px 0px 12px;
    .item-left {
      .item-left-top {
        margin: 16px;
        display: flex;
        .item-name {
          font-size: 16px;
          color: #111111;
          letter-spacing: 0.2px;
          font-weight: 500;
          margin-right: 6px;
        }
        .item-grade {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #00982d;
          letter-spacing: 0.21px;
          font-weight: 400;
        }
      }
      .item-left-bottom {
        margin: 0 0 12px 16px;
        font-size: 12px;
        color: #999999;
        letter-spacing: 0.15px;
        font-weight: 400;
      }
    }
    .item-right {
      display: flex;
      align-items: center;
      margin-right: 12px;
      .couple-back-active {
        font-size: 14px;
        color: #00982d;
        letter-spacing: 0.25px;
        text-align: right;
        font-weight: 400;
      }
      .couple-back-negative {
        font-size: 14px;
        color: #999999;
        letter-spacing: 0.25px;
        text-align: right;
        font-weight: 400;
      }
    }
  }
}
</style>
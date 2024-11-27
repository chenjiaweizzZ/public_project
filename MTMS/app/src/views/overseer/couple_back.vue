<template>
  <div class="overseer-grade">
    <van-nav-bar :title="title" left-text left-arrow @click-left="back" />
    <div class="select-menu">
      <div class="select-item" @click="selectType">
        <div class="se-text" :class="{active: show1}">类型&nbsp;{{ rtType }}</div>
        <van-col style="width:6px"></van-col>
        <van-icon name="play" :class="{active: show1}" />
      </div>
      <div class="select-item" @click="selectStatus">
        <div class="se-text" :class="{active: show2}">反馈状态&nbsp;{{ rtStatus }}</div>
        <van-col style="width:6px"></van-col>
        <van-icon name="play" :class="{active: show2}" />
      </div>
    </div>
    <van-popup v-model="show1" position="bottom" :close-on-click-overlay="false">
      <van-picker
        ref="typeCheck"
        show-toolbar
        title="请选择类型"
        :columns="types"
        @cancel="onCancel1"
        @confirm="onConfirm1"
        value-key="type"
        :default-index="typeDefault"
      />
    </van-popup>
    <van-popup v-model="show2" position="bottom" :close-on-click-overlay="false">
      <van-picker
        ref="statusCheck"
        show-toolbar
        title="请选择督导状态"
        :columns="statuses"
        @cancel="onCancel2"
        @confirm="onConfirm2"
        value-key="status"
        :default-index="statusDefault"
      />
    </van-popup>
    <van-search
      v-model="searchValue"
      placeholder="搜索"
      show-action
      shape="round"
      @search="onSearch"
      :clearable="true"
    >
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
    <div class="grade-list" v-if="gradeList.length > 0">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <div class="grade-content" v-for="(item,index) in gradeList" :key="index">
          <div class="grade-title" @click="activityDetail(item.businessId,item.type)">
            <div class="grade-headline" v-if="item.type == 1">《{{ item.theme }}》&nbsp;教学活动督导</div>
            <div class="grade-headline" v-if="item.type == 2">"{{ item.deptName }}"&nbsp;医院管理督导</div>
            <div class="grade-headline" v-if="item.type == 3">"{{ item.deptName }}"&nbsp;出科考核督导</div>
            <div class="status-box">
              <div class="grade-status1" v-if="item.status == 1">未反馈</div>
              <div class="grade-status2" v-if="item.status == 2">已反馈</div>
              <!-- <div class="grade-status3" v-if="item.status == 3">已过期</div> -->
            </div>
          </div>
          <div class="grade-detail" @click="activityDetail(item.businessId,item.type)">
            <div class="grade-time">
              <div class="detail-title" v-if="item.type == 1">活动时间</div>
              <div class="detail-title" v-else>督导时间</div>
              <div class="detail-content">{{ item.startTime }} 至 {{ item.endTime }}</div>
            </div>
            <div class="grade-time" v-if="item.type == 1">
              <div class="detail-title">活动地点</div>
              <div class="detail-content">{{ item.place }}</div>
            </div>
            <div class="grade-time" v-if="item.type == 1">
              <div class="detail-title">科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;室</div>
              <div class="detail-content">{{ item.deptName }}</div>
            </div>
          </div>
          <div class="btn-group">
            <van-button type="default" @click="picView(item.supervisorId)">查看照片</van-button>
            <!-- <van-button type="default" @click="picUpload">照片上传</van-button> -->
            <van-button
              type="default"
              @click="itemList(item.supervisorId,item.type,item.startTime,item.deptId,item.teachingActionType)"
            >督导反馈</van-button>
            <!-- <van-button
              v-if="item.status == 2"
              type="default"
              @click="itemList(item.supervisorId,item.type,item.startTime)"
            >反馈详情</van-button>-->
          </div>
        </div>
      </van-list>
    </div>
    <div v-else class="nodata">
      <img src="../../assets/images/overseer-no-data.png" />
      <div class="nodataText">暂无督导</div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import methods from "../../methods";
import cHeader from "@/views/header";
import { Toast, NavBar, Popup, Picker, col, Search, Button } from "vant";

export default {
  name: "supervise-grade",
  data() {
    return {
      title: "督导反馈",
      show1: false,
      show2: false,
      type: 0,
      status: 0,
      loading: false,
      finished: false,
      pageNum: 1,
      pageSize: 20,
      typeDefault: 0,
      statusDefault: 0,
      searchValue: "",
      types: [
        { type: "全部", value: 0 },
        { type: "教学活动", value: 1 },
        { type: "出科考核", value: 3 },
        { type: "医院管理", value: 2 }
      ],
      statuses: [
        { status: "全部", value: 0 },
        { status: "未反馈", value: 1 },
        { status: "已反馈", value: 2 }
        // { status: "已过期", value: 3 }
      ],
      gradeList: []
    };
  },
  created() {
    let self = this;
    self.getCbList();
  },
  computed: {
    rtType() {
      let self = this;
      if (self.type == 0) {
        return "全部";
      } else if (self.type == 1) {
        return "教学活动";
      } else if (self.type == 2) {
        return "医院管理";
      } else if (self.type == 3) {
        return "出科考核";
      } else {
        return "";
      }
    },
    rtStatus() {
      let self = this;
      if (self.status == 0) {
        return "全部";
      } else if (self.status == 1) {
        return "未反馈";
      } else if (self.status == 2) {
        return "已反馈";
      } else {
        return "";
      }
    }
  },
  methods: {
    ...methods,
    back() {
      // location.href = "/pages/futuredoctorapp/todo.html?view=application";
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
    },
    onLoad() {
      let self = this;
      self.pageNum += 1;
      let params = {
        command: "supervisor/supervisorEvaluate",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        keywords: self.searchValue,
        pageSize: self.pageSize,
        pageNum: self.pageNum,
        type: self.type ? self.type : null,
        status: self.status ? self.status : null
      };
      self.post("/supervisor/supervisorEvaluate", params).done(function(res) {
        console.log(self.loading, self.finished);
        console.log(res.result.records);
        if (res.result.records.length < self.pageSize) {
          self.finished = true;
          return;
        }
        self.gradeList.push(...res.result.records);
        self.loading = false;
      });
    },
    getCbList() {
      let self = this;
      self.pageNum = 1;
      let params = {
        command: "supervisor/supervisorFeedbackList",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        keywords: self.searchValue,
        pageSize: self.pageSize,
        pageNum: self.pageNum,
        type: self.type ? self.type : null,
        status: self.status ? self.status : null
      };
      self
        .post("/supervisor/supervisorFeedbackList", params)
        .done(function(res) {
          // console.log(res.result.list)
          self.gradeList = res.result.records;
          if (res.result.records.length < self.pageSize) {
            self.finished = true;

            return;
          }
        });
    },
    selectType() {
      let self = this;
      self.show2 = false;
      self.show1 = true;
    },
    selectStatus() {
      let self = this;
      self.show1 = false;
      self.show2 = true;
    },
    onConfirm1(v, i) {
      console.log(v, i);
      let self = this;
      self.type = v.value;
      self.typeDefault = i;
      self.show1 = false;
      self.show2 = false;
      self.getCbList();
    },
    onConfirm2(v, i) {
      console.log(v, i);
      let self = this;
      self.statusDefault = i;
      self.status = v.value;
      self.show1 = false;
      self.show2 = false;
      self.getCbList();
    },
    onCancel1() {
      let self = this;
      console.log(self.typeDefault);
      self.$refs.typeCheck.setColumnIndex(0, self.typeDefault);
      self.show1 = false;
      self.show2 = false;
    },
    onCancel2() {
      let self = this;
      console.log(self.$refs.statusCheck);
      self.show1 = false;
      self.show2 = false;
    },

    onSearch() {
      let self = this;
      self.getCbList();
      console.log(self.searchValue);
    },
    activityDetail(id, type) {
      // this.$router.push({
      //   name: "activity_detail"
      // });
      // this.$router.push({
      //     name: 'fdAction_detail',
      //     query: {
      //       id: 13231,
      //       ishistory: false,
      //       isOverseer: true
      //     }
      // })
      console.log(type);
      if (type == 1) {
        this.$router.push({
          name: "activity_detail",
          query: {
            id: id,
            ishistory: false,
            isOverseer: true,
            grade: false
          }
        });
      } else {
        return;
      }
    },
    overseerGrade() {
      this.$router.push({
        name: "overseer_grade"
      });
    },
    picUpload() {
      this.$router.push({
        name: "pic_upload"
      });
    },
    feedbackView() {
      this.$router.push({
        name: "feedback_view"
      });
    },
    picView(supervisorId) {
      this.$router.push({
        name: "pic_view",
        query: {
          supervisorId: supervisorId
        }
      });
    },
    itemList(supervisorId, lx, startTime,deptId,teachingActionType) {
      if (new Date().getTime() < new Date(startTime).getTime()) {
        Toast("督导时间未到,不可反馈!");
      } else {
        let type;
        if (lx == 1) {
          type = 2;
        } else if (lx == 2) {
          type = 6;
        } else if (lx == 3) {
          type = 4;
        } else {
          Toast("数据异常!");
        }
        this.$router.push({
          name: "couple_back_item_list",
          query: {
            supervisorId: supervisorId,
            type: type,
            deptId: deptId,
            teachingActionType: teachingActionType
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.overseer-grade {
  .select-menu {
    height: 46px;
    margin-top: 46px;
    display: flex;
    justify-content: space-around;
    background: #ffffff;
    .select-item {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .grade-list {
    height: 100vh;
    background: #f6f6f6;
    .grade-content {
      background: #ffffff;
      border-radius: 6px;
      margin: 12px 12px;
      // padding: 6px 0px;
      // height: 172px;
      display: flex;
      flex-direction: column;
      .grade-title {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 5px 0px;
        .grade-headline {
          flex: 4;
          margin: 12px;
          font-size: 16px;
          color: #111111;
          letter-spacing: 0.2px;
          font-weight: 600;
        }
        .status-box {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        .grade-status1 {
          line-height: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 16px;
          width: 43px;
          background-image: linear-gradient(114deg, #ffc252 0%, #f9971e 100%);
          border-radius: 8.5px;
          margin-right: 14px;
          font-size: 10px;
          color: #ffffff;
          letter-spacing: 0.13px;
          font-weight: 500;
        }
        .grade-status2 {
          line-height: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 16px;
          width: 43px;
          background-image: linear-gradient(-54deg, #0076f5 1%, #67b1ff 100%);
          border-radius: 8.5px;
          margin-right: 14px;
          font-size: 10px;
          color: #ffffff;
          letter-spacing: 0.13px;
          font-weight: 500;
        }
        .grade-status3 {
          line-height: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 16px;
          width: 43px;
          background-image: linear-gradient(114deg, #d1d1d1 0%, #adadad 100%);
          border-radius: 8.5px;
          margin-right: 14px;
          font-size: 10px;
          color: #ffffff;
          letter-spacing: 0.13px;
          font-weight: 500;
        }
      }
      .grade-detail {
        flex: 2;
        margin-left: 14px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        .grade-time {
          display: flex;
          .detail-title {
            flex: 1;
            font-size: 14px;
            color: #999999;
            letter-spacing: 0.2px;
            font-weight: 400;
            width: 60px;
          }
          .detail-content {
            flex: 4;
            margin-left: 14px;
            font-size: 14px;
            color: #111111;
            letter-spacing: 0.2px;
            font-weight: 400;
          }
        }
      }
      .btn-group {
        margin: 12px 0px;
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: row-reverse;
      }
    }
  }
  .nodata {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 60px;
    top: 150px;
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
}
</style>

<style lang="scss">
.overseer-grade {
  /* .van-nav-bar {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
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
  } */
  .van-nav-bar {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    .van-nav-bar__content {
      width: 100%;
    }
    .van-nav-bar__left {
      bottom: auto;
      .van-icon {
        color: #111111;
        font-size: 24px;
        line-height: 46px;
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
  .select-menu {
    .select-item {
      .se-text {
        &.active {
          color: #2f7dcd;
        }
      }
      .van-icon {
        transform: rotate(90deg);
        &.active {
          color: #2f7dcd;
          transform: rotate(-90deg);
        }
      }
    }
  }
  .van-picker {
    .van-picker__cancel {
      line-height: 44px;
    }
    .van-picker__title {
      line-height: 44px;
    }
    .van-picker__confirm {
      line-height: 44px;
    }
  }
  .van-search {
    padding-top: 0px;
    margin-bottom: 12px;
    .van-field__left-icon {
      display: flex;
      align-items: center;
      .van-icon {
        margin-top: 4px;
      }
    }
  }
  .grade-content {
    .btn-group {
      .van-button {
        height: 28px;
        line-height: 28px;
        margin-right: 8px;
      }
    }
  }
}
</style>


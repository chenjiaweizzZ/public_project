<template>
  <div class="homeAssign">
    <div class="matterWaiting">
      <div class="topTitle">
        <span class="topTitleLeft">待办事项</span>
        <span class="topTitleRight">
          <span class="topTitleRightTitle" @click="skipTask">更多</span>
          <span class="arrow-right"></span>
        </span>
      </div>
      <div class="matterWaitingContentList" v-if="matterList.length > 0">
        <img src="../../../../assets/images/index-waiting-bg.png" class="waiting-bg" />
        <div class="matterWaitingContent" v-for="(item, index) in matterList" :key="index" @click="skip1(item)">
          <img src="../../../../assets/images/index-unread.png" v-if="item.read == 0" />
          <img src="../../../../assets/images/index-read.png" v-else />
          <span class="matterContent" :class="{ contentRead: item.read == 1 }">{{ item.taskname }}</span>
        </div>
      </div>
      <div class="matterWaitingNoData" v-else>—&nbsp;&nbsp;暂无待办&nbsp;&nbsp;—</div>
    </div>
  </div>
</template>


<script>
import methods from "@/methods";
export default {
  name: "homeAssign",

  data() {
    return {
      matterList: []
    };
  },
  mounted() { },
  created() {
    this.getWaitingList()
  },
  methods: {
    ...methods,
    getWaitingList() {
      let self = this;
      self
        .post("/task/queryusertaskinfo", {
          command: "task/queryusertaskinfo",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid"),
          page: 1,
          reqnum: 3,
          showendtime: "",
          showstarttime: "",
          state: 0,
          taskname: "",
          tasktype: "",
          filterTasktypeList: ["19"]
        })
        .done(function (res) {
          self.matterList = res.tasklist;
        });
    },
    skipTask() {
      // this.$router.push({
      //   name: "wxTodo",
      // });
      window.location.href =
        "/pages/futuredoctorapp/index.html/#/wxIndex";
      // location.href = "/pages/futuredoctorapp/todo.html?view=task";
      // if(this.$route.query.stem) {
      //   this.$router.push({
      //   name: "wxMenu",
      //   });
      // }else {
      //   this.$router.push({
      //   name: "wxIndex",
      //   });
      // }
    },
    skip1(param) {
      let self = this;
      self
        .post("/task/readUserTask", {
          command: "task/readUserTask",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid"),
          id: param.id
        })
        .done(function (res) { });
      self
        .post("/commparaconf/querycommparaconflist", {
          command: "commparaconf/querycommparaconflist",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          paramcode: "appHomePageMenusId",
          paramvalue: param.tasktype
        })
        .done(res => {
          localStorage.setItem("menuId", res.commparaconflist[0].param1);
          if (param.tasktype == 14) this.gototurn14(param);
          else if (param.tasktype == 15) this.gototurn15(param);
          else if (param.tasktype == 16) this.gototurn16(param);
          else if (param.tasktype == 17) this.gototurn17(param);
          else if (param.tasktype == 19)
            window.location.href =
              "/pages/futuredoctorapp/" + param.taskurl + "&ishistory=false";
          //+"&id=" + param.id
          else if (param.tasktype == 20)
            window.location.href = "/pages/futuredoctorapp/" + param.taskurl;
          //反馈
          else if (param.tasktype == 21)
            window.location.href = "/pages/futuredoctorapp/" + param.taskurl;
          //实习生评价老师
          else if (param.tasktype == 22)
            window.location.href = "/pages/futuredoctorapp/" + param.taskurl;
          //出科考核
          else if (param.tasktype == 23)
            window.location.href = "/pages/futuredoctorapp/" + param.taskurl;
          else if (param.tasktype == 24)
            window.location.href = "/pages/futuredoctorapp/" + param.taskurl;
          else if (param.tasktype == 27)
            window.location.href = "/pages/futuredoctorapp/" + param.taskurl;
          // 出科考核
          else if (param.tasktype == 28)
            window.location.href = "/pages/futuredoctorapp/" + param.taskurl;
          else if (param.tasktype == 29)
            window.location.href = "/pages/futuredoctorapp/" + param.taskurl;
          // 实习生出科考核
          else if (param.tasktype == 33)
            window.location.href =
              "/pages/futuredoctorapp/" +
              param.taskurl +
              "?predefine5=" +
              param.predefine5;
          else if (
            param.tasktype == 31 ||
            param.tasktype == 32 ||
            param.tasktype == 30
          )
            window.location.href = "/pages/futuredoctorapp/" + param.taskurl;
          else if (param.tasktype == 18)
            window.location.href = "/pages/futuredoctorapp/" + param.taskurl;
          else if (param.tasktype == 34)
            window.location.href = "/pages/futuredoctorapp/" + param.taskurl;
          else if (param.tasktype == 7)
            window.location.href = "/pages/futuredoctorapp/" + param.taskurl;
        });
    },
    gototurn15(param) {
      let self = this;
      let data = {
        command: "commparaconf/queryCommparaConfList",
        loginid: $.cookie("uid"),
        sessionid: $.cookie("sid"),
        paramcode: "ck_settings",
        paramvalue: "7"
      };

      self.post("/commparaconf/queryCommparaConfList", data).done(res => {
        if (
          Array.isArray(res.commparaConfList) &&
          res.commparaConfList.length > 0
        ) {
          let pjTime =
            new Date(param.endtime) -
            Number(res.commparaConfList[0].param1) * 86400;
          let nowTime = Math.round(new Date().getTime() / 1000);
          if (pjTime > nowTime) {
            Toast("未到出科评价时间！");
          } else {
            window.location.href =
              "/pages/futuredoctorapp/" +
              param.taskurl +
              "&message=1&taskid=" +
              param.id +
              "&id=" +
              param.sourceid +
              "&param=1";
          }
        }
      });
    },
    gototurn16(param) {
      let self = this;
      let data = {
        command: "commparaconf/queryCommparaConfList",
        loginid: $.cookie("uid"),
        sessionid: $.cookie("sid"),
        paramcode: "ck_settings",
        paramvalue: "7"
      };

      self.post("/commparaconf/queryCommparaConfList", data).done(res => {
        console.log(res);
        if (
          Array.isArray(res.commparaConfList) &&
          res.commparaConfList.length > 0
        ) {
          let pjTime =
            new Date(param.endtime) -
            Number(res.commparaConfList[0].param1) * 86400;
          let nowTime = Math.round(new Date().getTime() / 1000);
          if (pjTime > nowTime) {
            Toast("未到出科评价时间！");
          } else {
            window.location.href =
              "/pages/futuredoctorapp/" +
              param.taskurl +
              "&message=1&taskid=" +
              param.id +
              "&id=" +
              param.sourceid +
              "&param=2";
          }
        }
      });
    },
    gototurn14(param) {
      let self = this;
      let data = {
        command: "commparaconf/queryCommparaConfList",
        loginid: $.cookie("uid"),
        sessionid: $.cookie("sid"),
        paramcode: "ck_settings",
        paramvalue: "7"
      };

      self.post("/commparaconf/queryCommparaConfList", data).done(res => {
        if (
          Array.isArray(res.commparaConfList) &&
          res.commparaConfList.length > 0
        ) {
          let pjTime =
            new Date(param.endtime) -
            Number(res.commparaConfList[0].param1) * 86400;
          let nowTime = Math.round(new Date().getTime() / 1000);
          if (pjTime > nowTime) {
            Toast("未到出科评价时间！");
          } else {
            window.location.href =
              "/pages/futuredoctorapp/" +
              param.taskurl +
              "&message=1&businessId=" +
              param.sourceid +
              "&taskid=" +
              param.id;
          }
        }
      });
    },
    gototurn17(param) {
      let self = this;
      let data = {
        command: "commparaconf/queryCommparaConfList",
        loginid: $.cookie("uid"),
        sessionid: $.cookie("sid"),
        paramcode: "ck_settings",
        paramvalue: "7"
      };

      self.post("/commparaconf/queryCommparaConfList", data).done(res => {
        if (
          Array.isArray(res.commparaConfList) &&
          res.commparaConfList.length > 0
        ) {
          let pjTime =
            new Date(param.endtime) -
            Number(res.commparaConfList[0].param1) * 86400;
          let nowTime = Math.round(new Date().getTime() / 1000);
          if (pjTime > nowTime) {
            Toast("未到出科评价时间！");
          } else {
            window.location.href =
              "/pages/futuredoctorapp/" +
              param.taskurl +
              "&message=1&taskid=" +
              param.id +
              "&businessId=" +
              param.sourceid;
          }
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.matterWaiting {
  padding: 0px 14px;
  background-color: #ffffff;
  margin-bottom: 10px;
  padding-bottom: 16px;

  .topTitle {
    height: 43px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .topTitleLeft {
      font-size: 17px;
      color: #444444;
      font-weight: 500;
    }

    .topTitleRight {
      .topTitleRightTitle {
        font-size: 13px;
        color: #999999;
        letter-spacing: 0.2px;
        text-align: right;
        font-weight: 400;
      }

      .arrow-right {
        height: 20px;
        width: 10px;
        display: inline-block;
        position: relative;
      }

      .arrow-right::after {
        content: "";
        height: 7px;
        width: 7px;
        top: 11px;
        border-width: 1px 1px 0 0;
        border-color: #999999;
        border-style: solid;
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        position: absolute;
      }
    }
  }

  .matterWaitingContentList {
    height: 120px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .waiting-bg {
      width: 100%;
      position: absolute;
    }

    .matterWaitingContent {
      display: flex;
      align-items: center;
      z-index: 1;
      margin-left: 16px;

      img {
        width: 16px;
        height: 16px;
      }

      .matterContent {
        font-size: 15px;
        color: #111111;
        letter-spacing: 0.21px;
        line-height: 21px;
        font-weight: 400;
        margin-left: 10px;

        &.contentRead {
          opacity: 0.6;
        }
      }

      .matterNumber {
        font-size: 15px;
        color: #2f7dcd;
        letter-spacing: 0.21px;
        line-height: 21px;
        font-weight: 500;
      }
    }
  }

  .matterWaitingNoData {
    height: 102px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #868e97;
    text-align: center;
    line-height: 22px;
    font-weight: 400;
  }
}</style>
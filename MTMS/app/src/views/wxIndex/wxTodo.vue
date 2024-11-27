<template>
  <div class="wxTodo">
    <van-nav-bar :title="title" left-text left-arrow @click-left="back" @click-right="filter">
      <template #right>
        <van-icon name="apps-o" size="26" />
      </template>
    </van-nav-bar>
    <div class="wxTodoList">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
        <div class="wxTodoListItem" v-for="value in taskList" :key="value">
          <template
            v-if="value.tasktype == 18 || value.tasktype == 30 || value.tasktype == 31 || value.tasktype == 32 || value.tasktype == 33">
            <div class="todo-title">{{ value.taskname }}</div>
            <div class="todo-content">{{ value.predefine3 }}</div>
            <div class="todo-content">{{ value.predefine4 }}</div>
            <div class="button-group">
              <van-button type="info" size="small" plain @click="gototurn(value)"
                v-if="value.tasktype == 33 || value.tasktype == 18 || value.tasktype == 30 || value.tasktype == 32">入科确认</van-button>
              <van-button type="info" size="small" plain v-if="value.tasktype == 31"
                @click="gototurn(value)">出科</van-button>
            </div>
          </template>
          <template v-if="value.tasktype == 27">
            <div class="todo-title">{{ value.taskname }}</div>
            <div class="todo-content">考核项目:{{ value.predefine3 }}</div>
            <div class="todo-content">考官:{{ value.predefine4 }}</div>
            <div class="todo-content">考核时间:{{ value.starttime | totime }}—{{ value.endtime | totime }}</div>
            <div class="todo-content">考核地点:{{ value.predefine5 }}</div>
            <div class="todo-content">{{ value.createdtimestr }}</div>
            <div class="button-group">
              <van-button type="info" size="small" plain @click="gototurn(value)">考核</van-button>
            </div>
          </template>
          <template v-if="value.tasktype == 29">
            <div class="todo-title">{{ value.taskname }}</div>
            <div class="todo-content">考核项目:{{ value.predefine3 }}</div>
            <div class="todo-content">考官:{{ value.predefine4 }}</div>
            <div class="todo-content">考核时间:{{ value.starttime | totime }}—{{ value.endtime | totime }}</div>
            <div class="todo-content">考核地点:{{ value.predefine5 }}</div>
            <div class="todo-content">{{ value.createdtimestr }}</div>
            <div class="button-group">
              <van-button type="info" size="small" plain @click="gototurn(value)">考核</van-button>
            </div>
            <van-tag mark v-if="value.predefine1 == -1">已过期</van-tag>
          </template>
          <template v-if="value.tasktype == 14 || value.tasktype == 15 || value.tasktype == 16 || value.tasktype == 17">
            <div class="todo-title">{{ value.taskname }}</div>
            <div class="todo-content">轮转科室:{{ value.predefine3 }}</div>
            <div class="todo-content">轮转时间:{{ value.starttime | todate }}——{{ value.endtime | todate }}</div>
            <div class="todo-content">请在{{ value.predefine4 }}前完成评价。</div>
            <div class="todo-content">{{ value.predefine5 }}</div>
            <div class="button-group">
              <van-button type="info" size="small" plain @click="gototurn(value)">评价</van-button>
            </div>
          </template>
          <template v-if="value.tasktype == 19">
            <div class="todo-title">{{ value.taskname }}</div>
            <div class="todo-content">活动类型:{{ value.predefine3 }}</div>
            <div class="todo-content">主讲人:{{ value.predefine6 }}</div>
            <div class="todo-content">活动时间:{{ value.starttime | totime }} - {{ value.endtime | totime }}</div>
            <div class="todo-content">活动地点:{{ value.predefine5 }}</div>
            <div class="todo-content">{{ value.predefine4 }}</div>
            <div class="button-group">
              <van-button type="info" size="small" plain @click="gototurn(value)">上传图片</van-button>
            </div>
            <van-tag mark v-if="value.predefine1 == -1">已过期</van-tag>
          </template>
          <template v-if="value.tasktype == 20">
            <div class="todo-title">{{ value.taskname }}</div>
            <div class="todo-content">活动类型:{{ value.predefine3 }}</div>
            <div class="todo-content">主讲人:{{ value.predefine6 }}</div>
            <div class="todo-content">活动时间:{{ value.starttime | totime }} - {{ value.endtime | totime }}</div>
            <div class="todo-content">活动地点:{{ value.predefine5 }}</div>
            <div class="todo-content">{{ value.predefine4 }}</div>
            <div class="button-group">
              <van-button type="info" size="small" plain @click="gototurn(value)">反馈</van-button>
            </div>
            <van-tag mark v-if="value.predefine1 == -1">已过期</van-tag>
          </template>
          <template v-if="value.tasktype == 21">
            <div class="todo-title">{{ value.taskname }}</div>
            <div class="todo-content">轮转科室:{{ value.predefine3 }}</div>
            <div class="todo-content">轮转时间:{{ value.starttime | todate }}——{{ value.endtime | todate }}</div>
            <div class="todo-content">请在{{ value.predefine4 }}前完成评价，过期则不能评价。</div>
            <div class="todo-content">{{ value.predefine5 }}</div>
            <div class="button-group">
              <van-button type="info" size="small" plain @click="gototurn(value)">评价</van-button>
            </div>
            <van-tag mark v-if="value.predefine1 == -1">已过期</van-tag>
          </template>
          <template v-if="value.tasktype == 22">
            <div class="todo-title">{{ value.taskname }}</div>
            <div class="todo-content">轮转科室:{{ value.predefine3 }}</div>
            <div class="todo-content">轮转时间:{{ value.starttime | todate }}——{{ value.endtime | todate }}</div>
            <div class="todo-content">请在{{ value.predefine4 }}前完成评价，过期则不能评价。</div>
            <div class="todo-content">{{ value.predefine5 }}</div>
            <div class="button-group">
              <van-button type="info" size="small" plain @click="gototurn(value)">评价</van-button>
            </div>
            <van-tag mark v-if="value.predefine1 == -1">已过期</van-tag>
          </template>
          <template v-if="value.tasktype == 23">
            <div class="todo-title">{{ value.taskname }}</div>
            <div class="todo-content">轮转科室:{{ value.predefine3 }}</div>
            <div class="todo-content">轮转科室:{{ value.predefine3 }}</div>
            <div class="todo-content">请在{{ value.predefine4 }}前完成评价，过期则不能评价。</div>
            <div class="todo-content">{{ value.predefine5 }}</div>
            <div class="button-group">
              <van-button type="info" size="small" plain @click="gototurn(value)">评价</van-button>
            </div>
            <van-tag mark v-if="value.predefine1 == -1">已过期</van-tag>
          </template>
          <template v-if="value.tasktype == 24">
            <div class="todo-title">{{ value.taskname }}</div>
            <div class="todo-content">轮转科室:{{ value.predefine3 }}</div>
            <div class="todo-content">轮转时间:{{ value.starttime | todate }}——{{ value.endtime | todate }}</div>
            <div class="todo-content">请在{{ value.predefine4 }}前完成评价，过期则不能评价。</div>
            <div class="todo-content">{{ value.predefine5 }}</div>
            <div class="button-group">
              <van-button type="info" size="small" plain @click="gototurn(value)">评价</van-button>
            </div>
            <van-tag mark v-if="value.predefine1 == -1">已过期</van-tag>
          </template>
          <template v-if="value.tasktype == 1">
            <div @click="gototurn(value)">
              <div class="todo-title">个人</div>
              <div class="todo-title">{{ value.taskname }}</div>
              <div class="todo-content">{{ value.showTimeStr }}</div>
            </div>

          </template>
          <template v-if="value.tasktype == 2">
            <div @click="gototurn(value)">
              <div class="todo-title">班级</div>
              <div class="todo-title">{{ value.taskname }}</div>
              <div class="todo-content">{{ value.showTimeStr }}</div>
            </div>

          </template>
          <template v-if="value.tasktype == 25">
            <div @click="gototurn(value)">
              <div class="todo-title">其他</div>
              <div class="todo-title">{{ value.taskname }}</div>
              <div class="todo-content">{{ value.showTimeStr }}</div>
            </div>

          </template>
          <template v-if="value.tasktype == 3">
            <div @click="gototurn(value)">
              <div class="todo-title">出科</div>
              <div class="todo-title">{{ value.taskname }}</div>
              <div class="todo-content">{{ value.showTimeStr }}</div>
            </div>

          </template>
          <template v-if="value.tasktype == 6">
            <div @click="gototurn(value)">
              <div class="todo-title">上课</div>
              <div class="todo-title">{{ value.taskname }}</div>
              <div class="todo-content">{{ value.showTimeStr }}</div>
            </div>

          </template>
          <template v-if="value.tasktype == 5">
            <div @click="gototurn(value)">
              <div class="todo-title">评教</div>
              <div class="todo-title">{{ value.taskname }}</div>
              <div class="todo-content">{{ value.showTimeStr }}</div>
            </div>

          </template>
          <template v-if="value.tasktype == 7">
            <div @click="gototurn(value)">
              <div class="todo-title">问卷</div>
              <div class="todo-title">{{ value.taskname }}</div>
              <div class="todo-content">{{ value.createdtimestr }}</div>
            </div>

          </template>
          <template v-if="value.tasktype == 8">
            <div @click="gototurn(value)">
              <div class="todo-title">训练</div>
              <div class="todo-title">{{ value.taskname }}</div>
              <div class="todo-content">{{ value.createdtimestr }}</div>
            </div>

          </template>
          <template v-if="value.tasktype == 9">
            <div @click="gototurn(value)">
              <div class="todo-title">随堂小测</div>
              <div class="todo-title">{{ value.taskname }}</div>
              <div class="todo-content">{{ value.createdtimestr }}</div>
            </div>

          </template>
          <template v-if="value.tasktype == 12">
            <div @click="gototurn(value)">
              <div class="todo-title">审核</div>
              <div class="todo-title">{{ value.taskname }}</div>
              <div class="todo-content">{{ value.createdtimestr }}</div>
            </div>

          </template>
          <template v-if="value.tasktype == 34">
            <div @click="gototurn(value)">
              <div class="todo-title">{{ value.taskname }}</div>
              <div class="todo-title">{{ value.predefine3 }}</div>
              <div class="todo-content">{{ value.predefine5 }}</div>
            </div>

          </template>
          <template v-if="value.tasktype == 28">
            <div @click="gototurn(value)">
              <div class="todo-title2">{{ value.taskname }}</div>
              <div class="todo-content">{{ value.createdtimestr }}</div>
              <van-tag round type="primary">{{ value.tasktypename }}</van-tag>
            </div>

          </template>
        </div>
      </van-list>
    </div>
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker show-toolbar :columns="typeList" @cancel="showPicker = false" @confirm="onConfirm"
        value-key="taskname" />
    </van-popup>
  </div>
</template>


<script>
import $ from "jquery";
import methods from "../../methods";
import { Toast } from "vant";
export default {
  name: "wxTodo",
  data() {
    return {
      title: "待办事项",
      typeList: [],
      showPicker: false,
      pageIndex: 1,
      pageSize: 20,
      tasktype: "",
      taskList: [],
      loading: false,
      finished: false,
    };
  },
  created() {
    this.getTypeList();
    this.getTaskList();
  },
  filters: {
    day: function (val) {
      if (val == 5) return "今天";
      if (val == 6) return "明天、后天";
    },
    todate: function (value) {
      if (value) {
        var t = new Date(value * 1000);
        var y = t.getFullYear();
        var m = t.getMonth() + 1;
        var d = t.getDate();
        return y + "年" + m + "月" + d + "日";
      }
    },
    totime: function (value) {
      if (value) {
        var t = new Date(value * 1000);
        var y = t.getFullYear();
        var m = t.getMonth() + 1;
        var d = t.getDate();
        var s = t.getHours();
        var f = t.getMinutes();
        return y + "年" + m + "月" + d + "日" + s + "时" + f + "分";
      }
    },
    today: function (value) {
      if (value) {
        var t = new Date(value * 1000);
        var y = t.getFullYear();
        var m = t.getMonth() + 1;
        var d = t.getDate();
        var s = t.getHours();
        var f = t.getMinutes();
        return y + "-" + m + "-" + d + " " + s + ":" + f;
      }
    },
  },
  methods: {
    ...methods,
    back() {
      self.$router.push({
        name: "wxIndex",
      });
    },
    onLoad() {
      let self = this;
      this.pageIndex += 1;
      self.post("/task/queryusertaskinfo", {
        command: "task/queryusertaskinfo",
        loginid: $.cookie("uid"),
        sessionid: $.cookie("sid"),
        uid: $.cookie("uid"),
        page: this.pageIndex,
        reqnum: this.pageSize,
        tasktype: this.tasktype,
        filterTasktypeList: ["19"],
      }).done(res => {
        if (res.tasklist.length < this.pageSize) {
          self.finished = true;
        }
        this.taskList.push(...res.tasklist);
        self.loading = false;
      })
    },
    getTypeList() {
      let self = this;
      self
        .post("/task/querytasktype", {
          command: "task/querytasktype",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
        })
        .done((res) => {
          res.tasktypelist.unshift({ taskname: "全部", tasktype: "" })
          self.typeList = res.tasktypelist;
        });
    },
    getTaskList() {
      let self = this;
      self.post("/task/queryusertaskinfo", {
        command: "task/queryusertaskinfo",
        loginid: $.cookie("uid"),
        sessionid: $.cookie("sid"),
        uid: $.cookie("uid"),
        page: this.pageIndex,
        reqnum: this.pageSize,
        tasktype: this.tasktype,
        filterTasktypeList: ["19"],
      }).done(res => {
        if (res.tasklist.length < this.pageSize) {
          self.finished = true;
        }
        this.taskList = res.tasklist;
        self.loading = false;
      })
    },
    filter() {
      this.showPicker = true;
    },
    onConfirm(values) {
      this.tasktype = values.tasktype
      this.pageIndex = 1
      this.finished = false;
      this.getTaskList()
      this.showPicker = false
    },
    gototurn: function (param) {
      console.log(param)
      let self = this
      self.post("/commparaconf/querycommparaconflist", {
        command: 'commparaconf/querycommparaconflist',
        loginid: $.cookie("uid"),
        sessionid: $.cookie("sid"),
        paramcode: 'appHomePageMenusId',
        paramvalue: param.tasktype
      }).done(res => {
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
      })
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
  },
};
</script>

<style lang="scss" scoped>
.wxTodo {
  .wxTodoList {
    margin-top: 48px;

    .wxTodoListItem {
      background: #fff;
      margin: 6px;
      border-radius: 6px;
      box-shadow: 0 0 3px #ccc;
      padding: 0.35rem;
      position: relative;

      &:active {
        background: rgb(239, 239, 239);
      }

      .todo-title {
        font-size: 18px;
        font-weight: 600;
        color: #333333;
        margin-bottom: 5px;
      }

      .todo-title2 {
        font-size: 18px;
        font-weight: 600;
        color: #333333;
        margin-top: 10px;
      }

      .todo-content {
        font-size: 15px;
        color: #333333;
      }

      .button-group {
        display: flex;
        flex-direction: row-reverse;
      }
    }
  }
}
</style>

<style lang="scss">
.wxTodo {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: scroll;

  .van-tag {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .van-button {
    border-radius: 5px;
    padding: 0px 15px;
    font-size: 14px;
  }

  .van-nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    background: #fff;

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
      height: 46px;

      .van-nav-bar__text {
        color: #111111;
        font-size: 18px;
      }

      i {
        color: #111;
      }
    }
  }
}
</style>
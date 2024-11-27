<template>
  <div class="first-page">
    <div class="top">
      <div class="left">
        <div class="left-title">
          <span>近期教学讨论</span>
          <span class="button-left" @click="checkTablecourse">课程表</span>
        </div>
        <div class="course-list self" v-if="courseList.length > 0">
          <div v-for="(item,index) in courseList" :key="index" class="list-item" v-if="index < 8">
            <p @click="checkPlan(item)" class="on-line">
              <span :style="{'background': typeList[item.type].bgCol,'color': typeList[item.type].textCol}" class="list-icon">{{item.typename}}</span>
              <span class="course-info">{{item.theme}} {{item.place}} {{item.speakerlist | speakeshowStr}}</span>
            </p>
            <p class="time-show">
              <span>{{item.actiontime[0].weekDay}} {{item.actiontime[0].newDate}} {{item.actiontime[0].startTime}}~{{item.actiontime[0].endTime}}</span>
              <el-tooltip placement="bottom" effect="light" popper-class="self-page">
                <img src="../../assets/images/icon-arrow.svg" class="arrow-img" v-if="item.actiontime.length > 1" />
                <div slot="content">
                  <p v-for="value in item.actiontime" class="toolTime">{{value.startTime}}~{{value.endTime}}</p>
                </div>
              </el-tooltip>
            </p>
          </div>
        </div>
        <div class="left-bottom" v-if="courseList.length > 0">
          <span>共{{total}}条</span>
          <span @click="checkTablecourse">查看更多</span>
        </div>
        <div class="img-nodata" v-if="courseList.length == 0">
          <img src="../../assets/images/nodata.png" class="noData" />
        </div>
      </div>
      <div class="right">
        <div class="right-title">
          <span>待办事项</span>
          <span class="red-dot">{{todoList.length}}</span>
        </div>
        <div class="todo-list" v-if="todoList.length > 0">
          <div v-for="(item,index) in todoList" :key="index" class="list-item todo-item" @click="goDetail(item)">
            <p>
              <img src="../../assets/images/icon-dbsx.svg" />
            </p>
            <p>{{item.temp}}</p>
          </div>
        </div>
        <div class="todo-list img-nodata" v-else>
          <img src="../../assets/images/nodata.png" class="noData" />
        </div>
      </div>
    </div>
    <div class="bottom" v-if="iszpManger">
      <p class="box-tips">人员情况</p>
      <div class="content">
        <div class="left-box">
          <div class="left-item">
            <span>分带教</span>
            <span class="yellowCol fontBold">{{deptTeacherStatistics['分带教']}}</span>
          </div>
          <!-- <div class="left-item">
            <span>基地秘书</span>
            <span class="greenCol fontBold">{{deptTeacherStatistics['基地秘书']}}</span>
          </div> -->
          <div class="left-item">
            <span>总带教</span>
            <span class="blueCol fontBold">{{deptTeacherStatistics['总带教']}}</span>
          </div>
          <div class="left-item">
            <span>护理部</span>
            <span class="orangeCol fontBold">{{deptTeacherStatistics['护培轮转管理者']}}</span>
          </div>
          <div class="left-item">
            <span>护士长</span>
            <span class="purpleCol fontBold">{{deptTeacherStatistics['护士长']}}</span>
          </div>
        </div>
        <div class="right-box">
          <div class="box" v-for="(item,index) in rightBoxTitle" :key="item.text" :class="'box' + index">
            <p class="box-title">
              <span>{{item.text}}</span>
              <span v-if="item.text == '护培生'">{{personnelStatisticsData.studentStatistics | totalPeople}}</span>
              <span v-else>{{turnRecordStatistics[item.key].total}}</span>
            </p>
            <div class="box-list">
              <p v-for="(val,index) in rightBox" :key="index">
                <span>{{val}}</span>
                <span v-if="item.text == '护培生'">{{personnelStatisticsData.studentStatistics[val] || 0}}</span>
                <span v-else>{{turnRecordStatistics[item.key]['detail'][val] || 0}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <teaching-plan :id="currentId" :activeplandialog.sync="activeplandialog"></teaching-plan>
  </div>
</template>
<script>
  import teachingPlan from "../../components/teachingPlan.vue";
  import { post, getCookie } from "../../config/util";
  import moment from "moment";
  import { mapState, mapActions } from "vuex";
  export default {
    data() {
      return {
        currentId: "",
        activeplandialog: false,
        courseList: [],
        deptTeacherStatistics: {},
        turnRecordStatistics: {},
        todoList: [],
        total: 0,
        color: [
          "#EAF9ED",
          "#FFF1D0",
          "#E7E0F5",
          "#CCEEF9",
          "#E1F1EC",
          "#FEE7DD",
          "#DCE8F9",
          "#EAEAEA"
        ],
        colorFont: [
          "#44B95C",
          "#F9AF00",
          "#8866CD",
          "#00AAE4",
          "#6EBCA2",
          "#FA8350",
          "#528FE0",
          "#999999"
        ],
        personnelStatisticsData: {},
        rightBox: [
          "大专",
          "本科",
          "专硕"
          // "四证合一",
          // "单位人",
          // "行业人",
          // "行业人/委培",
          // "行业人/订单定向",
          // "行业人/新疆委培",
          // "5+3"
        ],
        rightBoxTitle: [
          { text: "护培生", key: "studentStatistics", value: 0 },
          { text: "未轮转", key: "wait", value: 0 },
          { text: "轮转中", key: "run", value: 0 },
          { text: "已轮转", key: "end", value: 0 }
        ],
        typeList: {
          "1": { textCol: "#44B95C", bgCol: "#EAF9ED" },
          "2": { textCol: "#F9AF00", bgCol: "#FFF1D0" },
          "3": { textCol: "#8866CD", bgCol: "#E7E0F5" },
          "4": { textCol: "#6EBCA2", bgCol: "#E1F1EC" },
          "5": { textCol: "#00AAE4", bgCol: "#CCEEF9" },
          "6": { textCol: "#FA8350", bgCol: "#FEE7DD" },
          "7": { textCol: "#528FE0", bgCol: "#DCE8F9" },
          "8": { textCol: "#999999", bgCol: "#EAEAEA" }
        }
      };
    },
    components: {
      teachingPlan
    },
    filters: {
      totalPeople(item) {
        return item ? item.totalCount : 0
      },
      speakeshowStr(arg) {
        let str = "";
        if (arg && Array.isArray(arg)) {
          str = arg
            .map(
              item =>
                item.uname +
                (item.technique == null ? "" : "(" + item.technique + ")")
            )
            .join("、");
        }
        return str;
      }
    },
    computed: {
      ...mapState([
        "userRole"
      ]),
      iszpManger() {
        let flag = false
        console.log(this.userRole, "++++++++++")
        this.userRole.forEach(item => {
          if (item == 25) {
            flag = true
          }
        })
        return flag
      }
    },
    created() {
      this.initUserRole();
      this.listactionplan();
      this.personnelStatistics();
      this.getTodoList();

    },
    methods: {
      ...mapActions([
        "initUserRole",
      ]),
      goDetail(item) {
        if (item.type == 1) {
          // circleManage
          this.$router.push({
            name: "circleManage",
            query: {
              form: "wait"
            }
          });
        } else if (item.type == 2) {
          this.$router.push({
            name: "circleManage",
          });
        } else if (item.type == 4) {
          this.$router.push({
            name: "circleManage",
            query: {
              form: "waitOut"
            }
          });
        } else if (item.type == 3) {
          console.log(item, "iten");
          this.$router.push({
            name: "turnManualTeaCheck",
            query: {
              user: item.username
            }
          });
        }
      },
      getTodoList() {
        post("/home/listToDo", {
          command: "home/listToDo",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid")
        })
          .then(data => {
            console.log(data, "------------")
            if (data && data.errcode == 0) {
              let manualCheckPcListMap = data.result.manualCheckPcListMap.list;
              let runTurnRecordTimeoutMap =
                data.result.runTurnRecordTimeoutMap.list;
              let runTurnRecordWithoutTeacherMap =
                data.result.runTurnRecordWithoutTeacherMap.list;
              let waitTurnRecordMap = data.result.waitTurnRecordMap.list;
              waitTurnRecordMap.forEach(item => {
                let tempData = {
                  temp: "【" + item.dept + "】今日待入科" + item.count + "人",
                  type: 1
                };
                this.todoList.push(tempData);
              });
              runTurnRecordWithoutTeacherMap.forEach(item => {
                let tempData = {
                  temp: "【" + item.dept + "】待分配带教" + item.count + "人",
                  type: 2
                };
                this.todoList.push(tempData);
              });
              manualCheckPcListMap.forEach(item => {
                let tempData = {
                  temp: "【" + item.dept + "】1条轮转手册待审核",
                  username: item.username,
                  type: 3
                };
                this.todoList.push(tempData);
              });
              runTurnRecordTimeoutMap.forEach(item => {
                let tempData = {
                  temp: "【" + item.dept + "】今日待出科" + item.count + "人",
                  type: 4
                };
                this.todoList.push(tempData);
              });
              // this.todoList = data.result.list
              // this.deptTeacherStatistics = data.deptTeacherStatistics
              // this.turnRecordStatistics = data.turnRecordStatistics

              // let
            }
          })
          .catch(() => {
            this.$message.error({ message: "请求失败，请检查网络！" });
          });
      },
      personnelStatistics() {
        post("/home/personnelStatistics", {
          command: "home/personnelStatistics",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          clientflag: 0, //终端标志位0 pc 1 app
          turn_dept_id: [99]
        })
          .then(data => {
            if (data && data.errcode == 0) {
              this.personnelStatisticsData = data;
              this.deptTeacherStatistics = data.deptTeacherStatistics;
              this.turnRecordStatistics = data.turnRecordStatistics;
              console.log(this.personnelStatisticsData)
              // let
            }
          })
          .catch(() => {
            this.$message.error({ message: "请求失败，请检查网络！" });
          });
      },

      getWeek(dateString) {
        var dateArray = dateString.split("-");
        let date = new Date(dateArray[0], Number(dateArray[1]) - 1, dateArray[2]);
        return "星期" + "日一二三四五六".charAt(date.getDay());
      },
      listactionplan(option) {
        //右边table列表
        post("/home/listActionPlan", {
          command: "home/listActionPlan",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          uid: getCookie("uid"),
          clientflag: 0, //终端标志位0 pc 1 app
          page: 1, //查询页数
          reqnum: 8, //每页显示数
          starttime: moment(new Date()).format("YYYY-MM-DD"),
          endtime: moment(new Date()).format("YYYY-MM-DD")
        })
          .then(data => {
            if (data && data.errcode == 0) {
              let tempArr = data.result.beanlist.slice(0, 8) || [];
              tempArr.forEach(item => {
                let timeInfo = JSON.parse(item.actiontime);
                timeInfo.forEach(val => {
                  val.weekDay = this.getWeek(val.date);
                  let temp = val.date.split("-");
                  val.newDate = temp[1] + "/" + temp[2];
                });
                item.actiontime = timeInfo;
              });
              this.courseList = tempArr;
              this.total = data.result.count;
            }
          })
          .catch(() => {
            this.$message.error({ message: "请求失败，请检查网络！" });
          });
      },
      checkPlan(item) {
        this.activeplandialog = true;
        this.currentId = item.id;
      },
      checkTablecourse() {
        this.$router.push({ name: "tableCourse" });
      }
    }
  };
</script>
<style scoped>
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(144, 147, 153, 0.6);
    border-radius: 20px;
  }

  .arrow-img {
    width: 10px;
    position: absolute;
    right: -12px;
    top: 6px;
  }

  .noData {
    width: 280px;
    height: 162px;
    margin-top: 65px;
  }

  .img-nodata {
    text-align: center;
  }

  .on-line {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: calc(100% - 230px);
  }

  .course-info {
    width: calc(100% - 90px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 20px;
    margin-left: 8px;
  }

  .first-page {
    padding: 40px 20px;
    background: #fff;
    min-width: 1200px;
    padding-top: 15px;
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .left {
    width: calc(100% - 354px);
    min-width: 800px;
    min-height: 380px;
  }

  .right {
    width: 314px;
    height: 200px;
    flex-shrink: 0;
    min-height: 380px;
  }

  .left-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    color: #333333;
  }

  .button-left {
    display: inline-block;
    width: 104px;
    height: 40px;
    background: #f7ba2a;
    border-radius: 4px;
    color: #fff;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
  }

  .course-list {
    margin-top: 20px;
  }

  .todo-list {
    margin-top: 37px;
    height: 315px;
    overflow-y: auto;
  }

  .course-list p,
  .todo-item p {
    color: #111;
    font-size: 14px;
    margin: 0;
    margin-bottom: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .todo-item p {
    margin-bottom: 15px;
  }

  .course-list .time-show {
    position: relative;
    color: #666 !important;
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .todo-item {
    justify-content: flex-start;
  }

  .todo-item img {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }

  .course-list .list-icon {
    display: inline-block;
    font-size: 12px;
    padding: 0 8px;
    border-radius: 12px;
    height: 20px;
    line-height: 20px;
    font-weight: bold;
  }

  .left-bottom {
    width: 100%;
    text-align: right;
    color: #0080ff;
    font-size: 14px;
  }

  .left-bottom span:nth-child(1) {
    margin-right: 8px;
    color: #111;
  }

  .right-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 18px;
    color: #333333;
  }

  .red-dot {
    background: #db524b;
    border-radius: 12px;
    color: #fff;
    padding: 0 8px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    margin-left: 8px;
    margin-top: -2px;
  }

  .toolTime {
    margin-top: 8px;
    font-size: 14px;
    color: #111;
  }

  .toolTime:nth-child(1) {
    margin-top: 0px;
  }

  .bottom {
    width: 100%;
    margin-top: 40px;
  }

  .bottom .left-box {
    width: 18%;
    height: 300px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    flex-shrink: 0;
  }

  .bottom .left-item {
    width: calc(100% - 32px);
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    border-radius: 4px;
    font-size: 14px;
    color: #111111;
  }

  .bottom .left-item:nth-child(1) {
    background: #fff1d0;
  }

  .bottom .left-item:nth-child(2) {
    background: #d9f2de;
  }

  .bottom .left-item:nth-child(3) {
    background: #d1ecff;
  }

  .bottom .left-item:nth-child(4) {
    background: #fee7dd;
  }

  .bottom .left-item:nth-child(5) {
    background: #e7e0f5;
  }

  .fontBold {
    font-weight: bold;
  }

  .yellowCol {
    color: #ffb300;
    font-size: 18px;
  }

  .greenCol {
    color: #46c25f;
    font-size: 18px;
  }

  .blueCol {
    color: #0c9aff;
    font-size: 18px;
  }

  .orangeCol {
    color: #fa8350;
    font-size: 18px;
  }

  .purpleCol {
    color: #8866cd;
    font-size: 18px;
  }

  .content {
    margin-top: 20px;
  }

  .right-box,
  .content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .right-box {
    width: calc(82% - 40px);
    flex-shrink: 0;
    /* justify-content: flex-start; */
  }

  .bottom p {
    margin: 0;
  }

  .right-box .box {
    width: calc(25% - 30px);
    height: 300px;
    /* border: 1px solid #C0CBDA; */

    margin-right: 40px;
  }

  .right-box .box:nth-child(4) {
    margin-right: 0px;
  }

  .box-title {
    height: 44px;
    line-height: 44px;
    padding: 0 14px;
    font-size: 18px;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .box-title span {
    font-weight: bold;
  }

  .box-list {
    height: calc(100% - 44px);
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding: 0 12px;
    border: 1px solid #c0cbda;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    border-top: 1px solid transparent;
  }

  .box-list p {
    padding: 7px 0;
    font-size: 14px;
    color: #111111;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .box-list p span:nth-child(2) {
    color: #666;
  }

  .box-tips {
    font-size: 18px;
    color: #333333;
  }

  .box0 {
    background: url("../../assets/images/zhuyuanyi.png") 0 0 no-repeat;
    background-size: 100% 44px;
  }

  .box1 {
    background: url("../../assets/images/nolunzhuan.png") 0 0 no-repeat;
    background-size: 100% 44px;
  }

  .box2 {
    background: url("../../assets/images/lunzhuaning.png") 0 0 no-repeat;
    background-size: 100% 44px;
  }

  .box3 {
    background: url("../../assets/images/lunzhuan.png") 0 0 no-repeat;
    background-size: 100% 44px;
  }
</style>
<style>
  .self-page.el-tooltip__popper.is-light {
    border: 1px solid #dcdfe6 !important;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  }

  .self-page.el-tooltip__popper[x-placement^="bottom"] .popper__arrow {
    border-bottom-color: #dcdfe6 !important;
  }

  /* .self-page.el-tooltip__popper[x-placement^=bottom] .popper__arrow:after {
    border-bottom-color: #DCDFE6 !important;
  } */
/* 概况样式调整 */
  .left[data-v-e8eeb096]{
    min-height: 500px;
  }
  .right-box .box[data-v-e8eeb096]{
    height: 150px
  }
  .bottom .left-box[data-v-e8eeb096] {
    height: 250px;
}
</style>
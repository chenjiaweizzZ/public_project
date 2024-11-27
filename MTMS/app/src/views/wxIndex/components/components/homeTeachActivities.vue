<template>
  <div class="homeTeachActivities">
    <div class="activityToday">
      <div class="topTitle">
        <span class="topTitleLeft">今日教学活动</span>
        <span class="topTitleRight" @click="skipAct">
          <span class="topTitleRightTitle">更多</span>
          <span class="arrow-right"></span>
        </span>
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onload"
        :immediate-check="false"
      >
        <div class="actList" v-if="actList.length> 0">
          <span
            class="actItem"
            v-for="(item,index) in actList"
            :key="index"
            @click="skip2(item.id)"
          >
            <div class="actContent">
              <div class="actTop">
                <div class="acTitle">{{ item.theme }}</div>
                <el-row style="width: 8px"></el-row>
                <el-tag type="primary">{{ item.typename }}</el-tag>
              </div>
              <div class="aContent">
                <div class="contentText">
                  <div class="topicText">主&nbsp;&nbsp;讲&nbsp;&nbsp;人</div>
                  <div class="subText">
                    <span
                      v-for="(iten,indey) in item.speakerlist.slice(0,3)"
                      :key="indey"
                    >{{ iten.uname }}&nbsp;</span>
                  </div>
                </div>
                <div class="contentText">
                  <div class="topicText">科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;室</div>
                  <div class="subText">{{item.deptname}}</div>
                </div>
                <div class="contentText">
                  <div class="topicText">活动时间</div>
                  <div
                    class="subText"
                  >{{ item.starttimestr | getHourMinute}} - {{ item.endtimestr | getHourMinute}}</div>
                </div>
                <div class="contentText">
                  <div class="topicText">活动地点</div>
                  <div class="subText2">{{ item.place }}</div>
                </div>
              </div>
            </div>
          </span>
        </div>
        <div class="actNoData" v-else>—&nbsp;&nbsp;今日无活动&nbsp;&nbsp;—</div>
      </van-list>
    </div>
  </div>
</template>


<script>
import methods from "@/methods";
export default {
  name: "homeTeachActivities",
  data() {
    return {
        loading: false,
        finished: false,
        actList: [],
    };
  },
   props: {
      appList: {
        type: Array,
        default: []
      },
    },
  created() {
    this.getPlanList()
  },
  filters: {
    getHourMinute(time) {
      let date = new Date(time);
      if (date.getHours() < 10) {
        let newTime = "0" + date.getHours() + ":" + date.getMinutes();
        return newTime;
      } else {
        let newTime = date.getHours() + ":" + date.getMinutes();
        return newTime;
      }
    }
  },
  methods: {
    ...methods,
    getPlanList() {
      let self = this;
      self.pageNum += 1;
      self
        .post("/actionplan/listactionplan", {
          command: "actionplan/listactionplan",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid"),
          autobaselist: [],
          autohospitallist: [],
          autoofficelist: [],
          base: "",
          beforemonthindex: -1,
          clientflag: 1,
          endtime: self.getTime(),
          isself: "1",
          officelist: [],
          page: self.pageNum,
          reqnum: 10,
          speakername: "",
          starttime: self.getTime(),
          status: "",
          statuslist: [0, 1],
          type: "",
          yearmonth: "",
          apphomepageflag: 1
        })
        .done(function(res) {
          if (res.result.beanlist.length < 10) {
            self.actList = res.result.beanlist;
            self.finished = true;
            self.loading = false;
          } else {
            self.actList = res.result.beanlist;
          }
        //   if (self.userInfo.isGraduation == "0") {
        //     self.echartsInit();
        //   } else if (
        //     self.userInfo.isGraduation == "1" ||
        //     self.userInfo.isGraduation == "2"
        //   ) {
        //     self.echartsInit2();
        //   } else {
        //     return;
        //   }
        });
    },
    skipAct() {
      this.appList.forEach(i => {
          if(i.name == '教学活动计划') {
             localStorage.setItem("oprateMenu", JSON.stringify(i.children));
             localStorage.setItem("menuId", i.id);
          }
      })
      
      location.href = "/pages/futuredoctorapp/index.html/#/action/main/list";
    },
    getTime() {
      var date = new Date();
      let time =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      return time;
    },
    onload() {
      let self = this;
      self.pageNum += 1;
      self
        .post("/actionplan/listactionplan", {
          command: "actionplan/listactionplan",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid"),
          autobaselist: [],
          autohospitallist: [],
          autoofficelist: [],
          base: "",
          beforemonthindex: -1,
          clientflag: 1,
          endtime: self.getTime(),
          isself: "1",
          officelist: [],
          page: self.pageNum,
          reqnum: 20,
          speakername: "",
          starttime: self.getTime(),
          status: "",
          statuslist: [0, 1],
          type: "",
          yearmonth: ""
        })
        .done(function(res) {
          if (res.result.beanlist.length == 0) {
            self.finished = true;
            return;
          }
          self.actList.push(...res.result.beanlist);
          self.loading = false;
        });
    },
    skip2(id) {
      let self = this;
      this.appList.forEach(i => {
          if(i.name == '教学活动计划') {
             localStorage.setItem("oprateMenu", JSON.stringify(i.children));
             localStorage.setItem("menuId", i.id);
          }
      })
      this.$router.push({
        name: "fdAction_detail",
        query: {
          id: id,
          ishistory: false
        }
      });
    },
  }
    
};
</script>

<style lang="scss" scoped>
.activityToday {
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
    .actList {
      .actItem {
        margin-bottom: 8px;
        height: 132px;
        display: flex;
        border: 0.5px solid rgba(221, 221, 221, 1);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04);
        border-radius: 3px 6px 6px 3px;
        .actContent {
          margin: 8px 0px 8px 19px;
          width: calc(90%);
          .actTop {
            display: flex;
            align-items: center;
            padding-bottom: 8px;
            max-height: 28px;
            .acTitle {
              font-size: 16px;
              color: #111111;
              letter-spacing: 0.2px;
              font-weight: 500;
              height: 20px;
              line-height: 20px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 280px;
            }
            .acTag {
              margin-left: 8px;
              height: 16px;
              font-size: 12px;
              color: #2f7dcd;
              letter-spacing: 0.21px;
              line-height: 14px;
              font-weight: 400;
              min-width: 58px;
            }
          }
          .aContent {
            height: 86px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .contentText {
              display: flex;
              .topicText {
                width: 57px;
                font-size: 14px;
                color: #999999;
                letter-spacing: -0.7px;
                font-weight: 400;
              }
              .subText {
                font-size: 14px;
                color: #111111;
                letter-spacing: 0.2px;
                font-weight: 400;
                padding-left: 14px;
              }
              .subText2 {
                font-size: 14px;
                color: #111111;
                letter-spacing: 0.2px;
                font-weight: 400;
                padding-left: 14px;
                display: block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                width: calc(80%);
              }
            }
          }
        }
      }
    }
    .actNoData {
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
    .actList span:nth-child(3n)::before {
      content: "";
      background: #056fe0;
      height: 130px;
      width: 3px;
      border-radius: 100px 0px 0px 100px;
    }
    .actList span:nth-child(3n + 1)::before {
      content: "";
      background: #f9971e;
      height: 130px;
      width: 3px;
      border-radius: 100px 0px 0px 100px;
    }
    .actList span:nth-child(3n + 2)::before {
      content: "";
      background: #00b4c5;
      height: 130px;
      width: 3px;
      border-radius: 100px 0px 0px 100px;
    }
  }
</style>
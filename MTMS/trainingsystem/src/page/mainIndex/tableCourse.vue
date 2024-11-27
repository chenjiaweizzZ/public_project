<template>
  <div class="self-tableCourse">
    <div class="courseHead">
      <span @click="backToFisrt">返回</span>
      <span>课程表</span>
    </div>
    <el-calendar v-model="value">
      <template slot="dateCell" slot-scope="{date, data}">
        <div :class="data.isSelected ? 'is-selected' : ''" class="date-box" @click="showToday(data)">
          <p class="date-title">
            <span>{{Number((data).day.split("-")[2])}}</span>
            <span v-if="dataList[data.day] && dataList[data.day].length > 3" class="lookMore">查看{{dataList[data.day].length}}项</span>
          </p>
          <div v-if="dataList[data.day]" class="date-item">
            <el-tooltip class="item" effect="light" placement="bottom-end" popper-class="toolTips-border" v-for="(item,index) in dataList[data.day]"
              :key="index" v-if="index < 3">
              <div slot="content">
                <p class="toolTips" :style="{'background': typeList[item.type].bgCol,'borderColor':  typeList[item.type].textCol}">
                  <span class="info-span">
                    <span :style="{'color': typeList[item.type].textCol}" class="fontBold">
                      {{item.starttimestr.split(" ")[1]}}~{{item.endtimestr.split(" ")[1]}} </span>
                    {{item.typename}}-{{item.theme}}-{{item.speakerlist | speakeshowStr}}
                  </span>
                </p>
              </div>
              <p :class="item.read == 0 ? 'no-read' : ''">
                <span class="box-online" @click.stop="checkPlan(item, data.day, index)">
                  <span class="info-span" :style="{'background': typeList[item.type].bgCol,'borderColor':  typeList[item.type].textCol}">
                    <span :style="{'color': typeList[item.type].textCol}" class="fontBold">{{item.starttimestr.split(" ")[1]}} </span>
                    {{item.typename}}-{{item.theme}}-{{item.speakerlist | speakeshowStr}}
                  </span>
                </span>
              </p>
            </el-tooltip>
          </div>
        </div>
      </template>
    </el-calendar>
    <el-dialog :visible.sync="dialogVisible" :before-close="handleClose" custom-class="clickDayDate-style">
      <span slot="title" class="dialogTitle">{{clickDay}}</span>
      <div v-if="clickDayDate.length > 0" class="todys-item" popper-class="toolTips-border">
        <p :class="{'no-read': item.read == 0, 'todys-list':true}" v-for="(item,index) in clickDayDate[currentPage - 1]" :key="index"
          @click.stop="checkPlan(item, false, index)">
          <span class="info-span" :style="{'background': typeList[item.type].bgCol,'borderColor':  typeList[item.type].textCol}">
            <span :style="{'color': typeList[item.type].textCol}" class="fontBold">
              {{item.starttimestr.split(" ")[1]}}~{{item.endtimestr.split(" ")[1]}} </span>
            {{item.typename}}-{{item.theme}}-{{item.speakerlist | speakeshowStr}}
          </span>
        </p>
      </div>
      <el-pagination @current-change="handleCurrentChange" small :current-page.sync="currentPage" :page-size="pageSize" layout="slot, prev, pager, next"
        :total="total">
        <span class="totalPage">共有{{total}}个教学活动</span>
      </el-pagination>
    </el-dialog>
    <teaching-plan :id="currentId" :activeplandialog.sync="activeplandialog"></teaching-plan>
  </div>
</template>
<script>
  import teachingPlan from "../../components/teachingPlan.vue"
  import Calendar from "../../components/calendar/index"
  import { post, getCookie } from '../../config/util'
  import moment from 'moment';
  export default {
    data() {
      return {
        currentId: "",
        activeplandialog: false,
        currentPage: 1,
        total: 0,
        value: new Date(),
        dialogVisible: false,
        dataList: {},
        clickDay: "",
        clickDayDate: [],
        pageSize: 8,
        todayLists: [],
        typeList: {
          "1": { textCol: "#44B95C", bgCol: "#EAF9ED" },
          "2": { textCol: "#F9AF00", bgCol: "#FFF1D0" },
          "3": { textCol: "#8866CD", bgCol: "#E7E0F5" },
          "4": { textCol: "#6EBCA2", bgCol: "#E1F1EC" },
          "5": { textCol: "#00AAE4", bgCol: "#CCEEF9" },
          "6": { textCol: "#FA8350", bgCol: "#FEE7DD" },
          "7": { textCol: "#528FE0", bgCol: "#DCE8F9" },
          "8": { textCol: "#999999", bgCol: "#EAEAEA" },
        }
      }
    },
    filters: {
      speakeshowStr(arg) {
        let str = '';
        if (arg && Array.isArray(arg)) {
          str = arg.map((item) => item.uname + (item.technique == null ? "" : "(" + item.technique + ")")).join('、');
        }
        return str;
      }
    },
    components: {
      'el-calendar': Calendar,
      teachingPlan
    },
    methods: {
      checkPlan(item, day, index) {
        console.log(item,"============")
        this.activeplandialog = true;
        this.currentId = item.id
        if (item.read == 0) {
          post('/home/readActionPlan', {
            command: 'home/readActionPlan',
            uid: getCookie('uid'),
            id: item.actionPlanTimeId
          }).then((data) => {
            if (data && data.errcode == 0) {
              if (day) {
                // 课程表点击
                let currentDay = this.dataList[day];
                item.read = 1;
                currentDay[index] = item;
                this.$set(this.dataList, day, currentDay)
              } else {
                // 弹窗点击
                item.read = 1
                let temp = this.clickDayDate[this.currentPage - 1]
                temp[index] = item
                this.clickDayDate.splice(this.currentPage - 1, 1, temp)
              }
            }
          }).catch(err => {
            this.$message.error({ message: '请求失败，请检查网络！' })
          })
        }
      },
      showToday(data, type = 0) {
        let tempList = type == 1 ? this.todayLists : (this.dataList[data.day] || [])
        if (tempList.length == 0) {
          return false;
        }
        this.total = tempList.length
        let number = parseInt(tempList.length / this.pageSize)
        let except = tempList.length % this.pageSize
        number = except > 0 ? number + 1 : number
        let pageList = []
        for (let i = 1; i <= number; i++) {
          pageList[i - 1] = tempList.slice((i - 1) * 8, i * 8)
        }
        this.clickDayDate = pageList;
        let temp = data.day.split("-")
        this.clickDay = temp[0] + "年" + temp[1] + "月" + temp[2] + "日"
        this.dialogVisible = true
      },
      getMonthDay(date) {
        var now = date ? new Date(date) : new Date(); //当前日期 
        var nowMonth = now.getMonth(); //当前月 
        var nowYear = now.getFullYear(); //当前年 
        //本月的开始时间
        var monthStartDate = new Date(nowYear, nowMonth, 1);
        //本月的结束时间
        var monthEndDate = new Date(nowYear, nowMonth + 1, 0);
        var timeStar = Date.parse(monthStartDate) / 1000;//s
        var timeEnd = Date.parse(monthEndDate) / 1000;//s
        return {
          monthStartDate,
          monthEndDate
        }
      },
      listactionplan(month, days) {      //右边table列表
        let monthDay = month ? this.getMonthDay(month) : this.getMonthDay()
        post('/home/listActionPlan', {
          command: 'home/listActionPlan',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          uid: getCookie('uid'),
          clientflag: 0,//终端标志位0 pc 1 app
          page: 1,//查询页数
          reqnum: 9999,//每页显示数
          starttime: moment(monthDay.monthStartDate).format('YYYY-MM-DD'),
          endtime: moment(monthDay.monthEndDate).format('YYYY-MM-DD'),
          groupbydayflag: "1"
        }).then((data) => {
          if (data && data.errcode == 0) {
            let temp = data.result.beandaymap;
            this.dataList = data.result.beandaymap;
            if (days) {
              let time = moment(new Date()).format('YYYY-MM-DD')
              this.todayLists = this.dataList[time] || []
              this.showToday({ day: time }, '1')
            }
          }
        }).catch(() => {
          this.$message.error({ message: '请求失败，请检查网络！' })
        })

      },
      backToFisrt() {
        this.$router.push({ name: "mainIndex" })
      },
      handleClose() {
        this.dialogVisible = false;
        this.currentPage = 1
      },
      handleCurrentChange(val) {
        this.currentPage = val
      }
    },
    created() {
      this.listactionplan();

    },
    mounted() {
      //点击今天
      this.$nextTick(() => {
        let lastBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(1)');
        lastBtn.addEventListener('click', () => {
          this.listactionplan(this.value)
        })
        let nextBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(3)');
        nextBtn.addEventListener('click', () => {
          this.listactionplan(this.value)
        })
        let todysBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(2)');
        todysBtn.addEventListener('click', () => {
          let time = moment(new Date()).format('YYYY-MM-DD')
          this.listactionplan(this.value, time)
        })
      })
    }
  }
</script>
<style>
  .self-tableCourse {
    /* margin-top: 40px; */
  }

  .self-tableCourse thead {
    display: none;
  }

  .self-tableCourse .el-pagination {
    text-align: right;
  }

  .self-tableCourse .clickDayDate-style .el-dialog__body {
    padding-top: 10px;
  }

  .self-tableCourse .current,
  .el-calendar-day {
    height: 144px !important;
  }

  .self-tableCourse .clickDayDate-style.el-dialog {
    width: 580px;
  }

  .self-tableCourse .el-calendar__header {
    border-bottom: 1px solid transparent;
    border-top: 1px solid #e5e5e5;
    padding-left: 0;
    padding-right: 0;
  }

  .self-tableCourse .el-calendar__body {
    padding-left: 0;
    padding-right: 0;
  }

  .toolTips-border.el-tooltip__popper.is-light {
    border: 1px solid #DCDFE6 !important;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  }

  .toolTips-border.el-tooltip__popper[x-placement^=bottom-end] .popper__arrow {
    border-bottom-color: #DCDFE6 !important;
    /* background-color:#fff!important; */

  }
</style>
<style scoped>
  p {
    margin: 0;
  }

  .date-box {
    height: 100%;
  }

  .box-online {
    width: 100%;
  }

  .self-tableCourse {
    padding: 0 20px;
  }

  .courseHead {
    width: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .courseHead span:nth-child(1) {
    font-size: 14px;
    color: #0080FF;
  }

  .courseHead span:nth-child(2) {
    font-size: 18px;
    color: #333333;
  }

  .date-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
  }

  .date-item {
    height: calc(100% - 28px);
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    margin-top: 8px;
  }

  .todys-list {
    width: 100%;
    margin-bottom: 5px;
  }

  .date-item p,
  .todys-item p {
    width: calc(100% -18px);
  }

  .info-span {}
  .fontBold {
    font-weight: bold;
  }

  .date-item span.info-span,
  .toolTips,
  .todys-item span.info-span {
    display: inline-block;
    width: calc(100% - 16px);
    overflow: hidden;
    background: #EAF9ED;
    padding: 0 8px;
    /* border: 1px solid #46C25F; */
    height: 26px;
    line-height: 26px;
    border-radius: 4px;
    font-size: 14px;
    color: #111111;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-width: 1px;
    border-style: solid;
  }




  .lookMore {
    font-size: 14px;
    color: #0080FF;
  }

  .no-read {
    position: relative;
    z-index: 1;
  }

  .no-read::after {
    position: absolute;
    right: -4px;
    top: -4px;
    content: "";
    width: 8px;
    height: 8px;
    background: #DB524B;
    border-radius: 50%;
    z-index: 10;
  }

  .totalPage {
    font-size: 12px !important;
    color: #666666;
    font-weight: normal;
    margin-right: 15px;
  }

  .dialogTitle {
    font-size: 18px;
    color: #333333;
    letter-spacing: 0.2px;
    border-bottom: 1px solid transparent;
    margin-bottom: 0;
    padding-left: 0;
  }
</style>
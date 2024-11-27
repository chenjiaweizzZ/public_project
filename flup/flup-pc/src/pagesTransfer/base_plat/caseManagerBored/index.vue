<template>
  <div class="caseManagerBored">
    <div class="caseManagerBored-btnGroup">
      <el-button plain @click="iniTime(true)">今天</el-button>
      <el-date-picker v-model="month" type="month" placeholder="选择月" format="yyyy 年 M 月" @change="monthChange"
        value-format="yyyy-M">
      </el-date-picker>
    </div>
    <div class="type-area">
      <div style="width: 10%;">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      </div>
      <div class="group">
        <el-checkbox-group v-model="checkedList" @change="chooseOne">
          <el-checkbox v-for="(m, index) in typeData" :label="m.name" :key="index">
            <span class="short-line" :class="'color-' + (index + 1)"></span>
            {{ m.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <el-table :data="dateList">
      <el-table-column label="日期" width="60"></el-table-column>
      <el-table-column v-for="(item, index) in tableLabel" :label="item" :key="index">
        <template slot-scope="scope">
          <div class="bored-date">{{ dateList[scope.$index][index] | getStrTwoLast }}{{ dateList[scope.$index][index] ?
        "日" : '' }}</div>
          <div v-if="getBored(dateList[scope.$index][index])">
            <div v-html="getBoredHtml(getBored(dateList[scope.$index][index]))" class="bored-container"
              @click="viewBored(dateList[scope.$index][index], $event)"></div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      month: "",
      checkAll: true,
      typeData: [],
      typeList: [],
      checkedList: [],
      isIndeterminate: false,
      list: [],
      dateList: [],
      tableLabel: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    }
  },
  created() {
    this.iniTime()
    this.getTypeList()

  },
  filters: {
    getStrTwoLast(value) {
      if (value) {
        return value.substring(value.length - 2, value.length)
      } else {
        return
      }
    }
  },
  methods: {
    iniTime(init = false) {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      this.month = `${year}-${month}`
      init ? this.getList() : ''
      // return `${year}-${month}`
    },
    getBored(date) {
      return this.list[date]
    },
    getBoredHtml(obj) {
      // return '<p>' + obj + '</p>'
      let htmlStr = ''
      let arr = Object.keys(obj)
      for (let i = 0; i < arr.length; i++) {
        let key = arr[i]
        let value = obj[key]
        let className = this.getType(obj[key].flupType)
        let className2 = this.getClass(obj[key].flupType)
        let state = value.total == value.currentNumber ? "complete" : "imcomplete"
        let html = `
          <div class="bored ${className}">
             <div class="bored-number ${className2}">
                <div class="${className2}">
                    <span class="bored-left-top ${className2}">${value.flupType}</span> 
                    <span class="bored-right-top ${state} ${className2}">${state == 'complete' ? '已完成' : '未完成'}</span> 
                    <span class="bored-left-bottom ${className2}">管理人数</span> 
                    <span class="bored-right-bottom ${className2}">${value.currentNumber}/${value.total}人</span> 
                </div>
             </div>
          </div>
          `
        htmlStr = htmlStr + html
      }
      // <div class="bored-number ${className2}">
      //         <div class="${className2}">${value.flupType}<br>管理人数
      //           <span class="bored-right ${className2}">${value.currentNumber}/${value.total}人</span> 
      //           </div>
      //       </div>
      return htmlStr
    },
    // <div class="bored-title">${value.flupType}</div>
    getType(typeText) {
      let head = "type"
      switch (typeText) {
        case '健康宣教':
          return `${head}-1`
        case '调查问卷':
          return `${head}-2`
        case '专科随访':
          return `${head}-3`
        case '定期复诊':
          return `${head}-4`
        case '定期检查':
          return `${head}-5`
        case '定期检验':
          return `${head}-6`
        case '消息提醒':
          return `${head}-7`
        case '慢病评估报告':
          return `${head}-8`
        default:
          return `${head}-0`
      }
    },
    getClass(typeText) {
      let head = "class"
      switch (typeText) {
        case '健康宣教':
          return `${head}-1`
        case '调查问卷':
          return `${head}-2`
        case '专科随访':
          return `${head}-3`
        case '定期复诊':
          return `${head}-4`
        case '定期检查':
          return `${head}-5`
        case '定期检验':
          return `${head}-6`
        case '消息提醒':
          return `${head}-7`
        case '慢病评估报告':
          return `${head}-8`
        default:
          return `${head}-0`
      }
    },
    switchType(className) {
      if (className.includes(-1)) {
        return "健康宣教"
      } else if (className.includes(-2)) {
        return "调查问卷"
      } else if (className.includes(-3)) {
        return "专科随访"
      } else if (className.includes(-4)) {
        return "定期复诊"
      } else if (className.includes(-5)) {
        return "定期检查"
      } else if (className.includes(-6)) {
        return "定期检验"
      } else if (className.includes(-7)) {
        return "消息提醒"
      } else if (className.includes(-8)) {
        return "慢病评估报告"
      } else {
        return ''
      }
    },
    getTypeList() {
      this.$apis.queryFollowTypeList(JSON.parse(sessionStorage.getItem('global')).hospital_id).then((res) => {
        this.typeData = res.list.filter((item) => {
          return item.enable != 0;
        });
        this.typeList = [];
        this.typeData.forEach((i) => {
          this.typeList.push(i.name);
        });
        this.checkedList = this.typeList;
        this.getList()
      });
    },
    viewBored(key, event) {
      // console.log(key)
      // console.log(this.list[key])
      // console.log(event)
      // console.log(event.target.className)
      // console.log(this.switchType(event.target.className))
      let followType = this.switchType(event.target.className)
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + '/pc';
      }
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url: urlx + '/#/newphoneFollowUp?token=' + this.$route.query.token + '&time=' + key + '&followType=' + followType,
          title: `电话随访`,
        }),
        '*'
      );
      // this.$router.push({
      //   path: '/newphoneFollowUp',
      //   query: {
      //     time: key,
      //     followType: this.switchType(event.target.className)
      //   }
      // })
    },
    getList() {
      var date = new Date(this.month)
      this.$apis.getFlupTaskBulletinBoard({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        flupType: this.checkedList
      }).then(res => {
        this.list = res
        this.dateList = this.getMonthDays(this.month)
        // for (var key in this.list) {
        //   console.log(key, typeof key, "-")
        // }
        // console.log(res)
        // console.log(this.getMonthDays(this.month))
      })
    },
    monthChange(date) {
      this.getList()
    },
    handleCheckAllChange(val) {
      // console.log(val);
      this.checkedList = val ? this.typeList : [];
      this.isIndeterminate = false;
      this.getList();
    },
    chooseOne(value) {
      // console.log(value)
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.typeData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.typeData.length;
      this.getList();
    },
    getMonthDays(yearMonthStr) {
      const [year, month] = yearMonthStr.split('-').map(Number);
      const firstDayOfMonth = new Date(year, month - 1, 1);
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      const firstDayOfWeekIndex = firstDayOfMonth.getDay();
      const result = [];
      let currentWeek = [];
      let day = 1;
      for (let i = 0; i < firstDayOfWeekIndex; i++) {
        currentWeek.push('');
      }
      while (day <= lastDayOfMonth) {
        currentWeek.push(`${year}-${('0' + month).slice(-2)}-${('0' + day).slice(-2)}`);
        day++;
        if (currentWeek.length === 7) {
          result.push(currentWeek);
          currentWeek = [];
        }
      }
      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
          currentWeek.push('');
        }
        result.push(currentWeek);
      }

      return result;
    }
  }
}
</script>

<style lang="scss" scoped>
.caseManagerBored {
  padding: 24px;

  .type-area {
    display: flex;
    flex-direction: row;
    margin: 10px 0;
    font-size: 14px;
    font-weight: normal;
    line-height: 17px;
    letter-spacing: 0px;

    color: #111111;

    .group {
      .short-line {
        display: inline-block;
        width: 4px;
        height: 14px;
        margin-top: 3px;
        vertical-align: top;
      }
    }
  }

  .bored-date {
    color: #111111;
    font-size: 14px;
    font-weight: normal;
    line-height: 17px;
    letter-spacing: 0px;
    display: flex;
    justify-content: start;
    margin: 13px 0px 9px 0px;
  }

}
</style>

<style lang="scss">
.caseManagerBored {
  .el-table .el-table__body tr.hover-row>td, .el-table .el-table__body tr:hover>td {
    background-color: #fff !important;
  }
  .el-table .el-table__cell {
    vertical-align:top
  }
  .el-date-editor--month {
    height: 36px;
    line-height: 36px;
    margin-left: 20px;

    input {
      height: 36px !important;
      padding-top: 2px;
    }
  }

  .el-calendar {
    .el-calendar__header {
      display: none;
    }

    .is-selected {
      background-color: #fff;
    }
  }

  .color-1 {
    background: #2D81ED !important;
  }

  .color-2 {
    background: #0EAA69 !important;
  }

  .color-3 {
    background: #F48535 !important;
  }

  .color-4 {
    background: #F4359E;
  }

  .color-5 {
    background: #9B35F4 !important;
  }

  .color-6 {
    background: #1CC7D3 !important;
  }

  .color-7 {
    background: #FFC400 !important;
  }

  .color-8 {
    background: #05B0F3 !important;
  }

  ////////////////////////////////////////////////////////

  .type-1 {
    // background-color: rgba(45, 129, 237, .1) !important;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 64px;
      background-color: #2D81ED;
      position: absolute;
    }

    .bored-title {
      color: #2D81ED;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      line-height: 32px;
      margin-left: 14px;
    }

    .bored-number {
      color: #2D81ED;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      line-height: 32px;
      margin-left: 14px;
      margin-right: 12px;
      display: flex;
      justify-content: space-between;
    }
  }

  .type-2 {
    // background-color: rgba(14, 170, 105, .1) !important;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 64px;
      background-color: #0EAA69;
      position: absolute;
    }

    .bored-title {
      color: #0A784A;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      line-height: 32px;
      margin-left: 14px;
    }

    .bored-number {
      color: #0A784A;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      line-height: 32px;
      margin-left: 14px;
      margin-right: 12px;
      display: flex;
      justify-content: space-between;
    }
  }

  .type-3 {
    // background-color: rgba(244, 133, 53, .1) !important;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 64px;
      background-color: #F48535;
      position: absolute;
    }

    .bored-title {
      color: #F48535;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      line-height: 32px;
      margin-left: 14px;
    }

    .bored-number {
      color: #F48535;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      line-height: 32px;
      margin-left: 14px;
      margin-right: 12px;
      display: flex;
      justify-content: space-between;
    }
  }

  .type-4 {
    // background-color: rgba(244, 53, 158, .1) !important;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 64px;
      background-color: #F4359E;
      position: absolute;
    }

    .bored-title {
      color: #F4359E;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      line-height: 32px;
      margin-left: 14px;
    }

    .bored-number {
      color: #F4359E;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      line-height: 32px;
      margin-left: 14px;
      margin-right: 12px;
      display: flex;
      justify-content: space-between;
    }
  }

  .type-5 {
    // background-color: rgba(155, 53, 244, .1) !important;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 64px;
      background-color: #9B35F4;
      position: absolute;
    }

    .bored-title {
      color: #9B35F4;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      line-height: 32px;
      margin-left: 14px;
    }

    .bored-number {
      color: #9B35F4;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      line-height: 32px;
      margin-left: 14px;
      margin-right: 12px;
      display: flex;
      justify-content: space-between;
    }
  }

  .type-6 {
    // background-color: rgba(28, 199, 211, .1) !important;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 64px;
      background-color: #1CC7D3;
      position: absolute;
    }

    .bored-title {
      color: #1CC7D3;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      line-height: 32px;
      margin-left: 14px;
    }

    .bored-number {
      color: #1CC7D3;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      line-height: 32px;
      margin-left: 14px;
      margin-right: 12px;
      display: flex;
      justify-content: space-between;
    }
  }

  .type-7 {
    // background-color: rgba(255, 196, 0, .1) !important;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 64px;
      background-color: #FFC400;
      position: absolute;
    }

    .bored-title {
      color: #FFC400;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      line-height: 32px;
      margin-left: 14px;
    }

    .bored-number {
      color: #FFC400;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      line-height: 32px;
      margin-left: 14px;
      margin-right: 12px;
      display: flex;
      justify-content: space-between;
    }
  }

  .type-8 {
    // background-color: rgba(5, 176, 243, .1) !important;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 64px;
      background-color: #05B0F3;
      position: absolute;
    }

    .bored-title {
      color: #05B0F3;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      line-height: 32px;
      margin-left: 14px;
    }

    .bored-number {
      color: #05B0F3;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      line-height: 32px;
      margin-left: 14px;
      margin-right: 12px;
      display: flex;
      justify-content: space-between;
    }
  }

  .bored {
    height: 64px;
    cursor: pointer;
    position: relative;
    margin-bottom: 10px;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
    transition: 0.5s;
    &:hover {
      background-color: #F3F4F6;
      transform: translateY(-5px);
    }
  }

  .bored-title {
    height: 32px;
    opacity: 1;
  }

  .bored-number {
    height: 32px;
    opacity: 1;
  }

  .bored-left-top {
    color: #111111;
    position: absolute;
    top: 2px;
    left: 12px;
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 0px;
  }

  .bored-right-top {
    color: #111111;
    position: absolute;
    top: 2px;
    right: 12px;
    font-size: 12px;
    font-weight: normal;
    letter-spacing: 0px;
  }

  .bored-left-bottom {
    color: #666666;
    position: absolute;
    bottom: 2px;
    left: 12px;
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 0px;
  }

  .bored-right-bottom {
    color: #111111;
    position: absolute;
    bottom: 2px;
    right: 12px;
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 0px;
  }

  .complete {
    color: #666666;
  }

  .imcomplete {
    color: #0283EF;
  }
}
</style>
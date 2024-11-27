<template>
  <!-- 检验检查报告 -->
  <section ref="section" class="evalReportLiDetail" v-if="examType!='healthCheck'">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      报告记录
    </div>-->
    <!-- <div class="chooseType" @click="chooseType">
      <span class="type">{{ planType.planName }}</span>
    </div>-->
    <div class="allListChoose">
      <p>
        {{
        this.examType == "exam"
        ? funcDetail.examModality
        : funcDetail && funcDetail.length
        ? funcDetail[0].testName
        : ""
        }}
      </p>
      <span>
        {{
        this.examType == "exam"
        ? funcDetail.reporter
        : funcDetail && funcDetail.length
        ? funcDetail[0].labOperator
        : ""
        }}
      </span>
      <span>
        {{
        this.examType == "exam"
        ? funcDetail.examDatetime.slice(0, 10)
        : funcDetail && funcDetail.length
        ? funcDetail[0].testDatetime.slice(0, 10)
        : ""
        }}
      </span>
    </div>
    <div class="reportList" v-if="this.examType == 'exam'">
      <div class="reportLi">
        <label>检查项目</label>
        <p>{{ funcDetail.examModality }}</p>
      </div>
      <div class="reportLi">
        <label>影像所见</label>
        <p>{{ funcDetail.imagingFindings }}</p>
      </div>
      <div class="reportLi">
        <label>检查结果</label>
        <p>{{ funcDetail.imagingDiagnosis }}</p>
      </div>
    </div>
    <div class="labList" v-else>
      <div class="labLi header">
        <p>检查项目</p>
        <p>结果</p>
        <p>异常标志</p>
      </div>
      <div class="labLi" v-for="(item, index) in funcDetail" :key="index">
        <p>{{ item.testName }}</p>
        <p>{{ item.testResult }}</p>
        <p>{{ isNor(item) }}</p>
      </div>
    </div>
  </section>
  <!-- 体检报告 -->
  <section v-else class="evalReportLiDetail">
    <!-- <iframe :src="pdfUrl" width="100%" height="100%" :class="pdfUrl"></iframe> -->
    <div class="healthCheck">
      <div class="baseInfo">
        <div class="baseItem">
          <div class="label">体检编号: {{healthCheckInfo.cardNo}}</div>
          <div class="label">姓名: {{healthCheckInfo.name}}</div>
        </div>
        <div class="baseItem">
          <div class="label">性别: {{healthCheckInfo.sex}}</div>
          <div class="label">年龄: {{healthCheckInfo.age}}</div>
        </div>
        <div class="baseItem">
          <div class="label">单位: {{healthCheckInfo.company}}</div>
          <div class="label">部门: {{healthCheckInfo.dept}}</div>
        </div>
        <div class="baseItem">
          <div class="label">体检时间: {{healthCheckInfo.tijianRq}}</div>
          <div class="label">报告时间: {{healthCheckInfo.reportTime}}</div>
        </div>
      </div>
      <div class="result">
        <div>
          <span class="shortLine"></span>总检结论
          <div style="padding:10px 0">{{healthCheckInfo.zongshu}}</div>
        </div>
        <div>
          <span class="shortLine"></span>防治意见
          <div style="padding:10px 0">{{healthCheckInfo.suggestion}}</div>
        </div>
        <div>
          <span class="shortLine"></span>体检明细
          <div class="checkItem">
            <div v-for="(m,index) in healthCheckInfo.list" :key="index" class="item">
              <span class="itemName">{{ m.zuheXmmc }}</span>
              <div class="itemDetail">
                <div class="text text-l">项目名称</div>
                <div class="text text-s">结果</div>
                <div class="text text-m">单位</div>
                <div class="text text-m">参考范围</div>
              </div>
              <div v-for="(n,indexs) in m.subItems" :key="indexs" class="itemDetail">
                <div class="text text-l">{{ n.xiangMuMC }}</div>
                <div class="text text-s">{{ n.tijianJg}}</div>
                <div class="text text-m">{{ n.unit }}</div>
                <div class="text text-m">{{ n.reference }}</div>
              </div>
              <div class="right">体检医生:{{m.doctor }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      active: 0,
      isOpen: true,
      showPicker: false,
      hospitalList: [],
      currentDate: new Date(),
      startDate: '',
      endDate: '',
      funcsList: [],
      typeList: [],
      show: false,
      type: '',
      flupPlanId: '',
      planType: '',
      examType: '',
      examId: '',
      funcDetail: null,
      pdfUrl: '',
      healthCheckInfo: {
        title: '体检报告',
        basicInfo: {
          cardNo: 'T8165612',
          name: '周宇真',
          gender: '女',
          unit: '',
          dept: '',
          age: '58',
          healthCheckTime: '2023-04-01',
          reportTime: '2023-04-06',
          union: 'xx单位',
          dept: 'xx部门',
        },
        zongjianInfo: {
          zongshu: '1、眼科： 眼常规： 轻度白内障',
          jianyi: '【尿白细胞阳性】 1. 建议复查尿常规',
          doctor: '张荣归',
          checkDate: '2022-06-11',
        },
        result: [
          {
            doctor: '郭芳',
            keshi: '血液科',
            zhxmmc: '血常规',
            list: [
              {
                xmmc: '白细胞',
                xmresult: '6.6',
                unit: '10*9/L',
                reference: '3.5-9.0',
              },
              {
                xmmc: '红细胞',
                xmresult: '6.6',
                unit: '10*9/L',
                reference: '3.5-9.0',
              },
            ],
          },
          {
            doctor: '郭芳',
            keshi: '血液科',
            zhxmmc: '生化14项',
            list: [
              {
                xmmc: '胆红素',
                xmresult: '11.6',
                unit: 'umol/L',
                reference: '1-9.0',
              },
              {
                xmmc: '肌酐',
                xmresult: '11.6',
                unit: 'umol/L',
                reference: '1-9.0',
              },
            ],
          },
        ],
      },
    };
  },
  async created() {
    this.startDate = this.dateAdd(-30);
    this.endDate = new Date().toISOString().slice(0, 10);
    this.examType = this.$route.query.type;
    this.examId = this.$route.query.examId;
    this.pdfUrl = this.$route.query.pdfUrl;
    // if (this.examType != 'healthCheck') {
    //   this.getExamDetail();
    // }
    this.getExamDetail();
  },
  methods: {
    isNor(item) {
      return isNaN(item.testResult) ? '' : item.testResult < item.referenceMax && item.testResult > item.referenceMin ? '正常' : '异常';
    },
    dateAdd(days) {
      var date = new Date();
      date.setDate(date.getDate() + days);
      var time = date.toISOString().slice(0, 10);
      return time;
    },
    getExamDetail() {
      if (this.examType == 'exam') {
        this.$apis
          .getEmrExamReport({
            examId: this.examId,
            hospitalId: JSON.parse(sessionStorage.getItem('userInfo')).hospitalId,
          })
          .then((res) => {
            this.funcDetail = res.retData;
          });
      } else if (this.examType == 'healthCheck') {
        this.healthCheckInfo = {};
        this.$apis
          .getHealthCheckRecord({
            tijianBM: this.examId,
            hospitalId: JSON.parse(sessionStorage.getItem('userInfo')).hospitalId,
          })
          .then((res) => {
            this.healthCheckInfo = res.retData;
          });
      } else {
        this.$apis
          .getEmrLabReport({
            labId: this.examId,
            hospitalId: JSON.parse(sessionStorage.getItem('userInfo')).hospitalId,
          })
          .then((res) => {
            this.funcDetail = res.retData;
          });
      }
    },
    chooseTime(type) {
      this.type = type;
      this.showPicker = true;
      if (type == 'startDate') {
        this.currentDate = this.startDate ? new Date(this.startDate.slice(0, 4), this.startDate.slice(5, 7) - 1, this.startDate.slice(8, 10)) : new Date();
      } else {
        this.currentDate = this.endDate ? new Date(this.endDate.slice(0, 4), this.endDate.slice(5, 7) - 1, this.endDate.slice(8, 10)) : new Date();
      }
    },
    confirmPicker(val) {
      let year = val.getFullYear();
      let month = val.getMonth() + 1;
      let day = val.getDate();
      if (month >= 1 && month <= 9) {
        month = `0${month}`;
      }
      if (day >= 1 && day <= 9) {
        day = `0${day}`;
      }
      if (this.type == 'startDate') {
        this.startDate = `${year}-${month}-${day}`;
      } else {
        this.endDate = `${year}-${month}-${day}`;
      }

      let startDate = this.startDate.replace(/-/g, '');
      let endDate = this.endDate.replace(/-/g, '');
      if (startDate > endDate) {
        this.$toast('起始时间不可大于结束时间,已自动为您置换时间顺序');
        let startDateCopy = this.startDate;
        this.startDate = this.endDate;
        this.endDate = startDateCopy;
      }

      this.showPicker = false;
      this.getExamList();
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      } else if (type === 'hour') {
        return `${value}时`;
      } else if (type === 'minute') {
        return `${value}分`;
      } else if (type === 'second') {
        return `${value}秒`;
      }
      return value;
    },
    goToUrl(flupAddress) {},
    chooseType() {
      this.show = true;
    },
    onConfirm(value) {
      this.planType = value;
      this.show = false;
      this.getExamList();
    },
  },
};
</script>
<style lang="scss" scoped>
p {
  margin: 0;
}
.fff {
  background: #fff;
}
.evalReportLiDetail {
  position: relative;
  width: 100%;
  height: 100%;
  &::before {
    content: '';
    display: table;
  }
  .noData {
    height: 60%;
    background: url('../assets/images/noData.png') no-repeat center 40%;
    background-size: 42%;
  }
  .topMenu {
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 18px;
    color: #111111;
    letter-spacing: 0.2px;
    text-align: center;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
    u {
      position: absolute;
      left: 3.75%;
      top: 50%;
      transform: translate(0, -50%);
      display: block;
      width: 22px;
      height: 22px;
      background: #fff url('../assets/images/back.png') no-repeat;
      background-size: contain;
    }
  }
  .chooseType {
    // margin-top: 44px;
    padding: 10px 20px;
    text-align: center;
    background: #fff;
    span {
      padding-right: 15px;
      font-size: 16px;
      color: #333;
      background: url('../assets/images/downArrowB.png') no-repeat right;
      background-size: 12px;
    }
  }
  .allListChoose {
    // margin-top: 44px;
    padding: 14px 3.75%;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0.2px;
    line-height: 22px;
    background: #1c97fc;
    p {
      margin-bottom: 8px;
      line-height: 28px;
      font-size: 20px;
      letter-spacing: 0.22px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    span {
      margin-right: 8px;
      padding-right: 8px;
      border-right: 1px solid #fff;
      &:last-child {
        border: none;
      }
    }
  }
  .chooseDate {
    position: absolute;
    right: 3.75%;
    top: 50%;
    transform: translate(0, -50%);
    padding-right: 18px;
    line-height: 28px;
    background: url('../assets/images/downArroww.png') no-repeat right;
    background-size: 12px;
  }
  .reportList {
    .reportLi {
      margin-bottom: 8px;
      padding: 12px 3.75%;
      background: #fff;
      &:last-child {
        border: none;
      }
      label {
        padding-left: 10px;
        line-height: 24px;
        font-size: 17px;
        color: #111111;
        letter-spacing: 0.2px;
        border-left: 3px solid #1c97fc;
      }
      p {
        margin-top: 8px;
        font-size: 16px;
        color: #666666;
        letter-spacing: 0.2px;
        line-height: 24px;
      }
    }
  }
  .labList {
    background: #fff;
    padding: 0 3.75%;
    .labLi {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      line-height: 21px;
      color: #333;
      p {
        width: 20%;
        font-size: 16px;
        color: #333333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:first-child {
          width: 50%;
        }
      }
    }
    .header {
      background: #fafafa;
      p {
        font-size: 15px;
        color: #666;
      }
    }
  }
  .healthCheck {
    .baseInfo {
      background: #1c97fc;
      color: #fff;
      padding: 10px;
      .baseItem {
        display: flex;
        .label {
          width: 100%;
        }
      }
    }
    .result {
      padding: 10px;
      .shortLine {
        width: 3px;
        height: 12px;
        display: inline-block;
        background: #1c97fc;
        margin-right: 10px;
      }
      .checkItem {
        .item {
          margin-top: 10px;
          .itemName {
            font-weight: 600;
          }
          .itemDetail {
            display: flex;
            .text {
              // width: 100%;
            }
            .text-s {
              width: 15%;
            }
            .text-l {
              width: 40%;
            }
            .text-m {
              width: 22.5%;
            }
          }
          .right {
            text-align: right;
            border-bottom: 1px solid #e2e2e2;
            padding: 8px 0;
            line-height: 20px;
          }
        }
      }
    }
  }
}
</style>

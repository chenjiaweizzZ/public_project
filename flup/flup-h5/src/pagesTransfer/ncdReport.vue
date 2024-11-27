<template>
  <section ref="section" class="ncdReport">
    <!-- 切换就诊人的模块 -->
    <div class="patientChoose">
      <span>就诊人</span>
      <span class="patientId" @click="choosePatient()">{{ patient.text }}</span>
    </div>
    <!-- <van-tabs v-model="active" v-if="patientOption.length!=0">
      <van-tab title="最新评估报告">
        <iframe
          style="height:90vh"
          v-if="funcsList.length > 0"
          :src="urlx + '/#/thereportpreview?reportId=' + funcsList[0].id +'&hospitalId='+hospitalId +'&riskType='+funcsList[0].riskType+'&from=phone'"
          width="100%"
          frameborder="0"
        ></iframe>
        <div class="noData" v-else></div>
      </van-tab>
      <van-tab title="历次评估报告">
        <div class="allListChoose">
          <p>
            共
            <span>{{ funcsList.length }}</span> 份报告
          </p>
          <div class="chooseDate">
            <span @click="chooseTime('startDate')">{{ startDate }}</span>～
            <span @click="chooseTime">{{ endDate }}</span>
          </div>
          <van-popup v-model="showPicker" position="bottom">
            <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :formatter="formatter" :max-date="maxDate" @cancel="showPicker = false" @confirm="confirmPicker" />
          </van-popup>
        </div>
        <div class="noData" v-if="!funcsList.length"></div>
        <div class="reportList" v-if="!isShow">
          <div class="reportLi" v-for="(item, index) in funcsList" :key="index" @click="goToUrl(item)">
            <p>
              {{ item.title }}
              <span v-if="index==0">最新</span>
            </p>
            <div class="reportChoose">{{ item.createTime }}</div>
            <img class="detail" src="@/assets/images/jr.png" />
          </div>
        </div>
        <div class="detailFunc" v-if="isShow">
          <iframe
            style="height:100vh"
            :src="urlx + '/#/thereportpreview?reportId=' + funcsDetailid +'&hospitalId='+hospitalId +'&riskType='+riskType+'&from=phone'"
            width="100%"
            frameborder="0"
          ></iframe>
        </div>
      </van-tab>
    </van-tabs>-->
    <div class="reportList" v-if="funcsList.length">
      <div class="reportUl">
        <div class="reportLi" v-for="(item, index) in funcsList" :key="index" @click="goToUrl(item)">
          <p>
            <img src="@/assets/images/report.png" />
            {{ item.title }}
            <span v-if="index==0">最新</span>
          </p>
          <div class="reportChoose">{{ item.createTime }}</div>
          <img class="detail" src="@/assets/images/jr.png" />
        </div>
      </div>
    </div>
    <div class="noData" v-if="!funcsList.length&&patientOption.length!=0"></div>
    <div class="noPatient" v-show="patientOption.length==0">
      <div class="npContent">
        <img src="@/assets/images/noPatient.png" alt />
        <div class="noDataText">暂无就诊人</div>
        <div class="npBtn" @click="addPatient()">去新增</div>
      </div>
    </div>
    <van-popup v-model="showPatientPicker" round position="bottom">
      <van-picker title="切换就诊人" :columns="patientOption" @cancel="showPatientPicker = false" @confirm="onConfirm" show-toolbar :default-index="pickerBindIndex" />
    </van-popup>
  </section>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    this.chartSettings = {
      labelMap: {
        bloodPressureL: '舒张压',
        bloodPressureH: '收缩压',
      },
    };
    return {
      active: 0,
      isOpen: true,
      showPicker: false,
      hospitalList: [],
      currentDate: new Date(),
      maxDate: new Date(),
      startDate: '',
      endDate: '',
      type: '',
      hospitalId: '',
      funcsDetail: {},
      funcsList: [],
      // funcsOneDetail: {},
      isShow: false,
      chartData: {
        columns: ['checkDatetime', 'bloodPressureL', 'bloodPressureH'],
        rows: [],
      },
      urlx: '',
      // funcsDetailid: '',
      userInfo: {},
      // riskType: '',
      patientId: '123456784',
      patientOption: [],
      patient: {},
      showPatientPicker: false,
      pickerBindIndex: 0,
    };
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    if (location.pathname) {
      this.urlx = location.origin + location.pathname.replace(/h5/, 'pc');
    } else {
      this.urlx = location.origin + '/pc';
    }
    this.hospitalId = this.$route.query.hospitalId ? this.$route.query.hospitalId : ''; //1118033010334208499
    this.startDate = this.dateAdd(-30);
    this.endDate = new Date().toISOString().slice(0, 10);
    // this.getReport()
    this.getPatientList();
    // this.getReportList();
  },
  methods: {
    getPatientList() {
      this.$apis
        .getPatientList({
          openId: this.$route.query.openId,
          pageNo: 1,
          pageSize: 100,
        })
        .then((res) => {
          this.patientOption = [];
          if (res.retData.list.length != 0) {
            this.patientOption = res.retData.list;
            this.patientOption.forEach((i) => {
              //脱敏
              // var a = i.patientName.substring(0, 1) + '*' + i.patientName.substring(i.patientName.length - 1, 1);
              var b = i.idNo.substring(0, 4) + '**********' + i.idNo.substring(i.idNo.length - 4);
              i.text = i.patientName + '  ' + b;
              i.value = i.userId;
            });
            let index = null;
            if (sessionStorage.getItem('currentPatientId')) {
              index = this.patientOption.findIndex((i) => {
                return i.userId == sessionStorage.getItem('currentPatientId');
              });
            } else {
              index = this.patientOption.findIndex((i) => {
                return i.isDefault == 1;
              });
            }

            if (index != -1) {
              this.patient = this.patientOption[index];
            } else {
              this.patient = this.patientOption[0];
            }
            this.patientId = this.patient.value;
            this.pickerBindIndex = index == -1 ? 0 : index;
            this.getReportList();
          } else {
            this.patientOption = [];
            this.funcsList = [];
          }
        });
    },
    dateAdd(days) {
      var date = new Date();
      date.setDate(date.getDate() + days);
      var time = date.toISOString().slice(0, 10);
      return time;
    },
    onConfirm(selectedValues, index) {
      this.patient = selectedValues;
      this.patientId = this.patient.value;
      this.pickerBindIndex = index;
      this.getReportList();
      this.showPatientPicker = false;
    },
    choosePatient() {
      if (this.patient.value) {
        this.showPatientPicker = true;
      } else {
        this.$router.push({
          path: ' ',
        });
      }
    },
    addPatient() {
      this.$router.push({
        path: '/userManagement',
      });
    },
    async getReportList() {
      // this.$apis.getReportList(this.patientId, this.hospitalId, this.startDate, this.endDate).then((res) => {
      //   this.funcsList = res.retData;
      //   if (this.funcsList.length != 0) {
      //     this.funcsDetail = res.retData[0];
      //   } else {
      //     this.funcsDetail = {};
      //   }
      // });
      this.$apis.getReportList(this.patientId, this.hospitalId, this.startDate, this.endDate).then((res) => {
        this.funcsList = res.retData;
        if (this.funcsList.length != 0) {
          this.funcsDetail = res.retData[0];
        } else {
          this.funcsDetail = {};
        }
      });
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
      this.getReportList();
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
    raContral() {
      this.isOpen = !this.isOpen;
    },
    goToUrl(item) {
      // this.funcsDetailid = item.id;
      // this.riskType = item.riskType;
      // this.isShow = true;
      this.$router.push({
        path: 'ncdReportDetail',
        query: {
          funcsDetailid: item.id,
          riskType: item.riskType,
          hospitalId: this.hospitalId,
          patientId: this.patientId,
        },
      });
    },
  },
  beforeDestroy() {
    // console.log(123456);
    if (sessionStorage.getItem('currentPatientId')) {
      sessionStorage.removeItem('currentPatientId');
    }
  },
};
</script>
<style lang="scss">
.ncdReport {
  .van-tabs {
    // margin-top: 44px;
    height: 100%;
    .van-tabs__content {
      height: 100%;
      .van-tab__pane {
        height: 100%;
      }
    }
  }
  .van-tab {
    font-size: 15px;
  }
  .van-tab--active {
    color: #00982d;
  }
  .van-tabs__line {
    background-color: #00982d;
  }
  .van-tabs__wrap:before {
    content: '';
    display: block;
    width: 1px;
    height: 20px;
    z-index: 9;
    position: absolute;
    left: 50%;
    top: 22px;
    transform: translate(-50%, -50%);
    background: #e2e2e2;
  }
}
</style>
<style lang="scss" scoped>
p {
  margin: 0;
}
.fff {
  background: #fff;
}
.ncdReport {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f3f7f5;
  &::before {
    content: '';
    display: table;
  }
  .reportList {
    // padding-left: 3.75%;
    position: absolute;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 0;
    overflow-y: scroll;
    p {
    }
  }
  .patientChoose {
    padding: 0 14px 0 24px;
    height: 44px;
    background: linear-gradient(277deg, #32ae57 1%, #46cd6e 96%);
    font-size: 16px;
    line-height: 46px;
    color: #ffffff;
    .patientId {
      padding-right: 18px;
      float: right;
      font-size: 15px;
      background: url('../assets/images/right-arrow-icon.png') no-repeat right;
    }
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
  .reportResult {
    margin: 0 3.75%;
    margin-bottom: 12px;
    margin-top: 10px;
    padding: 20px;
    border-radius: 8px;
    background: url('../assets/images/reportResultBg.png') no-repeat;
    background-size: cover;
    box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.08);
    p {
      margin-bottom: 2px;
      line-height: 28px;
      font-size: 17px;
      color: #ffffff;
      letter-spacing: 0.2px;
      span {
        display: inline-block;
        margin-left: 10px;
        padding: 0 14px;
        line-height: 28px;
        font-size: 15px;
        color: #f15f00;
        background: #ffffff;
        border-radius: 14px;
      }
    }
    span {
      line-height: 17px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
      letter-spacing: 0.17px;
    }
  }
  .reportTitle {
    margin: 0 3.75%;
    margin-bottom: 12px;
    line-height: 21px;
    font-size: 15px;
    color: #111111;
  }
  .reportArea {
    margin: 0 3.75%;
    padding: 14px 3.75%;
    line-height: 20px;
    font-size: 14px;
    color: #333333;
    background: #f3f6fb;
    p {
      position: relative;
      margin-bottom: 8px;
      padding-left: 14px;
      letter-spacing: 0.16px;
      &::before {
        content: '';
        display: block;
        width: 6px;
        height: 6px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        border-radius: 6px;
        background: #f96a0e;
      }
    }
    span {
      display: block;
      margin-bottom: 16px;
    }
  }
  .close {
    span {
      display: none;
    }
  }
  .raContral {
    height: 30px;
    margin-bottom: 8px;
    background: url('../assets/images/downArrowB.png') no-repeat center;
    background-size: 16px;
  }
  .itemTitle {
    position: relative;
    height: 46px;
    font-size: 17px;
    color: #333;
    background-color: #fff;
    padding-left: 25px;
    line-height: 46px;
    &::before {
      position: absolute;
      left: 14px;
      top: 15px;
      bottom: 15px;
      width: 4px;
      background-color: #1c97fc;
      border-radius: 1.5px;
      content: '';
    }
  }
  .infoList {
    margin-bottom: 30px;
    .infoLi {
      position: relative;
      padding: 0 3.75%;
      padding-bottom: 8px;
      line-height: 30px;
      font-size: 16px;
      color: #111111;
      letter-spacing: 0.2px;
      label {
        position: absolute;
        left: 3.75%;
        top: 0;
        color: #666;
      }
      p {
        margin-left: 25%;
        text-align: right;
      }
    }
  }
  .allListChoose {
    position: relative;
    padding: 10px 3.75%;
    font-size: 15px;
    color: #ffffff;
    letter-spacing: 0.18px;
    line-height: 21px;
    background: #1c97fc;
    top: 0;
    left: 0;
    p span {
      font-size: 24px;
      color: #ffd675;
      letter-spacing: 0.28px;
      line-height: 33px;
    }
    span {
      font-size: 14px;
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
    // background: #fff;
    // padding-left: 3.75%;
    .reportUl {
      padding: 0 14px;
      .reportLi {
        position: relative;
        padding: 14px 0;
        padding-left: 3.75%;
        background-size: 16px;
        overflow: hidden;
        margin-top: 16px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0px 1px 4px 0px rgba(26, 33, 44, 0.08);
        // &:last-child {
        //   border: none;
        // }
        p {
          font-family: 苹方-简;
          font-size: 16px;
          font-weight: normal;
          line-height: 19px;
          letter-spacing: 0.2px;
          color: #111111;
          margin-bottom: 11px;
          display: flex;
          span {
            padding: 2px 6px;
            margin-left: 3px;
            border-radius: 8.5px;
            // border: 1px solid #1c97fc;
            line-height: 14px;
            font-size: 10px;
            color: #fff;
            letter-spacing: 0.13px;
            transform: scale(0.9);
            background: #ff7b35;
            border-radius: 0 8px 8px 8px;
          }
          img {
            width: 20px;
            height: 20px;
            display: inline-block;
            margin-right: 8px;
          }
        }
        .reportChoose {
          font-family: 苹方-简;
          font-size: 14px;
          font-weight: normal;
          line-height: 17px;
          letter-spacing: 0.2px;
          color: #999999;
          margin-left: 28px;
        }
        .detail {
          width: 16px;
          height: 16px;
          display: inline-block;
          position: absolute;
          top: 26px;
          right: 12px;
        }
      }
    }
  }
  .detailFunc {
    z-index: 9;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    bottom: 0;
  }
  .noPatient {
    .npContent {
      width: 74%;
      margin-left: 13%;
      margin-top: 40%;
      text-align: center;
      img {
        display: block;
        width: 100%;
      }
      .noDataText {
        font-family: 苹方-简;
        font-size: 17px;
        font-weight: normal;
        line-height: 20px;
        text-align: center;
        letter-spacing: 0px;
        color: #6b8c75;
      }
      .npBtn {
        display: inline-block;
        margin: 20px;
        padding: 0 23px;
        line-height: 26px;
        border-radius: 18px;
        border: 1px solid #32ae57;
        font-size: 15px;
        letter-spacing: 0.2px;
        color: #00982d;
      }
    }
  }
}
</style>

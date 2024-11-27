<template>
  <div class="followUpIndex">
    <div class="overviewbox">
      <el-date-picker
        v-model="time"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        @change="gettime"
      ></el-date-picker>

      <div class="overview">
        <div @click="jump('routinenew')" class="total">
          <div class="imgbox">
            <img src="~@/assets/images/zsfs.png" />
          </div>
          <div class="databox">
            <div>
              <h5>总随访数</h5>
              <el-tooltip placement="top">
                <div slot="content">该数据为当前所有随访任务数量</div>
                <img src="~@/assets/images/yw.png" />
              </el-tooltip>
            </div>
            <h3>{{ flupCount }}</h3>
          </div>
        </div>
        <div class="detailed">
          <div style="min-width:210px;width:20%; border: 0" class="total">
            <div class="imgbox">
              <img src="~@/assets/images/zhzs.png" />
            </div>
            <div class="databox">
              <div>
                <h5>总患者数</h5>
                <el-tooltip placement="top">
                  <div slot="content">该数据为当前所有类型患者数据</div>
                  <img src="~@/assets/images/yw.png" />
                </el-tooltip>
              </div>
              <h3>{{ patientCount }}</h3>
            </div>
          </div>
          <div class="quantityCollection" style="width: 75%">
            <div v-if="admissionCount" @click.stop="goNewpatientlistV2('ADMISSION_PATIENT,DISCHARGE_PATIENT')">
              <!-- <img src="~@/assets/images/zy.png" /> -->
              <p>在院患者数</p>
              <h4>{{ admissionCount}}</h4>
            </div>
            <div v-if="dischargeCount" @click.stop="goNewpatientlistV2('DISCHARGE_PATIENT,ADMISSION_PATIENT')">
              <!-- <img src="~@/assets/images/cy.png" /> -->
              <p>出院患者数</p>
              <h4>{{ dischargeCount}}</h4>
            </div>
            <div v-if="clinicCount" @click.stop="goNewpatientlistV2('OUT_PATIENT')">
              <!-- <img src="~@/assets/images/cy.png" /> -->
              <p>门诊患者数</p>
              <h4>{{ clinicCount}}</h4>
            </div>
            <div v-if="internetCount" @click.stop="goNewpatientlistV2('INTERNET_PATIENT')">
              <!-- <img src="~@/assets/images/hlw.png" /> -->
              <p>互联网患者数</p>
              <h4>{{ internetCount}}</h4>
            </div>
            <!-- <div>
              <img src="~@/assets/images/qy.png" />
              <p>签约患者数</p>
              <h4>{{ signCount }}</h4>
            </div>-->
            <div v-if="tijianCount"  @click.stop="goNewpatientlistV2('EXAMINATION_PATIENT')">
              <p>体检人数</p>
              <h4>{{ tijianCount}}</h4>
            </div>
          </div>
        </div>
        <div @click="jump('exceptionwarning')" class="total">
          <div class="imgbox">
            <img src="~@/assets/images/yc.png" />
          </div>
          <div class="databox">
            <div>
              <h5>异常处理</h5>
              <el-tooltip placement="top">
                <div slot="content">该数据为当前所有待处理异常处理数</div>
                <img src="~@/assets/images/yw.png" />
              </el-tooltip>
            </div>
            <h3>{{ exceptionCount }}</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="filter">
      <el-tooltip placement="top">
        <div slot="content">该图表为当前所选计划内一段时间的随访数量统计</div>
        <img style="width: 14px;height: 14px;" src="~@/assets/images/yw.png" />
      </el-tooltip>
      <span>随访计划</span>
      <el-select v-model="planId" placeholder="请选择" @change="getgetHomePageFlupPlan">
        <el-option v-for="item in allFlupPlanList" :key="item.serialNo" :label="item.planName" :value="item.serialNo"></el-option>
      </el-select>
      <span style="margin-left: 30px">时间</span>
      <el-select v-model="limits" placeholder="请选择" @change="getgetHomePageFlupPlan">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="chartBox">
      <div style="width: 60%; margin-right: 20px">
        <div class="title">
          <p>随访计划统计</p>
          <el-button type="text" v-if="planId" @click="push">更多</el-button>
          <el-button type="text" v-if="!planId" @click="jump('routinenew')">更多</el-button>
        </div>
        <div v-if="chartList.rows.length != 0">
          <ve-line :data="chartList" :settings="chartSettings" :extend="lienExtend"></ve-line>
        </div>
        <div class="imgbox" v-else>
          <img src="~@/assets/images/zwsj.png" alt="暂无数据" />
        </div>
      </div>
      <div style="width: 40%; position: relative;">
        <div class="title">
          <p>随访计划统计</p>
          <el-button type="text" @click="jump('newplanstatistics')">更多</el-button>
        </div>
        <div class="vebox" v-if="chartData.rows.length != 0">
          <ve-ring :data="chartData" :events="chartEvents" :extend="ringExtend"></ve-ring>
        </div>
        <div v-if="chartData.rows.length != 0" class="dataOverview">
          <p>
            <span>总任务数：</span>
            {{totalCount }}
          </p>
          <p>
            <span>随访成功数：</span>
            {{successFollowupCount }}
          </p>
          <p>
            <span>失访数：</span>
            {{lossFollowupCount }}
          </p>
          <p>
            <span>待执行数：</span>
            {{noFollowupCount }}
          </p>
          <p>
            <span>随访成功率：</span>
            {{successFollowupRate }}
          </p>
          <p>
            <span>失访率：</span>
            {{lossFollowupRate }}
          </p>
        </div>
        <div class="imgbox" v-else>
          <img src="~@/assets/images/zwsj.png" alt="暂无数据" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VeLine from 'v-charts/lib/line.common';
import VeRing from 'v-charts/lib/ring.common';
export default {
  components: {
    [VeLine.name]: VeLine,
    [VeRing.name]: VeRing,
  },
  data() {
    this.chartSettings = {
      // xAxisType: 'time',
      xAxisType: '',
      offsetY: 300,

      legend: {
        type: 'scroll',
        orient: 'vertical',
        pageButtonPosition: 'end',
      },
    };
    this.lienExtend = {
      grid: { right: 30 },
      legend: {
        top: 20,
      },
    };

    this.ringExtend = {
      series: {
        center: ['65%', '30%'],
        radius: ['33%', '42%'],
      },
      legend: {
        orient: 'vertical',
        left: 0,
        top: 30,
      },
      title: {
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 50,
        },
      },
    };
    var self = this;
    this.chartEvents = {
      mouseover: function (e) {
        self.name = e.name;
        for (let i in self.planCountList) {
          if (self.planCountList[i].flupType == e.name) {
            self.followupCount = self.planCountList[i].followupCount;
            self.followupRate = self.planCountList[i].followupRate;
            self.lossFollowupCount = self.planCountList[i].lossFollowupCount;
            self.lossFollowupRate = self.planCountList[i].lossFollowupRate;
            self.noFollowupCount = self.planCountList[i].noFollowupCount;
            self.successFollowupCount = self.planCountList[i].successFollowupCount;
            self.successFollowupRate = self.planCountList[i].successFollowupRate;
            self.totalCount = self.planCountList[i].totalCount;
          }
        }
      },
      mouseout: function () {
        self.followupCount = self.zfollowupCount;
        self.followupRate = self.zfollowupRate;
        self.lossFollowupCount = self.zlossFollowupCount;
        self.lossFollowupRate = self.zlossFollowupRate;
        self.noFollowupCount = self.znoFollowupCount;
        self.successFollowupCount = self.zsuccessFollowupCount;
        self.successFollowupRate = self.zsuccessFollowupRate;
        self.totalCount = self.ztotalCount;
      },
    };
    return {
      admissionCount: null,
      clinicCount: null,
      dischargeCount: null,
      exceptionCount: null,
      flupCount: null,
      internetCount: null,
      patientCount: null,
      signCount: null,
      tijianCount: null,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      time: '',
      options: [
        {
          value: '1',
          label: '最近一周',
        },
        {
          value: '2',
          label: '最近一个月',
        },
        {
          value: '3',
          label: '最近三个月',
        },
        {
          value: '4',
          label: '最近一年',
        },
      ],
      startDate: null,
      endDate: null,
      allFlupPlanList: [],
      planId: null,
      limits: '1',
      chartList: {
        columns: ['data'],
        rows: [],
      },
      chartData: {
        columns: ['类型', '数量'],
        rows: [],
      },
      zfollowupCount: null,
      zfollowupRate: null,
      zlossFollowupCount: null,
      zlossFollowupRate: null,
      znoFollowupCount: null,
      zsuccessFollowupCount: null,
      zsuccessFollowupRate: null,
      ztotalCount: null,
      followupCount: null,
      followupRate: null,
      lossFollowupCount: null,
      lossFollowupRate: null,
      noFollowupCount: null,
      successFollowupCount: null,
      successFollowupRate: null,
      totalCount: null,
      planCountList: [],
    };
  },
  created() {
    // 不再调用初始化接口 
    // this.$apis.configInitialize();

    this.getgetHomePageCount();
    this.$apis
      .getAllFlupPlan({
        isAll: 1,
      })
      .then((res) => {
        this.allFlupPlanList = res;
        if (this.allFlupPlanList.length != 0) {
          this.planId = res[0].serialNo;
          this.getgetHomePageFlupPlan();
        }
      });
  },

  computed: {},
  watch: {},
  methods: {
    goNewpatientlistV2(patientTypeCode) {
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + '/pc';
      }
      if (this.$isProduction) {
        window.parent.postMessage(
          JSON.stringify({
            method: 'addTab',
            url: urlx + '/#/newpatientlistV2?token=' + this.$route.query.token + '&patientTypeCode=' + patientTypeCode,
            title: `患者就诊信息管理`,
          }),
          '*'
        );
      } else {
        window.open(urlx + '/#/routinenew?token=' + this.$route.query.token + '&patientTypeCode=' + patientTypeCode);
      }
    },
    jump(way) {
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + '/pc';
      }
      if (way == 'routinenew') {
        if (this.$isProduction) {
          window.parent.postMessage(
            JSON.stringify({
              method: 'addTab',
              url: urlx + '/#/routinenew?token=' + this.$route.query.token,
              title: `常规随访`,
            }),
            '*'
          );
        } else {
          window.open(urlx + '/#/routinenew?token=' + this.$route.query.token);
        }
      } else if (way == 'newpatientlistV2') {
        if (this.$isProduction) {
          window.parent.postMessage(
            JSON.stringify({
              method: 'addTab',
              url: urlx + '/#/newpatientlistV2?token=' + this.$route.query.token,
              title: `患者就诊信息管理`,
            }),
            '*'
          );
        } else {
          window.open(urlx + '/#/newpatientlistV2?token=' + this.$route.query.token);
        }
      } else if (way == 'exceptionwarning') {
        if (this.$isProduction) {
          window.parent.postMessage(
            JSON.stringify({
              method: 'addTab',
              url: urlx + '/#/exceptionwarning?token=' + this.$route.query.token,
              title: `异常预警`,
            }),
            '*'
          );
        } else {
          window.open(urlx + '/#/exceptionwarning?token=' + this.$route.query.token);
        }
      } else if (way == 'newplanstatistics') {
        if (this.$isProduction) {
          window.parent.postMessage(
            JSON.stringify({
              method: 'addTab',
              url: urlx + '/#/newplanstatistics?token=' + this.$route.query.token + '&planId=' + this.planId,
              title: `随访计划统计`,
            }),
            '*'
          );
        } else {
          window.open(urlx + '/#/newplanstatistics?token=' + this.$route.query.token + '&planId=' + this.planId);
        }
      }
    },
    push() {
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + '/pc';
      }
      for (let i in this.allFlupPlanList) {
        if (this.planId == this.allFlupPlanList[i].serialNo) {
          if (this.allFlupPlanList[i].planType == 0) {
            if (this.$isProduction) {
              window.parent.postMessage(
                JSON.stringify({
                  method: 'addTab',
                  url: urlx + '/#/routinenew?token=' + this.$route.query.token + '&planId=' + this.planId,
                  title: `常规随访`,
                }),
                '*'
              );
            } else {
              window.open(urlx + '/#/routinenew?token=' + this.$route.query.token + '&planId=' + this.planId);
            }
          } else {
            if (this.$isProduction) {
              window.parent.postMessage(
                JSON.stringify({
                  method: 'addTab',
                  url: urlx + '/#/icdmpatient?token=' + this.$route.query.token + '&planId=' + this.planId,
                  title: `慢病患者管理`,
                }),
                '*'
              );
            } else {
              window.open(urlx + '/#/icdmpatient?token=' + this.$route.query.token + '&planId=' + this.planId);
            }
          }
        }
      }
    },
    getgetHomePageFlupPlan() {
      this.$apis
        .getHomePageFlupPlan({
          planId: this.planId,
          limits: this.limits,
        })
        .then((res) => {
          this.chartList.rows = [];
          this.chartData.rows = [];
          this.chartList.columns = ['data'];
          this.$nextTick(() => {
            this.planCountList = res.planCount.list;
            this.chartList.rows = res.list;
            for (let j in res.planCount.list) {
              let v = {
                类型: res.planCount.list[j].flupType,
                数量: res.planCount.list[j].totalCount,
              };
              this.chartData.rows.push(v);
              this.chartList.columns.push(res.planCount.list[j].flupType);
            }
            this.zfollowupCount = res.planCount.followupCount;
            this.zfollowupRate = res.planCount.followupRate;
            this.zlossFollowupCount = res.planCount.lossFollowupCount;
            this.zlossFollowupRate = res.planCount.lossFollowupRate;
            this.znoFollowupCount = res.planCount.noFollowupCount;
            this.zsuccessFollowupCount = res.planCount.successFollowupCount;
            this.zsuccessFollowupRate = res.planCount.successFollowupRate;
            this.ztotalCount = res.planCount.totalCount;
            this.followupCount = res.planCount.followupCount;
            this.followupRate = res.planCount.followupRate;
            this.lossFollowupCount = res.planCount.lossFollowupCount;
            this.lossFollowupRate = res.planCount.lossFollowupRate;
            this.noFollowupCount = res.planCount.noFollowupCount;
            this.successFollowupCount = res.planCount.successFollowupCount;
            this.successFollowupRate = res.planCount.successFollowupRate;
            this.totalCount = res.planCount.totalCount;
          });
        });
    },
    getgetHomePageCount() {
      this.$apis
        .getHomePageCount({
          startDate: this.startDate,
          endDate: this.endDate,
        })
        .then((res) => {
          this.admissionCount = res.admissionCount;
          this.clinicCount = res.clinicCount;
          this.dischargeCount = res.dischargeCount;
          this.exceptionCount = res.exceptionCount;
          this.flupCount = res.flupCount;
          this.internetCount = res.internetCount;
          this.patientCount = res.patientCount;
          this.signCount = res.signCount;
          this.tijianCount = res.tijianCount;
        });
    },
    gettime() {
      if (this.time) {
        this.startDate = this.time[0];
        this.endDate = this.time[1];
      } else {
        this.startDate = null;
        this.endDate = null;
      }
      this.getgetHomePageCount();
    },
  },
};
</script>

<style lang="scss">
.followUpIndex {
  padding: 0 20px;
  // .el-range-editor {
  //   width: auto !important;
  //   .el-range-input {
  //     width: 130px !important;
  //   }
  //   .el-range-separator {
  //     width: 50px !important;
  //   }
  // }
  .overviewbox {
    min-width: 1200px;
    padding: 20px;
    height: 200px;
    border: 1px solid #cccccc;
    .overview {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .total {
        width: 20%;
        min-width: 215px;
        height: 100px;
        padding: 19px 24px 18px;
        border: 0.5px solid #cccccc;
        border-radius: 3px;
        display: flex;
        align-items: center;
        .imgbox {
          height: 60px;
          padding: 10px 19px 10px 0;
          border-right: 2px solid rgba(204, 204, 204, 0.4);
          img {
            width: 40px;
            height: 40px;
          }
        }
        .databox {
          height: 60px;
          padding-left: 23px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          > div {
            display: flex;
            align-items: center;
          }
          h5 {
            font-size: 14px;
            color: #333333;
            letter-spacing: 0;
          }
          h3 {
            font-size: 30px;
            color: #00982d;
            letter-spacing: 0;
          }
          img {
            margin-left: 8px;
            width: 14px;
            height: 14px;
          }
        }
      }
      .detailed {
        width: 60%;
        margin: 0 20px;
        border: 0.5px solid #cccccc;
        display: flex;
        justify-content: space-between;
        .quantityCollection {
          // padding-left: 5%;
          margin: 20px 0;
          border-left: 2px solid rgba(204, 204, 204, 0.4);
          display: flex;
          align-items: center;
          // justify-content: space-between;
          flex-wrap: wrap;
          cursor: pointer;
          > div {
            width: 19%;
            // display: flex;
            // align-items: center;
            font-size: 14px;
            color: #333333;
            text-align: center;
            img {
              width: 12px;
              height: 12px;
              margin-right: 6px;
            }
            h4 {
              // margin-left: 20px;
              font-size: 20px;
              color: #111111;
            }
          }
        }
      }
    }
  }
  .filter {
    height: 72px;
    margin: 20px 0;
    padding: 16px 20px;
    background-color: #f8f8f8;
    > span {
      font-size: 14px;
      color: #333333;
      line-height: 40px;
      margin-right: 14px;
    }
  }
  .chartBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div {
      height: 420px;
      padding: 20px;
      border: 1px solid #cccccc;
      .title {
        padding-bottom: 10px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        border-bottom: 2px solid #e6e6e6;
        p {
          font-size: 16px;
          color: #333333;
        }
        .el-button {
          height: 20px;
        }
      }
    }
    .dataOverview {
      width: 100%;
      height: 100px;
      padding: 14px;
      position: absolute;
      left: 0;
      bottom: 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      p {
        width: 33%;
        font-size: 14px;
        color: #111111;
        line-height: 18px;
        text-align: center;
        font-weight: 600;
        span {
          color: #666666;
        }
      }
    }
    .imgbox {
      img {
        width: 200px;
        height: 235px;
        display: block;
        margin: 20px auto;
      }
    }
  }
}
</style>
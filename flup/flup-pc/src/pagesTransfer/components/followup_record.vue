<template>
  <div class="followup-record" :class="{'followup-record--open':isOpen}">
    <div class="followup-record_wrapper">
      <i class="followup-record_btn" :class="isOpen ? 'followup-record_btn--close':'followup-record_btn--open'" @click="isOpen = !isOpen"></i>
      <div class="scroll-auto height100 padding20">
        <section v-if="patientInfo.userId" class="followup-record_userinfo">
          <div>
            <span class="color-333">个人信息</span>
            <span class="margin-left20 color-111">{{`${patientInfo.patientName || ''}，${patientInfo.sex || ''}，${patientInfo.age}`}}</span>
          </div>
          <div class="margin-top10">
            <span class="color-333">联系电话</span>
            <span class="margin-left20 color-111">{{patientInfo.phone}}</span>
          </div>
          <div class="margin-top10">
            <span class="color-333">身份证号</span>
            <span class="margin-left20 color-111">{{patientInfo.idNo}}</span>
          </div>
        </section>
        <section v-if="patientInfo.userId" class="followup-record_content">
          <el-tabs v-model="activeTab" @tab-click="handleClick">
            <el-tab-pane label="随访记录" name="1">
              <div class="followupListbox" v-for="(item, index) in followupList" :key="index">
                <div class="titlebox">
                  <h3 @click="followupTable(index)">
                    {{item.planName}}
                    <i v-if="followupIndex == index " class="el-icon-arrow-up"></i>
                    <i v-else class="el-icon-arrow-down"></i>
                  </h3>
                  <!-- 呼叫中心缺失patientTypeCode故屏蔽 -->
                  <el-button :disabled="$route.name =='healtharchives' || $route.name=='IncomingCall'" type="text" @click="pushFollowup(item)">
                    详情
                    <i class="el-icon-arrow-right"></i>
                  </el-button>
                </div>
                <el-table v-if="followupIndex == index" :data="item.flupPath" border style="width: 100%">
                  <el-table-column prop="flupContent" label="随访内容" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="flupType" label="随访类型" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="flupStartTime" label="随访执行时间" width="120" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="status" label="状态" show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="健康监测" name="2">
              <el-table v-if="list.length!=0" :data="list" border style="width: 100%">
                <el-table-column prop="patientName" label="姓名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="sex" label="性别" show-overflow-tooltip></el-table-column>
                <el-table-column prop="age" label="年龄" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" label="操作" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button @click="jkjctz(scope.row)" type="text">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="住院记录" name="3">
              <el-table :data="mainList" border stripe>
                <el-table-column show-overflow-tooltip prop="admissionDatetime" :width="120" :formatter="$utils.formatTableDate()" label="入院时间"></el-table-column>
                <el-table-column prop="dischargeDatetime" :formatter="$utils.formatTableDate()" label="出院时间"></el-table-column>
                <el-table-column show-overflow-tooltip prop="dischargeWard" label="住院病区"></el-table-column>
                <el-table-column show-overflow-tooltip ::width="40" fixed="right" label="操作">
                  <template slot-scope="scope">
                    <el-button :disabled="$route.name =='healtharchives'" @click="onView(scope.row,patientModel.discharge)" type="text">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-if="total!=0"
                layout="prev, pager, next"
                :total="total"
                @current-change="handleCurrentChange"
                :page-size="pageSize"
                :pager-count="5"
                :current-page.sync="pageIndex"
                background
                small
              ></el-pagination>
            </el-tab-pane>
            <el-tab-pane label="门诊记录" name="4">
              <el-table :data="clinicReportList" border style="width: 100%">
                <el-table-column prop="medicalDate" label="就诊时间" show-overflow-tooltip></el-table-column>
                <el-table-column prop="medicalDoctor" label="就诊医生" show-overflow-tooltip></el-table-column>
                <el-table-column prop="clinicalDiagnosis" label="临床诊断" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" label="操作" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button :disabled="$route.name =='healtharchives'" @click="onView(scope.row,patientModel.out)" type="text">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="检查记录" name="5">
              <!-- <div>获取最新记录</div> -->
              <el-table :data="checkList" border style="width: 100%">
                <el-table-column show-overflow-tooltip prop="reportedDatetime" :formatter="$utils.formatTableDate()" :width="120" label="报告时间"></el-table-column>
                <el-table-column show-overflow-tooltip prop="examClassName" label="检查项目"></el-table-column>
                <el-table-column prop="reporter" :width="120" label="报告医生"></el-table-column>
                <el-table-column prop="status" label="操作" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button :disabled="$route.name =='healtharchives'" @click="onView(scope.row,patientModel.out)" type="text">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="体检记录" name="6">
              <el-table :data="healthCheck" border style="width: 100%">
                <el-table-column show-overflow-tooltip prop="tijianRq" label="体检日期">
                  <template slot-scope="scope">{{scope.row.tijianRq.substring(0,10)}}</template>
                </el-table-column>
                <!-- <el-table-column show-overflow-tooltip prop="zongjianRq" label="总检日期"></el-table-column> -->
                <el-table-column prop="type" label="体检类型"></el-table-column>
                <el-table-column prop="zongjianDoctor" label="总检医生"></el-table-column>
                <el-table-column prop="status" label="操作" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button :disabled="$route.name =='healtharchives'" @click="onView(scope.row,patientModel.out)" type="text">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="检验记录" name="7">
              <el-table :data="inspectionList" border style="width: 100%">
                <el-table-column show-overflow-tooltip prop="reportingDatetime" :width="120" :formatter="$utils.formatTableDate()" label="报告时间"></el-table-column>
                <el-table-column show-overflow-tooltip prop="testName" label="检验名称"></el-table-column>
                <el-table-column prop="reportingPhysician" label="报告医生"></el-table-column>
                <el-table-column prop="status" label="操作" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button :disabled="$route.name =='healtharchives'" @click="onView(scope.row,patientModel.out)" type="text">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </section>
        <knowlege></knowlege>
      </div>
    </div>
  </div>
</template>


<script>
import pagination from '@/mixins/pagination';
import Knowlege from './knowlege';
import { patientModel } from '@/mixins/enum.js';

export default {
  data() {
    return {
      isOpen: false,
      activeTab: '1',
      activeItem: '',
      mainList: [],
      knowlegeList: [],
      // patientInfo: {},
      knowledgeList: [],
      keyWord: '',
      patientTypeList: [],
      followupList: null,
      followupIndex: null,
      list: [],
      clinicReportList: [],
      checkList: [],
      inspectionList: [],
      healthCheck: [],
    };
  },
  mixins: [pagination, patientModel],
  components: { Knowlege },
  props: {
    id: String,
    patientInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    'patientInfo.serialNo'() {
      this.getInfo();
    },
  },
  created() {
    this.$apis.queryPatientTypeAll().then((res) => {
      this.patientTypeList = res.filter((x) => x.enabled);
    });
    if (this.patientInfo.userId) {
      this.getInfo();
    }
  },
  methods: {
    jkjctz(row) {
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + '/pc';
      }
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url: urlx + `/#/healthmonitor?userId=${row.userId}&patientName=${row.patientName}`,
          title: '健康监测',
        }),
        '*'
      );
    },
    getFollowupPlan() {
      this.$apis
        .getFollowupPlanByPatientNew({
          userId: this.patientInfo.userId,
          state: 0,
          complete: 0,
        })
        .then((res) => {
          this.followupList = res;
        });
      this.list = [];
      this.$nextTick(() => {
        this.list.push(this.patientInfo);
      });
      this.$apis
        .getClinicReportListExt({
          userId: this.patientInfo.userId,
        })
        .then((res) => {
          this.clinicReportList = res;
        });
    },
    pushFollowup(row) {
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + '/pc';
      }
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            urlx +
            `/#/healtharchives?userId=${this.patientInfo.userId}&name=${this.patientInfo.patientName}&sex=${this.patientInfo.sex}&age=${this.$utils.getAge(
              this.patientInfo.dateOfBirth
            )}&phone=${this.patientInfo.phone}&dateTime=${this.$utils.formatDate(this.patientInfo.createDatetime)}
             &recordSerialNo=${this.patientInfo.recordSerialNo}
            &joinPlanPatientType=${this.patientInfo.patientTypeCode}&flupPlanId=${this.patientInfo.flupPlan}&conceal=${this.patientInfo.planType == 0 ? true : false}&anchorPoint=${
              this.patientInfo.serialNo
            }`,
          title: '健康档案',
        }),
        '*'
      );
    },
    followupTable(index) {
      if (this.followupIndex == index) {
        this.followupIndex = null;
      } else {
        this.followupIndex = index;
      }
    },
    handleClick() {},
    //该方法获取患者信息
    getInfo() {
      this.$apis
        .bgetPatientInfoByUserId({
          patientId: this.patientInfo.userId || '',
        })
        .then((res) => {
          this.patientInfo.patientName = res.patientName;
          this.patientInfo.sex = res.sex;
          var age = this.$utils.getAge(res.dateOfBirth);
          this.patientInfo.age = age.substring(0, age.length - 1);
          this.patientInfo.idNo = res.idNo;
          this.patientInfo.dateOfBirth = res.dateOfBirth;
          this.patientInfo.phone = res.phone;

          this.$apis
            .getPatientDischargeRecordList({
              userId: this.patientInfo.userId,
              pageNo: this.pageIndex,
              pageSize: this.pageSize && 10,
            })
            .then((res) => {
              this.mainList = res.list;
              this.total = res.total;
              this.getFollowupPlan();
              this.getRecord();
            });
        });
    },
    getRecord() {
      let userId = this.patientInfo.userId;
      this.$apis.getEmrExamReportList({ userId,isHis: 0 }).then((res) => {
        this.checkList = res;
      });
      this.$apis.getEmrEmrLabReportList({ userId }).then((res) => {
        this.inspectionList = res;
      });
      this.$apis.getPhysicalExaminationList({ userId }).then((res) => {
        this.healthCheck = res;
      });
    },
    onView(row, patientTpype) {
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + '/pc';
      }
      // this.$router.push(
      //   `/healtharchives?userId=${this.patientInfo.userId}&name=${this.patientInfo.patientName}&sex=${this.patientInfo.sex}&age=${this.$utils.getAge(
      //     this.patientInfo.dateOfBirth
      //   )}&phone=${this.patientInfo.phone ? this.patientInfo.phone : ''}&dateTime=${this.$utils.formatDate(this.patientInfo.createTime)}&recordSerialNo=${
      //     this.patientInfo.recordSerialNo ? this.patientInfo.recordSerialNo : row.serialNo
      //   }&joinPlanPatientType=${patientTpype}&flupPlanId=${this.patientInfo.serialNo}&conceal=${true}&skip=${this.activeTab}&tijianBm=${row.tijianBm}`
      // );
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            urlx +
            `/#/healtharchives?userId=${this.patientInfo.userId}&name=${this.patientInfo.patientName}&sex=${this.patientInfo.sex}&age=${this.$utils.getAge(
              this.patientInfo.dateOfBirth
            )}&phone=${this.patientInfo.phone ? this.patientInfo.phone : ''}&dateTime=${this.$utils.formatDate(this.patientInfo.createTime)}&recordSerialNo=${
              this.patientInfo.recordSerialNo ? this.patientInfo.recordSerialNo : row.serialNo
            }&joinPlanPatientType=${patientTpype}&flupPlanId=${this.patientInfo.serialNo}&conceal=${true}&skip=${this.activeTab}&tijianBm=${row.tijianBm}`,
          title: '健康档案',
        }),
        '*'
      );
    },
  },
};
</script>

<style lang="scss">
.followup-record {
  // font-family: MicrosoftYaHei;
  // width: 480px;
  // position: fixed;
  // right: 0;
  // top: 0;
  // height: 100vh;
  // transition: all 0.3s ease-in;
  // background-color: #fff;
  // border: 1px solid #e6e6e6;
  // z-index: 9999;
  transition: all 0.3s ease;
  &--open {
    // background-color: red;
    // transform: translateX(-480px);
    .followup-record_wrapper {
      transform: translate(0);
    }
  }
  &_wrapper {
    position: fixed;
    width: 480px;
    top: 0;
    right: 0;
    height: 100vh;
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    background: #fff;
    z-index: 999;
    transform: translate(100%);
  }
  &_btn {
    position: absolute;
    left: -19px;
    top: calc(50vh - 28px);
    transition: all 0.3s ease;
    background-size: cover;
  }
  &_btn--open {
    height: 87px;
    width: 19px;
    background-image: url('~@/assets/images/open.png');
  }
  &_btn--close {
    height: 87px;
    width: 19px;
    background-image: url('~@/assets/images/close.png');
  }
  &_userinfo {
    background: #fbfbfb;
    padding: 16px 20px;
  }
  &_content {
    margin-top: 20px;
    .el-tabs__item {
      padding: 0 10px;
    }
  }
  &_knowlegelist {
    margin-top: 20px;
  }
  &_knowlegelist_title {
    padding: 14px 20px;
    background: #f7f7f7;
    font-size: 16px;
    color: #333333;
  }
  .followupListbox {
    padding: 20px 10px;
    .titlebox {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      h3 {
        cursor: pointer;
        i {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
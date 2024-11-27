<template>
  <div class="patientInfo">
    <div class="imgArea" v-show="imgUrl">
      <img
        :src="this.$baseURL.ICDMApiUrl + `/file/image/` + imgUrl"
        @click="closeImg"
      />
    </div>
    <el-tabs class="healtharchives-patient-info" v-model="activeName">
      <el-tab-pane v-if="patientProfile.BasicInfo" label="基本信息" name="1">
        <table class="table">
          <tr>
            <td class="table-label">姓名</td>
            <td class="table-value">
              {{ $utils.shield(patientInfo.patientName, 1) }}
            </td>
            <td class="table-label">身份证号</td>
            <td class="table-value">
              {{ $utils.shield(patientInfo.idNo, 3) }}
            </td>
          </tr>
          <tr>
            <td class="table-label">性别</td>
            <td class="table-value">{{ patientInfo.sex }}</td>
            <td class="table-label">年龄</td>
            <td class="table-value">{{ patientInfo.age }}</td>
          </tr>
          <tr>
            <td class="table-label">出生日期</td>
            <td class="table-value">
              {{ $utils.formatDate(patientInfo.dateOfBirth) }}
            </td>
            <td class="table-label">国籍</td>
            <td class="table-value">{{ patientInfo.nationality }}</td>
          </tr>
          <tr>
            <td class="table-label">民族</td>
            <td class="table-value">{{ patientInfo.clan }}</td>
            <td class="table-label">婚姻</td>
            <td class="table-value">{{ patientInfo.maritalStatus }}</td>
          </tr>
          <tr>
            <td class="table-label">家庭住址</td>
            <td class="table-value" colspan="3">
              <!-- {{ $utils.shield(patientInfo.homeAddrHouseNumber, 4) }} -->
              {{ patientInfo.homeAddrState }}{{ patientInfo.homeAddrCity
              }}{{ patientInfo.homeAddrCounty
              }}{{ patientInfo.homeAddrVillage }}
            </td>
          </tr>
        </table>

        <div class="pageTitle">既往史：</div>
        <div class="pageContent">
          <span>{{ patientInfo.pastHistory }}</span>
        </div>
        <div class="pageTitle">婚育史：</div>
        <div class="pageContent">
          <span>{{ patientInfo.marriageChildbirthHistory }}</span>
        </div>
        <div class="pageTitle">过敏史：</div>
        <div class="pageContent">
          <span>{{ patientInfo.allergyHistory }}</span>
        </div>
        <div class="pageTitle">家族史：</div>
        <div class="pageContent">
          <span>{{ patientInfo.familyHistory }}</span>
        </div>

        <div class="pageTitle">上传报告记录：</div>
        <div
          v-for="(item, index) in reportImgList"
          :key="index"
          class="reportImgList"
        >
          <div class="checkTitle">
            {{ item.reportTypeEnum }}
            <span>{{ item.createTime.slice(0, 10) }}</span>
          </div>
          <div class="checkList">
            <img
              v-show="jitem"
              v-for="(jitem, jindex) in item.fileIds"
              :key="jindex"
              @click="openImg('report', jitem)"
              :src="$baseURL.ICDMApiUrl + `/file/thumbnail/` + jitem"
            />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="patientProfile.AdmissionRec" label="入院记录" name="2">
        <el-table
          ref="admission"
          class="margin-top20"
          :data="admissionList"
          @current-change="setAdmissionRecordDetailSerialNo"
          highlight-current-row
          border
          stripe
        >
          <el-table-column
            show-overflow-tooltip
            prop="admissionWard"
            :width="120"
            label="入院病区"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="admissionDatetime"
            :width="120"
            :formatter="$utils.formatTableDate()"
            label="入院时间"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="presentHistory"
            label="住院诊断"
          ></el-table-column>
        </el-table>
        <AdmissionInfo :serialNo="admissionRecordDetailSerialNo" />
      </el-tab-pane>
      <el-tab-pane v-if="patientProfile.DischargeRec" label="出院记录" name="3">
        <el-table
          ref="discharge"
          class="margin-top20"
          :data="dischargeList"
          @current-change="getDischargeRecordDetail"
          highlight-current-row
          border
          stripe
        >
          <el-table-column
            show-overflow-tooltip
            prop="admissionWard"
            :width="120"
            label="入院病区"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="admissionDatetime"
            :width="120"
            :formatter="$utils.formatTableDate()"
            label="入院时间"
          ></el-table-column>
          <el-table-column
            prop="dischargeDatetime"
            :formatter="$utils.formatTableDate()"
            label="出院时间"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="admissionDays"
            label="住院天数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="admittingDiagnosis"
            label="住院诊断"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="chiefPhysician"
            label="主诊医生"
          ></el-table-column>
          <el-table-column
            v-if="parameterValue.componentValue == '1'"
            fixed="right"
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                @click="getDischargeRecordPDF(scope.row)"
                type="text"
                size="small"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <discharge-info :serialNo="currentDischargeSerialNo"></discharge-info>
      </el-tab-pane>
      <el-tab-pane v-if="patientProfile.ExamRec" label="检查记录" name="4">
        <div class="btn-group">
          <el-button type="primary" @click="getNewReport()">获取最新报告</el-button>
        </div>
        <el-table
          class="margin-top20"
          :data="inspectList"
          border
          stripe
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-row type="flex">
                <div class="min-width100px">影像所见</div>
                <div>{{ props.row.imagingFindings }}</div>
              </el-row>
              <el-row class="margin-top20" type="flex">
                <div class="min-width100px">检查结果</div>
                <div>{{ props.row.imagingDiagnosis }}</div>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="reportedDatetime"
            :formatter="$utils.formatTableDate()"
            :width="240"
            label="报告时间"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="examClassName"
            label="检查项目"
          ></el-table-column>
          <el-table-column
            prop="reporter"
            :width="120"
            label="报告医生"
          ></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane v-if="patientProfile.TijianRec" label="体检记录" name="5">
        <div class="table-part">
          <el-table
            ref="tablePhysicalExamination"
            class="margin-top20"
            :data="physicalExaminationList"
            border
            stripe
            highlight-current-row
            @current-change="physicalExamination"
          >
            <el-table-column
              show-overflow-tooltip
              prop="tijianRq"
              label="体检日期"
            >
              <template slot-scope="scope">
                {{ scope.row.tijianRq.substring(0, 10) }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="zongjianRq"
              label="总检日期"
            >
              <template slot-scope="scope">
                {{ scope.row.zongjianRq.substring(0, 10) }}
              </template>
            </el-table-column>
            <el-table-column prop="type" label="体检类型"></el-table-column>
            <el-table-column
              prop="zongjianDoctor"
              label="总检医生"
            ></el-table-column>
          </el-table>
        </div>
        <div class="content-part" v-if="physicalExaminationList.length > 0">
          <PhysicalExamination
            :healthCheckInfo="physicalExaminationDetail"
          ></PhysicalExamination>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="patientProfile.LabRec" label="检验记录" name="6">
        <el-table
          ref="table"
          class="margin-top20"
          :data="examineList"
          @expand-change="expand"
          border
          stripe
        >
          <el-table-column type="expand">
            <template slot-scope="{ row }">
              <el-table :data="row.labReport" border stripe>
                <el-table-column
                  show-overflow-tooltip
                  prop="testName"
                  label="检验项目"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="testResult"
                  label="检验结果"
                >
                  <template slot-scope="{ row }">
                    <div v-html="row.testResult"></div>
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="unit"
                  label="单位"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="correctFlag"
                  label="异常标志"
                ></el-table-column>
                <el-table-column show-overflow-tooltip label="参考范围">
                  <template slot-scope="{ row }">
                    <div
                      class="range"
                      v-if="row.referenceMin && row.referenceMax"
                    >
                      {{ row.referenceMin + "~" + row.referenceMax }}
                    </div>
                    <div
                      class="range"
                      v-else-if="
                        !row.referenceMin && !row.referenceMax && row.reference
                      "
                      v-html="row.reference"
                    ></div>
                    <div
                      class="range"
                      v-else
                      v-html="
                        row.referenceMin
                          ? row.referenceMin
                          : row.referenceMax
                          ? row.referenceMax
                          : row.reference
                          ? row.reference
                          : ''
                      "
                    ></div>
                    <!-- {{ `${row.referenceMin} ~ ${row.referenceMax}` }} -->
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="reportingDatetime"
            :width="120"
            :formatter="$utils.formatTableDate()"
            label="报告时间"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="testName"
            label="检验名称"
          ></el-table-column>
          <el-table-column
            prop="reportingPhysician"
            label="报告医生"
          ></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane v-if="patientProfile.ClinicRec" label="门诊记录" name="7">
        <el-table
          class="margin-top20"
          :data="clinicList"
          border
          stripe
        >
          <el-table-column
            show-overflow-tooltip
            prop="medicalDate"
            :width="120"
            :formatter="$utils.formatTableDate()"
            label="就诊时间"
          ></el-table-column>
          <el-table-column
            prop="medicalDoctor"
            label="就诊医生"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="clinicalDiagnosis"
            label="临床诊断"
          ></el-table-column>
          <el-table-column
            v-if="parameterValue.componentValue == '1'"
            fixed="right"
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                @click="getDischargeRecordPDF(scope.row)"
                type="text"
                size="small"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <patientPro :serialNo="currentPatientProSerialNo"></patientPro>
        <!-- <div class="recordPDF" v-if="clinicRecordPDF" display="clinicRecordPDF ? block : none">
          <div class="closeIcon">
            <i class="el-icon-close" @click="clinicRecordPDF = !clinicRecordPDF"></i>
          </div>
          <div class="iframeContainer">
            <iframe
              display="clinicRecordPDF ? block : none"
              :src="clinicRecordPDFUrl"
              frameborder="0"
            ></iframe>
          </div>
        </div>-->
      </el-tab-pane>
      <el-tab-pane v-if="patientProfile.OperationRec" label="手术记录" name="8">
        <el-table
          ref="operationRec"
          class="margin-top20"
          :data="operationGetList"
          border
          stripe
          @current-change="setOperationInfo"
          highlight-current-row
        >
          <el-table-column
            show-overflow-tooltip
            prop="startDatetime"
            :width="120"
            :formatter="$utils.formatTableDate()"
            label="手术时间"
          ></el-table-column>
          <el-table-column
            prop="operativeName"
            label="手术名称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="surgeon"
            label="主刀医生"
          ></el-table-column>
        </el-table>
        <Operation :operationInfo="operationInfo" />
      </el-tab-pane>
      <el-tab-pane
        v-if="patientProfile.HealthManagementRec"
        label="健管记录"
        name="9"
      >
        <healthRecords :userId="userId"></healthRecords>
      </el-tab-pane>
      <el-tab-pane label="核销记录" name="10">
        <verificationRecords :idNo="patientInfo.idNo"></verificationRecords>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DischargeInfo from "@/pages/followup/discharge_info/newDischarge";
import AdmissionInfo from "@/pages/followup/discharge_info/admissionInfo";
import Operation from "@/pages/followup/discharge_info/operation";
import PhysicalExamination from "./physicalExamination.vue";
import healthRecords from "./healthRecords.vue";
import verificationRecords from "./verificationRecords.vue";
import patientPro from "../../../followup/discharge_info/patientPro.vue";
export default {
  name: "patient-table-value",
  components: {
    DischargeInfo,
    AdmissionInfo,
    Operation,
    PhysicalExamination,
    healthRecords,
    verificationRecords
  },
  props: {
    userId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      activeName: "1",
      patientInfo: {},
      dischargeList: [],
      admissionList: [],
      inspectList: [],
      examineList: [],
      physicalExaminationList: [],
      clinicList: [],
      physicalList: [],
      operationGetList: [],
      dischargeRecordDetail: {},
      currentPatientProSerialNo: "",
      currentDischargeSerialNo: "",
      admissionRecordDetailSerialNo: "",
      reportImgList: [],
      imgUrl: "",
      recordPdfUrl: "",
      showRecordPDF: false,
      parameterValue: {},
      clinicRecordPDF: false,
      clinicRecordPDFUrl: "",
      packages: "",
      flupPlanId: null,
      operationInfo: {},
      pageNo: 1,
      pageSize: 10,
      total: 0,
      patientProfile: {
        BasicInfo: 1,
        AdmissionRec: 1,
        DischargeRec: 1,
        ExamRec: 1,
        LabRec: 1,
        ClinicRec: 1,
        OperationRec: 1,
        TijianRec: 1
      },
      physicalExaminationDetail: {},
      currentRow: null
    };
  },
  watch: {
    userId: {
      handler(newVal, oldVal) {
        this.activeName = "1";
        this.util();
      }
    }
  },
  mounted() {
    this.$apis
      .getFlupConfigList({
        hospitalId: this.$global.hospital_id,
        moduleCode: "patientProfile"
      })
      .then(res => {
        res.forEach(element => {
          this.patientProfile[element.componentKey] = parseInt(
            element.componentValue
          );
        });
        if (
          localStorage.getItem("activeName") &&
          this.patientProfile.HealthManagementRec
        ) {
          this.activeName = localStorage.getItem("activeName") + "";
        }
      })
      .finally(() => {
        localStorage.removeItem("activeName");
      });

    this.flupPlanId = this.$route.query.flupPlanId;
    if (this.$route.query.skip) {
      if (this.$route.query.skip == 3) {
        this.activeName = "2";
      } else if (this.$route.query.skip == 4) {
        this.activeName = "7";
      } else if (this.$route.query.skip == 5) {
        this.activeName = "4";
      } else if (this.$route.query.skip == 6) {
        this.activeName = "5";
      } else if (this.$route.query.skip == 7) {
        this.activeName = "6";
      }
    }
    this.util();
  },

  methods: {
    setOperationInfo(item) {
      this.operationInfo = item;
    },
    getDischargeRecordDetail(item) {
      this.currentDischargeSerialNo = item.serialNo;
      // this.$apis.getDischargeRecordDetail({serialNo: item.serialNo}).then((res)=>{
      //   this.dischargeRecordDetail = res
      // })
    },
    getPatientProDetail(item) {
      this.currentPatientProSerialNo = item.serialNo;
    },
    setAdmissionRecordDetailSerialNo(item) {
      this.admissionRecordDetailSerialNo = item.serialNo;
    },
    physicalExamination(row) {
      this.currentRow = row;
      this.$apis
        .getphysicalExaminationDetail({
          tijianBM: row.tijianBm
        })
        .then(res => {
          this.physicalExaminationDetail = res;
        });
    },
    expand(row, obj) {
      let isExpand = obj.includes(row);
      if (!row.labReport && isExpand) {
        this.$apis
          .getEmrLabReportDetail({
            labSn: row.labSn,
            patientId: this.patientInfo.patientId
          })
          .then(res => {
            this.$set(row, "labReport", res);
            this.$nextTick(() => {
              // console.log(this.$refs);
              this.$refs.table.toggleRowExpansion(row, true);
            });
          });
      }
    },
    openImg(type, index) {
      if (type == "report") {
        this.imgUrl = index;
      } else if (type == "jc") {
        this.imgUrl = this.jcList[index];
      } else {
        this.imgUrl = this.jyList[index];
      }
    },
    closeImg() {
      this.imgUrl = "";
    },
    withoutPDF() {
      this.$message({
        message: "没有病人病历PDF",
        type: "warning"
      });
    },
    getDischargeRecordPDF(row) {
      if (this.parameterValue.componentValue == "1") {
        this.recordPdfUrl = row.recordPdfUrl;
        this.showRecordPDF = true;
        // console.log(row)
      } else {
        this.withoutPDF();
      }
    },
    util() {
      let userId = this.$route.query.userId || this.userId;

      this.$apis.getEmrPatientBaseInfo({ userId }).then(res => {
        this.patientInfo = res;
      });
      this.$apis
        .queryEmrAdmissionRecordList({
          userId,
          hospitalId: this.$global.hospital_id
        })
        .then(res => {
          this.admissionList = res;
          if (this.admissionList.length != 0) {
            this.$nextTick(() => {
              this.$refs.admission.setCurrentRow(this.admissionList[0]);
            });
          }
        });
      this.$apis.getEmrDischargeRecordList({ userId }).then(res => {
        this.dischargeList = res;
        this.recordPdfUrl = res;
        if (this.dischargeList.length == 0) {
          this.dischargeRecordDetail = {};
        } else {
          this.$nextTick(() => {
            this.$refs.discharge.setCurrentRow(this.dischargeList[0]);
          });
        }
      });

      //接口回来了
      this.$apis.getEmrExamReportList({ userId,isHis: 0 }).then(res => {
        this.inspectList = res;
      });
      //接口消失了
      this.$apis.getEmrEmrLabReportList({ userId }).then(res => {
        this.examineList = res;
      });
      this.$apis.getPhysicalExaminationList({ userId }).then(res => {
        this.physicalExaminationList = res;
        if (this.$route.query.skip == 6) {
          let item = this.physicalExaminationList.find(i => {
            return i.tijianBm == this.$route.query.tijianBm;
          });
          this.$refs.tablePhysicalExamination.setCurrentRow(item);
          this.physicalExamination(item);
        } else {
          this.$refs.tablePhysicalExamination.setCurrentRow(
            this.physicalExaminationList[0]
          );
          this.physicalExamination(this.physicalExaminationList[0]);
        }
      });
      this.$apis.getClinicReportListExt({ userId }).then(res => {
        this.clinicList = res;
        if (this.clinicList.length) {
          this.$nextTick(() => {
            this.$refs.patientProTable.setCurrentRow(this.clinicList[0]);
          });
        }
        this.clinicRecordPDFUrl = res;
      });
      this.$apis.reportQuery(userId).then(res => {
        this.reportImgList = res;
      });
      this.$apis
        .queryFlupConfigOne({
          hospitalId: this.$global.hospital_id,
          moduleCode: "followUpSetting",
          componentKey: "jkdaPdfSource"
        })
        .then(res => {
          this.parameterValue = res;
        });

      this.$apis
        .operationGetList({
          hospitalId: this.$global.hospital_id,
          userId: userId
        })
        .then(res => {
          this.operationGetList = res;

          if (this.operationGetList.length != 0) {
            this.$nextTick(() => {
              this.$refs.operationRec.setCurrentRow(this.operationGetList[0]);
            });
          }
        });
    },
    getNewReport() {
      this.$apis.getEmrExamReportList({ userId: this.$route.query.userId,isHis: 1 }).then(res => {
              this.inspectList = res;
            });
     }
      
  }
};
</script>

<style lang="scss">
.healtharchives-patient-info {
  .el-tabs__header.is-top {
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 1;
  }
}
</style>

<style lang="scss" scoped>
.patientInfo {
  position: relative;
  width: 100%;
  height: 100%;
  .imgArea {
    z-index: 90;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    font-size: 0;
    background-color: rgba(0, 0, 0, 0.9);
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .pageTitle {
    margin: 20px;
    font-size: 16px;
  }
  .pageContent {
    margin: 30px;
    font-size: 14px;
  }
  .checkTitle {
    padding: 0 3.75%;
    line-height: 44px;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0.2px;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
    span {
      float: right;
      font-size: 12px;
      color: #999999;
    }
  }
  .checkList {
    margin-bottom: 8px;
    padding: 12px 3.75%;
    font-size: 0;
    background: #fff;
    img {
      width: 80px;
      height: 80px;
      margin-right: 10px;
      object-fit: cover;
    }
  }
  .recordPDF {
    position: fixed;
    padding: 10%;
    overflow: scroll;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1500;
    background-color: rgba(0, 0, 0, 0.3);

    .closeIcon {
      position: absolute;
      left: 90%;
      top: 5%;
      z-index: 1599;
      .el-icon-close {
        width: 50px;
        height: 50px;
        font-size: 50px;
        z-index: 1500;
      }
      .el-icon-close::before {
        width: 50px;
        height: 50px;
        color: #fff;
        z-index: 1500;
      }
    }
  }
  .iframeContainer {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    iframe {
      width: 80%;
      min-height: 800px;
      margin: 0 auto;
      display: block;
    }
  }
  .packageContentbox {
    h3 {
      font-size: 18px;
      padding: 20px 0 10px;
      border-bottom: 1px solid #ccc;
    }
    p {
      display: flex;
      line-height: 30px;
      span {
        display: block;
        width: 50%;
      }
    }
  }
  .btn-group {
    display: flex;
    justify-content: end;
    margin: 10px 0;
  }
}
</style>

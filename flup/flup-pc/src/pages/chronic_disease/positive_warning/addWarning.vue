<template>
  <div class="addWarning">
    <div class="queryConditionsBox">
      <div class="search">
        <div class="queryConditions">
          <p>患者类型</p>
          <el-select class="width200px" v-model="patientType" placeholder="请选择" :clearable="isAuthority" @change="getPatientData">
            <el-option :value="1" label="门诊患者"></el-option>
          </el-select>
        </div>
        <div class="queryConditions">
          <p>科室</p>
          <el-select class="width200px" v-model="deptId" placeholder="请选择" :clearable="isAuthority" @change="getPatientData" filterable>
            <el-option v-for="item in newDeptList" :key="item.serialNo" :value="item.serialNo" :label="item.deptName"></el-option>
          </el-select>
        </div>
        <div class="queryConditions">
          <p>患者姓名</p>
          <el-input class="value width200px limiting" v-model="patientName" placeholder="请输入患者姓名" maxlength="10" show-word-limit @keyup.enter.native="onSearch">
            <!-- <el-button slot="append" icon="el-icon-search"></el-button> -->
          </el-input>
        </div>
        <div class="queryConditions">
          <p>手机号</p>
          <el-input class="value width200px limiting" v-model="patientPhone" placeholder="请输入手机号" maxlength="11" show-word-limit @keyup.enter.native="onSearch">
            <!-- <el-button slot="append" icon="el-icon-search"></el-button> -->
          </el-input>
        </div>
        <div class="queryConditions">
          <p>身份证</p>
          <el-input class="value width300px limiting" v-model="patientIdCard" placeholder="请输入身份证号" maxlength="18" show-word-limit @keyup.enter.native="onSearch">
            <!-- <el-button slot="append" icon="el-icon-search"></el-button> -->
          </el-input>
        </div>
        <div class="queryConditions">
          <el-button type="success" plain @click="onSearch">查询</el-button>
          <el-button type="success" plain @click="next" :disabled="!multipleSelection.length==1">下一步</el-button>
        </div>
      </div>
      <el-table :data="patientData" border stripe @selection-change="handleSelectionChange" ref="patientList">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column width="60" type="index" label="序号"></el-table-column>
        <el-table-column prop="patientName" label="姓名"></el-table-column>
        <el-table-column prop="sex" label="性别" show-overflow-tooltip width="60"></el-table-column>
        <el-table-column prop="age" label="年龄" show-overflow-tooltip width="60"></el-table-column>
        <el-table-column prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="handleUser" label="病人类型" show-overflow-tooltip>门诊患者</el-table-column>
        <el-table-column prop="idNo" label="身份证"></el-table-column>
        <el-table-column prop="medicalDate" label="就诊时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="admissionTimes" label="入院时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dischargeDatetime" label="出院时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="medicalDept" label="科室" show-overflow-tooltip></el-table-column>
        <el-table-column prop="clinicalDiagnosis" label="诊断" show-overflow-tooltip></el-table-column>
        <el-table-column prop="flupPlan" label="入组情况" show-overflow-tooltip></el-table-column>
        <el-table-column prop="doctorName" label="随访/慢管医生" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <el-pagination class="pageBottom" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="prev, pager, next, jumper" :total="total"></el-pagination>
    <el-dialog :visible="addPositiveWarningShow" width="1000px" :show-close="false" :modal-append-to-body="false">
      <div class="patientInfo">
        <div class="labelkey">患者信息</div>
        <div class="valueArea">
          <div class="baseInfo">
            <div class="base">
              <label class="key">姓名</label>
              <span class="value">{{patientInfo.patientName}}</span>
            </div>
            <div class="base">
              <label class="key">性别</label>
              <span class="value">{{patientInfo.sex}}</span>
            </div>
            <div class="base">
              <label class="key">年龄</label>
              <span class="value">{{patientInfo.age}}岁</span>
            </div>
          </div>
          <div class="baseInfo">
            <div class="base">
              <label class="key">病人类型</label>
              <span class="value">门诊患者</span>
            </div>
            <div class="base">
              <label class="key">手机号</label>
              <span class="value">{{patientInfo.phone}}</span>
            </div>
            <div class="base">
              <label class="key">身份证</label>
              <span class="value">{{patientInfo.idNo}}</span>
            </div>
          </div>
          <div class="baseInfo">
            <div class="base">
              <label class="key">科室</label>
              <span class="value">{{patientInfo.medicalDept}}</span>
            </div>
            <div class="base">
              <label class="key">诊断</label>
              <span class="value">{{patientInfo.clinicalDiagnosis}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="contentForm">
        <div class="labelkey">阳性内容</div>
        <div class="valueArea">
          <div class="base">
            <label class="key">分类</label>
            <div class="value">
              <el-radio v-model="classification" label="1">A类</el-radio>
              <el-radio v-model="classification" label="2">B类</el-radio>
              <el-radio v-model="classification" label="3">其他</el-radio>
            </div>
          </div>
          <div class="base">
            <label class="key">预警类型</label>
            <div class="value">重大阳性</div>
          </div>
          <div class="base">
            <label class="key">预警内容</label>
            <el-input type="text" v-model="warningText" placeholder="简要概括异常内容"></el-input>
          </div>
          <div class="base">
            <label class="key">异常内容</label>
            <el-input type="textarea" v-model="abnormalContent" placeholder="详细描述异常内容和患者对应情况"></el-input>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="left">
          <el-button type="success" plain @click="goback">上一步</el-button>
        </div>
        <div class="right">
          <el-button type="success" plain @click="submit" :disabled="!warningText ||!abnormalContent||!classification">完成</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
  
  <script>
import PatientInfo from '../health_archives/components/patient_info.vue';
export default {
  data() {
    return {
      his_setion_id: '',
      deptList: [],
      deptId: '',
      isAuthority: false,
      pageNo: 1,
      pageSize: 10,
      name: '',
      states: [],
      currentPage: 1,
      deptList: [],
      query: {},
      ruleForm: {
        fuType: '',
        fuContent: '',
        handlingResult: '',
      },
      addPositiveWarningShow: false,
      patientData: [],
      patientName: '',
      patientType: 1,
      patientPhone: '',
      patientIdCard: '',
      warningText: '',
      abnormalContent: '',
      multipleSelection: [],
      patientInfo: {},
      hospitalId: '',
      total: null,
      classification: null,
    };
  },
  async created() {
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id;
    await this.getRight();
    await this.getDeptList();
    this.getPatientData();
  },
  computed: {
    newDeptList() {
      let list = [];
      if (!this.isAuthority) {
        list = this.deptList.filter((item) => item.serialNo == this.his_setion_id);
      } else {
        list = this.deptList;
      }
      return list;
    },
  },
  methods: {
    async getRight() {
      let { ret_data } = await this.$apis.getPermissions({});
      if (ret_data.dataRangeList && ret_data.dataRangeList.length) {
        let info = ret_data.dataRangeList[0];
        if ((info.model_id = 678 && info.data_range >= 300)) {
          this.isAuthority = true;
        } else {
          // await this.getSectionDetail();
          // this.his_setion_id = this.$global.sectionId;
          this.his_setion_id = JSON.parse(sessionStorage.getItem('global')).sectionId;
          this.$nextTick(() => {
            this.deptId = JSON.parse(sessionStorage.getItem('global')).sectionId;
          });
        }
      }
      console.log('权限', ret_data.dataRangeList);
    },
    async getSectionDetail() {
      let { ext_prop_value } = await this.$apis.getSectionDetail({ sectionId: JSON.parse(sessionStorage.getItem('global')).sectionId });
      if (ext_prop_value) {
        this.his_setion_id = JSON.parse(ext_prop_value).his_setion_id;
        this.$nextTick(() => {
          this.deptId = JSON.parse(ext_prop_value).his_setion_id;
        });
      }
    },
    //新增患者异常标记
    next() {
      this.patientInfo = this.multipleSelection[0];
      this.addPositiveWarningShow = true;
    },
    getDeptList() {
      this.$apis
        .departmentquery({
          flupDepartment: 1,
          hospitalId: this.$global.hospital_id,
          pageNo: 1,
          pageSize: 1000,
        })
        .then((res) => {
          this.deptList = res.list;
          // console.log('科室', this.deptList);
        });
    },
    getPatientData() {
      this.$apis
        .getPositivePatientList({
          pageNo: this.pageNo,
          pageSize: 10,
          hospitalId: this.hospitalId,
          deptId: this.deptId,
          patientName: this.patientName,
          patientIdCard: this.patientIdCard,
          patientPhone: this.patientPhone,
        })
        .then((res) => {
          this.total = res.total;
          if (res.list.length != 0) {
            res.list.forEach((i) => {
              i.age = this.caculateAge(i.dateOfBirth, i.medicalDate);
            });
          }
          this.patientData = res.list;
        });
    },
    //计算年龄
    caculateAge(birthDay, medicalDate) {
      let currentDate = medicalDate ? new Date(medicalDate) : new Date();
      let birthDate = new Date(birthDay);
      let age = currentDate.getFullYear() - birthDate.getFullYear();
      let monthDiff = currentDate.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    onSearch() {
      this.pageNo = 1;
      this.getPatientData();
    },
    goback() {
      if (this.warningText || this.abnormalContent || this.classification) {
        this.$confirm('返回上一步将会丢失该页所填内容，是否确认返回上一步？')
          .then((_) => {
            this.closeDialog();
            done();
          })
          .catch((_) => {});
      } else {
        this.closeDialog();
      }
    },
    handleSelectionChange(val) {
      if (val.length == 0) {
        this.multipleSelection = [];
      } else if (this.multipleSelection.length == 0 && val.length == 1) {
        this.multipleSelection = val;
      } else {
        this.$message({
          type: 'warning',
          message: '单次只能选取一位患者',
        });
        this.multipleSelection = [];
        this.$refs.patientList.clearSelection();
      }
    },
    submit() {
      this.$apis
        .addPositiveWarning({
          age: this.patientInfo.age,
          classification: this.classification,
          clinicId: this.patientInfo.clinicNo,
          deptId: this.patientInfo.medicalDeptCode,
          deptName: this.patientInfo.medicalDept,
          // doctorId: this.patientInfo.doctorId,
          doctorName: this.patientInfo.medicalDoctor,
          hospitalId: this.hospitalId,
          patientId: this.patientInfo.patientId,
          patientName: this.patientInfo.patientName,
          sex: this.patientInfo.sex,
          userId: this.patientInfo.userId,
          warningContent: this.warningText,
          abnormalContent: this.abnormalContent,
        })
        .then((res) => {
          this.$message({
            type: 'success',
            message: '提交成功',
          });
          this.closeDialog();
          this.multipleSelection = [];
          this.$refs.patientList.clearSelection();
        });
    },
    closeDialog() {
      this.warningText = '';
      this.abnormalContent = '';
      this.classification = '';
      this.addPositiveWarningShow = false;
    },
    // 分页查询
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getPatientData();
    },
  },
};
</script>
  
<style lang="scss">
.addWarning {
  padding: 0px 20px 20px 20px;
  [role='tab'] {
    border: 1px solid #e6e6e6;
  }
  .el-select__tags-text {
    display: inline-block;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }
  .dialog-footers {
    .el-button {
      width: 96px !important;
      height: 36px !important;
      margin-left: 10px !important;
    }
    .is-plain {
      background: #f5faff;
      box-sizing: border-box;
      border: 1px solid #0276d7;
      color: #0276d7;
    }
    .is-plain:hover {
      background: #409eff;
      color: #ffffff;
    }
  }
  .el-tabs__item {
    border: none !important;
  }
  table {
    border-collapse: collapse;
    border-color: #e6e6e6;
    tr {
      td {
        // padding: 10px 30px;
      }
      .keys {
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 0.2px;
        color: #666666;
      }
      .values {
        font-size: 14px;
        font-weight: normal;
        letter-spacing: 0.2px;
        color: #111111;
      }
    }
  }
  .el-dialog__wrapper {
    .patientInfo,
    .contentForm {
      display: flex;
      padding: 15px;
      .labelkey {
        font-size: 16px;
        font-weight: 600;
        color: #666;
        margin-right: 20px;
        min-width: 120px;
      }
      .valueArea {
        width: 100%;
        .baseInfo {
          display: flex;
          margin-bottom: 10px;
          .base {
            width: 33%;
          }
        }
        .base {
          color: #333;
        }
        .key {
          color: #666666;
        }
      }
    }
    .contentForm {
      .base {
        display: flex;
        margin-bottom: 10px;
        width: 100%;
        .key {
          min-width: 100px;
        }
        .value {
          min-width: 60%;
        }
      }
    }
    .bottom {
      margin-top: 50px;
      display: flex;
      .left {
        width: 50%;
      }
      .right {
        text-align: right;
        width: 50%;
      }
    }
  }
}
</style>
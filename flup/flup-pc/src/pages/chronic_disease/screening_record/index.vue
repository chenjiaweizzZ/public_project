<template>
  <div class="screening_record">
    <div class="queryConditionsBox">
      <div class="queryConditions"></div>
      <el-select class="margin-left10 width110px select-time-key" v-model="searchTimeKey" @change="onSearch">
        <el-option v-for="item in timeKeyList" :key="item.label" :value="item.value" :label="item.label" :disabled="item.disabled"></el-option>
      </el-select>
      <el-date-picker
        class="select-time-val"
        type="daterange"
        v-model="searchTimeVal"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        range-separator="至"
        clearable
        @change="onSearch"
      ></el-date-picker>
      <div class="queryConditions">
        <p>筛选指标名称</p>
        <el-input class="value width300px limiting" v-model="ruleName" placeholder="请输入关键字" maxlength="20" show-word-limit @keyup.enter.native="onSearch">
          <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
        </el-input>
      </div>
      <div class="queryConditions">
        <el-button type="success" plain @click="onSearch">查询</el-button>
      </div>
    </div>
    <el-collapse
      v-if="mainList.list && mainList.list.length != 0"
      style="margin-bottom:60px"
      class="margin-top20"
      v-model="activeName"
      accordion
      @change="getPatientList"
      v-loading="dataLoading"
    >
      <el-collapse-item v-for="(item, index) in mainList.list" :key="index" :name="index">
        <template slot="title">
          <div class="color-333 bold margin-left20 title" @click.stop="showCollapse()">
            <span class="text">{{ item.ruleName }}</span>
            <span class="text">筛选人数{{ item.warningCount }}人</span>
            <span class="float-right" @click="deleteMore">批量删除</span>
            <span class="float-right" @click="createGroup">创建患者组</span>
            <span class="float-right" @click="addGroup">加入患者组</span>
            <span class="float-right" @click="sendknowledge">发送宣教</span>
            <span class="float-right" @click="message">发送短信</span>
          </div>
        </template>
        <el-table :data="item.patientList" border stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="patientName" label="患者姓名" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="sex" label="性别" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="age" label="年龄" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="patientId" label="病案号" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="clinicNo" label="门诊号" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="medicalDate" label="就诊时间" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="tmWarningCreateTime" label="筛选时间" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="medicalDept" label="就诊科室" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="clinicalDiagnosis" label="就诊诊断" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="tmWarningDeptName" label="开单科室" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="patientState" label="患者状态" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="planCondition" label="入组情况" min-width="100"></el-table-column>
          <el-table-column width="220" label="随访/慢病组" prop="groupCondition"></el-table-column>
          <el-table-column width="220" label="随访/慢病人员" prop="planDoctorCondition"></el-table-column>
          <el-table-column show-overflow-tooltip width="220" label="操作">
            <template slot-scope="scope">
              <el-button @click.stop="deletePatient([scope.row])" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <div class="fpimgbox" v-else>
      <img src="~@/assets/images/zwsj.png" alt="暂无数据" />
    </div>
    <el-pagination
      class="pageBottom"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="mainList.total"
    ></el-pagination>
    <el-dialog title="发送宣教" :visible.sync="knowledgeDialogVisible" width="80%">
      <SelectTemplate ref="selectTemplate" @next="onNext"></SelectTemplate>
      <span slot="footer" class="dialog-footer">
        <el-button @click="knowledgeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendknowledgeSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="发送短信" :visible.sync="messageDialogVisible" width="80%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="messageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendMessageSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="创建患者组" :visible.sync="createGroupDialogVisible" width="50%">
      <el-form :model="groupForm" :rules="groupRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="患者组名称" prop="groupName">
          <el-input v-model="groupForm.groupName" maxlength="20" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createGroupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createGroupSubmit" :disabled="!groupForm.groupName">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="加入患者组" :visible.sync="addGroupDialogVisible" width="50%">
      <el-form :model="addForm" :rules="addRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="患者组名称" prop="groupName">
          <el-select v-model="addForm.groupId" placeholder="请选择患者组名称">
            <el-option v-for="item in patientGroupList" :key="item.groupId" :label="item.groupName" :value="item.groupId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGroupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGroupSubmit" :disabled="!addForm.groupId">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
///components/select_template   pagesTransfer\questionaire\send\components
import SelectTemplate from '../../../pagesTransfer/questionaire/send/components/select_template';
export default {
  data() {
    return {
      mainList: {},
      activeName: '',
      pageNo: 1,
      pageSize: 10,
      name: '',
      currentPage: 1,
      deptList: [],
      ruleName: '',
      timeKeyList: [
        { label: '就诊时间', value: 'orderTime' },
        { label: '筛选时间', value: 'filterTime' },
      ],
      searchTimeVal: null,
      searchTimeKey: 'filterTime',
      dataLoading: false,
      multipleSelection: [],
      messageDialogVisible: false,
      knowledgeDialogVisible: false,
      createGroupDialogVisible: false,
      addGroupDialogVisible: false,
      templateList: [],
      patientGroupList: [],
      groupForm: {
        groupName: '',
      },
      groupRules: {
        groupName: [{ required: true, message: '请输入患者组名称', trigger: 'blur' }],
      },
      addForm: {
        groupId: '',
      },
      addRules: {
        groupId: [{ required: true, message: '请选择患者组', trigger: 'change' }],
      },
    };
  },
  components: {
    SelectTemplate,
  },
  created() {
    this.onSearch();
  },
  methods: {
    // 获取时间
    dateAdd(days) {
      var date = new Date();
      date.setDate(date.getDate() + days);
      var time = date.toISOString().slice(0, 10);
      return time;
    },
    // 获取列表
    getWrining(pageNo) {
      this.mainList.list = [];
      this.activeName = '';
      let loadingInstance = this.$loading({
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)',
      });
      this.$apis
        .getPositiveRuleRecordList({
          pageNo: pageNo || this.pageNo,
          pageSize: this.pageSize,
          dataCreateStartTime: this.searchTimeKey == 'orderTime' ? (this.searchTimeVal && this.searchTimeVal[0] ? this.searchTimeVal[0] : '') : '', //就诊起始时间
          createStartTime: this.searchTimeKey == 'filterTime' ? (this.searchTimeVal && this.searchTimeVal[0] ? this.searchTimeVal[0] : '') : '', //筛选起始时间
          dataCreateEndTime: this.searchTimeKey == 'orderTime' ? (this.searchTimeVal && this.searchTimeVal[1] ? this.searchTimeVal[1] : '') : '', //就诊结束时间
          createEndTime: this.searchTimeKey == 'filterTime' ? (this.searchTimeVal && this.searchTimeVal[1] ? this.searchTimeVal[1] : '') : '', //筛选结束时间
          ruleName: this.ruleName,
          ruleType: 2,
        })
        .then((res) => {
          loadingInstance.close();
          this.mainList = res;
          if (this.mainList.list.length > 0) {
            this.mainList.list.forEach((i) => {
              i.patientList = [];
            });
          }
        });
    },
    //筛选出的患者数据
    getPatientList(str) {
      if (str || str === 0) {
        this.dataLoading = true;
        this.$apis
          .getRuleWarningPatientList({
            pageNo: 1,
            pageSize: 999,
            dataCreateStartTime: this.searchTimeKey == 'orderTime' ? (this.searchTimeVal && this.searchTimeVal[0] ? this.searchTimeVal[0] : '') : '', //就诊起始时间
            createStartTime: this.searchTimeKey == 'filterTime' ? (this.searchTimeVal && this.searchTimeVal[0] ? this.searchTimeVal[0] : '') : '', //筛选起始时间
            dataCreateEndTime: this.searchTimeKey == 'orderTime' ? (this.searchTimeVal && this.searchTimeVal[1] ? this.searchTimeVal[1] : '') : '', //就诊结束时间
            createEndTime: this.searchTimeKey == 'filterTime' ? (this.searchTimeVal && this.searchTimeVal[1] ? this.searchTimeVal[1] : '') : '', //筛选结束时间
            serialNo: this.mainList.list[parseInt(str)].serialNo,
          })
          .then((res) => {
            // console.log(res, 'resresresres');
            this.mainList.list[str].patientList = res.list;
            this.mainList.list[str].warningCount = res.list.length;
            this.$nextTick(() => {
              this.activeName = str;
              this.dataLoading = false;
            });
          });
      }
    },

    // 分页查询
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getWrining(val);
    },
    // 删除患者
    deletePatient(arr) {
      this.$confirm('确定从列表中删除所选用户吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        customClass: 'screening_record',
      })
        .then(() => {
          let warnSerialNoList = [];
          arr.forEach((i) => {
            warnSerialNoList.push(i.tmWarningSerialNo);
          });
          this.$apis
            .deleteWarningDetail({
              warnSerialNoList: warnSerialNoList,
            })
            .then((res) => {
              this.getPatientList(this.activeName);
            });
        })
        .catch(() => {});
    },
    message() {
      if (this.selectPatient()) {
        this.messageDialogVisible = true;
      }
    },
    sendMessageSubmit() {},
    sendknowledge() {
      if (this.selectPatient()) {
        this.knowledgeDialogVisible = true;
        this.$refs.selectTemplate.clearSelection();
      }
    },
    sendknowledgeSubmit() {
      // this.templateList = this.$refs.selectTemplate.selectedList;
      let templateList = this.$refs.selectTemplate.selectedList;
      if (!templateList || templateList.length == 0) {
        this.$message({
          message: `请至少选择一份${this.type == 2 ? '问卷' : '宣教'}`,
          type: 'warning',
        });
        return;
      }
      // let templateList = this.$refs.selectTemplate.selectedList;
      let patientList = this.multipleSelection;
      let quesTemps = [],
        patients = [];
      templateList.forEach((element) => {
        quesTemps.push({
          questionnaireId: element.serialNo,
          questionnaireName: element.questionnaireName,
          versionNumber: element.versionNumber,
        });
      });
      patientList.forEach((element) => {
        patients.push({
          deptName: element.deptName,
          deptCode: element.deptCode,
          userId: element.userId,
          patientName: element.patientName,
          idNo: element.idNo,
          openId: element.openId,
          phone: element.phone,
          // patientSourceTableName: tableName,
          patientSourceTableId: element.serialNo || '',
          // patientTypeCode: this.$refs.selectPatient.patientTypeCode,
          patientId: element.patientId,
        });
      });
      let loadingInstance = this.$loading({
        text: '正在发送中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)',
      });
      this.$apis
        .questionnairesendTemplateManual({
          userId: this.$global.serial_no || '',
          userName: this.$global.user_name || '',
          deptId: this.$global.dept_id || '',
          deptName: this.$global.dept_name || '',
          questionnaireTypeId: this.$route.params.type == 'wenjuan' ? '1' : this.$route.params.type == 'WJDC' ? '1' : '3',
          quesTemps: quesTemps,
          patients: patients,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          loadingInstance.close();
          this.$notify.info({
            title: '发送完成',
            message: res,
          });
        });
    },
    onNext(v) {
      this.templateList = this.$refs.selectTemplate.selectedList;
      if (!this.templateList || this.templateList.length == 0) {
        this.$message({
          message: `请至少选择一份${this.type == 2 ? '问卷' : '宣教'}`,
          type: 'warning',
        });
        return;
      }
      // // this.showSendView = true
    },
    createGroup() {
      if (this.selectPatient()) {
        this.createGroupDialogVisible = true;
        this.groupForm.groupName = '';
      }
    },
    createGroupSubmit() {
      //创建患者组
      // this.$apis
      //   .createGroup({
      //     patientGroupName: this.groupForm.groupName,
      //   })
      //   .then((res) => {
      //     console.log('createGroupSubmit', res);
      //     this.createGroupDialogVisible = false;
      //     this.patientGroupList = [];
      //     this.$message({
      //       type: 'success',
      //       message: '操作成功!',
      //     });
      //   });

      //创建患者组并加入患者
      this.$apis
        .createAndJoin({
          groupName: this.groupForm.groupName,
          patients: this.multipleSelection,
        })
        .then((res) => {
          console.log('createAndJoinGroupSubmit', res);
          this.createGroupDialogVisible = false;
          this.patientGroupList = [];
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
        });
    },
    getPatientGroupList() {
      this.$apis
        .patientGroupList({
          pageNo: 1,
          pageSize: 999,
          patientGroupName: '',
        })
        .then((res) => {
          console.log(res, 'patientGroupListpatientGroupList');
          this.patientGroupList = res.list;
        });
    },
    addGroup() {
      if (this.selectPatient()) {
        this.addGroupDialogVisible = true;
        this.addForm.groupId = '';
      }
      if (this.patientGroupList.length == 0) {
        this.getPatientGroupList();
      }
    },
    addGroupSubmit() {
      this.$apis
        .joinGroup({
          groupId: this.addForm.groupId,
          patients: this.multipleSelection,
        })
        .then((res) => {
          console.log('createGroupSubmit', res);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
          this.addGroupDialogVisible = false;
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteMore() {
      // console.log('multipleSelection', this.multipleSelection);
      if (this.selectPatient()) {
        this.deletePatient(this.multipleSelection);
      }
    },
    selectPatient() {
      if (this.multipleSelection.length > 0) {
        return true;
      } else {
        this.$message({
          type: 'error',
          message: '请先选择至少一名患者!',
        });
        return false;
      }
    },
    showCollapse() {},
    // 搜索
    onSearch() {
      this.getWrining('1');
    },
  },
};
</script>

<style lang="scss">
.screening_record {
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
  .el-collapse {
    border: 0;
  }
  .el-collapse-item__content {
    border: 1px solid #e6e6e6;
    padding: 20px;
  }
  .el-collapse-item + .el-collapse-item {
    margin-top: 10px;
  }
  .el-collapse-item__header {
    border: 0;
    background: #fbfbfb;
    height: 44px;
    line-height: 44px;
  }
  .fpimgbox {
    width: 100%;
    padding-top: 50px;
    img {
      width: 300px;
      height: 350px;
      display: block;
      margin: 0 auto;
    }
  }
  .item {
    display: flex;
    align-items: top;
    margin-bottom: 20px;
    .key {
      display: inline-block;

      width: 100px;
      padding-right: 14px;
      text-align: right;
    }
    .value {
      flex: 1;
    }
  }
  .title {
    flex: 1;
    .text {
      margin-right: 20px;
    }
    .warning {
      padding: 4px 12px;
      height: 28px;
      background: #ffe7db;
      border-radius: 14px;
      font-size: 14px;
      font-weight: normal;
      color: #ff7b35;
    }
    .float-right {
      float: right;
      margin-right: 20px;
      color: #0276d7;
    }
  }
  .main {
    height: 590px;
    display: flex;
    .left {
      width: 310px;
      background: #ffffff;
      border: 1px solid #e6e6e6;
      display: flex;
      flex-direction: column;
      .demo-ruleForm {
        padding: 20px 10px 0;
        .items {
          margin-bottom: 14px;
          .key {
            font-size: 14px;
            color: #333333;
            margin-bottom: 10px;
          }
        }
      }
    }
    .right {
      overflow-y: auto;
      margin-left: 20px;
      flex: 1;
    }
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
}
</style>

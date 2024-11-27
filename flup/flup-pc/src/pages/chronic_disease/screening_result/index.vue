<template>
  <div class="screening_result">
    <div class="header">
      <div class="search">
        <span>搜索</span>
        <el-input style="width: 299px;" placeholder="请输入名称查询" v-model="patientGroupName" :clearable="true"></el-input>
        <div class="search-icon" @click="getPatientGroupList">
          <i class="el-icon-search"></i>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="positive-table">
        <el-table :data="tableData" border style="width: 100%" highlight-current-row @current-change="tableDataChange" ref="singleTable">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="groupName" label="患者组名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope.row)">编辑</el-button>
              <el-button type="text" @click="deleteGroup(scope.row)">删除</el-button>
              <el-button type="text" @click="message(scope.row)">短信</el-button>
              <el-button type="text" @click="sendknowledge(scope.row)">宣教</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pageBottom"
          :page-sizes="[10, 20, 30, 50]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :current-page.sync="pageNo"
          :page-size="pageSize"
          layout="total,sizes,prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
      <div class="right">
        <el-table :data="patientsData" border style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="patientName" label="姓名"></el-table-column>
          <el-table-column prop="patientId" label="病案号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deptName" label="就诊科室" show-overflow-tooltip></el-table-column>
          <el-table-column prop="tmWarningDeptName" label="开单科室" show-overflow-tooltip></el-table-column>
          <el-table-column prop="clinicalDiagnosis" label="就诊诊断" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="deletePatient(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="编辑患者组" :visible.sync="groupDialogVisible" width="50%">
      <el-form :model="groupForm" :rules="groupRules" ref="groupForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="患者组名称" prop="groupName">
          <el-input v-model="groupForm.groupName" maxlength="20" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="groupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGroupSubmit" :disabled="!groupForm.groupName">确 定</el-button>
      </span>
    </el-dialog>
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
  </div>
</template>
<script>
import SelectTemplate from '../../../pagesTransfer/questionaire/send/components/select_template';
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      patientsData: [],
      patientGroupName: '',
      title: '标题',
      dialogVisible: false,
      groupDialogVisible: false,
      groupForm: {
        groupName: '',
        groupId: '',
      },
      groupRules: {
        groupName: [{ required: true, message: '请输入患者组名称', trigger: 'blur' }],
      },
      currentGroup: {},
      knowledgeDialogVisible: false,
      messageDialogVisible: false,
    };
  },
  components: {
    SelectTemplate,
  },
  created() {
    this.getPatientGroupList();
  },
  methods: {
    //患者组列表
    getPatientGroupList() {
      this.$apis
        .patientGroupList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          patientGroupName: this.patientGroupName,
        })
        .then((res) => {
          console.log(res, 'patientGroupListpatientGroupList');
          this.tableData = res.list;
          if (this.tableData.length > 0) {
            this.currentGroup = this.tableData[0];
            this.$refs.singleTable.setCurrentRow(this.currentGroup);
            this.getPatientMembersList();
          }
        });
    },
    //组下的患者列表
    getPatientMembersList() {
      this.patientsData = [];
      this.$apis
        .groupPatientList({
          groupId: this.currentGroup.groupId,
        })
        .then((res) => {
          this.patientsData = res;
        });
    },
    tableDataChange(val) {
      console.log(val, 'hhhhhhhhhh');
      this.currentGroup = val;
      this.getPatientMembersList();
    },
    /**
     * 删除患者组
     * @param {object} row
     */
    deleteGroup(row) {
      this.$confirm('确定删除该患者组吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        customClass: 'screening_result',
      })
        .then(() => {
          this.$apis
            .deleteGroup({
              groupId: row.groupId,
            })
            .then((res) => {
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              this.getPatientGroupList();
            });
        })
        .catch(() => {});
    },
    /**
     * 编辑患者组
     * @param {object} row
     */
    edit(row) {
      this.title = '编辑患者组';
      this.groupDialogVisible = true;
      this.groupForm.groupId = row.groupId;
      this.groupForm.groupName = row.groupName;
    },
    editGroupSubmit() {
      this.$apis
        .updateGroup({
          patientGroupName: this.groupForm.groupName,
          groupId: this.groupForm.groupId,
        })
        .then((res) => {
          console.log('createGroupSubmit', res);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
          this.groupDialogVisible = false;
          this.getPatientGroupList();
        });
    },
    deletePatient(row) {
      this.$confirm('确定删除该患者吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        customClass: 'screening_result',
      })
        .then(() => {
          this.$apis
            .deleteGroupPatient({
              patientId: row.patientId,
              groupId: this.currentGroup.groupId,
            })
            .then((res) => {
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              this.getPatientMembersList();
            });
        })
        .catch(() => {});
    },
    // 保存新增、编辑阳性指标规则
    Determine() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$apis
            .savePositiveIndicatorRule({
              serialNo: this.ruleForm.serialNo ? this.ruleForm.serialNo : undefined,
              effectiveScope: this.ruleForm.effectiveScope.join(','),
              ruleName: this.ruleForm.ruleName,
              classification: this.ruleForm.classification,
              ruleDescribe: this.ruleForm.ruleDescribe,
              ruleConfigConditionDtoList: this.ruleForm.ruleConfigConditionDtoList,
              needNotify: this.ruleForm.needNotify,
              notifyContents: this.ruleForm.notifyContents,
            })
            .then((res) => {
              this.$message({
                type: 'success',
                message: '操作成功!',
              });
              this.handleClose();
              this.getSelectPositiveRuleListCount();
              this.getPositiveIndicatorRuleList();
            });
        }
      });
    },
    /**
     * 分页查询
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.getPatientGroupList();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getPatientGroupList();
    },
    message() {
      this.messageDialogVisible = true;
    },
    sendMessageSubmit() {},
    sendknowledge() {
      this.knowledgeDialogVisible = true;
      // this.$refs.selectTemplate.clearSelection();
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
      let patientList = this.patientsData;
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
  },
};
</script>
<style lang="scss" scoped>
.screening_result {
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    height: 72px;
    padding: 16px 20px;
    background: #fbfbfb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .search {
      display: flex;
      align-items: center;
      span {
        // width: 50px;
        margin-right: 14px;
      }
      .search-icon {
        cursor: pointer;
        flex-shrink: 0;
        margin-left: 10px;
        width: 48px;
        height: 40px;
        border: 1px solid #d7dae0;
        box-sizing: border-box;
        text-align: center;
        line-height: 40px;
        border-radius: 4px;
      }
      // .search-icon:hover{
      //   background-color: ;
      // }
    }
  }
  .main {
    margin-top: 20px;
    padding: 0 20px;
    flex: 1;
    display: flex;
    // flex-direction: column;
    .title {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.2px;
      color: #3d3d3d;
      margin-bottom: 10px;
      span {
        color: #ff7b35;
        margin-left: 10px;
      }
    }
    .none,
    .positive-table {
      flex: 1;
      padding-bottom: 72px;
      width: 50%;
    }
    .right {
      width: 45%;
      margin-left: 15px;
    }
    .none {
      position: relative;
      .img {
        width: 264px;
        height: 214px;
        text-align: center;
        position: absolute;
        top: 30%;
        left: 0;
        right: 0;
        margin: 0 auto;
        .title {
          font-size: 18px;
          font-weight: normal;
          color: #111;
        }
      }
    }
  }

  .select {
    .main {
      width: 409px;
      height: 204px;
      display: flex;
      flex-direction: row;
      .left {
        width: 148px;
        border-right: 1px solid #e6e6e6;
        .items {
          cursor: pointer;
          width: 100%;
          height: 40px;
          padding-left: 15px;
          line-height: 40px;
        }
        .active {
          background: rgba(102, 102, 102, 0.04);
        }
      }
      .right {
        flex: 1;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        .options {
          flex: 1;
          overflow-y: auto;
        }
        .items {
          cursor: pointer;
          width: 100%;
          height: 40px;
          padding-left: 5px;
          line-height: 40px;
        }
        .active {
          background: rgba(102, 102, 102, 0.04);
        }
      }
    }
  }
  .indicators-dialog {
    .key {
      position: relative;
      font-size: 16px;
      font-weight: normal;
      color: #333333;
      margin-bottom: 28px;
    }
    .key::after {
      position: absolute;
      content: '';
      height: 1px;
      width: 100%;
      background-color: #d7dae0;
      left: 0;
      bottom: -14px;
    }
    .item {
      height: 55px;
      margin-bottom: 10px;
      display: flex;
      .keys {
        margin-left: 10px;
      }
    }
  }
}
</style>
<style lang="scss">
.positive-indicators {
  .header {
    .search {
      .el-button--small {
        width: 48px;
        height: 40px !important;
      }
    }
  }
  .el-button--primary {
    padding: 8px 17px !important;
    min-width: 0 !important;
  }
  .dialog-footer {
    padding: 0 !important;
  }
  .none {
    .img {
      .el-button--primary {
        padding: 6px 17px !important;
        margin-left: 10px;
        border: 1px solid #0276d7;
        background: #f5faff;
        color: #0276d7;
        height: 28px;
        padding: none;
      }
    }
  }
  .input {
    .el-input__suffix {
      display: flex;
      align-items: center;
    }
  }
  .input-with-select {
    .el-input__inner {
      border-color: #d7dae0 !important;
    }
  }
  .input-with-select {
    .el-input__inner:focus {
      border-color: #32ae57 !important;
    }
  }
}
</style>

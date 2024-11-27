<template>
  <div class="processList">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="" v-if="type != 1">
        <el-input v-model="formInline.keyWord" placeholder="姓名/学号"></el-input>
      </el-form-item>
      <el-form-item label="科室：">
        <el-select v-model="formInline.deptIdsName" placeholder="请选择" multiple collapse-tags clearable @remove-tag="deptRemove()">
          <el-option class="baseOption" value>
            <el-tree :props="baseProps" :data="deptList" show-checkbox ref="deptTree" check-strictly node-key="id" check-on-click-node
              @check-change="deptSelect" class="hosWithNoCheckBox"></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学员类型">
        <el-select v-model="formInline.stuType" placeholder="全部">
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in studTypeList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年级" v-if="type != 1">
        <el-select v-model="formInline.grade" placeholder="全部">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考核月份">
        <el-date-picker v-model="formInline.month" type="month" placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="formInline.status" placeholder="全部">
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in statusList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onReset" v-if="type != 1">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button @click="processItem" v-if="roleAuthority['monthTestProcess']">审核</el-button>
    <el-button>批量导出</el-button>
    <el-table :data="tableData" style="width: 100%;margin-top: 20px;" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="showPersonalInfo(scope.row)">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="学号" align="center"></el-table-column>
      <el-table-column prop="turnGradeTxt" label="年级" align="center"></el-table-column>
      <el-table-column prop="turnDeptName" label="轮转科室" align="center"></el-table-column>
      <el-table-column prop="planBeginTime" label="计划轮转周期" width="200px" align="center">
        <template slot-scope="scope">
          {{scope.row.planBeginTime}}-{{scope.row.planEndTime}}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="实际轮转周期" width="200px" align="center">
        <template slot-scope="scope">
          {{scope.row.realBeginTime}}-{{scope.row.realEndTime}}
        </template>
      </el-table-column>
      <el-table-column prop="evaluateMonth" label="考核月份" align="center"></el-table-column>
      <el-table-column prop="workAttendance" label="考勤情况" width="300px" align="center"></el-table-column>
      <el-table-column prop="address" :label="item.content" v-for="(item, index) in templateList" :key="index" width="200px" align="center">
        <template slot="header" slot-scope="scope">
          {{item.content}}
        </template>
        <template slot-scope="scope">{{scope.row.address}}</template>
      </el-table-column>
      <el-table-column prop="firstResponsibleUname" label="第一责任人" align="center" width="100px"></el-table-column>
      <el-table-column prop="secondResponsibleUname" label="第二责任人" align="center" width="100px"></el-table-column>
      <el-table-column prop="evaluateAuditUname" label="护士长" align="center"></el-table-column>
      <el-table-column prop="evaluateAuditStatus" label="审核状态" align="center">
        <template slot-scope="scope">
          {{scope.row.evaluateAuditStatus == 1 ? '已审核' : '待审核'}}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center" width="150px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="checkDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <month-test-com :disabledVal="disabledVal" :isEdit="isEdit" :previewId="templateId" :isShow="isShow" @updateDialog="changeDialog"
      :title="title" :currentDetail="currentDetail"></month-test-com>
    <!-- 个人档案 -->
    <other-student-info :studentDetailId="studentDetailId" :dialogRecords.sync="dialogRecords" :sysType='sysTypeNum'></other-student-info>
  </div>
</template>
<script>
  import { post, getCookie, exportMouldExcel, showErrorImport } from '../../config/util.js';
  import { mapState, mapActions } from 'vuex';
  import monthTestCom from "../../components/monthTestCom.vue"
  import otherStudentInfo from "../../components/otherStudentInfo.vue"
  import moment from 'moment';
  export default {
    data() {
      return {
        dialogRecords: false,
        studentDetailId: "",
        templateList: [],
        templateId: "",
        type: 0, // 0 非学生 1学生
        title: "",
        testId: "11",
        isEdit: false,
        isShow: false,
        total: 0,
        pageSize: 10,
        disabledVal: true,
        pageNum: 1,
        multipleSelection: [],
        tableData: [],
        statusList: [
          { label: "全部", value: null },
          { label: "待审核", value: 0 },
          { label: "已审核", value: 1 }
        ],
        studTypeList: [
          { label: '全部', value: null },
          { label: '大专', value: 1 },
          { label: '本科', value: 2 },
          { label: '专硕', value: 3 },
        ],
        baseProps: {
          children: "childrens",
          label: "name",
        },
        currentDetail: {},
        deptList: [],
        formInline: {
          keyWord: "",
          deptIdsName: [],
          deptIds: [],
          deptNames: [],
          stuType: "",
          grade: "",
          month: "",
          status: ""

        },
        selectable(row) {
          if (row.evaluateAuditStatus == 1) {
            return false
          } else {
            return true
          }
        },
      }
    },
    components: {
      monthTestCom,
      otherStudentInfo
    },
    computed: {
      ...mapState(['roleAuthority', 'sysTypeNum']),
    },
    created() {
      this.type = this.$route.query.type
      this.getRoleAuthority()
      if (this.type != 1) {
        let lastMonth = moment().subtract(1, 'months');
        this.formInline.month = lastMonth.format('YYYY-MM')
        this.getTableData()
      }
      this.getTemplate()
      this.getMyDeptTree()
    },
    methods: {
      ...mapActions(['getRoleAuthority']),
      showPersonalInfo(row) {
        this.studentDetailId = String(row.uid)
        this.dialogRecords = true
      },
      deptSelect() {
        let deptSelectList = this.$refs.deptTree.getCheckedNodes()
        this.formInline.deptIds = []
        this.formInline.deptIdsName = []
        deptSelectList.forEach(i => {
          this.formInline.deptIds.push(i.id)
          this.formInline.deptIdsName.push(i.name)
        })
      },
      deptRemove(val) {
        let deptSelectList = this.$refs.deptTree.getCheckedNodes()
        let deptIds = []
        let deptIdsName = []
        deptSelectList.forEach(i => {
          if (i.id != val.id) {
            deptIds.push(i.id)
            deptIdsName.push(i.name)
          }

        })
        this.formInline.deptIds = deptIds
        this.formInline.deptIdsName = depdeptIdsNametIds
        this.$refs.deptTree.setCheckedKeys(deptIds)
      },
      getTemplate() {
        post(`/base/scoringtemplate/getLatestTemplate`, {
          category: 1,
          type: 5,
        }).then(res => {
          if (res && res.resCode == 200) {
            this.templateList = res.model.scoringQuestionVos
            this.templateId = String(res.model.id)
          } else {
            this.$message({
              type: "warning",
              message: "请求月考核模版报错！"
            })
          }
        })
      },
      getTableData() {
        post(`/pub/pubevaluationmonth/listEvaluationMonth?pageSize=${this.pageSize}&pageNum=${this.pageNum}`, {
          keyword: this.formInline.keyword,
          deptIdList: this.formInline.deptIds,
          studType: this.formInline.stuType,
          turngrade: this.formInline.grade,
          evaluateMonth: moment(this.formInline.month).format('YYYY-MM'),
          evaluateAuditStatus: this.formInline.status == "" ? null : this.formInline.status,
          evaluateStatus: 1
        }).then(res => {
          if (res && res.resCode == 200) {
            this.tableData = res.rows
          } else {
            this.$message({
              type: "warning",
              message: "获取月考核列表失败！"
            })
          }
        })
      },
      getMyDeptTree() {
        let self = this
        post("/base/dept/getMyDeptTree", {
          showHospital: 1,
          showNoDeptHospital: 0,
          needBaseDept: 1
        }).then(res => {
          if (res.resCode == 200) {
            self.deptList = res.model
          }
        })
      },
      processItem() {
        if (this.multipleSelection.length == 0) {
          this.$message.error('请至少选择一项进行审核！');
        } else if (this.multipleSelection.length > 1) {
          this.$confirm(`<p>已选${this.multipleSelection.length}人：</p><p>提交后不可再次编辑，确认提交审核吗？</p>`, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true
          }).then(() => {
            let ids = this.multipleSelection.map(item => { return item.pubEvaluationMonthId })
            post(`/pub/pubevaluationmonth/auditEvaluateBatch`, {
              ids: ids,
            }).then(res => {
              if (res && res.resCode == 200) {
                this.$message({
                  type: "success",
                  message: "审核成功！"
                })
                this.getTableData()
              } else {
                this.$message({
                  type: "warning",
                  message: "审核失败！"
                })
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消审核！'
            });
          });
        } else {
          this.templateId = String(this.multipleSelection[0].pubScoringSubmitRecordId)
          this.currentDetail = this.multipleSelection[0]
          this.isEdit = false
          this.isShow = true
          this.disabledVal = false
          this.title = "审核"
        }

      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      onReset() {
        this.formInline = {
          keyWord: "",
          deptIds: [],
          deptNames: [],
          stuType: "",
          grade: "",
          month: moment().subtract(1, 'months').format('YYYY-MM'),
          status: ""
        }
      },
      onSubmit() {
        this.getTableData()
      },
      checkDetail(row) {
        this.currentDetail = row
        this.templateId = String(row.pubScoringSubmitRecordId)
        this.isShow = true
        this.isEdit = false
        this.disabledVal = true
        this.title = "查看详情"
      },
      changeDialog(val) {
        if (val) {
          this.getTableData()
        }
        this.isShow = false
      },
      renderHeader(h, { column }) {
        return (
          <el-tooltip
            class="item"
            effect="dark"
            content={column.label}
            placement="top"
          >
            <span>{column.label}</span>
          </el-tooltip>
        )
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getTableData()
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getTableData()
      },
    }
  }
</script>
<style scoped>
  .processList {
    padding: 0 20px;
  }
</style>
<style>
  .processList .el-pagination {
    margin-top: 20px;
    text-align: right;
  }
</style>
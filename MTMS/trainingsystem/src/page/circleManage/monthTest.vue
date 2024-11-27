<template>
  <div class="monthTest">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="">
        <el-input v-model="formInline.keyWord" placeholder="姓名/学号"></el-input>
      </el-form-item>
      <el-form-item label="科室：">
        <el-select v-model="formInline.deptIdsName" placeholder="请选择" multiple collapse-tags clearable @remove-tag="deptRemove()">
          <el-option class="baseOption" value></el-option>
          <el-tree :props="baseProps" :data="deptList" show-checkbox ref="deptTree" check-strictly node-key="id" check-on-click-node
            @check-change="deptSelect" class="hosWithNoCheckBox"></el-tree>

        </el-select>
      </el-form-item>
      <el-form-item label="学员类型">
        <el-select v-model="formInline.stuType" placeholder="全部">
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in studTypeList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年级">
        <el-select v-model="formInline.grade" placeholder="全部">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考核月份">
        <el-date-picker v-model="formInline.month" type="month" placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="考核状态">
        <el-select v-model="formInline.status" placeholder="全部">
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in statusList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button>批量导出</el-button>
    <el-table :data="tableData" style="width: 100%;margin-top: 20px;" border>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
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
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.questionOptionVOMap[item.id].content" placement="top" v-if="scope.row.questionOptionVOMap != null">
            <p>{{scope.row.questionOptionVOMap[item.id].code}}</p>
          </el-tooltip>
          <p v-else>——</p>
        </template>
      </el-table-column>
      <el-table-column prop="firstResponsibleUname" label="第一责任人" align="center" width="100px"></el-table-column>
      <el-table-column prop="secondResponsibleUname" label="第二责任人" align="center" width="100px"></el-table-column>
      <el-table-column prop="evaluateAuditUname" label="护士长" align="center"></el-table-column>
      <el-table-column prop="evaluateStatus" label="考核状态" align="center">
        <template slot-scope="scope">
          {{scope.row.evaluateStatus == 1 ? '已考核' : '待考核'}}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center" width="150px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="testOpen(scope.row)" v-if="scope.row.evaluateStatus == 0">考核</el-button>
          <el-button type="text" size="mini" @click="checkDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <month-test-com :disabledVal="disabledVal" :isEdit="isEdit" :previewId="templateId" :isShow="isShow" @updateDialog="changeDialog"
      :title="title" :currentDetail="currentDetail"></month-test-com>
  </div>
</template>
<script>
  import { post, getCookie, exportMouldExcel, showErrorImport } from '../../config/util.js';
  import monthTestCom from "../../components/monthTestCom.vue"
  import moment from 'moment';
  export default {
    data() {
      return {
        baseProps: {
          children: "childrens",
          label: "name",
        },
        title: "",
        templateId: "",
        modelTemplate: "",
        isEdit: false,
        isShow: false,
        total: 0,
        pageSize: 10,
        disabledVal: true,
        pageNum: 1,
        currentDetail: {},
        tableData: [{ address: "111" }],
        statusList: [
          { label: "全部", value: null },
          { label: "待考核", value: 0 },
          { label: "已考核", value: 1 }
        ],
        studTypeList: [
          { label: '全部', value: null },
          { label: '大专', value: 1 },
          { label: '本科', value: 2 },
          { label: '专硕', value: 3 },
        ],
        deptList: [],
        formInline: {
          keyWord: "",
          deptIds: [],
          deptNames: [],
          stuType: "",
          grade: "",
          month: "",
          status: ""

        },
        templateList: [],
      }
    },
    components: {
      monthTestCom
    },
    // filters: {
    //   formatData(data) {
    //     console.log(data,"--")
    //     if (data == ) {
    //       return data.code
    //     }
    //   }
    // },
    created() {
      this.formInline.month = moment().subtract(1, 'months').format('YYYY-MM')
      this.getTableData()
      this.getTemplate()
      this.getMyDeptTree()
    },
    methods: {
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
      getTemplate() {
        post(`/base/scoringtemplate/getLatestTemplate`, {
          category: 1,
          type: 5,
        }).then(res => {
          if (res && res.resCode == 200) {
            this.templateList = res.model.scoringQuestionVos
            this.modelTemplate = String(res.model.id)
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
          evaluateStatus: this.formInline.status == "" ? null : this.formInline.status
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
        // this.testId = row
        this.currentDetail = row
        this.templateId = row.evaluateStatus == 1 ? String(row.pubScoringSubmitRecordId) : this.modelTemplate
        this.isShow = true
        this.isEdit = false
        this.disabledVal = true
        this.title = "查看详情"

      },
      testOpen(row) {
        this.templateId = this.modelTemplate
        this.currentDetail = row
        this.isShow = true
        this.isEdit = true
        this.disabledVal = false
        this.title = "考核"
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
  .monthTest {
    padding: 0 20px;
  }
</style>
<style>
  .monthTest .el-pagination {
    margin-top: 20px;
    text-align: right;
  }
</style>
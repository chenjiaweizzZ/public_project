<template>
  <el-dialog
    title="出院患者列表"
    :visible.sync="dialogVisible"
    width="80%"
    :close-on-click-modal="false"
    @close="$emit('update:show', false)"
  >
    <div v-loading="isLoading">
      <OperationHeader>
        <el-button
          type="primary"
          @click="onAdd"
          :loading="isSubmitting"
          :disabled="!multipleSelection"
        >{{ isSubmitting ? "正在添加..." : "添加到计划" }}</el-button>
        <template v-slot:right>
          <el-select
            class="width200px"
            clearable
            disabled
            v-model="query.deptCode"
            placeholder="选择出院科室"
          >
            <el-option
              v-for="item in options"
              :key="item.serialNo"
              :label="item.deptName"
              :value="item.serialNo"
            ></el-option>
          </el-select>
          <el-date-picker
            class="margin-left10 width230px"
            v-model="query.date"
            clearable
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <el-input
            class="margin-left10 width150px"
            clearable
            v-model="query.patientName"
            placeholder="请输入姓名"
          ></el-input>
          <el-input
            class="margin-left10 width150px"
            clearable
            v-model="query.diagnose"
            placeholder="请输入诊断"
            @keyup.enter.native="onSearch"
          ></el-input>
          <el-button class="margin-left10" type="primary" @click="onSearch">查询</el-button>
        </template>
      </OperationHeader>
      <el-table
        class="margin-top20"
        :data="list"
        stripe
        border
        highlight-current-row
        @current-change="handleSelectionChange"
      >
        <el-table-column :width="50" label="选择">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.row.serialNo">
              {{
              ""
              }}
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          :formatter="$utils.shieldName"
          width="90"
          prop="patientName"
          label="姓名"
        ></el-table-column>
        <el-table-column show-overflow-tooltip width="100" prop="planCondition" label="入组情况"></el-table-column>
        <el-table-column show-overflow-tooltip width="50" prop="sex" label="性别"></el-table-column>
        <el-table-column width="80" show-overflow-tooltip prop="age" label="年龄"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="120" label="手机号码">
          <template slot-scope="scope">
            <span>{{ $utils.shield(scope.row.phone, 2) }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="patientId" label="病案号"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          :formatter="$utils.formatTableDate()"
          min-width="110"
          prop="admissionDatetime"
          label="入院日期"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop="dischargeDept" min-width="110" label="出院科室"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          :formatter="$utils.formatTableDate()"
          min-width="110"
          prop="dischargeDatetime"
          label="出院日期"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="110"
          prop="dischargeDiagnosis"
          label="出院诊断"
        ></el-table-column>
      </el-table>
      <el-pagination
        v-if="list.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageIndex"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
      ></el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import pagination from '@/mixins/pagination'
export default {
  props: {
    plan: {
      type: Object,
    },
    show: {
      type: false,
    },
  },
  mixins: [pagination],
  data() {
    return {
      // 选中的数据
      multipleSelection: null,
      // 全部数据
      list: [],
      query: {
        date: null,
        diagnose: '',
        patientName: '',
        deptCode: '',
      },
      isLoading: true,
      options: [],
      radio: '',
      dialogVisible: this.show,
      isSubmitting: false,
    }
  },
  watch: {
    show() {
      this.dialogVisible = this.show
    },
  },
  created() {
    this.query.deptCode = this.plan.executiveDeptId
    this.$apis
      .departmentgetFlupDeptByHospitalId({
        hospitalId: this.$global.hospital_id,
      })
      .then((res) => {
        this.options = res
      })
    // this.$apis.getDeptList().then(res => {
    //   this.options = res;
    // });
    this.getMainList()
  },
  methods: {
    getMainList() {
      this.isLoading = true
      this.$apis
        .getGroupPatienList({
          patientName: this.query.patientName,
          dischargeStartTime: this.query.date ? this.query.date[0] : '',
          dischargeEndTime: this.query.date ? this.query.date[1] : '',
          deptId: this.query.deptCode,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          diagnosis: this.query.diagnose,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.list = res.list || []
          this.total = res.total
          this.isLoading = false
        })
      // this.$apis.getPatientDischargeRecord({
      //   patient_name: this.query.patientName,
      //   start_date: this.query.date ? this.query.date[0] : '',
      //   end_date: this.query.date ? this.query.date[1] : '',
      //   dept_code: this.query.deptCode,
      //   page_index: this.pageIndex,
      //   page_size: this.pageSize,
      //   diagnosis: this.query.diagnose
      // }).then(res => {
      //   this.list = res.dataList || []
      //   this.total = res.total
      //   this.isLoading = false
      // })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.radio = this.multipleSelection.serialNo
    },
    async onAdd() {
      let successCallback = () => {
        this.dialogVisible = false
        this.$parent.onSearch()
        this.$message({
          message: '添加成功',
          type: 'success',
        })
      }
      if (this.multipleSelection) {
        // let list = await this.$apis.getTaskListByUserId({
        //   user_id: this.multipleSelection.user_id
        // })
        this.isSubmitting = true
        try {
          if (this.multipleSelection.planCondition) {
            await this.$confirm('患者已入组其他计划，是否继续入组？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            })
            await this.$apis.addIcdmPatientManage({
              dischargeSerialNo: this.multipleSelection.serialNo,
              flupPlanId: this.plan.serialNo,
            })
            // await this.$apis.importPatient({
            //   flup_plan_id: this.plan.serialNo,
            //   EnrollmentListArray: this.multipleSelection
            // })
            successCallback()
          } else {
            await this.$apis.addIcdmPatientManage({
              dischargeSerialNo: this.multipleSelection.serialNo,
              flupPlanId: this.plan.serialNo,
            })
            // await this.$apis.importPatient({
            //   flup_plan_id: this.plan.serialNo,
            //   EnrollmentListArray: this.multipleSelection
            // })
            successCallback()
          }
        } catch (err) {
          this.isSubmitting = false
        }
      } else {
        this.$message({
          message: '请选择患者',
          type: 'warning',
        })
      }
    },
    onSearch() {
      this.pageIndex = 1
      this.getMainList()
    },
  },
}
</script>
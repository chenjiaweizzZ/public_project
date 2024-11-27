<template>
  <el-dialog
    title="切换随访计划"
    :modal-append-to-body="false"
    :visible.sync="dialogVisible"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$emit('update:show', false)"
    append-to-body
  >
    <el-table
      :data="list"
      stripe
      highlight-current-row
      @current-change="handleSelectionChange"
      border
    >
      <el-table-column :width="50" label="选择">
        <template slot-scope="scope">
          <el-radio v-model="radio" :label="scope.row.serialNo">{{ "" }}</el-radio>
        </template>
      </el-table-column>
      <el-table-column :formatter="flupPlanType" show-overflow-tooltip prop="planName" label="计划名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="fuRule" label="随访规则"></el-table-column>
      <el-table-column show-overflow-tooltip prop="fuGroup" label="随访组"></el-table-column>
      <el-table-column show-overflow-tooltip prop="fuDoctor" :width="80" label="随访医生"></el-table-column>
      <el-table-column :width="140" label="操作">
        <template slot-scope="scope">
          <el-button @click="onViewToPlan(scope.row)" type="text" icon="el-icon-search">预览</el-button>
        </template>
      </el-table-column>
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
    <span slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onCutPlan">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialog'
import pagination from '@/mixins/pagination'
export default {
  name: 'cut-plan',
  mixins: [pagination, dialogMixin],
  data() {
    return {
      // 选中的数据
      multipleSelection: null,
      list: [],
      radio: '',
      pageNo: '',
      pageSize: 5,
    }
  },
  props: ['serialNo'],
  async created() {
    this.$startLoading()
    await this.getMainList()
    this.$stopLoading()
  },
  methods: {
    getMainList() {
      return this.$apis
        .queryPatientFlupPlanList({
          planType: '0',
          enable: '1',
          pageNo: this.pageNo,
          isExpire: '0',
          pageSize: this.pageSize,
          // planId: this.serialNo,
          hospitalId: JSON.parse(sessionStorage.getItem('global')).hospital_id,
        })
        .then((res) => {
          this.list = res.list
          this.total = res.total
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.getMainList()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getMainList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.radio = val.serialNo
    },
    flupPlanType(row, h, v) {
      if (!row.fuWay) {
        return v + '(全院随访)'
      } else {
        return v + '(专科随访)'
      }
    },
    onViewToPlan(row) {
      var urlx
      if (location.pathname) {
        urlx = location.origin + location.pathname
      } else {
        urlx = location.origin + '/pc'
      }
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url: urlx + `/#/previewPatientPlanV2?serial_no=${row.fuRuleId}`,
          title: '预览随访计划',
        }),
        '*'
      )
    },
    async onCutPlan(v) {
      //切换随访计划会将关闭当前入组计划的所有任务，是否切换？
      this.$confirm(
        '切换随访计划会将关闭当前入组计划的所有任务，是否切换？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          let patientInfo = {}
          new Promise((resolve, reject) => {
            this.$apis
              .getPatientInfoBySerialNo({
                serialNo: this.$route.query.recordSerialNo,
                patientTypeCode: this.$route.query.joinPlanPatientType,
              })
              .then((res) => {
                if (res) {
                  patientInfo.deptName = res.deptName
                  patientInfo.deptCode = res.deptCode
                  patientInfo.dateOfBirth = res.dateOfBirth
                  patientInfo.idNo = res.idNo
                  patientInfo.packageCode = res.packageCode
                }
                resolve()
              })
          }).then((values) => {
            this.$apis
              .cutFlupPlanNew({
                ...patientInfo,
                dischargeDatetime:
                  this.$route.query.discharge_datetime == 'null'
                    ? ''
                    : this.$route.query.discharge_datetime,
                hospitalId: JSON.parse(sessionStorage.getItem('global'))
                  .hospital_id,
                patientName:
                  this.$route.query.name || this.$route.query.patient_name,
                serialNo: this.$route.query.recordSerialNo,
                recordSerialNo: this.$route.query.recordSerialNo,
                userId: this.$route.query.userId
                  ? this.$route.query.userId
                  : this.$route.query.user_id,
                flupPlanId: this.serialNo,
                newFlupPlanId: this.multipleSelection.serialNo,
                groupDatetime:
                  this.$route.query.dischargeDate ||
                  this.$route.query.groupDatetime ||
                  this.$route.query.dateTime ||
                  this.$route.query.discharge_datetime,
                patientTypeCode: this.$route.query.joinPlanPatientType,
              })
              .then((res) => {
                this.dialogVisible = false
                this.$parent.getList()
              })
            this.$message({
              type: 'success',
              message: '切换成功!',
            })
          })
        })
        .catch(() => {})
    },
  },
}
</script>

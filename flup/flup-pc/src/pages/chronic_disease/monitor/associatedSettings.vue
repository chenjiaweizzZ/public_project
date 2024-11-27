//慢病计划关联设置
<template>
  <div class="container">
    <div class="queryConditionsBox">
      <el-form class="inquirebox" label-width="80px">
        <el-form-item label="所属医院">
          <el-select v-model="hospitalId" placeholder="智能随访演示医院">
            <el-option v-for="(item, index) in hospitallist" :key="index" :label="item.hospital_name" :value="item.serial_no " :disabled="item.serial_no!==$global.hospital_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室">
          <el-select v-model="deptId" placeholder="请选择" @change="getchronicdiseaserelevance" clearable>
            <el-option v-for="(item, index) in deptlist" :key="index" :label="item.deptName" :value="item.serialNo"></el-option>
          </el-select>
        </el-form-item>
        <el-button style="margin-left: 20px;" type="primary" plain @click="gunlian" :disabled="hospitalId!=$global.hospital_id">保持关联</el-button>
      </el-form>
    </div>
    <div class="flex">
      <div style=" flex: 1; padding: 0px 30px 20px 0px">
        <el-tabs v-model="activeName1" @tab-click="handleClick">
          <el-tab-pane label="慢病计划" name="1"></el-tab-pane>
        </el-tabs>
        <el-table ref="singleTable" highlight-current-row :data="chronicdiseaserelevancelist" border style="width: 100%" stripe @row-click="getchronicdiseaserelevancelist">
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="planName" label="计划名称"></el-table-column>
          <el-table-column prop="executiveDept" label="科室"></el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :total="chronicdiseaserelevancetotal"></el-pagination>
      </div>
      <div style="flex: 2;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="检测指标" name="1">
            <el-table ref="multipleTablezb" :data="physicalexaminationindexlist" border style="width: 100%; margin-top:20px" stripe @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="name" label="指标名称"></el-table-column>
              <el-table-column prop="unit" label="单位"></el-table-column>
              <el-table-column prop="normalValue" label="正常值"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="慢病报告" name="2">
            <el-table ref="multipleTablemb" :data="slowdiseasereportlist" highlight-current-row border style="width: 100%; margin-top:20px" stripe @row-click="qk">
              <el-table-column width="50">
                <template slot-scope="scope">
                  <i style="margin-left: 5px;color: #32ae57;font-size: 20px;font-weight:900" v-if="scope.row.code == healthParameterCode" class="el-icon-check"></i>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="模板名称"></el-table-column>
              <el-table-column prop="department" label="科室"></el-table-column>
              <el-table-column prop="createTime" label="创建时间"></el-table-column>
            </el-table>
            <el-pagination background :page-sizes="[10,20,50,100]" @current-change="handleCurrentChange2" :current-page.sync="pageNo2" layout="prev, pager, next" :total="slowdiseasereporttotal"></el-pagination>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hospitallist: [],
      deptlist: [],
      hospitalId: this.$global.hospital_id,
      deptId: null,
      activeName1: '1',
      activeName: '1',
      flupPlanId: null,
      chronicdiseaserelevancelist: [],
      chronicdiseaserelevancetotal: 0,
      physicalexaminationindexlist: [],
      physicalexaminationindextotal: 0,
      multipleSelection: [],
      slowdiseasereporttotal: 0,
      slowdiseasereportlist: [],
      healthParameterCode: null,
      pageNo2: null,
    }
  },
  created() {},
  watch: {
    hospitalId() {
      this.getchronicdiseaserelevance()
      this.deptId = null
    },
    chronicdiseaserelevancelist() {
      if (this.chronicdiseaserelevancelist.length != 0) {
        this.flupPlanId = this.chronicdiseaserelevancelist[0].serialNo
        this.$refs.singleTable.setCurrentRow(
          this.chronicdiseaserelevancelist[0]
        )
        this.getchronicdiseaserelevancelist()
      }
    },
  },
  mounted() {
    this.$apis.hospitalgetAllHospitals({}).then((res) => {
      this.hospitallist = res
      this.getchronicdiseaserelevance()
    })
    this.$apis.systemManagequeryCurrentUserDept({}).then((res) => {
      this.deptlist = res
    })
  },
  methods: {
    qk(row) {
      if (row.isSelect == true) {
        row.isSelect = false
        this.healthParameterCode = ''
        this.$refs.multipleTablemb.setCurrentRow()
      } else {
        row.isSelect = true
        this.healthParameterCode = row.code
      }
    },
    gunlian() {
      if (this.activeName == 1) {
        this.$apis
          .SaveHealthParameterByFlupPlanId({
            flupPlanId: this.flupPlanId,
            healthParameterCodes: this.multipleSelection,
          })
          .then((res) => {
            if (res) {
              this.$message({
                message: '关联成功',
                type: 'success',
              })
            }
          })
      } else {
        console.log(this.healthParameterCode)
        this.$apis
          .flupPlansaveChronicDiseaseByFlupPlanId({
            flupPlanId: this.flupPlanId,
            chronicDiseaseCode: this.healthParameterCode
              ? this.healthParameterCode
              : '',
          })
          .then((res) => {
            if (res) {
              this.$message({
                message: '关联成功',
                type: 'success',
              })
            }
          })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      if (this.activeName) {
        for (var i in val) {
          this.multipleSelection.push(val[i].code)
        }
      } else {
        this.multipleSelection.push(val[i].name)
      }
    },
    getchronicdiseaserelevance() {
      this.$apis
        .chronicdiseaserelevance({
          pageNo: this.pageNo1,
          pageSize: this.pageSize1,
          hospitalId: this.hospitalId,
          deptId: this.deptId,
        })
        .then((res) => {
          this.chronicdiseaserelevancelist = res.list
          this.chronicdiseaserelevancetotal = res.total
          this.physicalexaminationindexlist = []
          this.slowdiseasereportlist = []
          this.physicalexaminationindextotal = 0
        })
    },
    getchronicdiseaserelevancelist(row) {
      this.pageNo2 = 1
      if (row) {
        this.flupPlanId = row.serialNo
      }
      this.physicalexaminationindex()
      this.flupPlanqueryChronicDiseaseByFlupPlanId()
    },

    physicalexaminationindex() {
      this.$apis
        .physicalexaminationindex({
          pageNo: 1,
          pageSize: 1000,
          flupPlanId: this.flupPlanId,
        })
        .then((res) => {
          this.multipleSelection = []
          this.physicalexaminationindexlist = res.list
          this.$nextTick(function () {
            res.list.forEach((row) => {
              if (row.isSelect == true) {
                this.$refs.multipleTablezb.toggleRowSelection(row, true)
              }
            })
          })

          this.physicalexaminationindextotal = res.total
        })
    },
    flupPlanqueryChronicDiseaseByFlupPlanId() {
      this.$apis
        .flupPlanqueryChronicDiseaseByFlupPlanId({
          pageNo: this.pageNo2,
          pageSize: this.pageSize2,
          flupPlanId: this.flupPlanId,
        })
        .then((res) => {
          this.multipleSelection = []
          this.slowdiseasereportlist = res.list
          this.healthParameterCode = null
          this.$nextTick(function () {
            res.list.forEach((row) => {
              if (row.isSelect == true) {
                this.$refs.multipleTablemb.setCurrentRow(row)
                this.healthParameterCode = row.code
              }
            })
          })

          this.slowdiseasereporttotal = res.total
        })
    },

    handleClick(tab, event) {
      // console.log(tab.label)
    },
    handleCurrentChange1(val) {
      this.pageNo1 = val
      this.getchronicdiseaserelevance()
    },
    handleSizeChange1(val) {
        this.pageSize1 = val
      this.getchronicdiseaserelevance()  
    },
    handleCurrentChange2(val) {
      this.pageNo2 = val
      this.flupPlanqueryChronicDiseaseByFlupPlanId()
    },
  },
}
</script>

<style style lang="scss"  scoped>
</style>
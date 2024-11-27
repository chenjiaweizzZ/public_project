//知识库
<template>
  <div class="container">
    <div class="queryConditionsBox">
      <div class="queryConditions">
        <p>应用科室</p>
        <el-select multiple clearable class="margin-left14 width200px" v-model="deptId" placeholder="请选择" @change="getCrowdRuleList">
          <el-option v-for="item in deptlist" :key="item.serialNo" :label="item.deptName" :value="item.serialNo"></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <p>人群标签</p>
        <el-select multiple v-model="crowdType" class="margin-left20" placeholder="人群标签" clearable @change="getCrowdRuleList">
          <el-option v-for="item in crowdTypeList" :key="item.dict_code" :value="item.dict_code" :label="item.dict_name"></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <p>应用患者类型</p>
        <el-select multiple v-model="patientType" class="margin-left20" style="display: inline-block;" clearable @change="getCrowdRuleList">
          <el-option v-for="item in patientTypeList" :key="item.patientTypeCode" :value="item.patientTypeCode" :label="item.patientTypeName"></el-option>
        </el-select>
      </div>
      <div style="display: flex;align-items: center;" class="butBox">
        <el-button @click="tufa=true" type="primary" plain>新增</el-button>
      </div>
    </div>

    <el-table :data="tableData" border style="width: 100%;margin-bottom:60px" stripe>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="conditionAppend" label="配置条件"></el-table-column>
      <el-table-column show-overflow-tooltip prop="deptId" label="应用科室" :formatter="formatDept"></el-table-column>
      <el-table-column prop="crowdType" label="人群标签" :formatter="formatCrowd"></el-table-column>
      <el-table-column prop="patientTypeName" label="应用患者类型" :formatter="formatPatient"></el-table-column>
      <el-table-column prop="createDatetime" label="创建时间"></el-table-column>
      <el-table-column prop="address" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="xg(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pageBottom" :page-sizes="[10, 20, 50, 100]" @size-change="handleSizeChange" @current-change="handleCurrentChange" background layout="total,sizes,prev, pager, next" :total="total" :page-size="pageSize" :current-page="pageNo"></el-pagination>

    <el-dialog :title="title" :visible.sync="tufa" width="70%" class="demo-ruleForm" :before-close="closeDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="population" :rules="rules" ref="population" label-width="120px" class="demo-ruleForm">
        <el-form-item label="应用科室" prop="deptId">
          <el-select multiple style="width:70%;min-width:300px;display: inline-block;" v-model="population.deptId" placeholder="请选择">
            <el-option v-for="item in deptlist" :key="item.serialNo" :label="item.deptName" :value="item.serialNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用患者类型" prop="patientTypeCode">
          <el-select multiple v-model="population.patientTypeCode" style="display: inline-block;" clearable>
            <el-option v-for="item in patientTypeList" :key="item.patientTypeCode" :value="item.patientTypeCode" :label="item.patientTypeName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配置条件"></el-form-item>
        <div class="indicatorbox">
          <el-form-item label="包含">
            <div>
              <el-row class="rule-time-add-item" type="flex" align="middle" v-for="(jtem,index) in conditions" :key="index">
                <el-select clearable @change="changeQuery(jtem)" v-model="jtem.key">
                  <el-option v-for="ztem in conditionQuery" :key="ztem.key" :label="ztem.value" :value="ztem.key"></el-option>
                </el-select>
                <div v-if="jtem.key=='age'">
                  <el-input-number v-model="jtem.value[0]" :min="1" :max="999"></el-input-number>~
                  <el-input-number v-model="jtem.value[1]" :min="1" :max="999"></el-input-number>
                </div>
                <el-input v-else v-model="jtem.value"></el-input>

                <i v-if="conditions.length<3" class="el-icon-circle-plus-outline" style="color:blue;margin-right:5px;line-height:3" @click="addCondition(index)"></i>
                <i v-if="conditions.length>1" class="el-icon-remove-outline" style="color:blue;margin-right:5px;line-height:3" @click="delCondition(index)"></i>
              </el-row>
            </div>
          </el-form-item>
          <el-form-item label="关联人群标签" prop="crowdType">
            <el-select v-model="population.crowdType" class="margin-left20" placeholder="人群标签" clearable>
              <el-option v-for="item in crowdTypeList" :key="item.dict_code" :value="item.dict_code" :label="item.dict_name"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" :disabled="checkBtn" @click="bc">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deptId: '',
      deptlist: [],
      crowdType: '',
      crowdTypeList: [],
      patientType: '',
      patientTypeList: [],
      population: {},
      title: '详情',
      conditions: [{ key: '', value: '' }],
      conditionQuery: [
        { key: 'admissionDiagnosis', value: '入院诊断' },
        { key: 'dischargeDiagnosis', value: '出院诊断' },
        { key: 'clinicDiagnosis', value: '门诊诊断' },
        { key: 'age', value: '年龄' },
      ],

      checkBtn: false,
      tufa: false,
      hospitalId: null,
      tableData: [],
      total: null,
      pageNo: 1,
      pageSize: 10,
      rules: {
        deptId: [
          { required: true, message: '请选择应用科室', trigger: 'blur' },
        ],
        patientTypeCode: [
          { required: true, message: '请选择患者类型', trigger: 'blur' },
        ],
        crowdType: [
          { required: true, message: '请选择关联人群标签', trigger: 'blur' },
        ],
        // key: [
        //   { required: true, message: '请选择包含条件', trigger: 'blur' },
        // ],
      },
    }
  },
  created() {
    let a = this.$apis.systemManagequeryCurrentUserDept()
    let b = this.$apis.BaseDictGetDictItems({
      keyWord: '',
      parentId: '20170915191220011928',
    })
    let c = this.$apis.queryPatientTypeAll()

    this.$http.all([a, b, c]).then(
      this.$http.spread((res1, res2, res3) => {
        this.deptlist = res1
        this.crowdTypeList = res2
        this.patientTypeList = res3.filter((x) => x.enabled)

        this.getCrowdRuleList()
      })
    )
  },
  watch: {},
  mounted() {
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id
  },
  methods: {
    getCrowdRuleList() {
      this.$apis
        .getCrowdRuleList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          deptId: this.deptId.length == 0 ? '' : this.deptId.join(','),
          crowdType: this.crowdType.length == 0 ? '' : this.crowdType.join(','),
          patientType:
            this.patientType.length == 0 ? '' : this.patientType.join(','),
        })
        .then((res) => {
          this.tableData = res.list
          this.total = res.total
          console.log(res)
        })

      // this.$apis.getCrowdRuleList({ pageNo: 1, pageSize: 10 }).then((res) => {
      // this.tableData = [
      //   {
      //     conditionAppend: '入院诊断：糖尿病；年龄60-80',
      //     conditionContent:
      //       '[{"key":"dischargeDiagnosis","value":"123"},{"key":"admissionDiagnosis","value":"1234"},{"key":"age","value":"10_50"}]',
      //     createDatetime: '2021-05-13 13:59:20',
      //     crowdType: '92',
      //     deptId: '1218041815274698283,1221040810114626310',
      //     hospitalId: '1118033010334208499',
      //     id: 0,
      //     isDelete: 0,
      //     patientTypeCode: 'ADMISSION_PATIENT',
      //     patientTypeName: '回归患者,在院患者',
      //     updateDatetime: '2021-05-13 13:59:20',
      //   },
      // ]
      // })
    },
    changeQuery(item) {
      if (item.key == 'age') {
        item.value = [1, 50]
      } else {
        item.value = ''
      }
    },

    bc() {
      this.$refs['population'].validate((valid) => {
        if (valid) {
          try {
            this.conditions.forEach((item, index) => {
              if (!item.key) {
                this.$message.warning({
                  message: '第' + (index + 1) + '行包含项未选择！',
                })
                throw new Error('第' + (index + 1) + '行包含项未选择')
              }
              if (item.value == '' || item.value.length == 0) {
                this.$message.warning({
                  message: '第' + (index + 1) + '未进行填写！',
                })
                throw new Error('')
              }
            })
          } catch (e) {
            return
          }
          this.checkBtn = true
          let ageQuery = this.conditions.find((x) => x.key == 'age')
          if (ageQuery != null) {
            ageQuery.value = ageQuery.value.join('_')
          }
          this.population.conditionContent = JSON.stringify(this.conditions)
          this.population.deptId = this.population.deptId.join(',')
          this.population.patientTypeCode =
            this.population.patientTypeCode.join(',')
          this.$apis.saveCrowdRule(this.population).then((res) => {
            if (res) {
              this.$message({
                message: '操作成功',
                type: 'success',
              })
              this.tufa = false
              this.population = {}
              this.conditions = [{ key: '', value: '' }]
              this.$refs['population'].resetFields()

              this.getCrowdRuleList()
            }
          })
        } else {
          this.checkBtn = falses
          return false
        }
        let _this = this
        setTimeout(function () {
          _this.checkBtn = false
        }, 2000)
      })
    },
    xg(row) {
      this.population = JSON.parse(JSON.stringify(row))
      this.population.deptId = this.population.deptId.split(',')
      this.population.patientTypeCode =
        this.population.patientTypeCode.split(',')
      this.conditions = JSON.parse(this.population.conditionContent)
      this.formatAge()
      this.tufa = true
    },
    del(id) {
      this.$confirm('确认删除该人群标签规则？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$apis.deleteCrowdRule({ id }).then((res) => {
          if (res) {
            this.$message({ type: 'success', message: '删除成功' })
            this.getCrowdRuleList()
          } else {
            this.$message({ type: 'error', message: res.retData })
          }
        })
      })
    },
    closeDialog() {
      this.population = {}
      this.conditions = [{ key: '', value: '' }]
      this.tufa = false
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.getCrowdRuleList()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getCrowdRuleList()
    },
    addCondition(index) {
      this.conditions.splice(index + 1, 0, {
        key: '出院诊断',
        value: '',
      })
    },
    delCondition(index) {
      this.conditions.splice(index, 1)
    },
    formatDept(row) {
      let rowDept = this.deptlist.filter((x) =>
        row.deptId.split(',').includes(x.serialNo)
      )
      return rowDept.map((x) => x.deptName).join(',')
    },
    formatCrowd(row) {
      let rowCrowd = this.crowdTypeList.filter((x) =>
        row.crowdType.split(',').includes(x.dict_code)
      )
      return rowCrowd.map((x) => x.dict_name).join(',')
    },
    formatPatient(row) {
      let rowPatient = this.patientTypeList.filter((x) =>
        row.patientTypeCode.split(',').includes(x.patientTypeCode)
      )
      return rowPatient.map((x) => x.patientTypeName).join(',')
    },
    formatAge() {
      this.conditions.forEach((item) => {
        if (item.key == 'age') {
          item.value = item.value.split('_')
        }
      })
    },
  },
}
</script>

<style style lang="scss"  scoped>
.container {
  .indicatorbox {
    border-top: 1px solid #d7dae0;
		&>>>.el-form-item__content {
			height: auto !important;
		}
  }
}
</style>
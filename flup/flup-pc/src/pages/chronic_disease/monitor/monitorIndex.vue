//检测指标管理
<template>
  <div class="container">
    <div class="queryConditionsBox">
      <el-form class="inquirebox" label-width="80px">
        <el-form-item label="搜索">
          <el-input placeholder="请输入名称查询" v-model="name" class="input-with-select limiting" maxlength="20" show-word-limit>
            <el-button slot="append" icon="el-icon-search" @click="cax"></el-button>
          </el-input>
        </el-form-item>
        <!-- <el-button style="margin-left: 30px" type="primary" plain @click="xz">新增</el-button> -->
      </el-form>
    </div>

    <el-table :data="tableData" border style="width: 100%;margin-bottom:60px" stripe>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="createTime" label=" 创建时间"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="code" label="代码"></el-table-column>
      <el-table-column prop="unit" label="单位"></el-table-column>
      <el-table-column prop="normalStart" label="正常范围">
        <template slot-scope="scope">
          <p>{{ scope.row.normalStart }}~{{ scope.row.normalEnd }}</p>
        </template>
      </el-table-column>
      <el-table-column label="男性正常范围">
        <template slot-scope="scope">
          <p>{{ scope.row.normalStartMale }}~{{ scope.row.normalEndMale }}</p>
        </template>
      </el-table-column>
      <el-table-column label="女性正常范围">
        <template slot-scope="scope">
          <p>{{ scope.row.normalStartFemale }}~{{ scope.row.normalEndFemale }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="xg(scope.row)">修改</el-button>
          <!-- <el-button type="text" size="small" @click="deletex(scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pageBottom" :page-sizes="[10, 20, 50, 100]" :current-page="pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" background layout="total,sizes,prev, pager, next" :total="total"></el-pagination>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false" :close-on-press-esc="false">
      <el-form label-width="58px" :rules="rules" ref="parameter" :model="parameter" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-select class="width200 value" v-model="parameter.dictCode" placeholder="请输入名称" @change="changeName">
            <!-- <el-option v-for="item in paramsList" :key="item.serial_no" :value="item.serial_no" :label="item.dict_name" :disabled="item.enabled == '1' ? false : true"></el-option> -->
            <el-option v-for="item in paramsList" :key="item.serial_no" :value="item.serial_no" :label="item.dict_name" :disabled="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代码" prop="code">
          <el-input placeholder="请输入" v-model="parameter.code" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input placeholder="请输入" v-model="parameter.unit" maxlength="8" show-word-limit :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div class="indicatorbox">
        <el-form label-width="100px" class="demo-ruleForm">
          <el-form-item label="是否区分性别" prop="isDistinguishGender">
            <el-switch style="padding: 16px 0" v-model="parameter.isDistinguishGender" @change="() => switchx(parameter)"></el-switch>
          </el-form-item>
          <div class="flex">
            <p style="width: 73px; line-height: 30px; text-align: right">正常范围</p>
            <div class="flex" v-if="parameter.isDistinguishGender">
              <el-form-item label="男性" label-width="50px">
                <el-input placeholder="请输入" v-model="parameter.normalStartMale" maxlength="8" show-word-limit>></el-input>
                <p style="padding: 0 10px">-</p>
                <el-input placeholder="请输入" v-model="parameter.normalEndMale" maxlength="8" show-word-limit>></el-input>
              </el-form-item>
              <el-form-item label="女性" label-width="80px">
                <el-input placeholder="请输入" v-model="parameter.normalStartFemale" style="margin-right: 10px" maxlength="8" show-word-limit>></el-input>
                <p style="padding: 0 10px">-</p>
                <el-input placeholder="请输入" v-model="parameter.normalEndFemale" maxlength="8" show-word-limit>></el-input>
              </el-form-item>
            </div>
            <div class="flex" v-else>
              <el-form-item label label-width="50px">
                <el-input placeholder="请输入" v-model="parameter.normalStart" style="margin-left: -36px" maxlength="8" show-word-limit>></el-input>
                <p style="padding: 0 10px">-</p>
                <el-input placeholder="请输入" v-model="parameter.normalEnd" maxlength="8" show-word-limit>></el-input>
              </el-form-item>
            </div>
          </div>
          <div v-for="(item, index) in parameter.ranges" :key="index">
            <div class="flex">
              <p style="
                  width: 64px;
                  line-height: 30px;
                  text-align: right;
                  margin-left: 10px;
                ">范围{{ index + 1 }}</p>
              <div class="flex" v-if="parameter.isDistinguishGender">
                <el-form-item label="男性" label-width="50px">
                  <el-input placeholder="请输入" v-model="item.rangeStartMale" maxlength="8" show-word-limit>></el-input>
                  <p style="padding: 0 10px">-</p>
                  <el-input placeholder="请输入" v-model="item.rangeEndMale" maxlength="8" show-word-limit>></el-input>
                </el-form-item>
                <el-form-item label="女性" label-width="80px">
                  <el-input placeholder="请输入" v-model="item.rangeStartFemale" maxlength="8" show-word-limit>></el-input>
                  <p style="padding: 0 10px">-</p>
                  <el-input placeholder="请输入" v-model="item.rangeEndFemale" maxlength="8" show-word-limit>></el-input>
                </el-form-item>
              </div>
              <div class="flex" v-else>
                <el-form-item label label-width="50px" class="margin-left0">
                  <el-input placeholder="请输入" v-model="item.rangeStart" style="margin-left: -36px" maxlength="8" show-word-limit>></el-input>
                  <p style="padding: 0 10px">-</p>
                  <el-input placeholder="请输入" v-model="item.rangeEnd" maxlength="8" show-word-limit>></el-input>
                </el-form-item>
              </div>
              <el-button style="margin: 2px 0 0 10px; height: 30px" type="danger" plain @click="() => deletefw(index, item)">删除</el-button>
            </div>
            <el-form-item :label="'范围' + (index + 1) + '描述'" label-width="90px">
              <el-select class="width200 value" v-model="item.description" placeholder @change="getDescriptionList">
                <el-option v-for="item in descriptionList" :key="item.serial_no" :value="item.serial_no" :label="item.dict_name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="'范围' + (index + 1) + '说明'" label-width="90px">
              <el-input type="textarea" v-model="item.suggestion" class maxlength="100" show-word-limit>></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="parameter.ranges.length < 6" @click="augment">新增范围</el-button>
        <!-- <el-button v-else disabled>新增范围</el-button> -->
        <el-button type="primary" @click="baocun('parameter')">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      xzfw: false,
      title: '',
      dialogVisible: false,
      name: '',
      activeName: 'first',
      tableData: [],
      descriptionList: [],
      paramsList: [],
      total: null,
      pageNo: 1,
      pageSize: 10,
      parameter: {
        name: null,
        unit: null,
        code: null,
        dictCode: null,
        isDistinguishGender: false,
        normalStart: null, //正常开始
        normalEnd: null, //正常结束
        normalStartMale: null, //正常男开始
        normalEndMale: null, //正常男结束
        normalStartFemale: null, //正常女开始
        normalEndFemale: null, //正常女结束
        ranges: [
          {
            rangeStart: null, //开始
            rangeEnd: null, //结束
            rangeStartMale: null, //自定男开始
            rangeEndMale: null, //男结束
            rangeStartFemale: null, //女开始
            rangeEndFemale: null, //女结束
            description: null, //描述
            suggestion: null, //建议
          },
        ],
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        code: [{ required: true, message: '请输入代码', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getDescriptionList()
    this.$apis
      .BaseDictGetDictItems({ keyWord: '', parentId: '20200918150816665re5' })
      .then((res) => {
        this.paramsList = res
      })
  },
  watch: {},
  mounted() {
    this.gethealthparameter()
  },
  methods: {
    getDescriptionList() {
      this.$apis
        .BaseDictGetDictItems({ keyWord: '', parentId: '20200724091603497jh7' })
        .then((res) => {
          this.descriptionList = res.filter((x) => x.enabled == '1')
        })
    },
    switchx(parameter) {
      var paraOrg = this.tableData.filter((x) => x.id == parameter.id)[0]
      if (parameter.isDistinguishGender == paraOrg.isDistinguishGender) {
        this.parameter.normalStart = paraOrg.normalStart
        this.parameter.normalEnd = paraOrg.normalEnd
        this.parameter.isDistinguishGender = paraOrg.isDistinguishGender
        this.parameter.normalStartMale = paraOrg.normalStartMale
        this.parameter.normalEndMale = paraOrg.normalEndMale
        this.parameter.normalStartFemale = paraOrg.normalStartFemale
        this.parameter.normalEndFemale = paraOrg.normalEndFemale

        if (paraOrg.ranges.length != 0) {
          this.parameter.ranges = []
          for (let i in paraOrg.ranges) {
            let a = {
              id: paraOrg.ranges[i].id,
              rangeStart: paraOrg.ranges[i].rangeStart,
              rangeEnd: paraOrg.ranges[i].rangeEnd,
              rangeStartMale: paraOrg.ranges[i].rangeStartMale,
              rangeEndMale: paraOrg.ranges[i].rangeEndMale,
              rangeStartFemale: paraOrg.ranges[i].rangeStartFemale,
              rangeEndFemale: paraOrg.ranges[i].rangeEndFemale,
              description: paraOrg.ranges[i].description,
              suggestion: paraOrg.ranges[i].suggestion,
            }
            this.parameter.ranges.push(a)
          }
        }
      } else {
        parameter.normalStart = null
        parameter.normalEnd = null
        parameter.normalStartMale = null
        parameter.normalEndMale = null
        parameter.normalStartFemale = null
        parameter.normalEndFemale = null
        parameter.ranges.forEach((row) => {
          row.rangeStart = null
          row.rangeEnd = null
          row.rangeStartMale = null
          row.rangeEndMale = null
          row.rangeStartFemale = null
          row.rangeEndFemale = null
          row.description = null
          row.suggestion = null
        })
      }
    },
    deletefw(index, item) {
      this.$confirm('确认删除该监测指标？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.parameter.ranges.splice(index, 1)
          if (item.id) {
            this.$apis.deleteparameterrange(item.id).then((res) => {
              this.total--
              this.gethealthparameter()
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    cax() {
      this.pageNo = 1
      this.gethealthparameter()
    },
    qk() {
      let n = {
        name: null,
        unit: null,
        code: null,
        dictCode: null,
        normalStart: null,
        normalEnd: null,
        isDistinguishGender: false,
        normalStartMale: null,
        normalEndMale: null,
        normalStartFemale: null,
        normalEndFemale: null,
        ranges: [
          {
            rangeStart: null,
            rangeEnd: null,
            rangeStartMale: null,
            rangeEndMale: null,
            rangeStartFemale: null,
            rangeEndFemale: null,
            description: null,
            suggestion: null,
          },
        ],
      }
      this.parameter = n
    },
    xz() {
      // this.xzfw = true;
      if (this.$refs['parameter']) {
        this.$refs['parameter'].resetFields()
      }
      this.qk()
      this.title = '新增检测指标'
      this.dialogVisible = true
    },
    xg(row) {
      if (this.$refs['parameter']) {
        this.$refs['parameter'].resetFields()
      }
      this.qk()
      // this.xzfw = false;
      this.title = '修改检测指标'
      this.dialogVisible = true
      this.parameter.id = row.id
      this.parameter.name = row.name
      this.parameter.unit = row.unit
      this.parameter.code = row.code
      this.parameter.dictCode = row.dictCode
      this.parameter.normalStart = row.normalStart
      this.parameter.normalEnd = row.normalEnd
      this.parameter.isDistinguishGender = row.isDistinguishGender
      this.parameter.normalStartMale = row.normalStartMale
      this.parameter.normalEndMale = row.normalEndMale
      this.parameter.normalStartFemale = row.normalStartFemale
      this.parameter.normalEndFemale = row.normalEndFemale
      if (row.ranges.length != 0) {
        this.parameter.ranges = []
        for (let i in row.ranges) {
          let a = {
            id: row.ranges[i].id,
            rangeStart: row.ranges[i].rangeStart,
            rangeEnd: row.ranges[i].rangeEnd,
            rangeStartMale: row.ranges[i].rangeStartMale,
            rangeEndMale: row.ranges[i].rangeEndMale,
            rangeStartFemale: row.ranges[i].rangeStartFemale,
            rangeEndFemale: row.ranges[i].rangeEndFemale,
            description: row.ranges[i].description,
            suggestion: row.ranges[i].suggestion,
          }
          this.parameter.ranges.push(a)
        }
      } else {
        this.parameter.ranges = []
      }
    },
    deletex(row) {
      this.$confirm('确认删除该监测指标？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$apis.deleteputposthealthparameter(row.id).then((res) => {
            if (res) {
              this.$message({
                message: '删除成功',
                type: 'success',
              })
              this.total--
              this.gethealthparameter()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    baocun(parameter) {
      this.$refs[parameter].validate((valid) => {
        if (valid) {
          if (this.title == '新增检测指标') {
            this.$apis.posthealthparameter(this.parameter).then((res) => {
              if (res) {
                this.$message({
                  message: '新增成功',
                  type: 'success',
                })
                this.dialogVisible = false
                this.gethealthparameter()
              }
            })
          } else {
            this.$apis.posthealthparameterupdate(this.parameter).then((res) => {
              if (res) {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                })
                this.dialogVisible = false
                this.gethealthparameter()
              }
            })
          }
        } else {
          return false
        }
      })
    },
    augment() {
      if (this.parameter.ranges.length < 6) {
        let a = {
          rangeStartMale: null, //自定男开始
          rangeEndMale: null, //男结束
          rangeStartFemale: null, //女开始
          rangeEndFemale: null, //女结束
          description: null, //描述
          suggestion: null, //建议
        }
        this.parameter.ranges.push(a)
      }
    },
    gethealthparameter() {
      // if (this.pageNo > 1 && this.total % this.pageSize == 0) {
      //   --this.pageNo
      // }
      this.$apis
        .gethealthparameter({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          name: this.name,
          code: null,
        })
        .then((res) => {
          this.tableData = res.list
          this.total = res.total
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.gethealthparameter()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.gethealthparameter()
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    changeName(val) {
      let para = this.paramsList.filter((x) => x.serial_no == val)[0]
      this.parameter.name = para.dict_name
      this.parameter.code = para.dict_code
    },
  },
}
</script>

<style style lang="scss"  scoped>
.container {
  .inquirebox {
    display: flex;
    align-content: center;
    background-color: #f8f8f8;

    // margin-top: -20px;
    // margin-left: -14px;
    // margin-bottom: 0px;
  }
  .indicatorbox {
    border-top: 1px solid #d7dae0;
    .el-form .demo-ruleForm {
      .el-form-item {
        .el-form-item__content {
          margin-left: 48px;
        }
      }
    }
  }
  .el-dialog__wrapper {
    .el-dialog {
      .el-dialog__body {
        .demo-ruleForm {
          .el-form-item {
            .el-form-item__label {
              padding-left: 4px;
            }
          }
        }
      }
    }
  }
}
</style>
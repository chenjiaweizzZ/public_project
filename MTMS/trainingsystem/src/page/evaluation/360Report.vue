<template>
  <div class="report newReportSelf">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="评价类型">
        <el-select v-model="formInline.type" multiple placeholder="评价类型">
          <el-option :label="item.label" :value="item.value" v-for="item in typeList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应评价月份">
        <el-date-picker v-model="formInline.dateArr" type="monthrange" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="评估报告名称">
        <el-input v-model="formInline.name" placeholder=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="createReport">生成360报告</el-button>
    <el-table :data="tableData" border style="width: 100%;margin-top:20px">
      <el-table-column prop="name" label="评估报告名称" align="center"></el-table-column>
      <el-table-column prop="monthList" label="应评价月份" align="center">
        <template slot-scope="scope">
          {{ JSON.parse(scope.row.monthList).join(";") }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="评价类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.typeName }}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="报告状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.reportStatus | filterStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="reportTime" label="报告生成时间"></el-table-column>
      <el-table-column prop="address" label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="checkDetail(scope.row)" :disabled="scope.row.reportStatus==1">查看</el-button>
          <el-button type="text" size="mini" @click="exportReport(scope.row)" :disabled="scope.row.reportStatus==1">批量下载报告</el-button>
          <el-button type="text" size="mini" @click="deleteReport(scope.row)" :disabled="scope.row.reportStatus==1">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pageStyle" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
      :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog title="生成报告" :visible.sync="dialogReportVisible" width="45%">
      <el-form :model="form" :rules="rules" ref="createReport">
        <el-form-item label="报告名称：" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" class="labelInput" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="应评价月份：" :label-width="formLabelWidth" prop="month">
          <el-date-picker v-model="form.month" type="months" placeholder="请选择月份">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="评价类型：" :label-width="formLabelWidth" prop="type">
          <el-checkbox-group v-model="form.type">
            <el-checkbox v-for="item in typeList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReportVisible = false">取 消</el-button>
        <el-button type="primary" @click="creatingReport">生成360报告</el-button>
      </div>
    </el-dialog>
    <el-dialog title="生成报告中" :visible.sync="creatingReportVisible" width="40%">
      <div class="tipsBody">
        <p>共需要生成 {{exportInfo.count}}份 报告</p>
        <p>{{exportInfo.time}}</p>
        <p class="weightFont">
          <span>关掉此弹窗不会影响报告生成，生成后可在评估记录列表查看下载</span>
          <span class="blueFont">（有效期为一个月，请及时下载保存）</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeReport" type="primary">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { post, getCookie } from '../../config/util'
  import moment from 'moment';
  export default {
    data() {
      return {
        formInline: {
          type: [],
          dateArr: [],
          name: ""
        },
        exportInfo: {
          time: "",
          count: 0
        },
        form: {
          name: "",
          type: [],
          month: []
        },
        typeList: [
          { label: "护陪生评价带教", value: 1 },
          { label: "带教评价护陪生", value: 3 },
          { label: "护陪生评价科室", value: 2 },
          { label: "护士长评价护陪生", value: 4 },
        ],
        formLabelWidth: "120px",
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        dialogReportVisible: false,
        creatingReportVisible: false,
        rules: {
          name: [
            { required: true, message: '请输入报告名称', trigger: 'blur' },
            { min: 0, max: 20, message: '报告名称不超过20字', trigger: 'blur' }
          ],
          month: [
            { required: true, message: '请选择应评价月份', trigger: 'blur' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个评价类型', trigger: 'change' }
          ],
        }
      }
    },
    filters: {
      filterStatus(val) {
        // 0未生成或生成失败  1生成中  2已生成  3已过期
        if (val == 1) {
          return "生成中"
        } else if (val == 2) {
          return "已生成"
        } else if (val == 3) {
          return "已过期"
        } else if (val == 4) {
          return "生成失败"
        }
      }
    },
    watch: {
      "form.month": {
        handler(newVal, oldVal) {
          if (newVal.length > 12) {
            newVal = newVal.slice(0, 12)
            this.form.month = newVal
            this.$message({
              type: "warning",
              message: "评价月份最多只能选择12个月！"
            })
          }
        }
      }
    },
    created() {
      let year = new Date().getFullYear()
      this.formInline.dateArr = [`${year}-01`, `${year}-12`]
      this.getTableDate()
    },
    methods: {
      reset() {
        let year = new Date().getFullYear()
        this.formInline = {
          type: [],
          dateArr: [`${year}-01`, `${year}-12`],
          name: ""
        }
      },
      exportReport(row) {
        if (row.reportStatus == 3) {
          this.$message({
            message: '报告已过期，下载失败',
            type: 'warning'
          });
          return false;
        }
        if (row.zipUrl == null && row.reportStatus == 2) {
          this.$message({
            message: "共生成0份报告，下载失败！",
            type: "warning"
          })
          return false;
        }
        var oA = document.createElement('a');
        oA.download = row.name + ".zip"; // 设置下载的文件名
        oA.href = row.zipUrl;
        document.body.appendChild(oA);
        oA.click();
        oA.remove(); // 下载之后把创建的元素删除
      },
      createReport() {
        this.dialogReportVisible = true
      },
      getTableDate() {
        let monthList = []
        if (this.formInline.dateArr != null && this.formInline.dateArr.length > 0) {
          this.formInline.dateArr.forEach(item => {
            monthList.push(moment(new Date(item)).format("YYYY-MM"))
          })
        } else {
          monthList = ["", ""]
        }
        post(`/base/evaluateReport/list?pageSize=${this.pageSize}&pageNum=${this.pageNum}`, {
          name: this.formInline.name,
          type: this.formInline.type,
          startMonth: monthList[0],
          endMonth: monthList[1]
        }).then(res => {
          if (res && res.resCode == 200) {
            res.rows.forEach(item => {
              this.typeList.forEach(citem => {
                if (citem.value == item.type) {
                  item.typeName = citem.label
                }
              })

            })
            this.total = res.total
            this.tableData = res.rows
          } else {
            this.$message({
              type: "error",
              message: res.resMsg || "请求列表报错"
            })
          }
        })
      },
      onSubmit() {
        this.pageNum = 1
        this.getTableDate()
      },
      creatingReport() {
        let monthList = []
        this.form.month.forEach(item => {
          monthList.push(moment(new Date(item)).format("YYYY-MM"))
        })
        this.$refs["createReport"].validate((valid) => {
          if (valid) {
            post("/base/evaluateReport/add", {
              "name": this.form.name,
              "monthList": monthList.join(";"),
              "type": this.form.type,
            }).then(res => {
              if (res && res.resCode == 200) {
                this.creatingReportVisible = true
                this.exportInfo = {
                  time: res.model.totalTime,
                  count: res.model.count
                }
                this.pageNum = 1
                this.getTableDate()
              } else {
                this.$message({
                  type: "error",
                  message: res.resMsg || "生成360接口报错"
                })
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      deleteReport(row) {
        this.$confirm(`确认将"${row.name}"删除吗?`, '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          post(`/base/evaluateReport/delete/${row.id}`).then(res => {
            if (res && res.resCode == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getTableDate()
            } else {
              this.$message({
                type: "error",
                message: res.resMsg || "删除失败"
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      checkDetail(row) {
        this.$router.push({
          name: "360ReportDetail",
          query: {
            id: row.id
          }
        })
      },
      closeReport() {
        this.dialogReportVisible = false;
        this.creatingReportVisible = false;
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getTableDate()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getTableDate()
      },
      changeDate(val) {
        if (val.length > 12) {
          this.form.month = this.form.month.slice(0, 12)
        }
      },
    },
  }
</script>
<style scoped>
  .report {
    padding: 0 20px;
  }

  .pageStyle {
    margin-top: 20px;
    text-align: right;
  }

  .tipsBody {
    font-size: 16px;
    line-height: 22px;
  }

  .weightFont {
    color: #111;
    margin-top: 20px;
  }

  .weightFont span {
    display: inline;
  }

  .blueFont {
    color: #409eff;
  }

  .dialog-footer {
    text-align: center;
  }
</style>
<style>
  .newReportSelf .el-date-editor--month {
    width: 115px;
  }

  .newReportSelf .labelInput {
    width: calc(100% - 120px);
  }

  .newReportSelf .el-checkbox {
    margin: 0;
    margin-right: 15px;
  }
</style>
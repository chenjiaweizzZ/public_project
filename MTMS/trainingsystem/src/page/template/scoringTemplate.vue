<template>
  <div class="scoringTemplate">
    <el-radio-group v-model="currentTab" style="margin-bottom: 20px;" @change="changeTab">
      <el-radio-button :label="1">日常评价</el-radio-button>
      <el-radio-button :label="2">督导</el-radio-button>
      <el-radio-button :label="3">问卷</el-radio-button>
      <el-radio-button :label="5">大病历</el-radio-button>
      <el-radio-button :label="6">教学活动</el-radio-button>
    </el-radio-group>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" @submit.native.prevent>
      <el-form-item v-if="currentTab != 5 && currentTab != 6" :label="currentTab == 1 ? '日常评价类型' : (currentTab == 2 ? '督导类型' : '问卷类型')">
        <el-select v-model="formInline.type" clearable placeholder="日常评价类型" v-if="currentTab == 1">
          <el-option :label="item.typeName" :value="item.typeValue" v-for="item in evaluteType"></el-option>
        </el-select>
        <el-select v-model="formInline.type" clearable placeholder="督导类型" v-if="currentTab == 2">
          <el-option :label="item.typeName" :value="item.typeValue" v-for="item in supervisorType"></el-option>
        </el-select>
        <el-select v-model="formInline.type" clearable placeholder="问卷类型" v-if="currentTab == 3">
          <el-option :label="item.name" :value="item.key" v-for="item in questionType"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="currentTab == 6" label="教学活动类型">
        <el-select v-model="formInline.type" clearable placeholder="教学活动类型">
          <el-option :key="item.key" :label="item.name" :value="item.key" v-for="item in teachingActionList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="currentTab == 5 || currentTab == 6 ? '' : '评价模板' ">
        <el-input v-model="formInline.templateName" placeholder="评价模板名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" class="button-export" @click="addscoreTmplate()">新增</el-button>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="name" label="评价模板名称" width="300">
      </el-table-column>
      <el-table-column prop="typeName" v-if="currentTab != 5 && currentTab != 6" :label="currentTab == 1 ? '日常评价类型' : (currentTab == 2 ? '督导类型' : '问卷类型')"
        width="150">
      </el-table-column>
      <el-table-column prop="typeName" v-if="currentTab == 6 || currentTab == 2" label="教学活动类型" min-width="300">
        <template slot-scope="scope">
          <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.teachingActionType && scope.row.teachingActionType !== null ? scope.row.teachingActionType.join(',') : ''"
            placement="top">
            <span class="deptnames">
              {{scope.row.teachingActionType && scope.row.teachingActionType !== null ? scope.row.teachingActionType.join(',') : "——"}}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="range" v-if="currentTab == 5 || currentTab == 6 || currentTab == 2" label="适用范围" min-width="300">
        <template slot-scope="scope">
          <div v-if="scope.row.scopeType == 0">全部</div>
          <div v-if="scope.row.scopeType == 1">
            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.deptNames !== null ? scope.row.deptNames.join(',') : ''"
              placement="top">
              <span class="deptnames">
                {{scope.row.deptNames !== null ? scope.row.deptNames.join(',') : ""}}
              </span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="启用状态" width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" @change="changeStatus($event,scope.row,scope.$index)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="操作时间" width="250">
      </el-table-column>
      <el-table-column prop="updatorName" label="操作人" width="200">
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addscoreTmplate(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="previewTemplat(scope.row)">预览</el-button>
          <el-button type="text" size="small" @click="exportWordTemp(scope.row)">导出</el-button>
          <el-button type="text" size="small" @click="deleteTemplate(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog title="预览" :visible.sync="showPreview" width="80%" class="selfComp">
      <scoring-table :id="previewId" :isAnswer="isAnswer" :needHeader="needHeader"></scoring-table>
    </el-dialog>

  </div>
</template>
<script>
  import { post, get, getCookie, exportWord } from '../../config/util'
  import scoringTable from "../../components/scoringTable.vue"
  scoringTable
  export default {
    components: { scoringTable },
    data() {
      return {
        needHeader: true,
        currentRow: {},
        isAnswer: false,
        showPreview: false,
        previewId: "",
        evaluteType: null,
        supervisorType: null,
        questionType: null,
        pageNum: 1,
        pageSize: 10,
        teachingActionList: null,
        total: 0,
        currentTab: "1",
        tableData: [],
        formInline: {
          templateName: "",
          type: ""
        },
      }
    },
    created() {
      if (this.$route.query.tabIndex) {
        this.currentTab = this.$route.query.tabIndex
      }
      if (this.currentTab == 6 && this.teachingActionList === null) {
        this.getactivityTypeList()
      }
      this.getQueryType()
      this.getTableData();
    },
    methods: {
      changeStatus(val, row, index) {
        post("/scoreTemplate/changeStatus", {
          command: "scoreTemplate/changeStatus",
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          id: row.id,
          status: val ? 1 : 0
        }).then(data => {
          if (data && data.errcode == 0) {
            this.$message({
              type: 'success',
              message: '状态更改成功!'
            });
            // this.getTableData();
          } else {
            this.$message({
              type: 'warning',
              message: data.errdesc
            });
            row.status = !val
            this.tableData.splice(index, 1, row)
          }
        }).catch(error => {
          row.status = !val
          this.tableData.splice(index, 1, row)
        })
      },
      previewTemplat(row) {
        this.previewId = row.id
        this.currentRow = row
        this.showPreview = true

      },
      exportWordTemp(row) {
        exportWord({
          command: "scoreTemplate/detail",
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          id: row.id
        })
      },

      deleteTemplate(row) {
        this.$confirm('此操作将永久删除该评分表，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          post("/scoreTemplate/del", {
            command: "scoreTemplate/del",
            sessionid: getCookie('sid'),
            loginid: getCookie('uid'),
            id: row.id
          }).then(data => {
            if (data && data.errcode == 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getTableData();
            } else {
              this.$message({
                type: 'warning',
                message: '删除失败!'
              });
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      onSubmit() {
        this.pageNum = 1
        this.pageSize = 10
        this.total = 0
        this.tableData = []
        this.getTableData();
      },
      changeTab(val) {
        this.pageNum = 1
        this.pageSize = 10
        this.total = 0
        this.tableData = []
        this.formInline = {
          templateName: "",
          type: ""
        }
        if (val == 1 && this.evaluteType === null) {
          this.getQueryType()
        } else if (val == 2 && this.supervisorType === null) {
          this.getQueryType()
        } else if (val == 3 && this.questionType === null) {
          this.getQueryType()
        } else if (val == 6 && this.teachingActionList === null) {
          this.getactivityTypeList()
        }
        this.getTableData();
      },

      getTableData() {
        let temp = {
          category: this.currentTab == 5 ? 4 : this.currentTab == 6 ? 5 : this.currentTab,
          name: this.formInline.templateName,
        }
        if (this.currentTab == 6) {
          temp["teachingActionType"] = this.formInline.type
        }
        if (this.currentTab != 5 && this.currentTab != 6) {
          temp["type"] = this.formInline.type
        }
        post(`/base/scoringtemplate/listTemplate?pageSize=${this.pageSize}&pageNum=${this.pageNum}`, temp).then(res => {
          if (res && res.resCode == 200) {
            this.tableData = res.rows
            res.rows.forEach(item => {
              item.status = Boolean(item.status)
            })
            this.total = res.total
          } else {
            this.$message({
              type: "error",
              message: res.resMsg || "请求列表报错"
            })
          }
        })
      },

      getQueryType() {
        post("/commparaconf/queryCommparaConfList", {
          command: "commparaconf/queryCommparaConfList",
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          paramcode: "score_template_type",
          paramvalue: this.currentTab
        }).then((data) => {
          if (data && data.errcode == 0) {
            let temp = []
            data.commparaConfList[0].param.forEach(item => {
              temp.push(JSON.parse(item))
            })
            if (this.currentTab == 1) {
              this.evaluteType = temp
            } else if (this.currentTab == 2) {
              this.supervisorType = temp
            } else if (this.currentTab == 3) {
              this.questionType = temp
            }
          } else {
            this.$message({
              type: "warning",
              message: data.errdesc
            })
          }
        }).catch(err => {

        })
      },
      //获取活动类型下拉数据
      getactivityTypeList() {
        post('/turnbaseinfo/turnbaseinfolevel', {
          command: 'turnbaseinfo/turnbaseinfolevel',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          code: 'teachtype',
        }).then((data) => {
          if (data && data.errcode == 0) {
            this.teachingActionList = JSON.parse(data.baseinfolevellist);
          }
        })
      },
      addscoreTmplate(row) {
        let typeJson = this.currentTab == 1 ? this.evaluteType : (this.currentTab == 2 ? this.supervisorType : this.questionType)
        this.$router.push(
          {
            name: 'addScoreTemplate',
            query: {
              type: this.currentTab,
              id: row ? row.id : false,
              typeJson: JSON.stringify(typeJson)
            }
          }
        )
      },
      onReset() {
        this.formInline = {
          type: "",
          templateName: ""
        }
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getTableData();
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getTableData();
      },
    }
  }
</script>
<style>
  .scoringTemplate .el-pagination {
    text-align: right;
    margin-top: 20px;
  }

  .scoringTemplate .el-pagination {
    text-align: right;
    margin-top: 20px;
  }

  .scoringTemplate .selfComp .el-dialog__body {
    padding-top: 0px;
    margin-top: 2px;
    vertical-align: top;
    white-space: normal;
  }
</style>
<style scoped>
  .scoringTemplate {
    padding: 0 20px;
  }

  .button-export {
    margin-bottom: 20px;
  }

  .deptnames {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
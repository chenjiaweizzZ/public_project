<template>
  <div class="information-examine">
    <div class="search-row">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="招录名称:">
          <el-input v-model="title" placeholder="请输入招录名称"></el-input>
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select v-model="sceneAuditStatus" placeholder="请选择">
            <!-- <el-option label="全部" value="true"></el-option> -->
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学员姓名:">
          <el-input v-model="name" placeholder="请输入学员姓名"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getTableData()">搜索</el-button>
            <el-button @click="init()">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- <div class="search-row-right">
        <el-button type="primary" @click="getTableData()">搜索</el-button>
        <el-button @click="init()">重置</el-button>
      </div> -->
    </div>
    <div class="btn-row">
      <el-button type="primary" @click="check()">批量审核</el-button>
      <el-button type="primary" @click="exporti()">批量导出</el-button>
    </div>
    <div class="table-row">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="selected"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
        <el-table-column prop="sexTxt" label="性别" width="120">
          <!-- <template slot-scope="scope">{{ scope.row.sex == 1 ? "男" : "女" }}</template> -->
        </el-table-column>
        <el-table-column prop="title" label="招录名称"></el-table-column>
        <el-table-column prop="createTime" label="提交时间"></el-table-column>
        <el-table-column prop="sceneAuditStatusTxt" label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.sceneAuditStatusTxt == '通过'" class="pass">{{ scope.row.sceneAuditStatusTxt }}</span>
            <span v-else-if="scope.row.sceneAuditStatusTxt == '不通过'" class="nopass">{{ scope.row.sceneAuditStatusTxt }}</span>
            <span v-else >{{ scope.row.sceneAuditStatusTxt }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" width="120">
          <template slot-scope="scope">
            <el-button v-if="scope.row.sceneAuditStatus == 1" type="text" @click="detail(scope.row,true)" size="small">查看并审核</el-button>
            <el-button v-else type="text" @click="detail(scope.row,false)" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20]"
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <el-dialog title="批量审核" :visible.sync="dialogVisible" size="tiny" :before-close="handleClose">
      <span>已选{{ ids.length }}人</span>
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="审核结果" prop="radio">
          <el-radio-group v-model="form.radio">
            <el-radio label="1">通过</el-radio>
            <el-radio label="0">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="特殊资源" prop="resource">
          <el-radio-group v-model="form.resource">
            <el-radio label="1"></el-radio>
            <el-radio label="2"></el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item label="理由">
          <el-input type="textarea" v-model="form.reason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="formConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { post, getCookie, getStorage, downloadExcelHeader, downloadExcelHeader2 } from "../../config/util";
  export default {
    data() {
      return {
        id: "",
        ids: [],
        options: [
          {
            value: 1,
            label: "待审核"
          },
          {
            value: 2,
            label: "通过"
          },
          {
            value: 3,
            label: "不通过"
          }
        ],
        title: "",
        name: "",
        sceneAuditStatus: "",
        dialogVisible: false,
        detailShow: false,
        isExam: false,
        pageSize: 10,
        pageNum: 1,
        sceneAuditStatus: "",
        checkStatus: "",
        tableData: [],
        total: 0,
        form: {
          radio: "",
          reason: ""
        },
        selected(row) {
          if (row.sceneAuditStatus == 1) {
            return true;
          } else {
            return false;
          }
        },
        rules: {
          radio: [
            { required: true, message: "请选择审核结果", trigger: "change" }
          ]
        }
      };
    },
    created() {
      this.getTableData();
    },
    methods: {
      exporti() {
        let param = {
          title: this.title,
          name: this.name,
          preAuditStatus: "",
          sceneAuditStatus: this.sceneAuditStatus,
          notifyStatus: "",
          applyStatus: ""
        }
        let url = this.serlizeParams("/enrolltrain/enrollApply/export/2",param);
        downloadExcelHeader(url, this.getCurrentDateString("现场审核名单"))
        // .then(res => {
        //   console.log(res, "---");
        // });
      },
      serlizeParams(url, params) {
        let paramsStr = "";
        for (let key in params) {
          paramsStr = paramsStr + "&" + key + "=" + params[key];
        }
        paramsStr = paramsStr.substring(1);
        return url + "?" + paramsStr;
      },
      getCurrentDateString(fileName) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const date = String(currentDate.getDate()).padStart(2, '0');
        return fileName + `${year}${month}${date}`;
      },
      init() {
        this.title = "";
        this.name = "";
        this.sceneAuditStatus = ""
        this.getTableData()
      },
      getTableData() {
        post(
          `/enrolltrain/enrollApply/spotAuditList?pageSize=${this.pageSize}&pageNum=${this.pageNum}`,
          {
            title: this.title,
            name: this.name,
            sceneAuditStatus: this.sceneAuditStatus
          }
        ).then(res => {
          if (res && res.resCode == 200) {
            this.tableData = res.rows;
            this.total = res.total;
          } else {
            console.log("error");
          }
        });
      },
      check() {
        if (this.ids.length == 0) {
          this.$message({
            message: "请选择学员",
            type: "warning"
          });
        } else {
          this.formInit()
          this.dialogVisible = true;
          this.$nextTick(() => {
            this.$refs["ruleForm"].resetFields();
          })
        }
      },
      formInit() {
        this.form = {
          radio: "",
          reason: ""
        }
      },
      formConfirm() {
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            if (this.form.radio == "0") {
              if (this.form.reason == "") {
                this.$message({
                  message: "不通过请填写理由",
                  type: "warning"
                });
              } else {
                post(`/enrolltrain/enrollApply/updateStatus`, {
                  status: 3,
                  applyType: "2",
                  reason: this.form.reason,
                  idList: this.ids
                }).then(res => {
                  this.$message({
                    message: '批量审核成功',
                    type: 'success'
                  });
                  this.getTableData()
                  this.dialogVisible = false
                });
              }
            } else {
              post(`/enrolltrain/enrollApply/updateStatus`, {
                status: 2,
                applyType: "2",
                reason: this.form.reason,
                idList: this.ids
              }).then(res => {
                this.$message({
                  message: '批量审核成功',
                  type: 'success'
                });
                this.getTableData()
                this.dialogVisible = false
              });
            }
          } else {
            console.log(this.form);
          }
        });
      },
      handleSelectionChange(val) {
        console.log(val);
        let arr = [];
        if (val.length > 0) {
          val.forEach(i => {
            arr.push(i.id);
          });
        }
        this.ids = arr;
      },
      handleClose() {
        this.dialogVisible = false;
      },
      detail(val, isExam) {
        this.$router.push({
          name: "enrollDetail",
          query: {
            id: val.id,
            isExam: isExam,
            tanIndex: 3
          }
        });
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.getTableData();
      },
      handleCurrentChange(pageNum) {
        this.pageNum = pageNum;
        this.getTableData();
      }
    },
    computed: {}
  };
</script>
<style scoped lang="scss">
  .search-row {
    display: flex;
    align-content: center;
    justify-content: space-between;
    .search-row-left {
      display: flex;
      align-content: center;
    }
    .iptTitle {
      display: flex;
      align-items: center;
      height: 36px;
    }
  }

  .btn-row {
    margin: 10px 0px;
  }

  .table-row {
    height: calc(100vh - 320px);
    overflow-y: scroll;
  }
  .pass {
    color: #00982D;;
  }
  .nopass {
    color: #FF0000;
  }
</style>
<style lang="scss">
  .information-examine {
    .search-row {
      .el-input {
        width: 200px;
      }
    }
  }
</style>
<template>
  <div class="information-examine">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="招录名称:">
        <el-input v-model="title" placeholder="请输入招录名称"></el-input>
      </el-form-item>
      <el-form-item label="审核状态:">
        <el-select v-model="preAuditStatus" placeholder="请选择">
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
        </el-table-column>
        <el-table-column prop="title" label="招录名称"></el-table-column>
        <el-table-column prop="createTime" label="提交时间"></el-table-column>
        <el-table-column prop="preAuditStatusTxt" label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.preAuditStatusTxt == '通过'" class="pass">{{ scope.row.preAuditStatusTxt }}</span>
            <span v-else-if="scope.row.preAuditStatusTxt == '不通过'" class="nopass">{{ scope.row.preAuditStatusTxt }}</span>
            <span v-else >{{ scope.row.preAuditStatusTxt }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" width="120">
          <template slot-scope="scope">
            <el-button v-if="scope.row.preAuditStatus == 1" type="text" @click="detail(scope.row,true)" size="mini">查看并审核</el-button>
            <el-button v-else type="text" @click="detail(scope.row,false)" size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20]"
      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    <el-dialog title="批量审核" :visible.sync="dialogVisible" size="tiny" :before-close="handleClose">
      <span>已选{{ ids.length }}人</span>
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="审核结果" prop="radio">
          <el-radio-group v-model="form.radio">
            <el-radio label="1">通过</el-radio>
            <el-radio label="0">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
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
  import {
    post,
    getCookie,
    getStorage,
    downloadExcelHeader,
    downloadExcelHeader2
  } from "../../config/util";
  export default {
    data() {
      return {
        id: "",
        ids: [],
        key: 0,
        dialogVisible: false,
        detailShow: false,
        isExam: false,
        pageSize: 10,
        pageNum: 1,
        tableData: [],
        total: 0,
        preAuditStatus: "",
        title: "",
        name: "",
        form: {
          radio: "",
          reason: ""
        },
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
        checkStatus: "",
        tableData: [],
        selected(row) {
          if (row.preAuditStatus == 1) {
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
    computed: {},
    created() {
      this.getTableData();
    },
    methods: {
      exporti() {
        let param = {
          title: this.title,
          name: this.name,
          preAuditStatus: this.preAuditStatus,
          sceneAuditStatus: "",
          notifyStatus: "",
          applyStatus: ""
        }
        let url = this.serlizeParams("/enrolltrain/enrollApply/export/1",param);
        downloadExcelHeader(url, this.getCurrentDateString("资料预审名单")).then(res => {
        });
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
        this.preAuditStatus = "";
        this.getTableData();
      },
      detail(val, isExam) {
        this.$router.push({
          name: "enrollDetail",
          query: {
            id: val.id,
            isExam: isExam,
            tanIndex: 2
          }
        });
      },
      getTableData() {
        post(
          `/enrolltrain/enrollApply/antecedentTrialList?pageSize=${this.pageSize}&pageNum=${this.pageNum}`,
          {
            title: this.title,
            name: this.name,
            preAuditStatus: this.preAuditStatus
          }
        ).then(res => {
          if (res && res.resCode == 200) {
            this.tableData = res.rows;
            this.total = res.total;
          } else {
            this.$message({
              type: "error",
              message: res.resMsg || "获取列表数据错误！"
            })
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
          this.formInit();
          this.dialogVisible = true;
          this.$nextTick(() => {
            this.$refs.ruleForm.resetFields();
          });
        }
      },
      formInit() {
        this.form = {
          radio: "",
          reason: ""
        };
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
                  applyType: "1",
                  reason: this.form.reason,
                  idList: this.ids
                }).then(res => {
                  if(res.resCode == 200) {
                    this.$message({
                      message: '批量审核成功',
                      type: 'success'
                    });
                  }else {
                    this.$message.error(res.resMsg);
                  }
                  this.getTableData();
                  this.dialogVisible = false
                });
              }
            } else {
              post(`/enrolltrain/enrollApply/updateStatus`, {
                status: 2,
                applyType: "1",
                reason: this.form.reason,
                idList: this.ids
              }).then(res => {
                if(res.resCode == 200) {
                    this.$message({
                      message: '批量审核成功',
                      type: 'success'
                    });
                  }else {
                    this.$message.error(res.resMsg);
                  }
                this.getTableData();
                this.dialogVisible = false
              });
            }
          } else {
          }
        });
      },
      handleSelectionChange(val) {
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
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.getTableData();
      },
      handleCurrentChange(pageNum) {
        this.pageNum = pageNum;
        this.getTableData();
      }
    }
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
      font-size: 14px;
    }
  }

  .btn-row {
    margin: 10px 0px;
  }

  .table-row {

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
  .information-examine .el-pagination {
    text-align: right;
    margin-top: 20px;
  }
</style>
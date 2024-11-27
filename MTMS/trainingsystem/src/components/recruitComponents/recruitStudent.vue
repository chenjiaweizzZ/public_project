<template>
  <div class="information-examine">
    <div class="search-row">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="招录名称:">
          <el-input v-model="title" placeholder="请输入招录名称"></el-input>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select v-model="notifyStatus" placeholder="请选择">
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
    </div>
    <div class="btn-row">
      <el-button type="primary" @click="check()">批量通知</el-button>
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
        <el-table-column prop="notifyStatusTxt" label="通知状态">
          <template slot-scope="scope">
            <span v-if="scope.row.notifyStatusTxt == '已通知'" class="pass">{{ scope.row.notifyStatusTxt }}</span>
            <span v-else >{{ scope.row.notifyStatusTxt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="考试成绩" @click.stop="handleClickSon">
          <template slot-scope="scope">
            <el-popover placement="top" width="300" :ref="`popover-${scope.$index}`">
              <span style="display: flex">
                <el-input v-model="input" placeholder="0～200，最多两位小数" type="number" @change="checkNum(input,scope.row.id)" :ref="scope.row.id"></el-input>
                <el-button type="primary" size="mini" @click="makeSure(scope.row.id)">确定</el-button>
              </span>
              <el-button type="text" slot="reference" @click="changeScore(scope.row.id)">{{ scope.row.score ? scope.row.score : ""}}&nbsp;&nbsp;&nbsp;&nbsp;编辑</el-button>
              <!-- <el-link slot="reference" :underline="false" icon="el-icon-delete" type="danger">编辑</el-link> -->
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="detail(scope.row,false)" size="small">查看</el-button>
            <el-button type="text" v-if="scope.row.notifyStatus == 1" @click="notify(scope.row)" size="small">通知</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20]"
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <el-dialog title="批量通知" :visible.sync="dialogVisible" size="tiny" :before-close="handleClose">
      <span>已选{{ ids.length }}人</span>
      <div>确定给已选学员发送招生考试通知吗?</div>
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
        title: "",
        name: "",
        input: "",
        dialogVisible: false,
        notifyStatus: "",
        pageNum: 1,
        pageSize: 10,
        tableData: [],
        total: 0,
        options: [
          {
            value: 1,
            label: "未通知"
          },
          {
            value: 2,
            label: "已通知"
          }
        ],
        checkStatus: "",
        tableData: [],
        selected(row) {
          if (row.notifyStatus == 1) {
            return true;
          } else {
            return false;
          }
          // return true
        }
      };
    },
    computed: {},
    created() {
      this.getTableData();
    },
    methods: {
      checkNum(val, id) {
        let self = this;
        let checkPlan = "" + val;
        checkPlan = checkPlan
          .replace(/[^\d.]/g, "") // 清除“数字”和“.”以外的字符
          .replace(/\.{2,}/g, ".") // 只保留第一个. 清除多余的
          .replace(/^\./g, "") // 保证第一个为数字而不是.
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", ".");
        if (checkPlan.indexOf(".") < 0 && checkPlan !== "") {
          // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          checkPlan = parseFloat(checkPlan) + "";
        } else if (checkPlan.indexOf(".") >= 0) {
          checkPlan = checkPlan.replace(/^()*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
        }
        if (checkPlan < 0) {
          checkPlan = 0;
        }
        if (checkPlan > 200) {
          checkPlan = 200;
        }
        this.number = checkPlan;
        setTimeout(() => {
          self.$refs[id].currentValue = checkPlan;
        }, 100)
      },
      exporti() {
        let param = {
          title: this.title,
          name: this.name,
          preAuditStatus: "",
          sceneAuditStatus: "",
          notifyStatus: this.notifyStatus,
          applyStatus: ""
        };
        let url = this.serlizeParams("/enrolltrain/enrollApply/export/3",param);
        downloadExcelHeader(url, this.getCurrentDateString("招生考试名单")).then(res => {
          // console.log(res, "---");
        });
      },
      getCurrentDateString(fileName) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const date = String(currentDate.getDate()).padStart(2, '0');
        return fileName + `${year}${month}${date}`;
      },
      num(obj) {
        obj.value = obj.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
        obj.value = obj.value.replace(/^\./g, ""); //验证第一个字符是数字
        obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
        obj.value = obj.value
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", ".");
        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      },
      serlizeParams(url, params) {
        let paramsStr = "";
        for (let key in params) {
          paramsStr = paramsStr + "&" + key + "=" + params[key];
        }
        paramsStr = paramsStr.substring(1);
        return url + "?" + paramsStr;
      },
      edit(id) {
        let self = this;
        self.id = id;
      },
      handleClickFather() {
        let self = this;
        self.id = null;
      },
      handleClickSon() {
        console.log("son");
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
      notify(val) {
        this.$confirm('确定给'+ val.name +'学员发送招生考试通知吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.ids = [val.id];
          this.formConfirm();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
        
      },
      handleInputConfirm() {
        // let inputValue = this.inputValue;
        // if (inputValue) {
        //   this.dynamicTags.push(inputValue);
        // }
        // this.inputVisible = false;
        // this.inputValue = '';
      },
      changeScore() {
        this.input = "";
      },
      showInput(id) {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.id.$refs.input.focus();
        });
      },
      check() {
        if (this.ids.length == 0) {
          this.$message({
            message: "请选择学员",
            type: "warning"
          });
        } else {
          this.dialogVisible = true;
        }
      },
      formConfirm() {
        post(`/enrolltrain/enrollApply/notify/${String(this.ids)}`, {}).then(
          res => {
            let message = ""
            if(this.ids.length > 1) {
              message = "批量通知成功"
            }else {
              message = "通知成功"
            }
            this.$message({
              message: message,
              type: "success"
            });
            this.dialogVisible = false;
          }
        );
      },
      makeSure(id) {
        console.log(this.input)
        if(this.input > 200) {
          this.input = 200
        }
        post(`/enrolltrain/enrollApply/updateScore/`, {
          id: id,
          score: this.input
        }).then(res => {
          this.$message({
              message: "成绩修改成功",
              type: "success",
            });
          this.getTableData();
        });
      },
      getTableData() {
        post(
          `/enrolltrain/enrollApply/enrollExamList?pageSize=${this.pageSize}&pageNum=${this.pageNum}`,
          {
            title: this.title,
            name: this.name,
            notifyStatus: this.notifyStatus
          }
        ).then(res => {
          if (res && res.resCode == 200) {
            this.tableData = res.rows;
            this.total = res.total;
          } else {
          }
        });
      },
      init() {
        this.title = "";
        this.name = "";
        this.notifyStatus = "";
        this.getTableData();
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.getTableData();
      },
      handleCurrentChange(pageNum) {
        this.pageNum = pageNum;
        this.getTableData();
      },
      detail(val, isExam) {
        this.$router.push({
          name: "enrollDetail",
          query: {
            id: val.id,
            isExam: isExam,
            tanIndex: 4
          }
        });
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
    .popK {
      display: flex;
    }
  }
</style>
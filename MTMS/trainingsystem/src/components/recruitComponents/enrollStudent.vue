<template>
  <div class="information-examine">
    <div class="search-row">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="招录名称:">
          <el-input v-model="title" placeholder="请输入招录名称"></el-input>
        </el-form-item>
        <el-form-item label="录取状态:">
          <el-select v-model="applyStatus" placeholder="请选择">
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
      <el-button type="primary" @click="enroll">正式录取</el-button>
      <el-button type="danger" @click="noenroll">不录取</el-button>
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
        <el-table-column prop="score" label="考试成绩"></el-table-column>
        <el-table-column prop="applyStatusTxt" label="录取状态">
          <template slot-scope="scope">
            <span v-if="scope.row.applyStatusTxt == '已录取'" class="pass">{{ scope.row.applyStatusTxt }}</span>
            <span v-else-if="scope.row.applyStatusTxt == '未录取'" class="nopass">{{ scope.row.applyStatusTxt }}</span>
            <span v-else >{{ scope.row.applyStatusTxt }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" width="120">
          <template slot-scope="scope">
            <!-- <el-button v-if="scope.row.preAuditStatus == 1" type="text" @click="detail(scope.row,true)">查看并审核</el-button> -->
            <el-button type="text" @click="detail(scope.row,false)" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20]"
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <!-- <detail :detailShow="detailShow"  :isExam="isExam" :id="id" ref="detail"></detail> -->
    <el-dialog title="提示" :visible.sync="dialogVisible1" size="tiny" :before-close="handleClose1">
      <span>已选{{ ids.length }}人</span>
      <div>确定执行录取操作吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="formConfirm1()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible2" size="tiny" :before-close="handleClose2">
      <span>已选{{ ids.length }}人</span>
      <div>确定执行不录取操作吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="formConfirm2()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { post, getCookie, getStorage, downloadExcelHeader, downloadExcelHeader2 } from "../../config/util";
  // import detail from "./detail";
  export default {
    data() {
      return {
        id: "",
        ids: [],
        detailShow: false,
        isExam: false,
        pageSize: 10,
        dialogVisible1: false,
        dialogVisible2: false,
        pageNum: 1,
        tableData: [],
        total: 0,
        applyStatus: "",
        title: "",
        name: "",
        options: [
          {
            value: 6,
            label: "待录取"
          },
          {
            value: 7,
            label: "录取"
          },
          {
            value: 8,
            label: "未录取"
          }
        ],
        checkStatus: "",
        tableData: [],
        selected(row) {
          if (row.applyStatus == 6) {
            return true;
          } else {
            return false;
          }
          // return true;
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
          preAuditStatus: "",
          sceneAuditStatus: "",
          notifyStatus: "",
          applyStatus: this.applyStatus
        }
        let url = this.serlizeParams("/enrolltrain/enrollApply/export/4",param);
        downloadExcelHeader(url, this.getCurrentDateString("招生录取名单"))
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
        this.applyStatus = "";
        this.getTableData();
      },
      // detail(val,isExam) {
      //   console.log(val)
      //   this.isExam = true;
      //   this.detailShow = true;
      //   this.id = val.id;
      //   console.log(this.id)
      //   // this.$refs.detail.test();
      //   console.log(this.$refs.detail)
      // },
      // detailClose() {
      //   let self = this;
      //   self.detailShow = false
      // },
      getTableData() {
        post(
          `/enrolltrain/enrollApply/enrollAdmitList?pageSize=${this.pageSize}&pageNum=${this.pageNum}`,
          {
            title: this.title,
            name: this.name,
            applyStatus: this.applyStatus
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
      enroll() {
        if(this.ids.length == 0) {
          this.$message({
            message: "请选择学员",
            type: "warning"
          });
        }else {
          console.log(this.ids);
        this.dialogVisible1 = true;
        }
      },
      noenroll() {
        if(this.ids.length == 0) {
          this.$message({
            message: "请选择学员",
            type: "warning"
          });
        }else {
          console.log(this.ids);
        this.dialogVisible2 = true;
        }
      },
      handleClose1() {
        this.dialogVisible1 = false;
      },
      handleClose2() {
        this.dialogVisible2 = false;
      },
      formConfirm1() {
        console.log(this.ids);
        post(`/enrolltrain/enrollApply/updateStatus`, {
          status: 2,
          applyType: "4",
          reason: "",
          idList: this.ids
        }).then(res => {
          console.log(res);
          this.$message({
            type: "success",
            message: "正式录取成功！"
          });
          this.getTableData();
          this.dialogVisible1 = false;
        });
      },
      formConfirm2() {
        console.log(this.ids);
        post(`/enrolltrain/enrollApply/updateStatus`, {
          status: 3,
          applyType: "4",
          reason: "",
          idList: this.ids
        }).then(res => {
          console.log(res);
          this.$message({
            type: "success",
            message: "不录取成功！"
          });
          this.getTableData();
          this.dialogVisible2 = false;
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
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.getTableData();
      },
      handleCurrentChange(pageNum) {
        this.pageNum = pageNum;
        this.getTableData();
      },
      detail(val, isExam) {
        // console.log(val);
        // this.isExam = isExam;
        // this.detailShow = true;
        // this.id = val.id;
        // this.key+=1,
        // console.log(this.id);
        // this.$refs.detail.test();
        // console.log(this.$refs.detail);
        // console.log(this.key)
        this.$router.push({
          name: "enrollDetail",
          query: {
            id: val.id,
            isExam: isExam,
            tanIndex: 5
          }
        });
      }
    }
    // components: {
    //   detail
    // }
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
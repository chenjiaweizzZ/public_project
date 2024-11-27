<template>
  <div class="graduationMange">
    <el-radio-group v-model="tabIndex" style="margin-bottom: 30px;" @input="changeTabIndex">
      <el-radio-button label="1">可结业</el-radio-button>
      <el-radio-button label="2">已结业</el-radio-button>
    </el-radio-group>
    <div v-show="tabIndex=='1'">
      <el-form :inline="true" class="demo-form-inline">
        <!-- <el-form-item label="院区:">
          <el-select v-model="hospitalId" placeholder="请选择" @change="changeHosiptal">
            <el-option v-for="item in hospitalList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="专业基地:">
          <el-select v-model="baseId" placeholder="请选择">
            <el-option v-for="item in baseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="基地" prop="" style="width: 300px;">
          <el-select v-model="hosBaseName" placeholder="请选择基地" :popper-append-to-body="false" collapse-tags clearable @change="changeBase">
            <el-option disabled class="baseOption" value></el-option>
              <el-tree :data="hosBaseTree" :props="defaultProps" ref="tree" check-strictly node-key="id" @node-click="handleNodeClick"
                class="hosWithNoCheckBox">
              </el-tree>
            
          </el-select>
        </el-form-item>
        <el-form-item label="年级:">
          <el-select v-model="turngrade" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in turngradeList2" :key="item.id" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="培训年限:">
          <el-select v-model="turnYear" placeholder="请选择">
            <el-option label="全部" value="true"></el-option>
            <el-option v-for="item in turnYearsList" :key="item.key" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="input" placeholder="输入姓名/学号/手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList()">搜索</el-button>
          <el-button @click="init()">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="btn-row">
        <el-button type="primary" @click="finish2">批量结业</el-button>
        <el-button type="primary" @click="export2">导出名单</el-button>
      </div>
      <div class="table-row">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange2">
          <el-table-column type="selection" width="55" :selectable="selected"></el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="code" label="学号" width="120"></el-table-column>
          <el-table-column prop="sexTxt" label="性别" width="120"></el-table-column>
          <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
          <el-table-column prop="turngradeTxt" label="年级"></el-table-column>
          <el-table-column prop="hospitalIdTxt" label="所属院区"></el-table-column>
          <el-table-column prop="baseIdTxt" label="专业基地"></el-table-column>
          <el-table-column prop="verificationYearsTxt" label="培训年限"></el-table-column>
          <el-table-column prop="name" label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" @click="finish(scope.row)">结业</el-button>
              <el-button type="text" @click="person(scope.row.stuId)">个人档案</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10,20]"
          :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
      <el-dialog title="结业确认" :visible.sync="dialogVisible1" size="tiny" :before-close="handleClose1">
        <span>确认对该学员进行结业操作吗，结业后该学员不可再参与轮转！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="finishConfirm">结 业</el-button>
        </span>
      </el-dialog>
      <el-dialog title="结业确认" :visible.sync="dialogVisible2" size="tiny" :before-close="handleClose2">
        <span>已选择{{ selsectIds.length }}人,确认进行结业操作吗，结业后学员不可再参与轮转！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="finishConfirm">结 业</el-button>
        </span>
      </el-dialog>
    </div>
    <div v-show="tabIndex=='2'">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="基地" prop="" style="width: 300px;">
          <el-select v-model="hosBaseName2" placeholder="请选择基地" :popper-append-to-body="false" collapse-tags clearable @change="changeBase1">
            <el-option disabled class="baseOption" value></el-option>
              <el-tree :data="hosBaseTree" :props="defaultProps" ref="tree" check-strictly node-key="id" @node-click="handleNodeClick2"
                class="hosWithNoCheckBox">
              </el-tree>
            
          </el-select>
        </el-form-item>
        <el-form-item label="年级:">
          <el-select v-model="turngrade2" placeholder="请选择">
            <el-option v-for="item in turngradeList" :key="item.id" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="培训年限:">
          <el-select v-model="turnYear2" placeholder="请选择">
            <el-option v-for="item in turnYearsList" :key="item.key" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结业年度:">
          <el-select v-model="finishYear2" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in turngradeList" :key="item.id" :label="item.key+'年'" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="input2" placeholder="输入姓名/学号/手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList2()">搜索</el-button>
          <el-button @click="init2()">重置</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="finish4">批量撤销结业</el-button>
          <el-button type="primary" @click="export4">导出名单</el-button>
        </el-form-item>
      </el-form>
      <div class="table-row">
        <el-table ref="multipleTable" :data="tableData2" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" :selectable="selected"></el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="code" label="学号" width="120"></el-table-column>
          <el-table-column prop="sexTxt" label="性别" width="120"></el-table-column>
          <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
          <el-table-column prop="turngradeTxt" label="年级"></el-table-column>
          <el-table-column prop="hospitalIdTxt" label="所属院区"></el-table-column>
          <el-table-column prop="baseIdTxt" label="专业基地"></el-table-column>
          <el-table-column prop="verificationYearsTxt" label="培训年限"></el-table-column>
          <el-table-column prop="isGraduationTxt" label="结业状态" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.isGraduationTxt ? scope.row.isGraduationTxt : "暂无" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="graduationYearTxt" label="结业年度" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.graduationYearTxt ? scope.row.graduationYearTxt : "暂无" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" @click="finish3(scope.row)">撤销结业</el-button>
              <el-button type="text" @click="person(scope.row.stuId)">个人档案</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="pageNum2" :page-sizes="[10,20]"
          :page-size="pageSize2" layout="total, sizes, prev, pager, next, jumper" :total="total2"></el-pagination>
      </div>
      <el-dialog title="撤销结业确认" :visible.sync="dialogVisible3" size="tiny" :before-close="handleClose3">
        <span>确认对该学员进行撤销结业操作吗?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="finishConfirm2">撤销结业</el-button>
        </span>
      </el-dialog>
      <el-dialog title="撤销结业确认" :visible.sync="dialogVisible4" size="tiny" :before-close="handleClose4">
        <span>已选择{{ selsectIds2.length }}人,确认进行撤销结业操作吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible4 = false">取 消</el-button>
          <el-button type="primary" @click="finishConfirm2">撤销结业</el-button>
        </span>
      </el-dialog>
    </div>
    <student-personal-Info :studentDetailId="studentDetailId" :dialogRecords.sync="dialogRecords"></student-personal-Info>
  </div>
</template>
<script>
  import { post, get, getCookie, getStorage, downloadExcelHeader } from "../../config/util";
  import studentPersonalInfo from "../../components/studentPersonalInfo.vue";
  export default {
    components: {
      studentPersonalInfo,
    },
    data() {
      return {
        true: "",
        tabIndex: 1,
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3: false,
        dialogVisible4: false,
        hospitalList: [],
        baseList: [],
        baseList2: [],
        turngradeList: [],
        turnYearsList: [],
        turngradeList2: [],
        checkStatus: "",
        tableData: [],
        tableData2: [],
        selected(row) {
          return true;
        },
        hospitalId: "",
        baseId: "",
        turngrade: "",
        turnYear: "",
        input: "",
        pageSize: 10,
        pageNum: 1,
        total: 0,
        selsectIds2: [],
        selsectIds: [],
        finishId: [],
        hospitalId2: "",
        baseId2: "",
        turngrade2: "",
        turnYear2: "",
        input2: "",
        finishYear2: "",
        saveYear: "",
        pageSize2: 10,
        pageNum2: 1,
        total2: 0,
        finishId2: [],
        baseList: [],
        studentDetailId: "",
        dialogRecords: false,
        hosBaseTree: [],
        hosBaseName: "",
        hosBaseName2: "",
        defaultProps: {
          children: 'childrens',
          label: 'name'
        },
      };
    },
    computed: {},
    created() {
      this.getList();
      this.getHospital();
      this.getTurngradeList();
      this.getTurnYearsList();
      this.getList2();
      this.getMyBaseTree()
    },
    methods: {
      getMyBaseTree() {
        let self = this
        post("/base/dept/getHosBaseTree", {}).then(res => {
          if (res.resCode == 200) {
            self.hosBaseTree = res.model;
          }
        });
      },
      changeBase(val) {
        if (val == undefined || val == null || val == "") {
          this.hosBaseName = ""
          this.baseId = ""
        }
      },
      changeBase1(val) {
        if (val == undefined || val == null || val == "") {
          this.hosBaseName2 = ""
          this.baseId2 = ""
        }
      },
      handleNodeClick(data, checked, node) {
        if (data.deptlevel == 1) {
          return false
        } else {
          this.hosBaseName = data.name
          this.baseId = data.id
          // this.queryForm.newdepartment = data.id
        }
      },
      handleNodeClick2(data, checked, node) {
        if (data.deptlevel == 1) {
          return false
        } else {
          this.hosBaseName2 = data.name
          this.baseId2 = data.id
          // this.queryForm.newdepartment = data.id
        }
      },
      changeTabIndex(val) {
        if (val == 1) {
          this.pageNum = 1;
          this.pageSize = 10;
          this.selsectIds = []
          this.init();
        } else {
          this.selsectIds2 = []
          this.pageNum2 = 1;
          this.pageSize2 = 10
          this.init2()
        }
      },

      export2() {
        let url = this.serlizeParams("/base/turninterstdplan/exportFinishList", {
          hospitalId: this.hospitalId,
          baseId: this.baseId,
          turnGrade: this.turngrade,
          verificationYear: this.turnYear,
          keyword: this.input,
          graduationYear: "",
          isGraduation: 0,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        });
        downloadExcelHeader(url, this.getCurrentDateString("可结业名单")).then(res => {
        });
      },
      export4() {
        let url = this.serlizeParams("/base/turninterstdplan/exportFinishList", {
          hospitalId: this.hospitalId2,
          baseId: this.baseId2,
          turnGrade: this.turngrade2,
          verificationYear: this.turnYear2,
          keyword: this.input2,
          graduationYear: this.finishYear2,
          isGraduation: 1,
          pageNum: this.pageNum2,
          pageSize: this.pageSize2
        });
        downloadExcelHeader(url, this.getCurrentDateString("已结业名单")).then(res => {
        });
      },
      getCurrentDateString(fileName) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const date = String(currentDate.getDate()).padStart(2, '0');
        return fileName + `${year}${month}${date}`;
      },
      serlizeParams(url, params) {
        let paramsStr = "";
        for (let key in params) {
          paramsStr = paramsStr + "&" + key + "=" + params[key];
        }
        paramsStr = paramsStr.substring(1);
        return url + "?" + paramsStr;
      },
      handleClick(tab, event) {
        this.getList();
        this.getList2();
      },
      init() {
        this.baseList = [];
        this.hospitalId = "";
        this.baseId = "";
        this.turngrade = "";
        this.turnYear = "";
        this.input = "";
        this.baseList = []
        this.getList();
      },
      init2() {
        this.baseList2 = [];
        this.hospitalId2 = "";
        this.baseId2 = "";
        this.turngrade2 = "";
        this.turnYear2 = "";
        this.input2 = "";
        this.finishYear2 = this.saveYear;
        this.baseList2 = []
        this.getList2();
      },
      getList() {
        let menuId = localStorage.getItem("menuId")
        get(
          `/base/turninterstdplan/finishList?hospitalId=${this.hospitalId}&baseId=${this.baseId}&turnGrade=${this.turngrade}&verificationYears=${this.turnYear}&keyword=${this.input}&graduationYear&isGraduation=0&pageNum=${this.pageNum}&pageSize=${this.pageSize}&menusId=${menuId}`,
          {}
        ).then(res => {
          this.tableData = res.rows;
          this.total = res.total;
        });
      },
      getList2() {
        let menuId = localStorage.getItem("menuId")
        get(
          `/base/turninterstdplan/finishList?hospitalId=${this.hospitalId2}&baseId=${this.baseId2}&turnGrade=${this.turngrade2}&verificationYears=${this.turnYear2}&keyword=${this.input2}&graduationYear=${this.finishYear2}&isGraduation=1&pageNum=${this.pageNum2}&pageSize=${this.pageSize2}&menusId=${menuId}`,
          {}
        ).then(res => {
          this.tableData2 = res.rows;
          this.total2 = res.total;
        });
      },
      getHospital() {
        post("/base/dept/listMyHospital", {
          type: 1
        }).then(res => {
          this.hospitalList = res.model;
        });
      },
      getBaseList() {
        post("/base/dept/listMyBase", {
          pid: this.hospitalId,
          baseHavePermission: 1
        }).then(res => {
          this.baseList = res.model;
        });
      },
      getBaseList2() {
        post("/base/dept/listMyBase", {
          pid: this.hospitalId2,
          baseHavePermission: 1
        }).then(res => {
          this.baseList2 = res.model;
        });
      },
      getTurngradeList() {
        post(`/base/level/getByCode?code=graduationyears`, {}).then(res => {
          this.turngradeList = res.model;
          this.finishYear2 = res.model[res.model.length - 1].key
          this.saveYear = res.model[res.model.length - 1].key
        });
        post(`/base/level/getByCode?code=turngrade`, {}).then(res => {
          this.turngradeList2 = res.model;
        });
      },
      getTurnYearsList: function () {
        let self = this;
        post("/dictionaryinfo/getdictionaryinfolist", {
          command: "dictionaryinfo/getdictionaryinfolist",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          code: "turnyears"
        })
          .then(data => {
            this.turnYearsList = data.beanlist;
          })
          .catch(() => { });
      },
      finish(val) {
        this.finishId = [val.id];
        this.selsectIds = [val.id];
        this.dialogVisible1 = true;
      },
      finish3(val) {
        this.finishId2 = [val.id];
        this.selsectIds2 = [val.id];
        this.dialogVisible3 = true;
      },
      finish2() {
        console.log(this.selsectIds)
        if (this.selsectIds.length == 0) {
          this.$message({
            message: "请选择学员",
            type: "warning"
          });
        } else {
          this.dialogVisible2 = true;
        }
      },
      finish4() {
        console.log(this.selsectIds2)
        if (this.selsectIds2.length == 0) {
          this.$message({
            message: "请选择学员",
            type: "warning"
          });
        } else {
          this.dialogVisible4 = true;
        }
      },
      handleClose1() {
        this.dialogVisible1 = false;
      },
      handleClose2() {
        this.dialogVisible2 = false;
      },
      handleClose3() {
        this.dialogVisible3 = false;
      },
      handleClose4() {
        this.dialogVisible4 = false;
      },
      finishConfirm() {
        post(`/base/students/batchChangePubGraduation`, {
          ids: this.selsectIds,
          isGraduation: 1
        }).then(res => {
          this.dialogVisible1 = false;
          this.dialogVisible2 = false;
          this.getList();
        });
      },
      finishConfirm2() {
        post(`/base/students/batchChangePubGraduation`, {
          ids: this.selsectIds2,
          isGraduation: 0
        }).then(res => {
          this.dialogVisible3 = false;
          this.dialogVisible4 = false;
          this.getList2();
        });
      },
      handleSelectionChange(val) {
        let arr = [];
        if (val.length > 0) {
          val.forEach(i => {
            arr.push(i.id);
          });
        }
        this.selsectIds2 = arr;
        this.finishId = arr;
      },
      handleSelectionChange2(val) {
        let arr = [];
        if (val.length > 0) {
          val.forEach(i => {
            arr.push(i.id);
          });
        }
        this.selsectIds = arr;
      },
      changeHosiptal(val) {
        this.getBaseList();
        this.baseId = ""
      },
      changeHosiptal2(val) {
        this.getBaseList2();
        this.baseId2 = ""
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.getList();
      },
      handleCurrentChange(pageIndex) {
        this.pageNum = pageIndex;
        this.getList();
      },
      handleSizeChange2(pageSize) {
        this.pageSize2 = pageSize;
        this.getList2();
      },
      handleCurrentChange2(pageIndex) {
        this.pageNum2 = pageIndex;
        this.getList2();
      },
      person(id) {
        this.studentDetailId = id;
        this.dialogRecords = true
      }
    }
  };
</script>
<style scoped lang="scss">
.el-select-dropdown__item {
        overflow: visible;
        height: auto;
    }
  .graduationMange {
    padding: 20px;
  }

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
    overflow-y: scroll;
  }

  // .table-row {
  //   display: flex;
  // }
</style>
<style lang="scss">
  .graduationMange {
    .search-row {
      .el-input {
        width: 200px;
      }
    }
  }

  .search-row-2 {
    display: flex;
  }

  .graduationMange .el-pagination {
    text-align: right;
    margin-top: 20px;
  }
</style>
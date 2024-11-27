<template>
  <div class="graduatExamineRecords">
    <div class="searchRow">
      <span class="searchRowTitle">专业基地:</span>
      <el-select v-model="hosBaseName" placeholder="请选择科室" :popper-append-to-body="false" collapse-tags @clear="clearall" clearable>
        <el-option label="全部" value=""></el-option>
        <el-option disabled class="baseOption" value></el-option>
          <el-tree :data="hosBaseTree" :props="defaultProps" ref="baseTree" check-strictly node-key="id" @node-click="handleNodeClick2"
            class="hosWithNoCheckBox"></el-tree>
        
      </el-select>
      <span class="searchRowTitle">轮转科室:</span>
      <el-select v-model="hosDeptName" placeholder="请选择科室" :popper-append-to-body="false" collapse-tags @clear="clearall2" clearable>
        <el-option label="全部" value=""></el-option>
        <el-option disabled class="baseOption" value></el-option>
          <el-tree :data="hosDeptTree" :props="defaultProps" ref="deptTree" check-strictly node-key="id" @node-click="handleNodeClick"
            class="hosWithNoCheckBox"></el-tree>
        
      </el-select>
      <span class="searchRowTitle">年级:</span>
      <el-select v-model="turnGrade" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option v-for="item in  turnGradeList" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      <span class="searchRowTitle">是否符合出科条件:</span>
      <el-select v-model="conditionsGraduation" placeholder="请选择">
        <el-option v-for="item in conditionsGraduationList" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="width: 10px"></span>
      <el-input v-model="search" placeholder="输入姓名/学号/手机号" style="min-width: 158px;"></el-input>
      <span style="width: 10px"></span>
      <el-button type="primary" @click="getList()">搜索</el-button>
    
    </div>
    <div class="btnRow">
      <el-button @click="reset()">重置</el-button>
      <el-button @click="toExport()" type="primary">导出</el-button>
    </div>
    <div class="recordList">
      <el-table :data="recordList" style="width: 100%" border>
        <el-table-column label="学员姓名" fixed>
          <template slot-scope="scope">
            <el-button type="text" @click="studentDetail(scope.row)">{{ scope.row.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="学号"></el-table-column>
        <el-table-column prop="sexTxt" label="性别"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="turngradeTxt" label="年级"></el-table-column>
        <el-table-column prop="hospitalIdTxt" label="所属院区"></el-table-column>
        <el-table-column prop="baseIdTxt" label="专业基地"></el-table-column>
        <el-table-column prop="deptName" label="轮转科室"></el-table-column>
        <el-table-column prop="planTime" label="计划轮转时间"></el-table-column>
        <el-table-column prop="realTime" label="实际轮转时间"></el-table-column>
        <el-table-column prop="auditStatusStr" label="是否符合出科条件"></el-table-column>
        <el-table-column prop="auditTime" label="审核时间"></el-table-column>
        <el-table-column prop="auditUser" label="审核人"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="toDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pageRow">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10,20]"
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      <graduate-require-exa-detail :id="id" :dialogVisible.sync="dialogVisible" :onlyRead="true" :infoWithoutId="infoWithoutId"></graduate-require-exa-detail>
      <student-personal-Info :studentDetailId="studentDetailId" :dialogRecords.sync="dialogRecords"></student-personal-Info>
    </div>
  </div>
</template>

<script>
  import {
    post,
    get,
    getCookie,
    getStorage,
    setTitle,
    exportMouldExcel,
    exportExcel,
    downloadExcelHeader
  } from "../../config/util";
  import studentPersonalInfo from "../../components/studentPersonalInfo.vue";
  import graduateRequireExaDetail from "../../components/graduateRequireExaDetail.vue";
  export default {
    components: {
      studentPersonalInfo,
      graduateRequireExaDetail
    },
    data() {
      return {
        dialogVisible: false,
        id: "123",
        search: "",
        conditionsGraduation: "",
        conditionsGraduationList: [
          { label: "全部", value: "" },
          { label: "是", value: 1 },
          { label: "否", value: 0 },
          // { label: "待审核", value: 2 }
        ],
        infoWithoutId: {
          name: "",
          stuId: "",
          deptName: "",
          profIdTxt: "",
          turngradeTxt: ""
        },
        serach: "",
        turnGrade: "",
        turnGradeList: [],
        hosDeptTree: [],
        hosBaseTree: [],
        recordList: [],
        defaultProps: {
          children: "childrens",
          label: "name"
        },
        baseid: "",
        deptid: "",
        hosDeptName: "",
        hosBaseName: "",
        pageSize: 10,
        pageNum: 1,
        total: 0,
        studentDetailId: "",
        dialogRecords: false
      };
    },
    created() {
      this.getMyDeptTree();
      this.getMyBaseTree();
      this.getGradeList();
      this.getList();
    },
    methods: {
      getList() {
        get(
          `/base/turnexamaudit/list?baseId=${this.baseid}&deptId=${this.deptid}&turngrade=${this.turnGrade}&auditStatus=${this.conditionsGraduation}&keyword=${this.search}&pageSize=${this.pageSize}&pageNum=${this.pageNum}&menusId=${getStorage("menuId")}`
        ).then(res => {
          if (res && res.resCode == 200) {
            this.recordList = res.rows
            this.total = res.total
          }
        });
      },
      toExport() {
        let url = this.serlizeParams("/base/turnexamaudit/export", {
          baseId: this.baseid,
          deptId: this.deptid,
          turngrade: this.turnGrade,
          auditStatus: this.conditionsGraduation,
          keyword: this.search
        });
        downloadExcelHeader(url, "出科条件审核记录").then(res => {
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
      getMyDeptTree() {
        post("/base/dept/getMyDeptTree", {
          showHospital: 1,
          showNoDeptHospital: 0,
          needBaseDept: 0,
          hospitalId: ""
        }).then(res => {
          if (res && res.resCode == 200) {
            if (Array.isArray(res.model) && res.model.length > 0) {
              this.hosDeptTree = res.model;
            }
          }
        });
      },
      getMyBaseTree() {
        let self = this;
        post("/base/dept/getHosBaseTree", {}).then(res => {
          if (res.resCode == 200) {
            self.hosBaseTree = res.model;
          }
        });
      },
      getGradeList() {
        get(`/base/level/getByCodes?codes=turngrade`).then(res => {
          this.turnGradeList = res.model;
        });
      },
      handleNodeClick(data, checked, node) {
        if (data.deptlevel == 1) {
          if (data.havePermission) {
            this.hosDeptName = data.name;
            this.deptid = data.id;
          } else {
            this.$message({
              message: "无院区管辖权限",
              type: "warning"
            });
          }
        } else {
          if (data.havePermission) {
            this.hosDeptName = data.name;
            this.deptid = data.id;
          } else {
            this.$message({
              message: "无科室管辖权限",
              type: "warning"
            });
          }
        }
      },
      handleNodeClick2(data, checked, node) {
        if (data.deptlevel == 1) {
          if (data.havePermission) {
            this.hosBaseName = data.name;
            this.baseid = data.id;
          } else {
            this.$message({
              message: "无院区管辖权限",
              type: "warning"
            });
          }
        } else {
          if (data.havePermission) {
            this.hosBaseName = data.name;
            this.baseid = data.id;
          } else {
            this.$message({
              message: "无基地管辖权限",
              type: "warning"
            });
          }
        }
      },
      reset() {
        this.search = ""
        this.turnGrade = ""
        this.baseid = ""
        this.deptid = ""
        this.hosBaseName = ""
        this.hosDeptName = ""
        this.pageSize = 10
        this.pageNum = 1
        this.conditionsGraduation = ""
        this.$refs.baseTree.setCheckedNodes([])
        this.$refs.deptTree.setCheckedNodes([])
        this.getList()
      },
      toDetail(item) {
        this.id = item.id
        // this.id = ""
        // this.infoWithoutId = {
        //     name: item.name,
        //     stuId: item.stuId,
        //     deptName: item.deptName,
        //     profIdTxt: "",
        //     turngradeTxt: item.turngradeTxt
        // }
        this.dialogVisible = true;
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.getList()
      },
      handleCurrentChange(pageNum) {
        this.pageNum = pageNum
        this.getList()
      },
      studentDetail(item) {
        this.studentDetailId = item.stuId
        this.dialogRecords = true
      },
      clearall() {
        this.hosBaseName = ""
        this.baseid = ""
        this.$refs.baseTree.setCheckedNodes([])
      },
      clearall2() {
        this.hosDeptName = ""
        this.deptid = ""
        this.$refs.deptTree.setCheckedNodes([])
      },
    }
  };
</script>

<style scoped lang="scss">

.el-select-dropdown__item {
        overflow: visible;
        height: auto;
    }
  .graduatExamineRecords {
    ::-webkit-scrollbar {
      width: 5px;
      height: 10px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #c1c1c1;
      border-radius: 32px;
    }
    ::-webkit-scrollbar-track {
      border-radius: 32px;
    }
    .searchRow {
      // display: flex;
      align-items: center;

      .searchRowTitle {
        padding: 20px 20px 20px 20px;
        white-space: nowrap;
      }
    }
    .btnRow {
      padding: 20px 0px 0px 20px;
    }
    .recordList {
      padding: 20px;
    }
    .pageRow {
      padding: 20px;
    }
  }
</style>

<style lang="scss">
  .graduatExamineRecords {
    .searchRow {
      .el-input {
        width: 158px;
      }
    }
    .baseOption {
      overflow: inherit;
    }
  }
</style>
